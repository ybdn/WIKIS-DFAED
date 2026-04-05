/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningP4S.js]] */
/**
 * Vue P4S — Planning Mensuel
 * Grille : agents (ordonnees) x jours du mois (abscisses)
 */
(function () {

    var D = null; // ref to PlanningData (set in init)

    var ROLE_LABELS_P4S = {
        commandement: 'Commandement',
        chefs_pole: 'Chefs de pole',
        csf: 'Cellule de suivi fonctionnel (CSF)',
        formation: 'Formation',
        experts: 'Experts biometrie'
    };

    window.PlanningP4S = {

        _$el: null,
        _isGestion: false,
        _year: 0,
        _month: 0,
        _personnel: [],
        _data: {},
        _yearlyData: {},
        _comments: {},
        _isDirty: false,
        _missions: [],
        _$dropdown: null,
        _$tooltip: null,
        _$commentModal: null,
        _activeAgentId: null,
        _activeDay: null,

        /* Multi-sélection */
        _dragActive: false,
        _dragHasMoved: false,
        _dragStartAgent: null,
        _dragStartDay: null,
        _dragCurAgent: null,
        _dragCurDay: null,
        _lastSingleAgent: null,
        _lastSingleDay: null,
        _selectedCells: [],
        _$selectionBadge: null,
        _ignoreNextClick: false,
        _collapsedRoles: {},

        /* ============================================================= */
        /*  INIT                                                          */
        /* ============================================================= */

        init: function ($container, personnel, isGestion) {
            D = window.PlanningData;
            this._$el = $container;
            this._isGestion = isGestion;
            this._personnel = personnel || [];
            this._missions = window.PlanningMissionsP4S || [];

            var now = new Date();
            this._year = now.getFullYear();
            this._month = now.getMonth() + 1;

            this._createDropdown();
            if (isGestion) {
                this._createCommentUI();
                this._createSelectionBadge();
            }
            this.loadAndRender();
        },

        /* ============================================================= */
        /*  DATA                                                          */
        /* ============================================================= */

        loadAndRender: function () {
            var self = this;
            var monthDone = false;
            var yearDone = !self._isGestion; // si pas gestion, pas besoin des données annuelles
            var commentsDone = !self._isGestion; // idem pour les commentaires
            var pendingMonthData = {};
            var pendingComments = {};

            function tryRender() {
                if (monthDone && yearDone && commentsDone) {
                    self._data = pendingMonthData;
                    self._comments = pendingComments;
                    self._isDirty = false;
                    self._render();
                }
            }

            D.loadP4S(self._year, self._month, function (err, data) {
                pendingMonthData = data || {};
                monthDone = true;
                tryRender();
            });

            if (self._isGestion) {
                self._loadYearlyData(function () {
                    yearDone = true;
                    tryRender();
                });
                D.loadCommentsP4S(self._year, self._month, function (err, data) {
                    pendingComments = data || {};
                    commentsDone = true;
                    tryRender();
                });
            }
        },

        _loadYearlyData: function (callback) {
            var self = this;
            var year = self._year;
            var totalMonths = self._month; // janvier → mois courant inclus
            var loaded = 0;
            var allMonthsData = {};

            function onMonthLoaded(mo, data) {
                allMonthsData[mo] = data || {};
                loaded++;
                if (loaded < totalMonths) return;

                // Agréger les compteurs par agent et par code
                var yearly = {};
                for (var m = 1; m <= totalMonths; m++) {
                    var monthData = allMonthsData[m];
                    var days = D.getDaysInMonth(year, m);
                    for (var agentId in monthData) {
                        if (!monthData.hasOwnProperty(agentId)) continue;
                        if (!yearly[agentId]) yearly[agentId] = {};
                        var agentDays = monthData[agentId];
                        for (var d = 1; d <= days; d++) {
                            var code = agentDays['' + d] || '';
                            if (code) {
                                yearly[agentId][code] = (yearly[agentId][code] || 0) + 1;
                            }
                        }
                    }
                }
                self._yearlyData = yearly;
                callback();
            }

            for (var mo = 1; mo <= totalMonths; mo++) {
                (function (m) {
                    D.loadP4S(year, m, function (err, data) {
                        onMonthLoaded(m, data);
                    });
                }(mo));
            }
        },

        save: function () {
            var self = this;
            self._setSaveState('saving');
            D.saveP4S(self._year, self._month, self._data, function (err) {
                if (err) {
                    alert('Erreur de sauvegarde : ' + err);
                    self._setSaveState('dirty');
                    return;
                }
                D.saveCommentsP4S(self._year, self._month, self._comments, function (errC) {
                    if (errC) {
                        alert('Erreur de sauvegarde commentaires : ' + errC);
                        self._setSaveState('dirty');
                    } else {
                        self._isDirty = false;
                        self._setSaveState('saved');
                        setTimeout(function () {
                            if (!self._isDirty) self._setSaveState('clean');
                        }, 2500);
                    }
                });
            });
        },

        _getMission: function (code) {
            for (var i = 0; i < this._missions.length; i++) {
                if (this._missions[i].code === code) return this._missions[i];
            }
            return this._missions[0] || { code: '', label: '', bg: '#fff', fg: '#3a3a3a' };
        },

        /* ============================================================= */
        /*  MULTI-SÉLECTION                                              */
        /* ============================================================= */

        _agentIndex: function (agentId) {
            for (var i = 0; i < this._personnel.length; i++) {
                if (this._personnel[i].id === agentId) return i;
            }
            return -1;
        },

        _computeRange: function (a1, d1, a2, d2) {
            var i1 = this._agentIndex(a1);
            var i2 = this._agentIndex(a2);
            if (i1 === -1 || i2 === -1) return [];
            var iMin = Math.min(i1, i2);
            var iMax = Math.max(i1, i2);
            var dMin = Math.min(parseInt(d1, 10), parseInt(d2, 10));
            var dMax = Math.max(parseInt(d1, 10), parseInt(d2, 10));
            var cells = [];
            for (var i = iMin; i <= iMax; i++) {
                for (var d = dMin; d <= dMax; d++) {
                    cells.push({ agent: this._personnel[i].id, day: String(d) });
                }
            }
            return cells;
        },

        _highlightSelection: function () {
            this._$el.find('.planning-cell-selected').removeClass('planning-cell-selected');
            for (var i = 0; i < this._selectedCells.length; i++) {
                var c = this._selectedCells[i];
                this._$el.find('.planning-cell[data-agent="' + c.agent + '"][data-day="' + c.day + '"]')
                    .addClass('planning-cell-selected');
            }
        },

        _clearSelection: function () {
            this._$el.find('.planning-cell-selected').removeClass('planning-cell-selected');
            this._selectedCells = [];
            this._hideSelectionBadge();
        },

        _showSelectionBadge: function (n) {
            if (!this._$selectionBadge) return;
            var label = n + ' cellule' + (n > 1 ? 's' : '') + ' s\u00e9lectionn\u00e9e' + (n > 1 ? 's' : '');
            this._$selectionBadge.text(label).show();
        },

        _hideSelectionBadge: function () {
            if (this._$selectionBadge) this._$selectionBadge.hide();
        },

        _createSelectionBadge: function () {
            if (!this._$selectionBadge) {
                this._$selectionBadge = $('<div class="planning-selection-badge"></div>').appendTo('body').hide();
            }
        },

        /* ============================================================= */
        /*  RENDER                                                        */
        /* ============================================================= */

        _render: function () {
            this._dragActive = false;
            this._clearSelection();
            if (this._$commentModal) this._$commentModal.hide();
            if (this._$tooltip) this._$tooltip.hide();
            var h = '';
            h += this._buildNav();
            if (this._isGestion) h += this._buildSaveBar();
            h += '<div class="planning-export-row" style="text-align:right;margin-bottom:0.5rem;">';
            h += '<button class="fr-btn fr-btn--secondary fr-btn--sm fr-icon-printer-line" id="planning-p4s-print"> Imprimer / PDF</button>';
            h += '</div>';
            h += '<div class="planning-table-wrapper">';
            h += this._buildTable();
            h += '</div>';
            h += this._buildLegend();
            if (this._isGestion) h += this._buildCounters();
            this._$el.html(h);
            this._bindEvents();
        },

        /* --- Navigation --- */
        _buildNav: function () {
            var label = D.MOIS[this._month - 1] + ' ' + this._year;
            return '<div class="planning-nav">' +
                '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="p4s-prev">\u25C4</button>' +
                '<span class="planning-nav-title">' + label + '</span>' +
                '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="p4s-next">\u25BA</button>' +
                '</div>';
        },

        /* --- Save bar --- */
        _buildSaveBar: function () {
            return '<div class="planning-save-bar" id="p4s-save-bar">' +
                '<span class="planning-save-status" id="p4s-save-status">Aucune modification</span>' +
                '<button class="fr-btn fr-btn--sm" id="p4s-save-btn" disabled>Enregistrer</button>' +
                '</div>';
        },

        _setSaveState: function (state) {
            var $bar = $('#p4s-save-bar');
            var $status = $('#p4s-save-status');
            var $btn = $('#p4s-save-btn');
            $bar.removeClass('dirty saved');
            if (state === 'dirty') {
                $bar.addClass('dirty');
                $status.text('Modifications non enregistrees');
                $btn.prop('disabled', false);
            } else if (state === 'saving') {
                $status.text('Enregistrement en cours...');
                $btn.prop('disabled', true);
            } else if (state === 'saved') {
                $bar.addClass('saved');
                $status.text('Enregistre avec succes');
                $btn.prop('disabled', true);
            } else {
                $status.text('Aucune modification');
                $btn.prop('disabled', true);
            }
        },

        /* --- Table --- */
        _buildTable: function () {
            var days = D.getDaysInMonth(this._year, this._month);
            var y = this._year;
            var m = this._month;
            var h = '<table class="planning-table" id="p4s-table">';

            /* Header */
            h += '<thead><tr><th class="planning-col-agent">Agent</th>';
            for (var d = 1; d <= days; d++) {
                var cls = 'planning-col-day';
                if (D.isWeekend(y, m, d)) cls += ' planning-col-weekend';
                if (D.isHoliday(y, m, d)) cls += ' planning-col-holiday';
                var title = D.isHoliday(y, m, d) ? D.getHolidayName(y, m, d) : '';
                h += '<th class="' + cls + '"' + (title ? ' title="' + title + '"' : '') + '>' +
                     d + '<span class="planning-day-name">' + D.JOURS_COURTS[D.getDayOfWeek(y, m, d)] + '</span></th>';
            }
            h += '</tr></thead>';

            /* Body */
            var prevRoleP4S = null;
            h += '<tbody>';
            for (var p = 0; p < this._personnel.length; p++) {
                var agent = this._personnel[p];
                var agentRole = agent.role || 'experts';
                if (agentRole !== prevRoleP4S) {
                    var chevronP4S = this._collapsedRoles[agentRole] ? '\u25BA' : '\u25BC';
                    h += '<tr class="planning-role-separator" data-role-key="' + agentRole + '">' +
                         '<td colspan="' + (days + 1) + '">' +
                         '<span class="planning-role-toggle">' + chevronP4S + '</span> ' +
                         (ROLE_LABELS_P4S[agentRole] || agentRole) + '</td></tr>';
                    prevRoleP4S = agentRole;
                }
                var agentData = this._data[agent.id] || {};
                var rowStyleP4S = this._collapsedRoles[agentRole] ? ' style="display:none"' : '';
                h += '<tr data-role-key="' + agentRole + '"' + rowStyleP4S + '><td class="planning-col-agent">' + (agent.grade ? agent.grade + ' ' : '') + agent.nom + '</td>';
                for (var d2 = 1; d2 <= days; d2++) {
                    var code = agentData['' + d2] || '';
                    var mission = this._getMission(code);
                    var cellCls = 'planning-cell';
                    if (D.isWeekend(y, m, d2)) cellCls += ' planning-col-weekend';
                    if (D.isHoliday(y, m, d2)) cellCls += ' planning-col-holiday';
                    if (this._isGestion) cellCls += ' editable';
                    var comment = (this._isGestion && this._comments[agent.id] && this._comments[agent.id]['' + d2]) ? this._comments[agent.id]['' + d2] : '';
                    if (comment) cellCls += ' has-comment';
                    var bg = code ? mission.bg : '';
                    var fg = code ? mission.fg : '';
                    var style = bg ? 'background-color:' + bg + ';color:' + fg + ';' : '';
                    var commentAttr = comment ? ' data-comment="' + comment.replace(/"/g, '&quot;') + '"' : '';
                    h += '<td class="' + cellCls + '" data-agent="' + agent.id + '" data-day="' + d2 + '"' +
                         (style ? ' style="' + style + '"' : '') + commentAttr + '>' +
                         code + '</td>';
                }
                h += '</tr>';
            }
            h += '</tbody></table>';
            return h;
        },

        /* --- Legend --- */
        _buildLegend: function () {
            var h = '<div class="planning-legend">';
            for (var i = 0; i < this._missions.length; i++) {
                var m = this._missions[i];
                if (!m.code) continue;
                h += '<span class="planning-legend-item" style="background:' + m.bg + ';color:' + m.fg + ';">' +
                     m.code + ' — ' + m.label + '</span>';
            }
            h += '</div>';
            return h;
        },

        /* --- Counters (gestion only) --- */
        _buildCounters: function () {
            var activeCodes = [];
            for (var i = 0; i < this._missions.length; i++) {
                if (this._missions[i].code) activeCodes.push(this._missions[i]);
            }

            var h = '<details class="planning-counters" open>';
            h += '<summary>Compteurs par personnel</summary>';
            h += '<div class="planning-counters-scroll">';
            h += '<table class="planning-counters-table"><thead>';

            /* Ligne 1 : codes missions (colspan 2) */
            h += '<tr>';
            h += '<th rowspan="2" class="planning-cth-agent">Agent</th>';
            for (var c = 0; c < activeCodes.length; c++) {
                var mc = activeCodes[c];
                h += '<th colspan="2" class="planning-cth-code planning-col-month" style="background:' + mc.bg + ';color:' + mc.fg + ';">' + mc.code + '</th>';
            }
            h += '</tr>';

            /* Ligne 2 : Mois / Année pour chaque code */
            h += '<tr>';
            for (var c3 = 0; c3 < activeCodes.length; c3++) {
                h += '<th class="planning-cth-sub planning-col-month">Mois</th>';
                h += '<th class="planning-cth-sub planning-cth-year">Ann\u00e9e</th>';
            }
            h += '</tr>';

            h += '</thead><tbody>';

            var days = D.getDaysInMonth(this._year, this._month);
            for (var p = 0; p < this._personnel.length; p++) {
                var agent = this._personnel[p];
                var agentData = this._data[agent.id] || {};
                var yearAgentData = (this._yearlyData && this._yearlyData[agent.id]) || {};
                h += '<tr><td>' + (agent.grade ? agent.grade + ' ' : '') + agent.nom + '</td>';
                for (var c2 = 0; c2 < activeCodes.length; c2++) {
                    var count = 0;
                    for (var d = 1; d <= days; d++) {
                        if ((agentData['' + d] || '') === activeCodes[c2].code) count++;
                    }
                    var countYear = yearAgentData[activeCodes[c2].code] || 0;
                    h += '<td class="planning-col-month">' + count + '</td>';
                    h += '<td class="planning-ctd-year">' + countYear + '</td>';
                }
                h += '</tr>';
            }
            h += '</tbody></table></div></details>';
            return h;
        },

        /* ============================================================= */
        /*  EVENTS                                                        */
        /* ============================================================= */

        _bindEvents: function () {
            var self = this;

            $('#p4s-prev').on('click', function () { self._navigate(-1); });
            $('#p4s-next').on('click', function () { self._navigate(1); });
            $('#p4s-save-btn').on('click', function () { self.save(); });
            $('#planning-p4s-print').on('click', function () { self._openPrintWindow(); });

            this._$el.on('click', '.planning-role-separator', function () {
                var role = $(this).data('role-key');
                self._collapsedRoles[role] = !self._collapsedRoles[role];
                self._$el.find('tr[data-role-key="' + role + '"]:not(.planning-role-separator)')
                    .toggle(!self._collapsedRoles[role]);
                $(this).find('.planning-role-toggle')
                    .text(self._collapsedRoles[role] ? '\u25BA' : '\u25BC');
            });

            if (this._isGestion) {
                this._$el.on('mousedown', '.planning-cell.editable', function (e) {
                    if (e.which !== 1) return;
                    e.preventDefault();
                    if (self._$commentModal && self._$commentModal.is(':visible')) {
                        self._$commentModal.hide();
                    }
                    var $cell = $(this);
                    var agent = '' + $cell.data('agent');
                    var day = '' + $cell.data('day');

                    if (e.shiftKey && self._lastSingleAgent) {
                        /* Shift+clic : sélection rectangulaire depuis la dernière cellule */
                        self._selectedCells = self._computeRange(self._lastSingleAgent, self._lastSingleDay, agent, day);
                        self._highlightSelection();
                        self._showSelectionBadge(self._selectedCells.length);
                        self._activeAgentId = agent;
                        self._activeDay = day;
                        self._ignoreNextClick = true;
                        self._showDropdown($cell);
                        return;
                    }

                    /* Début de drag */
                    self._clearSelection();
                    self._dragActive = true;
                    self._dragHasMoved = false;
                    self._dragStartAgent = agent;
                    self._dragStartDay = day;
                    self._dragCurAgent = agent;
                    self._dragCurDay = day;
                    self._selectedCells = [{ agent: agent, day: day }];
                    self._highlightSelection();
                    $('#p4s-table').addClass('planning-dragging');
                });

                this._$el.on('mouseover', '.planning-cell.editable', function () {
                    if (!self._dragActive) return;
                    var $cell = $(this);
                    var agent = '' + $cell.data('agent');
                    var day = '' + $cell.data('day');
                    if (agent === self._dragCurAgent && day === self._dragCurDay) return;
                    self._dragCurAgent = agent;
                    self._dragCurDay = day;
                    if (agent !== self._dragStartAgent || day !== self._dragStartDay) {
                        self._dragHasMoved = true;
                    }
                    self._selectedCells = self._computeRange(self._dragStartAgent, self._dragStartDay, agent, day);
                    self._highlightSelection();
                    if (self._selectedCells.length > 1) {
                        self._showSelectionBadge(self._selectedCells.length);
                    }
                });

                $(document).off('mouseup.p4sDrag').on('mouseup.p4sDrag', function () {
                    if (!self._dragActive) return;
                    self._dragActive = false;
                    $('#p4s-table').removeClass('planning-dragging');

                    if (self._dragHasMoved && self._selectedCells.length > 1) {
                        /* Drag multi-cellules : ouvrir dropdown sur la dernière cellule */
                        var $lastCell = self._$el.find(
                            '.planning-cell[data-agent="' + self._dragCurAgent + '"][data-day="' + self._dragCurDay + '"]'
                        );
                        if ($lastCell.length) {
                            self._activeAgentId = self._dragCurAgent;
                            self._activeDay = self._dragCurDay;
                            self._ignoreNextClick = true;
                            self._showDropdown($lastCell);
                        }
                    } else {
                        /* Clic simple */
                        self._clearSelection();
                        var $startCell = self._$el.find(
                            '.planning-cell[data-agent="' + self._dragStartAgent + '"][data-day="' + self._dragStartDay + '"]'
                        );
                        if ($startCell.length) {
                            self._activeAgentId = self._dragStartAgent;
                            self._activeDay = self._dragStartDay;
                            self._lastSingleAgent = self._dragStartAgent;
                            self._lastSingleDay = self._dragStartDay;
                            self._ignoreNextClick = true;
                            self._showDropdown($startCell);
                        }
                    }
                });

                $(document).off('keydown.p4sDrag').on('keydown.p4sDrag', function (e) {
                    if (e.key === 'Escape' || e.keyCode === 27) {
                        self._clearSelection();
                        if (self._dragActive) {
                            self._dragActive = false;
                            $('#p4s-table').removeClass('planning-dragging');
                        }
                        if (self._$dropdown) self._$dropdown.hide();
                    }
                });

                this._$el.off('.p4sComment')
                    .on('mouseenter.p4sComment', '.has-comment', function () {
                        var comment = $(this).data('comment');
                        var rect = this.getBoundingClientRect();
                        self._$tooltip.text(comment).css({
                            top: rect.top + window.scrollY - 4,
                            left: rect.left + window.scrollX
                        }).show();
                    })
                    .on('mouseleave.p4sComment', '.has-comment', function () {
                        self._$tooltip.hide();
                    })
                    .on('contextmenu.p4sComment', '.planning-cell.editable', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._$tooltip.hide();
                        var $cell = $(this);
                        var agentId = $cell.data('agent');
                        var day = '' + $cell.data('day');
                        var agentNom = '';
                        for (var i = 0; i < self._personnel.length; i++) {
                            if (self._personnel[i].id === agentId) {
                                agentNom = self._personnel[i].nom;
                                break;
                            }
                        }
                        var existing = (self._comments[agentId] && self._comments[agentId][day]) ? self._comments[agentId][day] : '';
                        var rect = $cell[0].getBoundingClientRect();
                        self._$commentModal
                            .find('.planning-comment-modal-title').text('Commentaire \u2014 ' + agentNom + ' \u2014 Jour ' + day).end()
                            .find('.planning-comment-input').val(existing).end()
                            .css({ top: rect.bottom + window.scrollY + 2, left: rect.left + window.scrollX })
                            .data('agentId', agentId).data('key', day)
                            .show();
                        self._$commentModal.find('.planning-comment-input').focus();
                    });
            }
        },

        _navigate: function (delta) {
            if (this._isDirty) {
                if (!confirm('Des modifications non enregistrees seront perdues. Continuer ?')) return;
            }
            this._month += delta;
            if (this._month > 12) { this._month = 1; this._year++; }
            if (this._month < 1) { this._month = 12; this._year--; }
            this.loadAndRender();
        },

        /* ============================================================= */
        /*  DROPDOWN                                                      */
        /* ============================================================= */

        _createDropdown: function () {
            if (this._$dropdown) return;
            var h = '<div class="planning-dropdown" id="p4s-dropdown">';
            for (var i = 0; i < this._missions.length; i++) {
                var m = this._missions[i];
                h += '<div class="planning-dropdown-item" data-code="' + m.code + '">' +
                     '<span class="planning-dropdown-swatch" style="background:' + m.bg + ';"></span>' +
                     '<span class="planning-dropdown-code">' + (m.code || '\u2014') + '</span>' +
                     '<span class="planning-dropdown-label">' + m.label + '</span>' +
                     '</div>';
            }
            h += '</div>';
            this._$dropdown = $(h);
            $('body').append(this._$dropdown);

            var self = this;
            this._$dropdown.on('click', '.planning-dropdown-item', function (e) {
                e.stopPropagation();
                var code = $(this).data('code');
                self._selectMission(code);
            });
            $(document).on('click.p4sDropdown', function () {
                if (self._ignoreNextClick) {
                    self._ignoreNextClick = false;
                    return;
                }
                if (self._$dropdown) self._$dropdown.hide();
                self._clearSelection();
            });
        },

        _createCommentUI: function () {
            var self = this;

            /* Tooltip flottant */
            if (!this._$tooltip) {
                this._$tooltip = $('<div class="planning-cell-tooltip" role="tooltip"></div>').appendTo('body').hide();
            }

            /* Modale commentaire (clic droit) */
            if (!this._$commentModal) {
                this._$commentModal = $(
                    '<div class="planning-comment-modal">' +
                        '<div class="planning-comment-modal-title"></div>' +
                        '<textarea class="planning-comment-input" rows="3" placeholder="Ajouter un commentaire..."></textarea>' +
                        '<div class="planning-comment-modal-actions">' +
                            '<button class="fr-btn fr-btn--secondary planning-comment-cancel">Annuler</button>' +
                            '<button class="fr-btn planning-comment-ok">OK</button>' +
                        '</div>' +
                    '</div>'
                ).appendTo('body').hide();

                this._$commentModal.on('click', '.planning-comment-ok', function () {
                    var agentId = self._$commentModal.data('agentId');
                    var key = self._$commentModal.data('key');
                    var text = self._$commentModal.find('.planning-comment-input').val().trim();
                    if (!self._comments[agentId]) self._comments[agentId] = {};
                    if (text) {
                        self._comments[agentId][key] = text;
                    } else {
                        delete self._comments[agentId][key];
                    }
                    var $cell = self._$el.find('.planning-cell[data-agent="' + agentId + '"][data-day="' + key + '"]');
                    if (text) {
                        $cell.addClass('has-comment').attr('data-comment', text);
                    } else {
                        $cell.removeClass('has-comment').removeAttr('data-comment');
                    }
                    self._isDirty = true;
                    self._setSaveState('dirty');
                    self._$commentModal.hide();
                });

                this._$commentModal.on('click', '.planning-comment-cancel', function () {
                    self._$commentModal.hide();
                });

                $(document).off('mousedown.p4sCommentModal').on('mousedown.p4sCommentModal', function (e) {
                    if (self._$commentModal.is(':visible') && !self._$commentModal[0].contains(e.target)) {
                        self._$commentModal.hide();
                    }
                });
            }
        },

        _showDropdown: function ($cell) {
            var rect = $cell[0].getBoundingClientRect();
            var top = rect.bottom + 2;
            var left = rect.left;
            if (top + 250 > window.innerHeight) top = rect.top - 250;
            if (left + 200 > window.innerWidth) left = window.innerWidth - 210;
            this._$dropdown.css({ top: top, left: left }).show();
        },

        _selectMission: function (code) {
            var mission = this._getMission(code);
            var cells = this._selectedCells.length > 0
                ? this._selectedCells
                : (this._activeAgentId && this._activeDay
                    ? [{ agent: this._activeAgentId, day: this._activeDay }]
                    : []);

            if (cells.length === 0) return;

            for (var i = 0; i < cells.length; i++) {
                var c = cells[i];
                if (!this._data[c.agent]) this._data[c.agent] = {};
                this._data[c.agent][c.day] = code;
                var $cell = this._$el.find('.planning-cell[data-agent="' + c.agent + '"][data-day="' + c.day + '"]');
                $cell.text(code).css({
                    'background-color': code ? mission.bg : '',
                    'color': code ? mission.fg : ''
                }).removeClass('planning-cell-selected');
            }

            this._selectedCells = [];
            this._hideSelectionBadge();
            this._isDirty = true;
            this._$dropdown.hide();
            this._setSaveState('dirty');
        },

        _openPrintWindow: function () {
            var navText = this._$el.find('.planning-nav-title').text() || 'P4S';
            var $table = this._$el.find('#p4s-table');
            var $legend = this._$el.find('.planning-legend');

            var tableHtml = $table.length ? $table[0].outerHTML : '';
            var legendHtml = $legend.length ? $legend[0].outerHTML : '';

            var now = new Date();
            var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
            var exportLabel = 'Export\u00e9 le ' +
                pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear() +
                ' \u00e0 ' + pad(now.getHours()) + 'h' + pad(now.getMinutes());

            var css = [
                '@page { size: A4 landscape; margin: 1.5cm; }',
                '* { box-sizing: border-box; }',
                'body {',
                '    font-family: Arial, sans-serif;',
                '    font-size: 8pt;',
                '    margin: 0;',
                '    -webkit-print-color-adjust: exact;',
                '    print-color-adjust: exact;',
                '    color-adjust: exact;',
                '}',
                '.print-header {',
                '    display: flex;',
                '    justify-content: space-between;',
                '    align-items: baseline;',
                '    margin-bottom: 8pt;',
                '    border-bottom: 1px solid #ccc;',
                '    padding-bottom: 4pt;',
                '}',
                'h2.print-title {',
                '    font-size: 12pt;',
                '    font-weight: 700;',
                '    margin: 0;',
                '    color: #161616;',
                '}',
                '.print-subtitle {',
                '    font-size: 7.5pt;',
                '    color: #555;',
                '    margin: 2pt 0 0 0;',
                '    font-style: italic;',
                '    letter-spacing: 0.04em;',
                '}',
                '.print-export-date {',
                '    font-size: 7.5pt;',
                '    color: #666;',
                '    font-style: italic;',
                '    white-space: nowrap;',
                '}',
                '.planning-table {',
                '    width: 100%;',
                '    border-collapse: collapse;',
                '    font-size: 7pt;',
                '    page-break-inside: auto;',
                '    table-layout: fixed;',
                '    font-size: 6.5pt;',
                '}',
                '.planning-table th, .planning-table td {',
                '    border: 1px solid #ccc;',
                '    padding: 1px 2px;',
                '    text-align: center;',
                '    white-space: nowrap;',
                '    overflow: hidden;',
                '    height: 16px;',
                '    vertical-align: middle;',
                '}',
                '.planning-table thead th {',
                '    background: #f0f0f0;',
                '    font-weight: 600;',
                '    position: static;',
                '}',
                '.planning-col-agent {',
                '    position: static;',
                '    background: #f6f6f6 !important;',
                '    font-weight: 600;',
                '    text-align: left !important;',
                '    width: 18%;',
                '    padding-left: 4px !important;',
                '}',
                'td.planning-col-agent, th.planning-col-agent {',
                '    white-space: normal;',
                '    overflow: visible;',
                '    word-break: break-word;',
                '    height: auto;',
                '}',
                '.planning-day-name { display: none; }',
                '.planning-table thead .planning-col-agent { background: #e5e5e5 !important; }',
                '.planning-col-weekend { background-color: #f0f0f0 !important; }',
                '.planning-table thead .planning-col-weekend { background-color: #ddd !important; }',
                '.planning-col-holiday { background-color: #E8EDFF !important; }',
                '.planning-table thead .planning-col-holiday { background-color: #C5D1FF !important; }',
                '.planning-role-separator td {',
                '    background: #eef0fb !important;',
                '    color: #000091;',
                '    font-weight: 700;',
                '    font-size: 7pt;',
                '    text-transform: uppercase;',
                '    letter-spacing: 0.05em;',
                '    text-align: left !important;',
                '    padding: 2px 6px !important;',
                '    border-top: 1px solid #9ba9e0 !important;',
                '}',
                '.planning-legend {',
                '    display: flex;',
                '    flex-wrap: wrap;',
                '    gap: 2px;',
                '    margin-top: 5pt;',
                '    padding: 3px 5px;',
                '    background: #f6f6f6;',
                '    border-radius: 3px;',
                '}',
                '.planning-legend-item {',
                '    display: inline-flex;',
                '    align-items: center;',
                '    gap: 2px;',
                '    padding: 1px 5px;',
                '    border-radius: 2px;',
                '    font-size: 6pt;',
                '    font-weight: 600;',
                '    border: 1px solid rgba(0,0,0,0.1);',
                '}',
                '.planning-cell-tooltip, .planning-role-toggle { display: none !important; }',
                'tr { display: table-row !important; }',
                '.planning-cell.has-comment::after {',
                '    content: \'\';',
                '    position: absolute;',
                '    top: 1px; right: 1px;',
                '    width: 4px; height: 4px;',
                '    border-radius: 50%;',
                '    background: #000091;',
                '}'
            ].join('\n');

            var html = '<!DOCTYPE html><html><head>' +
                '<meta charset="utf-8">' +
                '<title>P4S \u2014 ' + navText + '</title>' +
                '<style>' + css + '</style>' +
                '</head><body>' +
                '<div class="print-header">' +
                '<div>' +
                '<h2 class="print-title">P4S \u2014 ' + navText + '</h2>' +
                '<p class="print-subtitle">DFAED \u00b7 DFBC \u00b7 SCRC \u00b7 UNPJ</p>' +
                '</div>' +
                '<span class="print-export-date">' + exportLabel + '</span>' +
                '</div>' +
                '<div class="planning-table-wrapper">' + tableHtml + '</div>' +
                legendHtml +
                '</body></html>';

            var w = window.open('', '_blank');
            if (!w) { return; }
            w.document.write(html);
            w.document.close();
            w.focus();
            setTimeout(function () { w.print(); w.close(); }, 400);
        }
    };

}());
