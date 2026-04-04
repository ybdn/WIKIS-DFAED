/* SOURCE FILE FOR: [[MediaWiki:Dsfr/oce/OceForm.js]] */
/**
 * Modale de creation / edition d'une OCE.
 * Champs : Agent, N° OCE, Delivre par, Date reception, Date echeance.
 * En edition, pre-rempli avec les valeurs existantes (numero non modifiable).
 */
(function () {

    window.OceForm = {

        _$modal: null,
        _callback: null,
        _editingOce: null,

        /* ============================================================= */
        /*  OPEN                                                          */
        /* ============================================================= */

        /**
         * @param {Object|null} oce - OCE existante (null = creation)
         * @param {Array} personnel - liste du personnel actif
         * @param {Function} callback - recoit l'OCE creee/modifiee
         */
        open: function (oce, personnel, callback) {
            this._callback = callback;
            this._editingOce = oce;
            this._showModal(oce, personnel);
        },

        /* ============================================================= */
        /*  MODAL                                                         */
        /* ============================================================= */

        _showModal: function (oce, personnel) {
            var self = this;
            var isEdit = !!oce;
            var C = window.OceConfig;

            /* Remove previous modal */
            if (this._$modal) this._$modal.remove();

            var activePersonnel = [];
            for (var i = 0; i < personnel.length; i++) {
                if (personnel[i].actif !== false) activePersonnel.push(personnel[i]);
            }

            var h = '<div class="oce-modal-overlay" id="oce-modal-overlay">';
            h += '<div class="oce-modal">';
            h += '<div class="oce-modal-header">';
            h += '<h3>' + (isEdit ? 'Modifier l\'OCE' : 'Nouvelle OCE') + '</h3>';
            h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary oce-modal-close">\u2715</button>';
            h += '</div>';
            h += '<div class="oce-modal-body">';

            /* Agent */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-agent">Agent *</label>';
            h += '<select class="fr-select" id="oce-form-agent">';
            h += '<option value="">-- Selectionnez --</option>';
            for (var a = 0; a < activePersonnel.length; a++) {
                var p = activePersonnel[a];
                var sel = (isEdit && oce.agent === p.id) ? ' selected' : '';
                h += '<option value="' + self._escAttr(p.id) + '"' + sel + '>' + self._esc(p.nom) + ' (' + self._esc(p.grade || '') + ')</option>';
            }
            h += '</select>';
            h += '</div>';

            /* Numero OCE */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-numero">N\u00B0 OCE *</label>';
            h += '<input class="fr-input" type="text" id="oce-form-numero" value="' + (isEdit ? self._escAttr(oce.numero) : '') + '"' + (isEdit ? ' readonly style="background:#f0f0f0;"' : '') + ' placeholder="Ex: 2026/042">';
            h += '</div>';

            /* Delivre par */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-delivre">Delivre par *</label>';
            h += '<input class="fr-input" type="text" id="oce-form-delivre" value="' + (isEdit ? self._escAttr(oce.delivrePar || '') : '') + '" placeholder="Ex: TGI Marseille">';
            h += '</div>';

            /* Date arrivee ordonnance */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-ordonnance">Date d\'arrivee ordonnance *</label>';
            h += '<input class="fr-input" type="date" id="oce-form-ordonnance" value="' + (isEdit ? (oce.dateArriveeOrdonnance || '') : C.todayISO()) + '">';
            h += '</div>';

            /* Date arrivee images */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-images">Date d\'arrivee images</label>';
            h += '<input class="fr-input" type="date" id="oce-form-images" value="' + (isEdit ? (oce.dateArriveeImages || '') : '') + '">';
            h += '<span class="fr-hint-text">Laisser vide si les images ne sont pas encore arrivees.</span>';
            h += '</div>';

            /* Date echeance */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-echeance">Date d\'echeance *</label>';
            h += '<input class="fr-input" type="date" id="oce-form-echeance" value="' + (isEdit ? (oce.dateEcheance || '') : '') + '">';
            h += '</div>';

            /* Nombre de cliches */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-cliches">Nombre de cliches *</label>';
            h += '<input class="fr-input" type="number" id="oce-form-cliches" min="0" value="' + (isEdit ? (oce.nbCliches || 0) : '') + '" placeholder="Ex: 12">';
            h += '</div>';

            /* Objet (optionnel) */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-objet">Objet</label>';
            h += '<input class="fr-input" type="text" id="oce-form-objet" value="' + (isEdit ? self._escAttr(oce.objet || '') : '') + '" placeholder="Description libre">';
            h += '</div>';

            /* Priorite */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-priorite">Priorite</label>';
            h += '<select class="fr-select" id="oce-form-priorite">';
            h += '<option value="normale"' + (isEdit && oce.priorite === 'normale' ? ' selected' : (!isEdit ? ' selected' : '')) + '>Normale</option>';
            h += '<option value="urgente"' + (isEdit && oce.priorite === 'urgente' ? ' selected' : '') + '>Urgente</option>';
            h += '</select>';
            h += '</div>';

            /* Commentaire */
            h += '<div class="fr-input-group">';
            h += '<label class="fr-label" for="oce-form-commentaire">Commentaire</label>';
            h += '<textarea class="fr-input" id="oce-form-commentaire" rows="3" placeholder="Notes libres...">' + (isEdit ? self._esc(oce.commentaire || '') : '') + '</textarea>';
            h += '</div>';

            h += '</div>'; /* modal-body */

            h += '<div class="oce-modal-footer">';
            h += '<button class="fr-btn fr-btn--secondary oce-modal-close">Annuler</button>';
            h += '<button class="fr-btn" id="oce-form-submit">' + (isEdit ? 'Modifier' : 'Creer') + '</button>';
            h += '</div>';

            h += '</div></div>';

            this._$modal = $(h);
            $('body').append(this._$modal);

            /* Focus */
            if (!isEdit) {
                setTimeout(function () { $('#oce-form-agent').focus(); }, 100);
            }

            /* Bind events */
            this._$modal.on('click', '.oce-modal-close', function () { self._close(); });
            this._$modal.on('click', '#oce-modal-overlay', function (e) {
                if (e.target.id === 'oce-modal-overlay') self._close();
            });
            $('#oce-form-submit').on('click', function () { self._submit(); });

            /* Enter key */
            this._$modal.on('keypress', 'input', function (e) {
                if (e.which === 13) self._submit();
            });

            /* Escape key */
            $(document).on('keydown.oceform', function (e) {
                if (e.which === 27) self._close();
            });
        },

        /* ============================================================= */
        /*  SUBMIT                                                        */
        /* ============================================================= */

        _submit: function () {
            var C = window.OceConfig;
            var agent = $('#oce-form-agent').val();
            var numero = $('#oce-form-numero').val().trim();
            var delivre = $('#oce-form-delivre').val().trim();
            var ordonnance = $('#oce-form-ordonnance').val();
            var images = $('#oce-form-images').val();
            var echeance = $('#oce-form-echeance').val();
            var nbCliches = parseInt($('#oce-form-cliches').val(), 10);
            var objet = $('#oce-form-objet').val().trim();
            var priorite = $('#oce-form-priorite').val();
            var commentaire = $('#oce-form-commentaire').val().trim();

            /* Validation */
            if (!agent) { alert('Veuillez selectionner un agent.'); return; }
            if (!numero) { alert('Veuillez saisir un numero d\'OCE.'); return; }
            if (!delivre) { alert('Veuillez saisir le champ "Delivre par".'); return; }
            if (!ordonnance) { alert('Veuillez saisir la date d\'arrivee de l\'ordonnance.'); return; }
            if (!echeance) { alert('Veuillez saisir la date d\'echeance.'); return; }
            if (isNaN(nbCliches) || nbCliches < 0) { alert('Veuillez saisir un nombre de cliches valide.'); return; }

            /* Check duplicate numero (creation only) */
            if (!this._editingOce) {
                var allData = window.OceTable.getData();
                var allOce = (allData.oce || []).concat(allData.archive || []);
                if (window.OceData.findByNumero(allOce, numero) >= 0) {
                    alert('Le numero d\'OCE "' + numero + '" existe deja.');
                    return;
                }
            }

            var result;
            if (this._editingOce) {
                /* Edition : conserver les champs existants */
                result = {};
                for (var k in this._editingOce) {
                    if (this._editingOce.hasOwnProperty(k)) result[k] = this._editingOce[k];
                }
                result.agent = agent;
                result.delivrePar = delivre;
                result.dateArriveeOrdonnance = ordonnance;
                result.dateArriveeImages = images || '';
                result.dateEcheance = echeance;
                result.nbCliches = nbCliches;
                result.objet = objet;
                result.priorite = priorite;
                result.commentaire = commentaire;
                /* Suppression ancien champ migre */
                delete result.dateReception;
            } else {
                /* Creation */
                result = {
                    numero: numero,
                    agent: agent,
                    delivrePar: delivre,
                    objet: objet,
                    dateArriveeOrdonnance: ordonnance,
                    dateArriveeImages: images || '',
                    dateEcheance: echeance,
                    nbCliches: nbCliches,
                    statut: 'en_attente',
                    priorite: priorite,
                    commentaire: commentaire,
                    historique: []
                };
            }

            /* Auto-statut : en_attente <-> pret */
            var autoStatut = C.computeAutoStatut(result);
            if (autoStatut && autoStatut !== result.statut) {
                var oldStatut = result.statut;
                result.statut = autoStatut;
                window.OceData.addHistorique(result, 'Statut (auto)', oldStatut, autoStatut);
            }

            this._close();
            if (this._callback) this._callback(result);
        },

        /* ============================================================= */
        /*  CLOSE                                                         */
        /* ============================================================= */

        _close: function () {
            $(document).off('keydown.oceform');
            if (this._$modal) {
                this._$modal.remove();
                this._$modal = null;
            }
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
