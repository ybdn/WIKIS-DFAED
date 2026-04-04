/* SOURCE FILE FOR: [[MediaWiki:Dsfr/oce/OceStats.js]] */
/**
 * Statistiques OCE — tableau agents x mois.
 * Toggle entre volume OCE et volume cliches.
 * Comptage base sur dateArriveeOrdonnance (mois d'attribution).
 * Inclut OCE actives + archivees de l'annee selectionnee.
 * Uniquement visible en mode Gestion.
 */
(function () {

    var MOIS = [
        'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun',
        'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    window.OceStats = {

        _$el: null,
        _data: null,
        _personnel: [],
        _year: new Date().getFullYear(),
        _mode: 'oce', // 'oce' ou 'cliches'

        /* ============================================================= */
        /*  INIT                                                          */
        /* ============================================================= */

        init: function ($container, data, personnel) {
            this._$el = $container;
            this._data = data;
            this._personnel = personnel;
            this._year = new Date().getFullYear();
            this._mode = 'oce';
            this._render();
        },

        refresh: function (data, personnel) {
            if (data) this._data = data;
            if (personnel) this._personnel = personnel;
            this._render();
        },

        /* ============================================================= */
        /*  RENDER                                                        */
        /* ============================================================= */

        _render: function () {
            var self = this;
            var isClichesMode = (this._mode === 'cliches');

            /* Merge active + archived OCE */
            var allOce = (this._data.oce || []).concat(this._data.archive || []);

            /* Build active personnel list */
            var activePersonnel = [];
            for (var p = 0; p < this._personnel.length; p++) {
                if (this._personnel[p].actif !== false) {
                    activePersonnel.push(this._personnel[p]);
                }
            }

            /* Compute stats: agentId -> [12 months] */
            var stats = {};
            for (var a = 0; a < activePersonnel.length; a++) {
                stats[activePersonnel[a].id] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }

            /* Totaux globaux (inclut tous les agents, meme partis) */
            var monthTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            for (var i = 0; i < allOce.length; i++) {
                var oce = allOce[i];
                var dateRef = oce.dateArriveeOrdonnance || oce.dateReception || '';
                if (!dateRef) continue;
                var parts = dateRef.split('-');
                var y = parseInt(parts[0], 10);
                var m = parseInt(parts[1], 10) - 1; // 0-indexed
                if (y !== this._year) continue;
                if (!oce.agent) continue;

                var val = isClichesMode ? (parseInt(oce.nbCliches, 10) || 0) : 1;

                /* Toujours compter dans les totaux */
                monthTotals[m] += val;

                /* Compter par agent (actifs seulement dans les lignes) */
                if (!stats[oce.agent]) {
                    stats[oce.agent] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
                stats[oce.agent][m] += val;
            }

            /* Header + toggle */
            var h = '<div class="oce-stats-header">';
            h += '<h4>Statistiques OCE</h4>';
            h += '<div class="oce-stats-controls">';
            h += '<div class="oce-stats-toggle">';
            h += '<button class="oce-stats-toggle-btn' + (!isClichesMode ? ' active' : '') + '" data-mode="oce">OCE</button>';
            h += '<button class="oce-stats-toggle-btn' + (isClichesMode ? ' active' : '') + '" data-mode="cliches">Cliches</button>';
            h += '</div>';
            h += '<div class="oce-stats-nav">';
            h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary" id="oce-stats-prev">\u25C0</button>';
            h += '<span class="oce-stats-year" id="oce-stats-year">' + this._year + '</span>';
            h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary" id="oce-stats-next">\u25B6</button>';
            h += '</div>';
            h += '</div>';
            h += '</div>';

            /* Table */
            h += '<div class="oce-stats-table-wrapper">';
            h += '<table class="oce-stats-table">';
            h += '<thead><tr>';
            h += '<th class="oce-stats-agent-col">Agent</th>';
            for (var m2 = 0; m2 < 12; m2++) {
                h += '<th>' + MOIS[m2] + '</th>';
            }
            h += '<th class="oce-stats-total-col">Total</th>';
            h += '</tr></thead>';
            h += '<tbody>';

            for (var b = 0; b < activePersonnel.length; b++) {
                var agent = activePersonnel[b];
                var row = stats[agent.id] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var total = 0;

                h += '<tr>';
                h += '<td class="oce-stats-agent-col">' + this._esc(agent.nom) + '</td>';
                for (var m3 = 0; m3 < 12; m3++) {
                    var v = row[m3];
                    total += v;
                    h += '<td class="' + (v > 0 ? 'oce-stats-has-value' : '') + '">' + (v > 0 ? v : '') + '</td>';
                }
                h += '<td class="oce-stats-total-col">' + (total > 0 ? '<strong>' + total + '</strong>' : '') + '</td>';
                h += '</tr>';
            }

            /* Totals row */
            var grandTotal = 0;
            h += '<tr class="oce-stats-totals-row">';
            h += '<td class="oce-stats-agent-col"><strong>TOTAL</strong></td>';
            for (var m4 = 0; m4 < 12; m4++) {
                grandTotal += monthTotals[m4];
                h += '<td><strong>' + (monthTotals[m4] > 0 ? monthTotals[m4] : '') + '</strong></td>';
            }
            h += '<td class="oce-stats-total-col"><strong>' + grandTotal + '</strong></td>';
            h += '</tr>';

            h += '</tbody></table>';
            h += '</div>';

            var modeLabel = isClichesMode ? 'nombre de cliches' : 'nombre d\'OCE';
            h += '<p class="oce-stats-footnote">Comptage base sur la date d\'arrivee de l\'ordonnance (' + modeLabel + ').</p>';

            this._$el.html(h);
            this._bindEvents();
        },

        /* ============================================================= */
        /*  EVENTS                                                        */
        /* ============================================================= */

        _bindEvents: function () {
            var self = this;

            $('#oce-stats-prev').on('click', function () {
                self._year--;
                self._render();
            });

            $('#oce-stats-next').on('click', function () {
                self._year++;
                self._render();
            });

            this._$el.on('click', '.oce-stats-toggle-btn', function () {
                var mode = $(this).attr('data-mode');
                if (mode !== self._mode) {
                    self._mode = mode;
                    self._render();
                }
            });
        },

        /* ============================================================= */
        /*  UTILS                                                         */
        /* ============================================================= */

        _esc: function (s) {
            if (!s) return '';
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    };

}());
