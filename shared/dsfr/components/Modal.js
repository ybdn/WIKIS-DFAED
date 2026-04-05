/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Modal.js]] */
(function() {
    // DSFR Modal Component (Modale)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/modale
    // Note: Le JS DSFR officiel n'est pas chargé → comportement polyfill manuel.

    window.DsfrModal = {
        _counter: 0,

        /**
         * Transforms declarative modal markup into DSFR-compliant modals.
         *
         * Pattern déclencheur :
         * <span class="dsfr-modal-trigger" data-target="mon-modal">Ouvrir la modale</span>
         *
         * Pattern modale :
         * <div class="dsfr-modal-dialog" id="mon-modal">
         *   <div class="dsfr-modal-title">Titre de la modale</div>
         *   <div class="dsfr-modal-content">Contenu de la modale...</div>
         * </div>
         *
         * Attributs optionnels sur .dsfr-modal-dialog :
         *   data-size="lg"   → fr-col-lg-10 au lieu de fr-col-lg-6
         */
        transform: function() {
            var self = this;

            // 1. Construire les modales depuis les .dsfr-modal-dialog
            $('.dsfr-modal-dialog').each(function() {
                var $source  = $(this);
                var id       = $source.attr('id') || ('dsfr-modal-' + (++self._counter));
                var size     = $source.attr('data-size') || '';
                var lgClass  = (size === 'lg') ? 'fr-col-lg-10' : 'fr-col-lg-6';

                var $titleEl   = $source.find('.dsfr-modal-title').first();
                var $contentEl = $source.find('.dsfr-modal-content').first();
                var titleId    = id + '-title';

                var $dialog = $('<dialog>')
                    .attr('id', id)
                    .attr('aria-labelledby', titleId)
                    .attr('role', 'dialog')
                    .addClass('fr-modal');

                var $container = $('<div>').addClass('fr-container fr-container--fluid fr-container-md');
                var $row       = $('<div>').addClass('fr-grid-row fr-grid-row--center');
                var $col       = $('<div>').addClass('fr-col-12 fr-col-md-8 ' + lgClass);
                var $body      = $('<div>').addClass('fr-modal__body');
                var $header    = $('<div>').addClass('fr-modal__header');
                var $closeBtn  = $('<button>')
                    .addClass('fr-link--close fr-link')
                    .attr('title', 'Fermer la fenêtre modale')
                    .attr('data-dsfr-modal-close', id)
                    .text('Fermer');

                $header.append($closeBtn);
                $body.append($header);

                var $modalContent = $('<div>').addClass('fr-modal__content');

                if ($titleEl.length) {
                    var titleHtml = $titleEl.html().trim();
                    if ($titleEl.children().length === 1) {
                        var $child = $titleEl.children().first();
                        if (['P', 'PRE', 'CODE'].indexOf($child.prop('tagName')) !== -1) {
                            titleHtml = $child.html();
                        }
                    }
                    $modalContent.append(
                        $('<h1>').attr('id', titleId).addClass('fr-modal__title').html(titleHtml)
                    );
                }

                if ($contentEl.length) {
                    $modalContent.append($contentEl.html());
                }

                $body.append($modalContent);
                $col.append($body);
                $row.append($col);
                $container.append($row);
                $dialog.append($container);

                $source.replaceWith($dialog);
            });

            // 2. Transformer les déclencheurs en boutons DSFR
            $('.dsfr-modal-trigger').each(function() {
                var $el     = $(this);
                var target  = $el.attr('data-target') || '';
                var label   = $el.text().trim();
                var variant = $el.attr('data-variant') || 'primary';

                var classes = ['fr-btn'];
                if (variant !== 'primary') classes.push('fr-btn--' + variant);

                var $btn = $('<button>')
                    .addClass(classes.join(' '))
                    .attr('data-dsfr-modal-open', target)
                    .attr('aria-haspopup', 'dialog')
                    .text(label);

                $el.replaceWith($btn);
            });
        },

        /**
         * Ouvre une modale par son ID.
         * L'overlay est géré par le CSS DSFR via fr-modal--opened.
         * @param {string} id
         */
        open: function(id) {
            var $dialog = $('#' + id);
            if ($dialog.length === 0) return;

            $dialog.addClass('fr-modal--opened').attr('open', true);
            $(document.body).addClass('fr-no-scroll');

            // Focus sur le premier élément focusable dans la modale
            var $focusable = $dialog.find('button, [href], input, select, textarea, [tabindex]').first();
            if ($focusable.length) {
                setTimeout(function() { $focusable.focus(); }, 50);
            }
        },

        /**
         * Ferme une modale par son ID (ou toutes les modales ouvertes si id absent).
         * @param {string} [id]
         */
        close: function(id) {
            var $dialogs = id ? $('#' + id) : $('.fr-modal.fr-modal--opened');
            $dialogs.removeClass('fr-modal--opened').removeAttr('open');
            if ($('.fr-modal.fr-modal--opened').length === 0) {
                $(document.body).removeClass('fr-no-scroll');
            }
        },

        bindEvents: function() {
            var self = this;

            // Ouverture via data-dsfr-modal-open
            $(document.body).on('click', '[data-dsfr-modal-open]', function(e) {
                e.preventDefault();
                self.open($(this).attr('data-dsfr-modal-open'));
            });

            // Fermeture via bouton close
            $(document.body).on('click', '[data-dsfr-modal-close]', function(e) {
                e.preventDefault();
                self.close($(this).attr('data-dsfr-modal-close'));
            });

            // Fermeture par clic hors de la modale (sur le fond DSFR)
            $(document.body).on('click', '.fr-modal.fr-modal--opened', function(e) {
                if ($(e.target).hasClass('fr-modal')) {
                    self.close($(this).attr('id'));
                }
            });

            // Fermeture par Échap
            $(document).on('keydown', function(e) {
                if (e.key === 'Escape' || e.keyCode === 27) {
                    self.close();
                }
            });
        },

        init: function() {
            this.transform();
            this.bindEvents();
            console.log('[DSFR] Modal component initialized');
        }
    };

    $(function() {
        window.DsfrModal.init();
    });
})();
