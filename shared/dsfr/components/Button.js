/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Button.js]] */
(function() {
    // DSFR Button Component
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/bouton

    window.DsfrButton = {
        /**
         * Renders a DSFR Button HTML string.
         * @param {Object} options
         * @param {string}  options.label          - Texte affiché
         * @param {string}  [options.href]          - Si présent → <a>, sinon <button>
         * @param {string}  [options.variant]       - 'primary'(défaut), 'secondary', 'tertiary', 'tertiary-no-outline'
         * @param {string}  [options.size]          - 'sm', 'lg' (md = défaut, pas de classe supplémentaire)
         * @param {string}  [options.icon]          - Classe icône DSFR ex: 'fr-icon-download-line'
         * @param {string}  [options.iconPosition]  - 'left'(défaut) ou 'right'
         * @param {boolean} [options.disabled]      - Désactiver le bouton
         * @returns {string} HTML string
         */
        render: function(options) {
            if (!options || !options.label) return '';

            var classes = ['fr-btn'];

            if (options.variant && options.variant !== 'primary') {
                classes.push('fr-btn--' + options.variant);
            }
            if (options.size && options.size !== 'md') {
                classes.push('fr-btn--' + options.size);
            }
            if (options.icon) {
                classes.push(options.icon);
                classes.push(options.iconPosition === 'right' ? 'fr-btn--icon-right' : 'fr-btn--icon-left');
            }

            var classStr = classes.join(' ');

            if (options.href) {
                return '<a class="' + classStr + '" href="' + options.href + '">' + options.label + '</a>';
            }

            var disabled = options.disabled ? ' disabled' : '';
            return '<button class="' + classStr + '"' + disabled + '>' + options.label + '</button>';
        },

        /**
         * Transforms wikitext-safe spans/divs into DSFR buttons.
         *
         * Input Pattern (span recommandé pour inline) :
         * <span class="dsfr-btn">Label</span>
         * <span class="dsfr-btn" data-href="url" data-variant="secondary">Label</span>
         * <span class="dsfr-btn" data-icon="fr-icon-download-line" data-icon-position="right">Télécharger</span>
         * <span class="dsfr-btn" data-variant="tertiary" data-size="sm">Petit</span>
         */
        transform: function() {
            $('.dsfr-btn').each(function() {
                var $el = $(this);
                if ($el.hasClass('fr-btn')) return;

                var label   = $el.text().trim();
                var href    = $el.attr('data-href') || '';
                var variant = $el.attr('data-variant') || 'primary';
                var size    = $el.attr('data-size') || 'md';
                var icon    = $el.attr('data-icon') || '';
                var iconPos = $el.attr('data-icon-position') || 'left';

                var html = window.DsfrButton.render({
                    label: label,
                    href: href || null,
                    variant: variant,
                    size: size,
                    icon: icon,
                    iconPosition: iconPos
                });

                $el.replaceWith($(html));
            });
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Button component initialized');
        }
    };

    $(function() {
        window.DsfrButton.init();
    });
})();
