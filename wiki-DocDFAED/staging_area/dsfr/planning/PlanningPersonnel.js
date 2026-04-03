/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningPersonnel.js]] */
/**
 * Gestion du personnel — UI CRUD
 * Uniquement affiche en mode Gestion (bureaucrates).
 * Les donnees sont stockees dans Planning:Data/Personnel.
 */
(function () {

    window.PlanningPersonnel = {

        _$el: null,
        _personnel: [],
        _isDirty: false,
        _onChangeCallback: null,

        /* ============================================================= */
        /*  INIT                                                          */
        /* ============================================================= */

        init: function ($container, personnel, onChangeCallback) {
            this._$el = $container;
            this._personnel = personnel ? personnel.slice() : [];
            this._isDirty = false;
            this._onChangeCallback = onChangeCallback || function () {};
            this._render();
        },

        getPersonnel: function () {
            return this._personnel;
        },

        /* ============================================================= */
        /*  RENDER                                                        */
        /* ============================================================= */

        _render: function () {
            var h = '<div class="planning-personnel">';
            h += '<h3>Gestion du personnel</h3>';

            /* Save bar */
            h += '<div class="planning-save-bar" id="perso-save-bar">';
            h += '<span class="planning-save-status" id="perso-save-status">Aucune modification</span>';
            h += '<button class="fr-btn fr-btn--sm" id="perso-save-btn" disabled>Enregistrer</button>';
            h += '</div>';

            /* Table */
            h += '<table class="planning-personnel-table">';
            h += '<thead><tr><th>ID</th><th>Nom</th><th>Grade</th><th>Actions</th></tr></thead>';
            h += '<tbody>';
            for (var i = 0; i < this._personnel.length; i++) {
                var p = this._personnel[i];
                h += '<tr data-index="' + i + '">';
                h += '<td>' + p.id + '</td>';
                h += '<td>' + p.nom + '</td>';
                h += '<td>' + (p.grade || '') + '</td>';
                h += '<td>';
                h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-up" title="Monter"' + (i === 0 ? ' disabled' : '') + '>\u25B2</button> ';
                h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-down" title="Descendre"' + (i === this._personnel.length - 1 ? ' disabled' : '') + '>\u25BC</button> ';
                h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-del" title="Supprimer">\u2716</button>';
                h += '</td></tr>';
            }
            h += '</tbody></table>';

            /* Add form */
            h += '<div class="planning-personnel-add">';
            h += '<input class="fr-input" type="text" id="perso-add-id" placeholder="Identifiant (ex: dupont)" style="max-width:150px;">';
            h += '<input class="fr-input" type="text" id="perso-add-nom" placeholder="Nom complet (ex: DUPONT Jean)" style="max-width:200px;">';
            h += '<input class="fr-input" type="text" id="perso-add-grade" placeholder="Grade (ex: MDC)" style="max-width:100px;">';
            h += '<button class="fr-btn fr-btn--sm fr-btn--secondary" id="perso-add-btn">Ajouter</button>';
            h += '</div>';

            h += '</div>';
            this._$el.html(h);
            this._bindEvents();
        },

        /* ============================================================= */
        /*  EVENTS                                                        */
        /* ============================================================= */

        _bindEvents: function () {
            var self = this;

            $('#perso-save-btn').on('click', function () { self._save(); });

            $('#perso-add-btn').on('click', function () { self._addAgent(); });
            $('#perso-add-nom').on('keypress', function (e) {
                if (e.which === 13) self._addAgent();
            });

            this._$el.on('click', '.perso-del', function () {
                var idx = $(this).closest('tr').data('index');
                if (confirm('Supprimer ' + self._personnel[idx].nom + ' ?')) {
                    self._personnel.splice(idx, 1);
                    self._markDirty();
                    self._render();
                }
            });

            this._$el.on('click', '.perso-up', function () {
                var idx = $(this).closest('tr').data('index');
                if (idx > 0) {
                    var tmp = self._personnel[idx];
                    self._personnel[idx] = self._personnel[idx - 1];
                    self._personnel[idx - 1] = tmp;
                    self._markDirty();
                    self._render();
                }
            });

            this._$el.on('click', '.perso-down', function () {
                var idx = $(this).closest('tr').data('index');
                if (idx < self._personnel.length - 1) {
                    var tmp = self._personnel[idx];
                    self._personnel[idx] = self._personnel[idx + 1];
                    self._personnel[idx + 1] = tmp;
                    self._markDirty();
                    self._render();
                }
            });
        },

        _addAgent: function () {
            var id = $('#perso-add-id').val().trim().toLowerCase().replace(/\s+/g, '_');
            var nom = $('#perso-add-nom').val().trim();
            var grade = $('#perso-add-grade').val().trim();
            if (!id || !nom) {
                alert('Veuillez renseigner un identifiant et un nom.');
                return;
            }
            /* Check duplicate id */
            for (var i = 0; i < this._personnel.length; i++) {
                if (this._personnel[i].id === id) {
                    alert('Cet identifiant existe deja.');
                    return;
                }
            }
            this._personnel.push({ id: id, nom: nom, grade: grade });
            this._markDirty();
            this._render();
        },

        _markDirty: function () {
            this._isDirty = true;
            $('#perso-save-bar').addClass('dirty');
            $('#perso-save-status').text('Modifications non enregistrees');
            $('#perso-save-btn').prop('disabled', false);
        },

        _save: function () {
            var self = this;
            $('#perso-save-status').text('Enregistrement en cours...');
            $('#perso-save-btn').prop('disabled', true);
            window.PlanningData.savePersonnel(self._personnel, function (err) {
                if (err) {
                    alert('Erreur : ' + err);
                    self._markDirty();
                } else {
                    self._isDirty = false;
                    $('#perso-save-bar').removeClass('dirty').addClass('saved');
                    $('#perso-save-status').text('Enregistre avec succes');
                    self._onChangeCallback(self._personnel);
                    setTimeout(function () {
                        if (!self._isDirty) {
                            $('#perso-save-bar').removeClass('saved');
                            $('#perso-save-status').text('Aucune modification');
                        }
                    }, 2500);
                }
            });
        }
    };

}());
