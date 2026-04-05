/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningJournalier.js]] */
/**
 * Vue Service Journalier
 * Grille : agents (ordonnees) x heures 07h-20h (abscisses)
 */
(function () {

    var D = null;
    var HEURES = [];
    (function () { for (var i = 7; i <= 20; i++) HEURES.push(i); })();

    var ROLE_LABELS_JOUR = {
        commandement: 'Commandement',
        chefs_pole: 'Chefs de pole',
        csf: 'Cellule de suivi fonctionnel (CSF)',
        formation: 'Formation',
        experts: 'Experts biometrie'
    };

    window.PlanningJournalier = {

        _$el: null,
        _isGestion: false,
        _year: 0,
        _month: 0,
        _day: 0,
        _personnel: [],
        _data: {},
        _comments: {},
        _isDirty: false,
        _missions: [],
        _$dropdown: null,
        _$tooltip: null,
        _$commentModal: null,
        _activeAgentId: null,
        _activeHour: null,

        /* Multi-sélection */
        _dragActive: false,
        _dragHasMoved: false,
        _dragStartAgent: null,
        _dragStartHour: null,
        _dragCurAgent: null,
        _dragCurHour: null,
        _lastSingleAgent: null,
        _lastSingleHour: null,
        _selectedCells: [],
        _$selectionBadge: null,
        _ignoreNextClick: false,
        _commentaireJour: '',
        _collapsedRoles: {},
        _previsionData: {},
        _counterSortState: { col: null, dir: 0 },

        /* ============================================================= */
        /*  INIT                                                          */
        /* ============================================================= */

        init: function ($container, personnel, isGestion) {
            D = window.PlanningData;
            this._$el = $container;
            this._isGestion = isGestion;
            this._personnel = personnel || [];
            this._missions = window.PlanningMissionsJournalier || [];

            var now = new Date();
            this._year = now.getFullYear();
            this._month = now.getMonth() + 1;
            this._day = now.getDate();

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
            var dataDone = false;
            var commentsDone = !self._isGestion;
            var commentaireJourDone = false;
            var previsionDone = !self._isGestion;
            var pendingData = {};
            var pendingComments = {};
            var pendingCommentaireJour = '';
            var pendingPrevision = {};

            function tryRender() {
                if (dataDone && commentsDone && commentaireJourDone && previsionDone) {
                    self._data = pendingData;
                    self._comments = pendingComments;
                    self._commentaireJour = pendingCommentaireJour;
                    self._previsionData = pendingPrevision;
                    self._isDirty = false;
                    self._render();
                }
            }

            D.loadJournalier(self._year, self._month, self._day, function (err, data) {
                pendingData = data || {};
                dataDone = true;
                tryRender();
            });

            if (self._isGestion) {
                D.loadCommentsJournalier(self._year, self._month, self._day, function (err, data) {
                    pendingComments = data || {};
                    commentsDone = true;
                    tryRender();
                });
                D.loadPrevisionJournalier(self._year, self._month, self._day, function (err, data) {
                    pendingPrevision = data || {};
                    previsionDone = true;
                    tryRender();
                });
            }

            D.loadCommentaireJour(self._year, self._month, self._day, function (err, data) {
                pendingCommentaireJour = (data && data.text) ? data.text : '';
                commentaireJourDone = true;
                tryRender();
            });
        },

        save: function () {
            var self = this;
            self._setSaveState('saving');
            D.saveJournalier(self._year, self._month, self._day, self._data, function (err) {
                if (err) {
                    alert('Erreur de sauvegarde : ' + err);
                    self._setSaveState('dirty');
                    return;
                }
                D.saveCommentsJournalier(self._year, self._month, self._day, self._comments, function (errC) {
                    if (errC) {
                        alert('Erreur de sauvegarde commentaires : ' + errC);
                        self._setSaveState('dirty');
                        return;
                    }
                    D.saveCommentaireJour(self._year, self._month, self._day, { text: self._commentaireJour }, function (errCJ) {
                        if (errCJ) {
                            alert('Erreur de sauvegarde commentaire journee : ' + errCJ);
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

        _computeRange: function (a1, h1, a2, h2) {
            var i1 = this._agentIndex(a1);
            var i2 = this._agentIndex(a2);
            if (i1 === -1 || i2 === -1) return [];
            var iMin = Math.min(i1, i2);
            var iMax = Math.max(i1, i2);
            var hMin = Math.min(parseInt(h1, 10), parseInt(h2, 10));
            var hMax = Math.max(parseInt(h1, 10), parseInt(h2, 10));
            var cells = [];
            for (var i = iMin; i <= iMax; i++) {
                for (var h = hMin; h <= hMax; h++) {
                    cells.push({ agent: this._personnel[i].id, hour: D.pad(h) });
                }
            }
            return cells;
        },

        _highlightSelection: function () {
            this._$el.find('.planning-cell-selected').removeClass('planning-cell-selected');
            for (var i = 0; i < this._selectedCells.length; i++) {
                var c = this._selectedCells[i];
                this._$el.find('.planning-cell[data-agent="' + c.agent + '"][data-hour="' + c.hour + '"]')
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
            h += '<button class="fr-btn fr-btn--secondary fr-btn--sm fr-icon-printer-line" id="planning-jour-print"> Imprimer / PDF</button>';
            h += '</div>';
            h += this._buildCommentaireJour();
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
            var dn = D.JOURS_COURTS[D.getDayOfWeek(this._year, this._month, this._day)];
            var label = dn + ' ' + this._day + ' ' + D.MOIS[this._month - 1] + ' ' + this._year;
            var holidayName = D.getHolidayName(this._year, this._month, this._day);
            if (holidayName) label += ' — ' + holidayName;
            return '<div class="planning-nav">' +
                '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="jour-prev">\u25C4</button>' +
                '<span class="planning-nav-title">' + label + '</span>' +
                '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="jour-next">\u25BA</button>' +
                '</div>';
        },

        /* --- Save bar --- */
        _buildSaveBar: function () {
            return '<div class="planning-save-bar" id="jour-save-bar">' +
                '<span class="planning-save-status" id="jour-save-status">Aucune modification</span>' +
                '<button class="fr-btn fr-btn--sm" id="jour-save-btn" disabled>Enregistrer</button>' +
                '</div>';
        },

        _setSaveState: function (state) {
            var $bar = $('#jour-save-bar');
            var $status = $('#jour-save-status');
            var $btn = $('#jour-save-btn');
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
            var h = '<table class="planning-table" id="jour-table">';

            /* Header */
            h += '<thead><tr><th class="planning-col-agent">Agent</th>';
            for (var i = 0; i < HEURES.length; i++) {
                h += '<th>' + D.pad(HEURES[i]) + 'h</th>';
            }
            h += '</tr></thead>';

            /* Body */
            var prevRoleJour = null;
            h += '<tbody>';
            for (var p = 0; p < this._personnel.length; p++) {
                var agent = this._personnel[p];
                var agentRole = agent.role || 'experts';
                if (agentRole !== prevRoleJour) {
                    var chevronJour = this._collapsedRoles[agentRole] ? '\u25BA' : '\u25BC';
                    h += '<tr class="planning-role-separator" data-role-key="' + agentRole + '">' +
                         '<td colspan="' + (HEURES.length + 1) + '">' +
                         '<span class="planning-role-toggle">' + chevronJour + '</span> ' +
                         (ROLE_LABELS_JOUR[agentRole] || agentRole) + '</td></tr>';
                    prevRoleJour = agentRole;
                }
                var agentData = this._data[agent.id] || {};
                var rowStyleJour = this._collapsedRoles[agentRole] ? ' style="display:none"' : '';
                h += '<tr data-role-key="' + agentRole + '"' + rowStyleJour + '><td class="planning-col-agent">' + (agent.grade ? agent.grade + ' ' : '') + agent.nom + '</td>';
                for (var j = 0; j < HEURES.length; j++) {
                    var hKey = D.pad(HEURES[j]);
                    var code = agentData[hKey] || '';
                    var mission = this._getMission(code);
                    var cellCls = 'planning-cell';
                    if (this._isGestion) cellCls += ' editable';
                    var comment = (this._isGestion && this._comments[agent.id] && this._comments[agent.id][hKey]) ? this._comments[agent.id][hKey] : '';
                    if (comment) cellCls += ' has-comment';
                    var bg = code ? mission.bg : '';
                    var fg = code ? mission.fg : '';
                    var style = bg ? 'background-color:' + bg + ';color:' + fg + ';' : '';
                    var commentAttr = comment ? ' data-comment="' + comment.replace(/"/g, '&quot;') + '"' : '';
                    var prevCode = (this._isGestion && this._previsionData && this._previsionData[agent.id] && this._previsionData[agent.id][hKey]) ? this._previsionData[agent.id][hKey] : '';
                    var prevDot = prevCode ? '<span class="planning-prevision-dot" title="Pr\u00e9vision\u00a0: ' + prevCode + '" data-agent="' + agent.id + '" data-hour="' + hKey + '" data-code="' + prevCode + '"></span>' : '';
                    h += '<td class="' + cellCls + '" data-agent="' + agent.id + '" data-hour="' + hKey + '"' +
                         (style ? ' style="' + style + '"' : '') + commentAttr + '>' +
                         code + prevDot + '</td>';
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
                     m.code + ' \u2014 ' + m.label + '</span>';
            }
            h += '</div>';
            return h;
        },

        /* --- Consignes globales de journee --- */
        _buildCommentaireJour: function () {
            var h = '<div class="planning-commentaire-jour">';
            h += '<div class="planning-commentaire-jour-header">';
            h += '<span class="planning-commentaire-jour-title">Consignes</span>';
            h += '</div>';
            if (this._isGestion) {
                var escaped = (this._commentaireJour || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                h += '<textarea class="planning-commentaire-jour-input" id="jour-commentaire-input" rows="4" placeholder="Ajouter une consigne pour cette journee...">' + escaped + '</textarea>';
            } else {
                var txt = this._commentaireJour || '';
                if (txt) {
                    var display = txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
                    h += '<div class="planning-commentaire-jour-text">' + display + '</div>';
                } else {
                    h += '<div class="planning-commentaire-jour-empty">Aucune consigne pour cette journee.</div>';
                }
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
            h += '<table class="planning-counters-table" id="jour-counters-table"><thead><tr>';
            h += '<th class="planning-cth-agent planning-cth-sortable" data-sort-col="agent">';
            h += 'Agent <span class="planning-sort-icon">\u2195</span></th>';
            for (var c = 0; c < activeCodes.length; c++) {
                h += '<th class="planning-cth-sortable" data-sort-col="c-' + c + '" style="background:' + activeCodes[c].bg + ';color:' + activeCodes[c].fg + ';">';
                h += activeCodes[c].code + ' <span class="planning-sort-icon">\u2195</span></th>';
            }
            h += '<th class="planning-cth-sortable" data-sort-col="total">Total h <span class="planning-sort-icon">\u2195</span></th>';
            h += '</tr></thead><tbody>';

            for (var p = 0; p < this._personnel.length; p++) {
                var agent = this._personnel[p];
                var agentData = this._data[agent.id] || {};
                var total = 0;
                var agentLabel = (agent.grade ? agent.grade + ' ' : '') + agent.nom;
                h += '<tr data-orig-idx="' + p + '">';
                h += '<td data-val="' + agentLabel + '">' + agentLabel + '</td>';
                for (var c2 = 0; c2 < activeCodes.length; c2++) {
                    var count = 0;
                    for (var j = 0; j < HEURES.length; j++) {
                        var hKey = D.pad(HEURES[j]);
                        if ((agentData[hKey] || '') === activeCodes[c2].code) count++;
                    }
                    total += count;
                    h += '<td data-sort-col="c-' + c2 + '" data-val="' + count + '">' + count + '</td>';
                }
                h += '<td data-sort-col="total" data-val="' + total + '"><strong>' + total + '</strong></td></tr>';
            }
            h += '</tbody></table></details>';
            return h;
        },

        _bindCounterSort: function () {
            var self = this;
            this._$el.on('click', '#jour-counters-table .planning-cth-sortable', function () {
                var col = $(this).data('sort-col');
                if (self._counterSortState.col === col) {
                    if (self._counterSortState.dir === 1) {
                        self._counterSortState.dir = -1;
                    } else if (self._counterSortState.dir === -1) {
                        self._counterSortState.dir = 0;
                        self._counterSortState.col = null;
                    } else {
                        self._counterSortState.dir = 1;
                    }
                } else {
                    self._counterSortState.col = col;
                    self._counterSortState.dir = 1;
                }
                self._applyCounterSort();
            });
        },

        _applyCounterSort: function () {
            var state = this._counterSortState;
            var $tbody = this._$el.find('#jour-counters-table tbody');
            var rows = $tbody.find('tr').get();

            if (state.dir === 0 || state.col === null) {
                rows.sort(function (a, b) {
                    return parseInt($(a).data('orig-idx'), 10) - parseInt($(b).data('orig-idx'), 10);
                });
            } else {
                var col = state.col;
                var dir = state.dir;
                rows.sort(function (a, b) {
                    var va, vb;
                    if (col === 'agent') {
                        va = $(a).find('td:first-child').data('val') || '';
                        vb = $(b).find('td:first-child').data('val') || '';
                        return dir * ('' + va).localeCompare('' + vb);
                    }
                    va = parseInt($(a).find('td[data-sort-col="' + col + '"]').data('val'), 10) || 0;
                    vb = parseInt($(b).find('td[data-sort-col="' + col + '"]').data('val'), 10) || 0;
                    return dir * (va - vb);
                });
            }

            $tbody.empty();
            for (var i = 0; i < rows.length; i++) { $tbody.append(rows[i]); }

            /* Mise a jour des indicateurs */
            this._$el.find('#jour-counters-table .planning-sort-icon').text('\u2195');
            this._$el.find('#jour-counters-table .planning-cth-sortable')
                .removeClass('planning-sort-asc planning-sort-desc');
            if (state.dir !== 0 && state.col !== null) {
                var $th = this._$el.find('#jour-counters-table [data-sort-col="' + state.col + '"]').first();
                $th.addClass(state.dir === 1 ? 'planning-sort-asc' : 'planning-sort-desc');
                $th.find('.planning-sort-icon').text(state.dir === 1 ? '\u25B2' : '\u25BC');
            }
        },

        /* ============================================================= */
        /*  EVENTS                                                        */
        /* ============================================================= */

        _bindEvents: function () {
            var self = this;

            $('#jour-prev').on('click', function () { self._navigate(-1); });
            $('#jour-next').on('click', function () { self._navigate(1); });
            $('#jour-save-btn').on('click', function () { self.save(); });
            $('#planning-jour-print').on('click', function () { self._openPrintWindow(); });

            this._$el.on('click', '.planning-role-separator', function () {
                var role = $(this).data('role-key');
                self._collapsedRoles[role] = !self._collapsedRoles[role];
                self._$el.find('tr[data-role-key="' + role + '"]:not(.planning-role-separator)')
                    .toggle(!self._collapsedRoles[role]);
                $(this).find('.planning-role-toggle')
                    .text(self._collapsedRoles[role] ? '\u25BA' : '\u25BC');
            });

            if (this._isGestion) {
                this._bindCounterSort();

                this._$el.on('input', '#jour-commentaire-input', function () {
                    self._commentaireJour = $(this).val();
                    self._isDirty = true;
                    self._setSaveState('dirty');
                });

                this._$el.on('mousedown', '.planning-cell.editable', function (e) {
                    if (e.which !== 1) return;
                    e.preventDefault();
                    if (self._$commentModal && self._$commentModal.is(':visible')) {
                        self._$commentModal.hide();
                    }
                    var $cell = $(this);
                    var agent = '' + $cell.data('agent');
                    var hour = '' + $cell.data('hour');

                    if (e.shiftKey && self._lastSingleAgent) {
                        /* Shift+clic : sélection rectangulaire depuis la dernière cellule */
                        self._selectedCells = self._computeRange(self._lastSingleAgent, self._lastSingleHour, agent, hour);
                        self._highlightSelection();
                        self._showSelectionBadge(self._selectedCells.length);
                        self._activeAgentId = agent;
                        self._activeHour = hour;
                        self._ignoreNextClick = true;
                        self._showDropdown($cell);
                        return;
                    }

                    /* Début de drag */
                    self._clearSelection();
                    self._dragActive = true;
                    self._dragHasMoved = false;
                    self._dragStartAgent = agent;
                    self._dragStartHour = hour;
                    self._dragCurAgent = agent;
                    self._dragCurHour = hour;
                    self._selectedCells = [{ agent: agent, hour: hour }];
                    self._highlightSelection();
                    $('#jour-table').addClass('planning-dragging');
                });

                this._$el.on('mouseover', '.planning-cell.editable', function () {
                    if (!self._dragActive) return;
                    var $cell = $(this);
                    var agent = '' + $cell.data('agent');
                    var hour = '' + $cell.data('hour');
                    if (agent === self._dragCurAgent && hour === self._dragCurHour) return;
                    self._dragCurAgent = agent;
                    self._dragCurHour = hour;
                    if (agent !== self._dragStartAgent || hour !== self._dragStartHour) {
                        self._dragHasMoved = true;
                    }
                    self._selectedCells = self._computeRange(self._dragStartAgent, self._dragStartHour, agent, hour);
                    self._highlightSelection();
                    if (self._selectedCells.length > 1) {
                        self._showSelectionBadge(self._selectedCells.length);
                    }
                });

                $(document).off('mouseup.jourDrag').on('mouseup.jourDrag', function () {
                    if (!self._dragActive) return;
                    self._dragActive = false;
                    $('#jour-table').removeClass('planning-dragging');

                    if (self._dragHasMoved && self._selectedCells.length > 1) {
                        /* Drag multi-cellules : ouvrir dropdown sur la dernière cellule */
                        var $lastCell = self._$el.find(
                            '.planning-cell[data-agent="' + self._dragCurAgent + '"][data-hour="' + self._dragCurHour + '"]'
                        );
                        if ($lastCell.length) {
                            self._activeAgentId = self._dragCurAgent;
                            self._activeHour = self._dragCurHour;
                            self._ignoreNextClick = true;
                            self._showDropdown($lastCell);
                        }
                    } else {
                        /* Clic simple */
                        self._clearSelection();
                        var $startCell = self._$el.find(
                            '.planning-cell[data-agent="' + self._dragStartAgent + '"][data-hour="' + self._dragStartHour + '"]'
                        );
                        if ($startCell.length) {
                            self._activeAgentId = self._dragStartAgent;
                            self._activeHour = self._dragStartHour;
                            self._lastSingleAgent = self._dragStartAgent;
                            self._lastSingleHour = self._dragStartHour;
                            self._ignoreNextClick = true;
                            /* Si une prévision existe → dialog de validation en priorité */
                            var agentId = self._dragStartAgent;
                            var hourKey = self._dragStartHour;
                            var prevCode = self._previsionData[agentId] && self._previsionData[agentId][hourKey]
                                ? self._previsionData[agentId][hourKey] : '';
                            if (prevCode) {
                                var agentNom = '';
                                for (var pi = 0; pi < self._personnel.length; pi++) {
                                    if (self._personnel[pi].id === agentId) {
                                        agentNom = (self._personnel[pi].grade ? self._personnel[pi].grade + ' ' : '') + self._personnel[pi].nom;
                                        break;
                                    }
                                }
                                self._openPrevisionDialog(agentId, hourKey, prevCode, agentNom);
                            } else {
                                self._showDropdown($startCell);
                            }
                        }
                    }
                });

                $(document).off('keydown.jourDrag').on('keydown.jourDrag', function (e) {
                    if (e.key === 'Escape' || e.keyCode === 27) {
                        self._clearSelection();
                        if (self._dragActive) {
                            self._dragActive = false;
                            $('#jour-table').removeClass('planning-dragging');
                        }
                        if (self._$dropdown) self._$dropdown.hide();
                    }
                });

                this._$el.off('.jourComment')
                    .on('mouseenter.jourComment', '.has-comment', function () {
                        var comment = $(this).data('comment');
                        var rect = this.getBoundingClientRect();
                        self._$tooltip.text(comment).css({
                            top: rect.top + window.scrollY - 4,
                            left: rect.left + window.scrollX
                        }).show();
                    })
                    .on('mouseleave.jourComment', '.has-comment', function () {
                        self._$tooltip.hide();
                    })
                    .on('contextmenu.jourComment', '.planning-cell.editable', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._$tooltip.hide();
                        var $cell = $(this);
                        var agentId = $cell.data('agent');
                        var hour = '' + $cell.data('hour');
                        var agentNom = '';
                        for (var i = 0; i < self._personnel.length; i++) {
                            if (self._personnel[i].id === agentId) {
                                agentNom = self._personnel[i].nom;
                                break;
                            }
                        }
                        var existing = (self._comments[agentId] && self._comments[agentId][hour]) ? self._comments[agentId][hour] : '';
                        var rect = $cell[0].getBoundingClientRect();
                        self._$commentModal
                            .find('.planning-comment-modal-title').text('Commentaire \u2014 ' + agentNom + ' \u2014 ' + hour + 'h').end()
                            .find('.planning-comment-input').val(existing).end()
                            .css({ top: rect.bottom + window.scrollY + 2, left: rect.left + window.scrollX })
                            .data('agentId', agentId).data('key', hour)
                            .show();
                        self._$commentModal.find('.planning-comment-input').focus();
                    });
            }
        },

        _navigate: function (delta) {
            if (this._isDirty) {
                if (!confirm('Des modifications non enregistrees seront perdues. Continuer ?')) return;
            }
            var d = new Date(this._year, this._month - 1, this._day + delta);
            this._year = d.getFullYear();
            this._month = d.getMonth() + 1;
            this._day = d.getDate();
            this.loadAndRender();
        },

        /* ============================================================= */
        /*  DROPDOWN                                                      */
        /* ============================================================= */

        _createDropdown: function () {
            if (this._$dropdown) return;
            var h = '<div class="planning-dropdown" id="jour-dropdown">';
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
            $(document).on('click.jourDropdown', function () {
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
                    var $cell = self._$el.find('.planning-cell[data-agent="' + agentId + '"][data-hour="' + key + '"]');
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

                $(document).off('mousedown.jourCommentModal').on('mousedown.jourCommentModal', function (e) {
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
                : (this._activeAgentId && this._activeHour
                    ? [{ agent: this._activeAgentId, hour: this._activeHour }]
                    : []);

            if (cells.length === 0) return;

            for (var i = 0; i < cells.length; i++) {
                var c = cells[i];
                if (!this._data[c.agent]) this._data[c.agent] = {};
                this._data[c.agent][c.hour] = code;
                var $cell = this._$el.find('.planning-cell[data-agent="' + c.agent + '"][data-hour="' + c.hour + '"]');
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
            var navText = this._$el.find('.planning-nav-title').text() || 'Service Journalier';
            var $table = this._$el.find('#jour-table');
            var $legend = this._$el.find('.planning-legend');
            var $commentaireWrap = this._$el.find('.planning-commentaire-jour');

            var tableHtml = $table.length ? $table[0].outerHTML : '';
            var legendHtml = $legend.length ? $legend[0].outerHTML : '';
            var commentHtml = $commentaireWrap.length ? $commentaireWrap[0].outerHTML : '';

            var now = new Date();
            var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
            var exportLabel = 'Export\u00e9 le ' +
                pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear() +
                ' \u00e0 ' + pad(now.getHours()) + 'h' + pad(now.getMinutes());

            var css = [
                '@page { size: A4 portrait; margin: 1.5cm; }',
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
                '}',
                '.planning-table th, .planning-table td {',
                '    border: 1px solid #ccc;',
                '    padding: 1px 2px;',
                '    text-align: center;',
                '    white-space: nowrap;',
                '    overflow: hidden;',
                '    height: 18px;',
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
                '    width: 22%;',
                '    padding-left: 4px !important;',
                '}',
                'td.planning-col-agent, th.planning-col-agent {',
                '    white-space: normal;',
                '    overflow: visible;',
                '    word-break: break-word;',
                '    height: auto;',
                '}',
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
                '    gap: 4px;',
                '    margin-top: 8pt;',
                '    padding: 6px 8px;',
                '    background: #f6f6f6;',
                '    border-radius: 3px;',
                '}',
                '.planning-legend-item {',
                '    display: inline-flex;',
                '    align-items: center;',
                '    gap: 3px;',
                '    padding: 2px 8px;',
                '    border-radius: 3px;',
                '    font-size: 7.5pt;',
                '    font-weight: 600;',
                '    border: 1px solid rgba(0,0,0,0.1);',
                '}',
                '.planning-commentaire-jour {',
                '    margin-bottom: 8pt;',
                '    border: 1px solid #e5e5e5;',
                '    border-radius: 3px;',
                '    overflow: hidden;',
                '}',
                '.planning-commentaire-jour-header { padding: 3px 8px; background: #f0f0f0; }',
                '.planning-commentaire-jour-title { font-size: 8pt; font-weight: 700; }',
                '.planning-commentaire-jour-text,',
                '.planning-commentaire-jour-empty {',
                '    padding: 4px 8px;',
                '    font-size: 8pt;',
                '    white-space: pre-wrap;',
                '    word-break: break-word;',
                '    background: #fff;',
                '}',
                '.planning-commentaire-jour-input { display: none !important; }',
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
                '<title>Service Journalier \u2014 ' + navText + '</title>' +
                '<style>' + css + '</style>' +
                '</head><body>' +
                '<div class="print-header">' +
                '<div>' +
                '<h2 class="print-title">Service Journalier \u2014 ' + navText + '</h2>' +
                '<p class="print-subtitle">DFAED \u00b7 DFBC \u00b7 SCRC \u00b7 UNPJ</p>' +
                '</div>' +
                '<span class="print-export-date">' + exportLabel + '</span>' +
                '</div>' +
                commentHtml +
                '<div class="planning-table-wrapper">' + tableHtml + '</div>' +
                legendHtml +
                '</body></html>';

            var w = window.open('', '_blank');
            if (!w) { return; }
            w.document.write(html);
            w.document.close();
            w.focus();
            setTimeout(function () { w.print(); w.close(); }, 400);
        },

        /* ============================================================= */
        /*  DIALOG PREVISION                                              */
        /* ============================================================= */

        _openPrevisionDialog: function (agentId, hour, prevCode, agentNom) {
            var self = this;

            /* Detection de la plage d'heures consecutive (meme code, meme agent) */
            var hourInt = parseInt(hour, 10);
            var agentPrev = self._previsionData[agentId] || {};
            var periodStartH = hourInt;
            var periodEndH = hourInt;
            while (periodStartH > 7  && agentPrev[D.pad(periodStartH - 1)] === prevCode) periodStartH--;
            while (periodEndH < 20 && agentPrev[D.pad(periodEndH + 1)] === prevCode) periodEndH++;
            var isPeriod = (periodStartH < periodEndH);
            var periodLength = periodEndH - periodStartH + 1;

            var mission = self._getMission(prevCode);
            var missionLabel = mission.label || prevCode;

            var dn = D.JOURS_COURTS[D.getDayOfWeek(self._year, self._month, self._day)];
            var dateBase = dn + ' ' + self._day + ' ' + D.MOIS[self._month - 1] + ' ' + self._year;
            var periodStr = isPeriod
                ? D.pad(periodStartH) + 'h\u2013' + D.pad(periodEndH) + 'h (' + periodLength + '\u00a0h) \u2014 ' + dateBase
                : D.pad(hourInt) + 'h \u2014 ' + dateBase;

            var html = '<div class="planning-prevision-dialog-overlay">' +
                '<div class="planning-prevision-dialog">' +
                '<h4>Pr\u00e9vision en attente</h4>' +
                '<p><strong>Agent\u00a0:</strong> ' + agentNom + '</p>' +
                '<p><strong>' + (isPeriod ? 'Plage\u00a0:' : 'Heure\u00a0:') + '</strong> ' + periodStr + '</p>' +
                '<p><strong>Code\u00a0:</strong> ' + prevCode + ' \u2014 ' + missionLabel + '</p>' +
                '<div class="planning-prevision-dialog-actions">';

            if (isPeriod) {
                html += '<button class="fr-btn fr-btn--sm" id="pd-ok-period">Int\u00e9grer la plage (' + periodLength + '\u00a0h)</button>';
                html += '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="pd-ok-day">Cette heure seule</button>';
            } else {
                html += '<button class="fr-btn fr-btn--sm" id="pd-ok-day">Int\u00e9grer ' + prevCode + '</button>';
            }

            html += '</div><div class="planning-prevision-dialog-actions planning-prevision-dialog-actions--reject">';

            if (isPeriod) {
                html += '<button class="fr-btn fr-btn--secondary fr-btn--sm planning-btn-reject" id="pd-reject-period">Rejeter la plage</button>';
                html += '<button class="fr-btn fr-btn--secondary fr-btn--sm planning-btn-reject" id="pd-reject-day">Rejeter cette heure</button>';
            } else {
                html += '<button class="fr-btn fr-btn--secondary fr-btn--sm planning-btn-reject" id="pd-reject-day">Rejeter</button>';
            }
            html += '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="pd-cancel">Annuler</button>';
            html += '</div></div></div>';

            var $overlay = $(html).appendTo('body');

            /* Integrer une plage d'heures dans le planning officiel */
            function integrateRange(startH, endH) {
                var m = self._getMission(prevCode);
                for (var h = startH; h <= endH; h++) {
                    var hKey = D.pad(h);
                    if (!self._data[agentId]) self._data[agentId] = {};
                    self._data[agentId][hKey] = prevCode;
                    if (self._previsionData[agentId]) delete self._previsionData[agentId][hKey];
                    var $cell = self._$el.find('.planning-cell[data-agent="' + agentId + '"][data-hour="' + hKey + '"]');
                    $cell.html(prevCode).css({ 'background-color': m.bg, 'color': m.fg });
                }
                self._isDirty = true;
                self._setSaveState('dirty');
                D.savePrevisionJournalier(self._year, self._month, self._day, self._previsionData, function (err) {
                    if (err) console.warn('[Planning] Erreur sauvegarde prevision journalier:', err);
                });
            }

            /* Rejeter (supprimer) une plage de previsions */
            function rejectRange(startH, endH) {
                for (var h = startH; h <= endH; h++) {
                    var hKey = D.pad(h);
                    if (self._previsionData[agentId]) delete self._previsionData[agentId][hKey];
                    self._$el.find('.planning-cell[data-agent="' + agentId + '"][data-hour="' + hKey + '"] .planning-prevision-dot').remove();
                }
                D.savePrevisionJournalier(self._year, self._month, self._day, self._previsionData, function (err) {
                    if (err) console.warn('[Planning] Erreur sauvegarde prevision journalier:', err);
                });
            }

            $overlay.on('click', '#pd-ok-period',     function () { integrateRange(periodStartH, periodEndH); $overlay.remove(); });
            $overlay.on('click', '#pd-ok-day',         function () { integrateRange(hourInt, hourInt);        $overlay.remove(); });
            $overlay.on('click', '#pd-reject-period', function () { rejectRange(periodStartH, periodEndH);    $overlay.remove(); });
            $overlay.on('click', '#pd-reject-day',    function () { rejectRange(hourInt, hourInt);            $overlay.remove(); });
            $overlay.on('click', '#pd-cancel',        function () { $overlay.remove(); });
            $overlay.on('click', function (e) {
                if ($(e.target).hasClass('planning-prevision-dialog-overlay')) $overlay.remove();
            });
        }
    };

}());
