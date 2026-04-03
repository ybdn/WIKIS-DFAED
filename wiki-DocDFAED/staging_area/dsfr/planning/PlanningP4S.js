/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningP4S.js]] */
/**
 * Vue P4S — Planning Mensuel
 * Grille : agents (ordonnees) x jours du mois (abscisses)
 */
(function () {

    var D = null; // ref to PlanningData (set in init)

    window.PlanningP4S = {

        _$el: null,
        _isGestion: false,
        _year: 0,
        _month: 0,
        _personnel: [],
        _data: {},
        _isDirty: false,
        _missions: [],
        _$dropdown: null,
        _activeAgentId: null,
        _activeDay: null,

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
            this.loadAndRender();
        },

        /* ============================================================= */
        /*  DATA                                                          */
        /* ============================================================= */

        loadAndRender: function () {
            var self = this;
            D.loadP4S(self._year, self._month, function (err, data) {
                self._data = data || {};
                self._isDirty = false;
                self._render();
            });
        },

        save: function () {
            var self = this;
            self._setSaveState('saving');
            D.saveP4S(self._year, self._month, self._data, function (err) {
                if (err) {
                    alert('Erreur de sauvegarde : ' + err);
                    self._setSaveState('dirty');
                } else {
                    self._isDirty = false;
                    self._setSaveState('saved');
                    setTimeout(function () {
                        if (!self._isDirty) self._setSaveState('clean');
                    }, 2500);
                }
            });
        },

        _getMission: function (code) {
            for (var i = 0; i < this._missions.length; i++) {
                if (this._missions[i].code === code) return this._missions[i];
            }
            return this._missions[0] || { code: '', label: '', bg: '#fff', fg: '#3a3a3a' };
        },

        /* ============================================================= */
        /*  RENDER                                                        */
        /* ============================================================= */

        _render: function () {
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
            h += '<tbody>';
            for (var p = 0; p < this._personnel.length; p++) {
                var agent = this._personnel[p];
                var agentData = this._data[agent.id] || {};
                h += '<tr><td class="planning-col-agent">' + agent.nom + '</td>';
                for (var d2 = 1; d2 <= days; d2++) {
                    var code = agentData['' + d2] || '';
                    var mission = this._getMission(code);
                    var cellCls = 'planning-cell';
                    if (D.isWeekend(y, m, d2)) cellCls += ' planning-col-weekend';
                    if (D.isHoliday(y, m, d2)) cellCls += ' planning-col-holiday';
                    if (this._isGestion) cellCls += ' editable';
                    var bg = code ? mission.bg : '';
                    var fg = code ? mission.fg : '';
                    var style = bg ? 'background-color:' + bg + ';color:' + fg + ';' : '';
                    h += '<td class="' + cellCls + '" data-agent="' + agent.id + '" data-day="' + d2 + '"' +
                         (style ? ' style="' + style + '"' : '') + '>' +
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
            h += '<table class="planning-counters-table"><thead><tr><th>Agent</th>';
            for (var c = 0; c < activeCodes.length; c++) {
                h += '<th style="background:' + activeCodes[c].bg + ';color:' + activeCodes[c].fg + ';">' + activeCodes[c].code + '</th>';
            }
            h += '<th>Total</th></tr></thead><tbody>';

            var days = D.getDaysInMonth(this._year, this._month);
            for (var p = 0; p < this._personnel.length; p++) {
                var agent = this._personnel[p];
                var agentData = this._data[agent.id] || {};
                var total = 0;
                h += '<tr><td>' + agent.nom + '</td>';
                for (var c2 = 0; c2 < activeCodes.length; c2++) {
                    var count = 0;
                    for (var d = 1; d <= days; d++) {
                        if ((agentData['' + d] || '') === activeCodes[c2].code) count++;
                    }
                    total += count;
                    h += '<td>' + count + '</td>';
                }
                h += '<td><strong>' + total + '</strong></td></tr>';
            }
            h += '</tbody></table></details>';
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
            $('#planning-p4s-print').on('click', function () { window.print(); });

            if (this._isGestion) {
                this._$el.on('click', '.planning-cell.editable', function (e) {
                    e.stopPropagation();
                    var $cell = $(this);
                    self._activeAgentId = $cell.data('agent');
                    self._activeDay = '' + $cell.data('day');
                    self._showDropdown($cell);
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
            this._$dropdown.on('click', '.planning-dropdown-item', function () {
                var code = $(this).data('code');
                self._selectMission(code);
            });
            $(document).on('click.p4sDropdown', function () {
                if (self._$dropdown) self._$dropdown.hide();
            });
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
            var agentId = this._activeAgentId;
            var day = this._activeDay;
            if (!agentId || !day) return;

            if (!this._data[agentId]) this._data[agentId] = {};
            this._data[agentId][day] = code;
            this._isDirty = true;

            /* Update cell in DOM */
            var mission = this._getMission(code);
            var $cell = this._$el.find('.planning-cell[data-agent="' + agentId + '"][data-day="' + day + '"]');
            $cell.text(code).css({
                'background-color': code ? mission.bg : '',
                'color': code ? mission.fg : ''
            });

            this._$dropdown.hide();
            this._setSaveState('dirty');
        }
    };

}());
