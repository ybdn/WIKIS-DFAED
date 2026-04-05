/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningPrevision.js]] */
/**
 * Module Planning Prevision
 * Accessible a tous les agents connectes (pas de restriction bureaucrate).
 * Permet de saisir des previsions d'absences P4S et de SPORT journalier.
 * Les previsions sont stockees dans des pages distinctes des donnees officielles
 * et peuvent etre integrees depuis Planning:Gestion par un bureaucrate.
 */
(function () {

    var D = null;

    /* Codes autorises pour les previsions P4S */
    var CODES_P4S = [
        { code: 'R',   label: 'Repos',           bg: '#dffee6', fg: '#18753c' },
        { code: 'RR',  label: 'Repos recup.',     bg: '#dffee6', fg: '#18753c' },
        { code: 'P',   label: 'Permissions',      bg: '#dffee6', fg: '#18753c' },
        { code: 'PM',  label: 'Perm. matin',      bg: '#dffee6', fg: '#18753c' },
        { code: 'PAM', label: 'Perm. apres-midi', bg: '#dffee6', fg: '#18753c' }
    ];

    /* Codes autorises pour les previsions journalieres */
    var CODES_JOUR = [
        { code: 'SPORT', label: 'Sport', bg: '#fee9e2', fg: '#b34000' }
    ];

    var HEURES = [];
    (function () { for (var i = 7; i <= 20; i++) HEURES.push(i); }());

    var ROLE_LABELS = {
        commandement: 'Commandement',
        chefs_pole: 'Chefs de pole',
        csf: 'Cellule de suivi fonctionnel (CSF)',
        formation: 'Formation',
        experts: 'Experts biometrie'
    };

    window.PlanningPrevision = {

        _$el: null,
        _year: 0,
        _month: 0,
        _day: 0,
        _personnel: [],
        _dataP4S: {},
        _dataJour: {},
        _isDirtyP4S: false,
        _isDirtyJour: false,
        _activeTab: 'p4s',
        _$dropdownP4S: null,
        _$dropdownJour: null,
        _activeAgentId: null,
        _activeKey: null,

        /* Groupes replies */
        _collapsedRolesP4S: {},
        _collapsedRolesJour: {},

        /* Multi-selection P4S */
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

        /* ============================================================= */
        /*  INIT                                                          */
        /* ============================================================= */

        init: function ($el, personnel) {
            D = window.PlanningData;
            this._$el = $el;
            this._personnel = personnel || [];

            var now = new Date();
            this._year = now.getFullYear();
            this._month = now.getMonth() + 1;
            this._day = now.getDate();

            /* Titre H1 */
            var $h1 = $('#firstHeading');
            if ($h1.length) $h1.text('Planning \u2014 Pr\u00e9visions');

            this._createDropdowns();
            this._createSelectionBadge();
            this._buildShell();
            this._loadP4S();
            this._loadJour();
        },

        /* ============================================================= */
        /*  SHELL — structure onglets                                     */
        /* ============================================================= */

        _buildShell: function () {
            var h = '<div class="planning-app" id="planning-app">';
            h += '<div class="planning-tabs">';
            h += '<button class="planning-tab active" id="prev-tab-p4s">P4S \u2014 Pr\u00e9visions mensuelles</button>';
            h += '<button class="planning-tab" id="prev-tab-jour">Service Journalier \u2014 Pr\u00e9visions</button>';
            h += '</div>';
            h += '<div id="prev-panel-p4s" class="planning-panel active"></div>';
            h += '<div id="prev-panel-jour" class="planning-panel" style="display:none;"></div>';
            h += '</div>';
            this._$el.html(h);

            $('body').addClass('planning-fullwidth');

            var self = this;
            $('#prev-tab-p4s').on('click', function () {
                if (self._activeTab === 'p4s') return;
                self._activeTab = 'p4s';
                $('#prev-tab-p4s').addClass('active');
                $('#prev-tab-jour').removeClass('active');
                $('#prev-panel-p4s').show();
                $('#prev-panel-jour').hide();
                $('body').addClass('planning-fullwidth');
            });
            $('#prev-tab-jour').on('click', function () {
                if (self._activeTab === 'jour') return;
                self._activeTab = 'jour';
                $('#prev-tab-jour').addClass('active');
                $('#prev-tab-p4s').removeClass('active');
                $('#prev-panel-jour').show();
                $('#prev-panel-p4s').hide();
                $('body').removeClass('planning-fullwidth');
            });
        },

        /* ============================================================= */
        /*  DONNEES — P4S                                                 */
        /* ============================================================= */

        _loadP4S: function () {
            var self = this;
            $('#prev-panel-p4s').html('<div style="text-align:center;padding:2rem;color:#666;">Chargement...</div>');
            D.loadPrevisionP4S(self._year, self._month, function (err, data) {
                self._dataP4S = data || {};
                self._isDirtyP4S = false;
                self._renderP4S();
            });
        },

        _saveP4S: function () {
            var self = this;
            self._setSaveStateP4S('saving');
            D.savePrevisionP4S(self._year, self._month, self._dataP4S, function (err) {
                if (err) {
                    alert('Erreur de sauvegarde\u00a0: ' + err);
                    self._setSaveStateP4S('dirty');
                } else {
                    self._isDirtyP4S = false;
                    self._setSaveStateP4S('saved');
                    setTimeout(function () {
                        if (!self._isDirtyP4S) self._setSaveStateP4S('clean');
                    }, 2500);
                }
            });
        },

        /* ============================================================= */
        /*  DONNEES — JOURNALIER                                          */
        /* ============================================================= */

        _loadJour: function () {
            var self = this;
            $('#prev-panel-jour').html('<div style="text-align:center;padding:2rem;color:#666;">Chargement...</div>');
            D.loadPrevisionJournalier(self._year, self._month, self._day, function (err, data) {
                self._dataJour = data || {};
                self._isDirtyJour = false;
                self._renderJour();
            });
        },

        _saveJour: function () {
            var self = this;
            self._setSaveStateJour('saving');
            D.savePrevisionJournalier(self._year, self._month, self._day, self._dataJour, function (err) {
                if (err) {
                    alert('Erreur de sauvegarde\u00a0: ' + err);
                    self._setSaveStateJour('dirty');
                } else {
                    self._isDirtyJour = false;
                    self._setSaveStateJour('saved');
                    setTimeout(function () {
                        if (!self._isDirtyJour) self._setSaveStateJour('clean');
                    }, 2500);
                }
            });
        },

        /* ============================================================= */
        /*  RENDER — P4S                                                  */
        /* ============================================================= */

        _renderP4S: function () {
            this._dragActive = false;
            this._clearSelection();
            var h = '';
            h += this._buildNavP4S();
            h += this._buildSaveBarP4S();
            h += '<div class="planning-table-wrapper">' + this._buildTableP4S() + '</div>';
            h += this._buildLegendP4S();
            $('#prev-panel-p4s').html(h);
            this._bindEventsP4S();
        },

        _buildNavP4S: function () {
            var label = D.MOIS[this._month - 1] + ' ' + this._year;
            return '<div class="planning-nav">' +
                '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="prev-p4s-prev">\u25C4</button>' +
                '<span class="planning-nav-title">' + label + '</span>' +
                '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="prev-p4s-next">\u25BA</button>' +
                '</div>';
        },

        _buildSaveBarP4S: function () {
            return '<div class="planning-save-bar" id="prev-p4s-save-bar">' +
                '<span class="planning-save-status" id="prev-p4s-save-status">Aucune modification</span>' +
                '<button class="fr-btn fr-btn--sm" id="prev-p4s-save-btn" disabled>Enregistrer</button>' +
                '</div>';
        },

        _setSaveStateP4S: function (state) {
            var $bar = $('#prev-p4s-save-bar');
            var $status = $('#prev-p4s-save-status');
            var $btn = $('#prev-p4s-save-btn');
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

        _buildTableP4S: function () {
            var days = D.getDaysInMonth(this._year, this._month);
            var y = this._year;
            var m = this._month;
            var h = '<table class="planning-table" id="prev-p4s-table">';

            /* En-tete */
            h += '<thead><tr><th class="planning-col-agent">Agent</th>';
            for (var d = 1; d <= days; d++) {
                var cls = 'planning-col-day';
                if (D.isWeekend(y, m, d)) cls += ' planning-col-weekend';
                if (D.isHoliday(y, m, d)) cls += ' planning-col-holiday';
                var titleAttr = D.isHoliday(y, m, d) ? D.getHolidayName(y, m, d) : '';
                h += '<th class="' + cls + '"' + (titleAttr ? ' title="' + titleAttr + '"' : '') + '>' +
                     d + '<span class="planning-day-name">' + D.JOURS_COURTS[D.getDayOfWeek(y, m, d)] + '</span></th>';
            }
            h += '</tr></thead>';

            /* Corps */
            var prevRole = null;
            h += '<tbody>';
            for (var p = 0; p < this._personnel.length; p++) {
                var agent = this._personnel[p];
                var agentRole = agent.role || 'experts';
                if (agentRole !== prevRole) {
                    var chevron = this._collapsedRolesP4S[agentRole] ? '\u25BA' : '\u25BC';
                    h += '<tr class="planning-role-separator" data-role-key="' + agentRole + '">' +
                         '<td colspan="' + (days + 1) + '">' +
                         '<span class="planning-role-toggle">' + chevron + '</span> ' +
                         (ROLE_LABELS[agentRole] || agentRole) + '</td></tr>';
                    prevRole = agentRole;
                }
                var agentData = this._dataP4S[agent.id] || {};
                var rowStyle = this._collapsedRolesP4S[agentRole] ? ' style="display:none"' : '';
                h += '<tr data-role-key="' + agentRole + '"' + rowStyle + '>' +
                     '<td class="planning-col-agent">' + (agent.grade ? agent.grade + ' ' : '') + agent.nom + '</td>';
                for (var d2 = 1; d2 <= days; d2++) {
                    var code = agentData['' + d2] || '';
                    var cellCls = 'planning-cell editable';
                    if (D.isWeekend(y, m, d2)) cellCls += ' planning-col-weekend';
                    if (D.isHoliday(y, m, d2)) cellCls += ' planning-col-holiday';
                    var bg = '';
                    var fg = '';
                    for (var ci = 0; ci < CODES_P4S.length; ci++) {
                        if (CODES_P4S[ci].code === code) { bg = CODES_P4S[ci].bg; fg = CODES_P4S[ci].fg; break; }
                    }
                    var style = bg ? 'background-color:' + bg + ';color:' + fg + ';' : '';
                    h += '<td class="' + cellCls + '" data-agent="' + agent.id + '" data-day="' + d2 + '"' +
                         (style ? ' style="' + style + '"' : '') + '>' + code + '</td>';
                }
                h += '</tr>';
            }
            h += '</tbody></table>';
            return h;
        },

        _buildLegendP4S: function () {
            var h = '<div class="planning-legend">';
            for (var i = 0; i < CODES_P4S.length; i++) {
                var m = CODES_P4S[i];
                h += '<span class="planning-legend-item" style="background:' + m.bg + ';color:' + m.fg + ';">' +
                     m.code + ' \u2014 ' + m.label + '</span>';
            }
            h += '</div>';
            return h;
        },

        _bindEventsP4S: function () {
            var self = this;

            $('#prev-p4s-prev').on('click', function () { self._navigateP4S(-1); });
            $('#prev-p4s-next').on('click', function () { self._navigateP4S(1); });
            $('#prev-p4s-save-btn').on('click', function () { self._saveP4S(); });

            /* Repli/deploi des groupes de roles */
            this._$el.on('click', '#prev-panel-p4s .planning-role-separator', function () {
                var role = $(this).data('role-key');
                self._collapsedRolesP4S[role] = !self._collapsedRolesP4S[role];
                self._$el.find('#prev-panel-p4s tr[data-role-key="' + role + '"]:not(.planning-role-separator)')
                    .toggle(!self._collapsedRolesP4S[role]);
                $(this).find('.planning-role-toggle')
                    .text(self._collapsedRolesP4S[role] ? '\u25BA' : '\u25BC');
            });

            /* Multi-selection par drag */
            this._$el.on('mousedown', '#prev-panel-p4s .planning-cell.editable', function (e) {
                if (e.which !== 1) return;
                e.preventDefault();
                var $cell = $(this);
                var agent = '' + $cell.data('agent');
                var day = '' + $cell.data('day');

                if (e.shiftKey && self._lastSingleAgent) {
                    self._selectedCells = self._computeRangeP4S(self._lastSingleAgent, self._lastSingleDay, agent, day);
                    self._highlightSelection();
                    self._showSelectionBadge(self._selectedCells.length);
                    self._activeAgentId = agent;
                    self._activeKey = day;
                    self._ignoreNextClick = true;
                    self._showDropdownP4S($cell);
                    return;
                }

                self._clearSelection();
                self._dragActive = true;
                self._dragHasMoved = false;
                self._dragStartAgent = agent;
                self._dragStartDay = day;
                self._dragCurAgent = agent;
                self._dragCurDay = day;
                self._selectedCells = [{ agent: agent, day: day }];
                self._highlightSelection();
                $('#prev-p4s-table').addClass('planning-dragging');
            });

            this._$el.on('mouseover', '#prev-panel-p4s .planning-cell.editable', function () {
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
                self._selectedCells = self._computeRangeP4S(self._dragStartAgent, self._dragStartDay, agent, day);
                self._highlightSelection();
                if (self._selectedCells.length > 1) self._showSelectionBadge(self._selectedCells.length);
            });

            $(document).off('mouseup.prevP4sDrag').on('mouseup.prevP4sDrag', function () {
                if (!self._dragActive) return;
                self._dragActive = false;
                $('#prev-p4s-table').removeClass('planning-dragging');

                if (self._dragHasMoved && self._selectedCells.length > 1) {
                    var $lastCell = self._$el.find(
                        '#prev-panel-p4s .planning-cell[data-agent="' + self._dragCurAgent + '"][data-day="' + self._dragCurDay + '"]'
                    );
                    if ($lastCell.length) {
                        self._activeAgentId = self._dragCurAgent;
                        self._activeKey = self._dragCurDay;
                        self._ignoreNextClick = true;
                        self._showDropdownP4S($lastCell);
                    }
                } else {
                    self._clearSelection();
                    var $startCell = self._$el.find(
                        '#prev-panel-p4s .planning-cell[data-agent="' + self._dragStartAgent + '"][data-day="' + self._dragStartDay + '"]'
                    );
                    if ($startCell.length) {
                        self._activeAgentId = self._dragStartAgent;
                        self._activeKey = self._dragStartDay;
                        self._lastSingleAgent = self._dragStartAgent;
                        self._lastSingleDay = self._dragStartDay;
                        self._ignoreNextClick = true;
                        self._showDropdownP4S($startCell);
                    }
                }
            });

            $(document).off('keydown.prevP4sDrag').on('keydown.prevP4sDrag', function (e) {
                if (e.key === 'Escape' || e.keyCode === 27) {
                    self._clearSelection();
                    if (self._dragActive) {
                        self._dragActive = false;
                        $('#prev-p4s-table').removeClass('planning-dragging');
                    }
                    if (self._$dropdownP4S) self._$dropdownP4S.hide();
                }
            });
        },

        _navigateP4S: function (delta) {
            if (this._isDirtyP4S) {
                if (!confirm('Des modifications non enregistrees seront perdues. Continuer ?')) return;
            }
            this._month += delta;
            if (this._month > 12) { this._month = 1; this._year++; }
            if (this._month < 1) { this._month = 12; this._year--; }
            this._loadP4S();
        },

        /* ============================================================= */
        /*  RENDER — JOURNALIER                                           */
        /* ============================================================= */

        _renderJour: function () {
            var h = '';
            h += this._buildNavJour();
            h += this._buildSaveBarJour();
            h += '<div class="planning-table-wrapper">' + this._buildTableJour() + '</div>';
            h += this._buildLegendJour();
            $('#prev-panel-jour').html(h);
            this._bindEventsJour();
        },

        _buildNavJour: function () {
            var dn = D.JOURS_COURTS[D.getDayOfWeek(this._year, this._month, this._day)];
            var label = dn + ' ' + this._day + ' ' + D.MOIS[this._month - 1] + ' ' + this._year;
            var holidayName = D.getHolidayName(this._year, this._month, this._day);
            if (holidayName) label += ' \u2014 ' + holidayName;
            return '<div class="planning-nav">' +
                '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="prev-jour-prev">\u25C4</button>' +
                '<span class="planning-nav-title">' + label + '</span>' +
                '<button class="fr-btn fr-btn--secondary fr-btn--sm" id="prev-jour-next">\u25BA</button>' +
                '</div>';
        },

        _buildSaveBarJour: function () {
            return '<div class="planning-save-bar" id="prev-jour-save-bar">' +
                '<span class="planning-save-status" id="prev-jour-save-status">Aucune modification</span>' +
                '<button class="fr-btn fr-btn--sm" id="prev-jour-save-btn" disabled>Enregistrer</button>' +
                '</div>';
        },

        _setSaveStateJour: function (state) {
            var $bar = $('#prev-jour-save-bar');
            var $status = $('#prev-jour-save-status');
            var $btn = $('#prev-jour-save-btn');
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

        _buildTableJour: function () {
            var h = '<table class="planning-table" id="prev-jour-table">';
            h += '<thead><tr><th class="planning-col-agent">Agent</th>';
            for (var i = 0; i < HEURES.length; i++) {
                h += '<th>' + D.pad(HEURES[i]) + 'h</th>';
            }
            h += '</tr></thead>';

            var prevRole = null;
            h += '<tbody>';
            for (var p = 0; p < this._personnel.length; p++) {
                var agent = this._personnel[p];
                var agentRole = agent.role || 'experts';
                if (agentRole !== prevRole) {
                    var chevron = this._collapsedRolesJour[agentRole] ? '\u25BA' : '\u25BC';
                    h += '<tr class="planning-role-separator" data-role-key="' + agentRole + '">' +
                         '<td colspan="' + (HEURES.length + 1) + '">' +
                         '<span class="planning-role-toggle">' + chevron + '</span> ' +
                         (ROLE_LABELS[agentRole] || agentRole) + '</td></tr>';
                    prevRole = agentRole;
                }
                var agentData = this._dataJour[agent.id] || {};
                var rowStyle = this._collapsedRolesJour[agentRole] ? ' style="display:none"' : '';
                h += '<tr data-role-key="' + agentRole + '"' + rowStyle + '>' +
                     '<td class="planning-col-agent">' + (agent.grade ? agent.grade + ' ' : '') + agent.nom + '</td>';
                for (var j = 0; j < HEURES.length; j++) {
                    var hKey = D.pad(HEURES[j]);
                    var code = agentData[hKey] || '';
                    var cellCls = 'planning-cell editable';
                    var bg = '';
                    var fg = '';
                    for (var ci = 0; ci < CODES_JOUR.length; ci++) {
                        if (CODES_JOUR[ci].code === code) { bg = CODES_JOUR[ci].bg; fg = CODES_JOUR[ci].fg; break; }
                    }
                    var style = bg ? 'background-color:' + bg + ';color:' + fg + ';' : '';
                    h += '<td class="' + cellCls + '" data-agent="' + agent.id + '" data-hour="' + hKey + '"' +
                         (style ? ' style="' + style + '"' : '') + '>' + code + '</td>';
                }
                h += '</tr>';
            }
            h += '</tbody></table>';
            return h;
        },

        _buildLegendJour: function () {
            var h = '<div class="planning-legend">';
            for (var i = 0; i < CODES_JOUR.length; i++) {
                var m = CODES_JOUR[i];
                h += '<span class="planning-legend-item" style="background:' + m.bg + ';color:' + m.fg + ';">' +
                     m.code + ' \u2014 ' + m.label + '</span>';
            }
            h += '</div>';
            return h;
        },

        _bindEventsJour: function () {
            var self = this;

            $('#prev-jour-prev').on('click', function () { self._navigateJour(-1); });
            $('#prev-jour-next').on('click', function () { self._navigateJour(1); });
            $('#prev-jour-save-btn').on('click', function () { self._saveJour(); });

            /* Repli/deploi des groupes de roles */
            this._$el.on('click', '#prev-panel-jour .planning-role-separator', function () {
                var role = $(this).data('role-key');
                self._collapsedRolesJour[role] = !self._collapsedRolesJour[role];
                self._$el.find('#prev-panel-jour tr[data-role-key="' + role + '"]:not(.planning-role-separator)')
                    .toggle(!self._collapsedRolesJour[role]);
                $(this).find('.planning-role-toggle')
                    .text(self._collapsedRolesJour[role] ? '\u25BA' : '\u25BC');
            });

            /* Clic simple sur cellule */
            this._$el.on('click', '#prev-panel-jour .planning-cell.editable', function (e) {
                e.stopPropagation();
                var $cell = $(this);
                self._activeAgentId = '' + $cell.data('agent');
                self._activeKey = '' + $cell.data('hour');
                self._showDropdownJour($cell);
            });
        },

        _navigateJour: function (delta) {
            if (this._isDirtyJour) {
                if (!confirm('Des modifications non enregistrees seront perdues. Continuer ?')) return;
            }
            var date = new Date(this._year, this._month - 1, this._day + delta);
            this._year = date.getFullYear();
            this._month = date.getMonth() + 1;
            this._day = date.getDate();
            this._loadJour();
        },

        /* ============================================================= */
        /*  MULTI-SELECTION — helpers P4S                                 */
        /* ============================================================= */

        _agentIndex: function (agentId) {
            for (var i = 0; i < this._personnel.length; i++) {
                if (this._personnel[i].id === agentId) return i;
            }
            return -1;
        },

        _computeRangeP4S: function (a1, d1, a2, d2) {
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
            this._$el.find('#prev-panel-p4s .planning-cell-selected').removeClass('planning-cell-selected');
            for (var i = 0; i < this._selectedCells.length; i++) {
                var c = this._selectedCells[i];
                this._$el.find('#prev-panel-p4s .planning-cell[data-agent="' + c.agent + '"][data-day="' + c.day + '"]')
                    .addClass('planning-cell-selected');
            }
        },

        _clearSelection: function () {
            this._$el.find('#prev-panel-p4s .planning-cell-selected').removeClass('planning-cell-selected');
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
        /*  DROPDOWNS                                                     */
        /* ============================================================= */

        _createDropdowns: function () {
            var self = this;

            /* Dropdown P4S */
            if (!this._$dropdownP4S) {
                var h = '<div class="planning-dropdown" id="prev-p4s-dropdown">';
                h += '<div class="planning-dropdown-item" data-code="">' +
                     '<span class="planning-dropdown-code">\u2014</span>' +
                     '<span class="planning-dropdown-label">Effacer</span></div>';
                for (var i = 0; i < CODES_P4S.length; i++) {
                    var m = CODES_P4S[i];
                    h += '<div class="planning-dropdown-item" data-code="' + m.code + '">' +
                         '<span class="planning-dropdown-swatch" style="background:' + m.bg + ';"></span>' +
                         '<span class="planning-dropdown-code">' + m.code + '</span>' +
                         '<span class="planning-dropdown-label">' + m.label + '</span>' +
                         '</div>';
                }
                h += '</div>';
                this._$dropdownP4S = $(h);
                $('body').append(this._$dropdownP4S);

                this._$dropdownP4S.on('click', function (e) { e.stopPropagation(); });
                this._$dropdownP4S.on('click', '.planning-dropdown-item', function () {
                    self._selectP4S('' + $(this).data('code'));
                });
                $(document).on('click.prevP4sDropdown', function () {
                    if (self._ignoreNextClick) { self._ignoreNextClick = false; return; }
                    if (self._$dropdownP4S) self._$dropdownP4S.hide();
                    self._clearSelection();
                });
            }

            /* Dropdown Journalier */
            if (!this._$dropdownJour) {
                var hj = '<div class="planning-dropdown" id="prev-jour-dropdown">';
                hj += '<div class="planning-dropdown-item" data-code="">' +
                      '<span class="planning-dropdown-code">\u2014</span>' +
                      '<span class="planning-dropdown-label">Effacer</span></div>';
                for (var j = 0; j < CODES_JOUR.length; j++) {
                    var mj = CODES_JOUR[j];
                    hj += '<div class="planning-dropdown-item" data-code="' + mj.code + '">' +
                          '<span class="planning-dropdown-swatch" style="background:' + mj.bg + ';"></span>' +
                          '<span class="planning-dropdown-code">' + mj.code + '</span>' +
                          '<span class="planning-dropdown-label">' + mj.label + '</span>' +
                          '</div>';
                }
                hj += '</div>';
                this._$dropdownJour = $(hj);
                $('body').append(this._$dropdownJour);

                this._$dropdownJour.on('click', function (e) { e.stopPropagation(); });
                this._$dropdownJour.on('click', '.planning-dropdown-item', function () {
                    self._selectJour('' + $(this).data('code'));
                });
                $(document).on('click.prevJourDropdown', function () {
                    if (self._$dropdownJour) self._$dropdownJour.hide();
                });
            }
        },

        _showDropdownP4S: function ($cell) {
            var rect = $cell[0].getBoundingClientRect();
            var top = rect.bottom + 2;
            var left = rect.left;
            if (top + 200 > window.innerHeight) top = rect.top - 200;
            if (left + 200 > window.innerWidth) left = window.innerWidth - 210;
            this._$dropdownP4S.css({ top: top, left: left }).show();
        },

        _showDropdownJour: function ($cell) {
            var rect = $cell[0].getBoundingClientRect();
            var top = rect.bottom + 2;
            var left = rect.left;
            if (top + 100 > window.innerHeight) top = rect.top - 100;
            if (left + 200 > window.innerWidth) left = window.innerWidth - 210;
            this._$dropdownJour.css({ top: top, left: left }).show();
        },

        /* ============================================================= */
        /*  SELECTION DE MISSION                                          */
        /* ============================================================= */

        _selectP4S: function (code) {
            var cells = this._selectedCells.length > 0
                ? this._selectedCells
                : (this._activeAgentId && this._activeKey !== null
                    ? [{ agent: this._activeAgentId, day: this._activeKey }]
                    : []);

            if (cells.length === 0) return;

            var bg = '';
            var fg = '';
            for (var i = 0; i < CODES_P4S.length; i++) {
                if (CODES_P4S[i].code === code) { bg = CODES_P4S[i].bg; fg = CODES_P4S[i].fg; break; }
            }

            for (var c = 0; c < cells.length; c++) {
                var agentId = cells[c].agent;
                var day = cells[c].day;
                if (!this._dataP4S[agentId]) this._dataP4S[agentId] = {};
                if (code) {
                    this._dataP4S[agentId][day] = code;
                } else {
                    delete this._dataP4S[agentId][day];
                }
                var $cell = this._$el.find('#prev-panel-p4s .planning-cell[data-agent="' + agentId + '"][data-day="' + day + '"]');
                $cell.text(code).css({ 'background-color': bg, 'color': fg }).removeClass('planning-cell-selected');
            }

            this._selectedCells = [];
            this._hideSelectionBadge();
            this._isDirtyP4S = true;
            this._setSaveStateP4S('dirty');
            if (this._$dropdownP4S) this._$dropdownP4S.hide();
        },

        _selectJour: function (code) {
            if (!this._activeAgentId || this._activeKey === null) return;
            var agentId = this._activeAgentId;
            var hour = this._activeKey;

            if (!this._dataJour[agentId]) this._dataJour[agentId] = {};
            if (code) {
                this._dataJour[agentId][hour] = code;
            } else {
                delete this._dataJour[agentId][hour];
            }

            var $cell = this._$el.find('#prev-panel-jour .planning-cell[data-agent="' + agentId + '"][data-hour="' + hour + '"]');
            var bg = '';
            var fg = '';
            for (var i = 0; i < CODES_JOUR.length; i++) {
                if (CODES_JOUR[i].code === code) { bg = CODES_JOUR[i].bg; fg = CODES_JOUR[i].fg; break; }
            }
            $cell.text(code).css({ 'background-color': bg, 'color': fg });

            this._isDirtyJour = true;
            this._setSaveStateJour('dirty');
            if (this._$dropdownJour) this._$dropdownJour.hide();
        }
    };

}());
