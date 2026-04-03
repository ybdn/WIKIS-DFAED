/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningPersonnel.js]] */
/**
 * Gestion du personnel — UI CRUD avec edition inline et statut actif/parti.
 * Uniquement affiche en mode Gestion (bureaucrates).
 * Donnees stockees dans Planning:Data/Personnel.
 *
 * Structure d'un agent :
 *   { id: "dupont", nom: "DUPONT Jean", grade: "MDC", actif: true }
 *   { id: "martin", nom: "MARTIN Sophie", grade: "GAV", actif: false, dateDepart: "2026-04-01" }
 */
(function () {

    window.PlanningPersonnel = {

        _$el: null,
        _personnel: [],
        _isDirty: false,
        _onChangeCallback: null,
        _editingIndex: -1,

        /* ============================================================= */
        /*  INIT                                                          */
        /* ============================================================= */

        init: function ($container, personnel, onChangeCallback) {
            this._$el = $container;
            this._isDirty = false;
            this._editingIndex = -1;
            this._onChangeCallback = onChangeCallback || function () {};

            /* Backward compat: ensure actif field exists */
            this._personnel = [];
            for (var i = 0; i < (personnel || []).length; i++) {
                var p = {};
                for (var k in personnel[i]) {
                    if (personnel[i].hasOwnProperty(k)) p[k] = personnel[i][k];
                }
                if (p.actif === undefined) p.actif = true;
                this._personnel.push(p);
            }

            this._render();
        },

        getPersonnel: function () {
            return this._personnel;
        },

        getActivePersonnel: function () {
            var result = [];
            for (var i = 0; i < this._personnel.length; i++) {
                if (this._personnel[i].actif !== false) result.push(this._personnel[i]);
            }
            return result;
        },

        /* ============================================================= */
        /*  RENDER                                                        */
        /* ============================================================= */

        _render: function () {
            var actifs = [];
            var partis = [];
            for (var i = 0; i < this._personnel.length; i++) {
                if (this._personnel[i].actif !== false) {
                    actifs.push({ data: this._personnel[i], index: i });
                } else {
                    partis.push({ data: this._personnel[i], index: i });
                }
            }

            var h = '<div class="planning-personnel">';
            h += '<h3>Gestion du personnel</h3>';

            /* Save bar */
            h += '<div class="planning-save-bar" id="perso-save-bar">';
            h += '<span class="planning-save-status" id="perso-save-status">Aucune modification</span>';
            h += '<button class="fr-btn fr-btn--sm" id="perso-save-btn" disabled>Enregistrer</button>';
            h += '</div>';

            /* ---- ACTIFS ---- */
            h += '<h4 style="margin-top:1rem;margin-bottom:0.5rem;">Personnel actif (' + actifs.length + ')</h4>';
            h += '<table class="planning-personnel-table">';
            h += '<thead><tr><th>ID</th><th>Nom</th><th>Grade</th><th style="min-width:150px;">Actions</th></tr></thead>';
            h += '<tbody>';

            for (var a = 0; a < actifs.length; a++) {
                var p = actifs[a].data;
                var idx = actifs[a].index;
                var isEditing = (this._editingIndex === idx);

                h += '<tr data-index="' + idx + '">';
                if (isEditing) {
                    h += '<td><input class="fr-input fr-input--sm" type="text" id="perso-edit-id" value="' + this._escAttr(p.id) + '" style="width:100px;"></td>';
                    h += '<td><input class="fr-input fr-input--sm" type="text" id="perso-edit-nom" value="' + this._escAttr(p.nom) + '" style="width:180px;"></td>';
                    h += '<td><input class="fr-input fr-input--sm" type="text" id="perso-edit-grade" value="' + this._escAttr(p.grade || '') + '" style="width:80px;"></td>';
                    h += '<td>';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--secondary perso-confirm" title="Confirmer">\u2713</button> ';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-cancel" title="Annuler">\u2715</button>';
                    h += '</td>';
                } else {
                    h += '<td>' + this._esc(p.id) + '</td>';
                    h += '<td>' + this._esc(p.nom) + '</td>';
                    h += '<td>' + this._esc(p.grade || '') + '</td>';
                    h += '<td>';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-edit" title="Modifier">\u270F\uFE0F</button> ';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-depart" title="Depart de l\'unite">\uD83D\uDCE4</button> ';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-up" title="Monter"' + (a === 0 ? ' disabled' : '') + '>\u25B2</button> ';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-down" title="Descendre"' + (a === actifs.length - 1 ? ' disabled' : '') + '>\u25BC</button>';
                    h += '</td>';
                }
                h += '</tr>';
            }

            if (actifs.length === 0) {
                h += '<tr><td colspan="4" style="text-align:center;color:#666;">Aucun personnel actif</td></tr>';
            }
            h += '</tbody></table>';

            /* Add form */
            h += '<div class="planning-personnel-add" style="margin-bottom:1.5rem;">';
            h += '<input class="fr-input" type="text" id="perso-add-id" placeholder="Identifiant (ex: dupont)" style="max-width:150px;">';
            h += '<input class="fr-input" type="text" id="perso-add-nom" placeholder="Nom complet (ex: DUPONT Jean)" style="max-width:200px;">';
            h += '<input class="fr-input" type="text" id="perso-add-grade" placeholder="Grade (ex: MDC)" style="max-width:100px;">';
            h += '<button class="fr-btn fr-btn--sm fr-btn--secondary" id="perso-add-btn">Ajouter</button>';
            h += '</div>';

            /* ---- PARTIS ---- */
            if (partis.length > 0) {
                h += '<details style="margin-top:1rem;">';
                h += '<summary style="cursor:pointer;font-weight:700;color:#666;">Personnel parti (' + partis.length + ')</summary>';
                h += '<table class="planning-personnel-table" style="opacity:0.7;margin-top:0.5rem;">';
                h += '<thead><tr><th>ID</th><th>Nom</th><th>Grade</th><th>Date depart</th><th>Actions</th></tr></thead>';
                h += '<tbody>';
                for (var b = 0; b < partis.length; b++) {
                    var pp = partis[b].data;
                    var idxP = partis[b].index;
                    h += '<tr data-index="' + idxP + '">';
                    h += '<td>' + this._esc(pp.id) + '</td>';
                    h += '<td>' + this._esc(pp.nom) + '</td>';
                    h += '<td>' + this._esc(pp.grade || '') + '</td>';
                    h += '<td>' + (pp.dateDepart || '—') + '</td>';
                    h += '<td>';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-reactivate" title="Reactiver">\u21A9\uFE0F</button> ';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary perso-del" title="Supprimer definitivement">\uD83D\uDDD1\uFE0F</button>';
                    h += '</td>';
                    h += '</tr>';
                }
                h += '</tbody></table>';
                h += '</details>';
            }

            h += '</div>';
            this._$el.html(h);
            this._bindEvents();
        },

        /* ============================================================= */
        /*  EVENTS                                                        */
        /* ============================================================= */

        _bindEvents: function () {
            var self = this;

            /* Save */
            $('#perso-save-btn').on('click', function () { self._save(); });

            /* Add */
            $('#perso-add-btn').on('click', function () { self._addAgent(); });
            $('#perso-add-nom, #perso-add-id, #perso-add-grade').on('keypress', function (e) {
                if (e.which === 13) self._addAgent();
            });

            /* Edit */
            this._$el.on('click', '.perso-edit', function () {
                var idx = $(this).closest('tr').data('index');
                self._editingIndex = idx;
                self._render();
                /* Focus first input */
                $('#perso-edit-id').focus();
            });

            /* Confirm edit */
            this._$el.on('click', '.perso-confirm', function () {
                self._confirmEdit();
            });

            /* Also confirm on Enter in edit inputs */
            this._$el.on('keypress', '#perso-edit-id, #perso-edit-nom, #perso-edit-grade', function (e) {
                if (e.which === 13) self._confirmEdit();
            });

            /* Cancel edit */
            this._$el.on('click', '.perso-cancel', function () {
                self._editingIndex = -1;
                self._render();
            });

            /* Departure */
            this._$el.on('click', '.perso-depart', function () {
                var idx = $(this).closest('tr').data('index');
                var agent = self._personnel[idx];
                if (confirm('Marquer ' + agent.nom + ' comme parti de l\'unite ?\n\nSes donnees de planning seront conservees.')) {
                    agent.actif = false;
                    var now = new Date();
                    agent.dateDepart = now.getFullYear() + '-' +
                        (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + '-' +
                        (now.getDate() < 10 ? '0' : '') + now.getDate();
                    self._render();
                    self._markDirty();
                }
            });

            /* Reactivate */
            this._$el.on('click', '.perso-reactivate', function () {
                var idx = $(this).closest('tr').data('index');
                var agent = self._personnel[idx];
                agent.actif = true;
                delete agent.dateDepart;
                self._render();
                self._markDirty();
            });

            /* Delete (departed only) */
            this._$el.on('click', '.perso-del', function () {
                var idx = $(this).closest('tr').data('index');
                if (confirm('Supprimer definitivement ' + self._personnel[idx].nom + ' ?\n\nAttention : ses donnees de planning passeront en orphelin.')) {
                    self._personnel.splice(idx, 1);
                    self._render();
                    self._markDirty();
                }
            });

            /* Move up (active only) */
            this._$el.on('click', '.perso-up', function () {
                var idx = $(this).closest('tr').data('index');
                if (idx > 0) {
                    /* Find previous active */
                    var prev = -1;
                    for (var i = idx - 1; i >= 0; i--) {
                        if (self._personnel[i].actif !== false) { prev = i; break; }
                    }
                    if (prev >= 0) {
                        var tmp = self._personnel[idx];
                        self._personnel[idx] = self._personnel[prev];
                        self._personnel[prev] = tmp;
                        self._render();
                        self._markDirty();
                    }
                }
            });

            /* Move down (active only) */
            this._$el.on('click', '.perso-down', function () {
                var idx = $(this).closest('tr').data('index');
                var next = -1;
                for (var i = idx + 1; i < self._personnel.length; i++) {
                    if (self._personnel[i].actif !== false) { next = i; break; }
                }
                if (next >= 0) {
                    var tmp = self._personnel[idx];
                    self._personnel[idx] = self._personnel[next];
                    self._personnel[next] = tmp;
                    self._render();
                    self._markDirty();
                }
            });
        },

        /* ============================================================= */
        /*  ACTIONS                                                       */
        /* ============================================================= */

        _addAgent: function () {
            var id = $('#perso-add-id').val().trim().toLowerCase().replace(/\s+/g, '_');
            var nom = $('#perso-add-nom').val().trim();
            var grade = $('#perso-add-grade').val().trim();
            if (!id || !nom) {
                alert('Veuillez renseigner un identifiant et un nom.');
                return;
            }
            for (var i = 0; i < this._personnel.length; i++) {
                if (this._personnel[i].id === id) {
                    alert('Cet identifiant existe deja.');
                    return;
                }
            }
            this._personnel.push({ id: id, nom: nom, grade: grade, actif: true });
            this._render();
            this._markDirty();
        },

        _confirmEdit: function () {
            var idx = this._editingIndex;
            if (idx < 0 || idx >= this._personnel.length) return;

            var newId = $('#perso-edit-id').val().trim().toLowerCase().replace(/\s+/g, '_');
            var newNom = $('#perso-edit-nom').val().trim();
            var newGrade = $('#perso-edit-grade').val().trim();

            if (!newId || !newNom) {
                alert('L\'identifiant et le nom sont obligatoires.');
                return;
            }

            /* Check duplicate ID (excluding current) */
            for (var i = 0; i < this._personnel.length; i++) {
                if (i !== idx && this._personnel[i].id === newId) {
                    alert('Cet identifiant est deja utilise par un autre agent.');
                    return;
                }
            }

            /* Warn if ID changed */
            var oldId = this._personnel[idx].id;
            if (newId !== oldId) {
                if (!confirm('Attention : changer l\'identifiant de "' + oldId + '" en "' + newId + '" ne migrera pas les donnees de planning existantes.\n\nContinuer ?')) {
                    return;
                }
            }

            this._personnel[idx].id = newId;
            this._personnel[idx].nom = newNom;
            this._personnel[idx].grade = newGrade;

            this._editingIndex = -1;
            this._render();
            this._markDirty();
        },

        /* ============================================================= */
        /*  SAVE                                                          */
        /* ============================================================= */

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
        },

        /* ============================================================= */
        /*  UTILS                                                         */
        /* ============================================================= */

        _esc: function (s) {
            if (!s) return '';
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        _escAttr: function (s) {
            if (!s) return '';
            return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    };

}());
