/* SOURCE FILE FOR: [[MediaWiki:Dsfr/oce/OceTable.js]] */
/**
 * Tableau de suivi OCE — vue groupee par agent.
 * Utilise en mode Consultation (lecture seule) et Gestion (avec actions).
 */
(function () {

    window.OceTable = {

        _$el: null,
        _data: null,
        _personnel: [],
        _canEdit: false,
        _isDirty: false,
        _filters: { statut: 'all', priorite: 'all', echeance: 'all', search: '', showCloture: false, showArchive: false },
        _onDirtyChange: null,

        /* ============================================================= */
        /*  INIT                                                          */
        /* ============================================================= */

        init: function ($container, data, personnel, canEdit, onDirtyChange) {
            this._$el = $container;
            this._data = data;
            this._personnel = personnel;
            this._canEdit = canEdit;
            this._isDirty = false;
            this._onDirtyChange = onDirtyChange || function () {};
            this._render();
        },

        refresh: function (data, personnel) {
            if (data) this._data = data;
            if (personnel) this._personnel = personnel;
            this._render();
        },

        getData: function () {
            return this._data;
        },

        isDirty: function () {
            return this._isDirty;
        },

        /* ============================================================= */
        /*  RENDER                                                        */
        /* ============================================================= */

        _render: function () {
            var C = window.OceConfig;
            var D = window.OceData;

            /* --- Filter OCE --- */
            var visibleOce = this._getFilteredOce();

            /* --- Group by agent --- */
            var grouped = D.groupByAgent(visibleOce, this._personnel);
            var groups = grouped.groups;
            var order = grouped.order;
            var agentMap = grouped.agentMap;

            /* --- Counters --- */
            var allOce = this._data.oce || [];
            var counts = { total: allOce.length, en_attente: 0, en_cours: 0, termine: 0, cloture: 0 };
            var echCounts = { retard: 0, proche: 0, ok: 0 };
            for (var c = 0; c < allOce.length; c++) {
                var st = allOce[c].statut || 'en_attente';
                if (counts[st] !== undefined) counts[st]++;
                /* Compteurs echeance (seulement OCE non cloturees) */
                if (st !== 'cloture') {
                    var jr = C.joursRestants(allOce[c].dateEcheance);
                    if (jr !== null) {
                        if (jr < 0) echCounts.retard++;
                        else if (jr <= 30) echCounts.proche++;
                        else echCounts.ok++;
                    }
                }
            }

            var h = '';

            /* --- Save bar (gestion only) --- */
            if (this._canEdit) {
                var dirtyClass = this._isDirty ? ' dirty' : '';
                var dirtyText = this._isDirty ? 'Modifications non enregistrees' : 'Aucune modification';
                var dirtyDisabled = this._isDirty ? '' : ' disabled';
                h += '<div class="oce-save-bar' + dirtyClass + '" id="oce-save-bar">';
                h += '<span class="oce-save-status" id="oce-save-status">' + dirtyText + '</span>';
                h += '<button class="fr-btn fr-btn--sm" id="oce-save-btn"' + dirtyDisabled + '>Enregistrer</button>';
                h += '</div>';
            }

            /* --- Dashboard counters --- */
            h += '<div class="oce-dashboard">';

            /* Card: Statuts */
            h += '<div class="oce-dash-card">';
            h += '<div class="oce-dash-card-header">';
            h += '<span class="oce-dash-card-title">Statuts</span>';
            h += '<span class="oce-dash-total">' + counts.total + '</span>';
            h += '</div>';
            h += '<div class="oce-dash-card-body">';
            for (var s = 0; s < C.statuts.length; s++) {
                var st2 = C.statuts[s];
                var cnt = counts[st2.code] || 0;
                var isActive = this._filters.statut === st2.code;
                h += '<button class="oce-dash-chip' + (isActive ? ' active' : '') + '" data-filter-statut="' + st2.code + '" style="border-left:3px solid ' + st2.bg + ';">';
                h += '<span class="oce-dash-chip-count">' + cnt + '</span>';
                h += '<span class="oce-dash-chip-label">' + st2.label + '</span>';
                h += '</button>';
            }
            h += '</div></div>';

            /* Card: Echeances */
            h += '<div class="oce-dash-card oce-dash-card--echeance">';
            h += '<div class="oce-dash-card-header">';
            h += '<span class="oce-dash-card-title">Echeances</span>';
            h += '</div>';
            h += '<div class="oce-dash-card-body">';
            var echItems = [
                { key: 'retard',  count: echCounts.retard,  label: 'En retard',       cls: 'oce-dash-ech--retard' },
                { key: 'proche',  count: echCounts.proche,  label: '\u226430 jours',   cls: 'oce-dash-ech--proche' },
                { key: 'ok',      count: echCounts.ok,      label: 'Dans les delais',  cls: 'oce-dash-ech--ok' }
            ];
            for (var e = 0; e < echItems.length; e++) {
                var ei = echItems[e];
                var eActive = this._filters.echeance === ei.key;
                h += '<button class="oce-dash-ech ' + ei.cls + (eActive ? ' active' : '') + '" data-filter-echeance="' + ei.key + '">';
                h += '<span class="oce-dash-ech-count">' + ei.count + '</span>';
                h += '<span class="oce-dash-ech-label">' + ei.label + '</span>';
                h += '</button>';
            }
            h += '</div></div>';

            h += '</div>';

            /* --- Filters (search, priorite, checkboxes only — statut/echeance via dashboard chips) --- */
            h += '<div class="oce-filters">';
            h += '<input class="fr-input fr-input--sm" type="text" id="oce-search" placeholder="Rechercher..." value="' + this._escAttr(this._filters.search) + '" style="max-width:220px;">';
            h += '<select class="fr-select fr-select--sm" id="oce-filter-priorite" style="max-width:160px;">';
            h += '<option value="all"' + (this._filters.priorite === 'all' ? ' selected' : '') + '>Toutes priorites</option>';
            h += '<option value="normale"' + (this._filters.priorite === 'normale' ? ' selected' : '') + '>Normale</option>';
            h += '<option value="urgente"' + (this._filters.priorite === 'urgente' ? ' selected' : '') + '>Urgente</option>';
            h += '</select>';
            h += '<label class="oce-checkbox-label"><input type="checkbox" id="oce-show-cloture"' + (this._filters.showCloture ? ' checked' : '') + '> Afficher cloturees</label>';
            if (this._canEdit) {
                h += '<label class="oce-checkbox-label"><input type="checkbox" id="oce-show-archive"' + (this._filters.showArchive ? ' checked' : '') + '> Afficher archivees</label>';
            }
            h += '</div>';

            /* --- Add button (gestion) --- */
            if (this._canEdit) {
                h += '<div style="margin-bottom:1rem;">';
                h += '<button class="fr-btn fr-btn--sm fr-btn--secondary" id="oce-add-btn">+ Nouvelle OCE</button>';
                h += '</div>';
            }

            /* --- Grouped tables --- */
            var hasAny = false;
            for (var o = 0; o < order.length; o++) {
                var agentId = order[o];
                var oceList = groups[agentId] || [];
                if (oceList.length === 0) continue;
                hasAny = true;

                var agent = agentMap[agentId];
                var agentLabel = agent ? (agent.nom + ' (' + (agent.grade || '') + ')') : agentId;

                h += '<details class="oce-group" open>';
                h += '<summary class="oce-group-summary">' + this._esc(agentLabel) + ' \u2014 ' + oceList.length + ' OCE</summary>';
                h += '<div class="oce-table-wrapper">';
                h += '<table class="oce-table">';
                h += '<thead><tr>';
                h += '<th>N\u00B0 OCE</th><th>Delivre par</th><th>Objet</th><th>Reception</th><th>Echeance</th><th>Statut</th><th>Priorite</th>';
                if (this._canEdit) {
                    h += '<th style="min-width:120px;">Actions</th>';
                }
                h += '</tr></thead>';
                h += '<tbody>';

                for (var j = 0; j < oceList.length; j++) {
                    var oce = oceList[j];
                    var echClass = C.echeanceClass(oce.dateEcheance);
                    var statutObj = C.getStatut(oce.statut);
                    var joursR = C.joursRestants(oce.dateEcheance);
                    var echTitle = '';
                    if (joursR !== null) {
                        if (joursR < 0) echTitle = 'Depassee de ' + Math.abs(joursR) + ' jour(s)';
                        else if (joursR === 0) echTitle = 'Echeance aujourd\'hui';
                        else echTitle = joursR + ' jour(s) restant(s)';
                    }
                    var isArchived = !!oce._archived;

                    h += '<tr class="oce-row' + (isArchived ? ' oce-row-archived' : '') + '" data-numero="' + this._escAttr(oce.numero) + '">';
                    h += '<td class="oce-col-numero"><strong>' + this._esc(oce.numero) + '</strong></td>';
                    h += '<td>' + this._esc(oce.delivrePar || '') + '</td>';
                    h += '<td class="oce-col-objet">' + this._esc(oce.objet || '') + '</td>';
                    h += '<td>' + C.formatDate(oce.dateReception) + '</td>';
                    h += '<td class="' + echClass + '" title="' + echTitle + '">' + C.formatDate(oce.dateEcheance) + '</td>';
                    h += '<td><span class="fr-badge ' + statutObj.badge + ' fr-badge--sm">' + statutObj.label + '</span></td>';
                    h += '<td>' + (oce.priorite === 'urgente' ? '<span class="fr-badge fr-badge--error fr-badge--sm fr-badge--no-icon">Urgente</span>' : 'Normale') + '</td>';

                    if (this._canEdit) {
                        h += '<td class="oce-col-actions">';
                        if (!isArchived) {
                            h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary oce-edit-btn" title="Modifier">\u270F\uFE0F</button> ';
                            h += '<select class="fr-select fr-select--sm oce-statut-select" style="max-width:110px;">';
                            for (var ss = 0; ss < C.statuts.length; ss++) {
                                h += '<option value="' + C.statuts[ss].code + '"' + (oce.statut === C.statuts[ss].code ? ' selected' : '') + '>' + C.statuts[ss].label + '</option>';
                            }
                            h += '</select>';
                            if (oce.statut === 'cloture') {
                                h += ' <button class="fr-btn fr-btn--sm fr-btn--tertiary oce-archive-btn" title="Archiver">\uD83D\uDCE6</button>';
                            }
                        } else {
                            h += '<span style="color:#929292;font-style:italic;">Archivee</span>';
                        }
                        /* Historique toggle (gestion only) */
                        if (!isArchived && oce.historique && oce.historique.length > 0) {
                            h += ' <button class="fr-btn fr-btn--sm fr-btn--tertiary oce-histo-btn" title="Historique">\uD83D\uDCCB</button>';
                        }
                        h += '</td>';
                    }
                    h += '</tr>';

                    /* Historique row (hidden by default) */
                    if (this._canEdit && oce.historique && oce.historique.length > 0) {
                        var colSpan = this._canEdit ? 8 : 7;
                        h += '<tr class="oce-histo-row" data-histo-for="' + this._escAttr(oce.numero) + '" style="display:none;">';
                        h += '<td colspan="' + colSpan + '" class="oce-histo-cell">';
                        h += '<div class="oce-histo-content">';
                        h += '<strong>Historique :</strong><br>';
                        for (var hh = oce.historique.length - 1; hh >= 0; hh--) {
                            var entry = oce.historique[hh];
                            var dateStr = entry.date ? entry.date.substring(0, 16).replace('T', ' ') : '';
                            h += '<span class="oce-histo-entry">' + dateStr + ' \u2014 <strong>' + this._esc(entry.user) + '</strong> : ' + this._esc(entry.action);
                            if (entry.de && entry.vers) {
                                h += ' (' + this._esc(entry.de) + ' \u2192 ' + this._esc(entry.vers) + ')';
                            }
                            h += '</span><br>';
                        }
                        h += '</div></td></tr>';
                    }
                }

                h += '</tbody></table>';
                h += '</div></details>';
            }

            if (!hasAny) {
                h += '<div class="oce-empty">Aucune OCE a afficher.</div>';
            }

            this._$el.html(h);
            this._bindEvents();
        },

        /* ============================================================= */
        /*  FILTER                                                        */
        /* ============================================================= */

        _getFilteredOce: function () {
            var result = [];
            var oce = this._data.oce || [];
            var archive = this._data.archive || [];

            for (var i = 0; i < oce.length; i++) {
                if (!this._filters.showCloture && oce[i].statut === 'cloture') continue;
                if (this._matchesFilters(oce[i])) result.push(oce[i]);
            }

            if (this._filters.showArchive) {
                for (var j = 0; j < archive.length; j++) {
                    var a = {};
                    for (var k in archive[j]) {
                        if (archive[j].hasOwnProperty(k)) a[k] = archive[j][k];
                    }
                    a._archived = true;
                    if (this._matchesFilters(a)) result.push(a);
                }
            }

            return result;
        },

        _matchesFilters: function (oce) {
            if (this._filters.statut !== 'all' && oce.statut !== this._filters.statut) return false;
            if (this._filters.priorite !== 'all' && oce.priorite !== this._filters.priorite) return false;

            /* Filtre echeance */
            if (this._filters.echeance !== 'all') {
                var C = window.OceConfig;
                var jours = C.joursRestants(oce.dateEcheance);
                var f = this._filters.echeance;
                if (f === 'retard' && (jours === null || jours >= 0)) return false;
                if (f === 'proche' && (jours === null || jours < 0 || jours > 30)) return false;
                if (f === 'retard_proche' && (jours === null || jours > 30)) return false;
                if (f === 'ok' && (jours === null || jours <= 30)) return false;
            }

            if (this._filters.search) {
                var q = this._filters.search.toLowerCase();
                var haystack = (oce.numero + ' ' + (oce.objet || '') + ' ' + (oce.delivrePar || '') + ' ' + (oce.agent || '') + ' ' + (oce.commentaire || '')).toLowerCase();
                if (haystack.indexOf(q) === -1) return false;
            }

            return true;
        },

        /* ============================================================= */
        /*  EVENTS                                                        */
        /* ============================================================= */

        _bindEvents: function () {
            var self = this;

            /* Unbind previous delegated events to avoid stacking */
            this._$el.off('click.oce change.oce');

            /* Save */
            $('#oce-save-btn').on('click', function () { self._save(); });

            /* Dashboard chip: statut toggle */
            this._$el.on('click.oce', '.oce-dash-chip[data-filter-statut]', function () {
                var val = $(this).attr('data-filter-statut');
                self._filters.statut = (self._filters.statut === val) ? 'all' : val;
                self._render();
            });

            /* Dashboard chip: echeance toggle */
            this._$el.on('click.oce', '.oce-dash-ech[data-filter-echeance]', function () {
                var val = $(this).attr('data-filter-echeance');
                self._filters.echeance = (self._filters.echeance === val) ? 'all' : val;
                self._render();
            });

            /* Filters */
            $('#oce-search').on('input', function () {
                self._filters.search = $(this).val();
                self._render();
            });
            $('#oce-filter-priorite').on('change', function () {
                self._filters.priorite = $(this).val();
                self._render();
            });
            $('#oce-show-cloture').on('change', function () {
                self._filters.showCloture = $(this).prop('checked');
                self._render();
            });
            $('#oce-show-archive').on('change', function () {
                self._filters.showArchive = $(this).prop('checked');
                self._render();
            });

            /* Add */
            $('#oce-add-btn').on('click', function () {
                window.OceForm.open(null, self._personnel, function (newOce) {
                    window.OceData.addHistorique(newOce, 'Creation');
                    self._data.oce.push(newOce);
                    self._markDirty();
                    self._render();
                });
            });

            /* Edit */
            this._$el.on('click.oce', '.oce-edit-btn', function () {
                var numero = $(this).closest('tr').data('numero');
                var idx = window.OceData.findByNumero(self._data.oce, numero);
                if (idx < 0) return;
                var oce = self._data.oce[idx];
                window.OceForm.open(oce, self._personnel, function (updated) {
                    window.OceData.addHistorique(updated, 'Modification');
                    self._data.oce[idx] = updated;
                    self._markDirty();
                    self._render();
                });
            });

            /* Statut change */
            this._$el.on('change.oce', '.oce-statut-select', function () {
                var numero = $(this).closest('tr').data('numero');
                var newStatut = $(this).val();
                var idx = window.OceData.findByNumero(self._data.oce, numero);
                if (idx < 0) return;
                var oce = self._data.oce[idx];
                var oldStatut = oce.statut;
                if (newStatut !== oldStatut) {
                    window.OceData.addHistorique(oce, 'Statut', oldStatut, newStatut);
                    oce.statut = newStatut;
                    self._markDirty();
                    self._render();
                }
            });

            /* Archive */
            this._$el.on('click.oce', '.oce-archive-btn', function () {
                var numero = $(this).closest('tr').data('numero');
                var idx = window.OceData.findByNumero(self._data.oce, numero);
                if (idx < 0) return;
                if (!confirm('Archiver l\'OCE ' + numero + ' ?\n\nElle sera retiree de la liste active.')) return;
                var oce = self._data.oce.splice(idx, 1)[0];
                window.OceData.addHistorique(oce, 'Archivage');
                self._data.archive.push(oce);
                self._markDirty();
                self._render();
            });

            /* Historique toggle */
            this._$el.on('click.oce', '.oce-histo-btn', function () {
                var numero = $(this).closest('tr').data('numero');
                var $row = self._$el.find('tr[data-histo-for="' + numero + '"]');
                $row.toggle();
            });
        },

        /* ============================================================= */
        /*  SAVE                                                          */
        /* ============================================================= */

        _markDirty: function () {
            this._isDirty = true;
            $('#oce-save-bar').addClass('dirty');
            $('#oce-save-status').text('Modifications non enregistrees');
            $('#oce-save-btn').prop('disabled', false);
            this._onDirtyChange(true);
        },

        _save: function () {
            var self = this;
            $('#oce-save-status').text('Enregistrement en cours...');
            $('#oce-save-btn').prop('disabled', true);

            window.OceData.save(this._data, function (err) {
                if (err) {
                    alert('Erreur : ' + err);
                    self._markDirty();
                } else {
                    self._isDirty = false;
                    $('#oce-save-bar').removeClass('dirty').addClass('saved');
                    $('#oce-save-status').text('Enregistre avec succes');
                    self._onDirtyChange(false);
                    setTimeout(function () {
                        if (!self._isDirty) {
                            $('#oce-save-bar').removeClass('saved');
                            $('#oce-save-status').text('Aucune modification');
                        }
                    }, 2500);
                }
            });
        },

        /* ============================================================= */
        /*  UTILS                                                         */
        /* ============================================================= */

        _esc: function (s) {
            if (!s) return '';
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        _escAttr: function (s) {
            if (!s) return '';
            return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    };

}());
