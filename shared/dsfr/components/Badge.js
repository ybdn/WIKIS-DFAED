/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Badge.js]] */
(function() {
    // DSFR Badge Component Generator
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/badge
    
    window.DsfrBadge = {
        /**
         * Renders a DSFR Badge HTML string
         * @param {Object} options Configuration object
         * @param {string} options.label - Text content of the badge
         * @param {string} [options.type] - Semantic type: 'success', 'error', 'info', 'warning', 'new'
         * @param {string} [options.color] - Specific color name (ex: 'green-menthe') if type is not used
         * @param {boolean} [options.sm] - Small size (default: false)
         * @param {boolean} [options.noIcon] - Hide icon (default: false)
         * @returns {string} HTML string
         */
        render: function(options) {
            if (!options || !options.label) return '';

            var classes = ['fr-badge'];
            
            // Size
            if (options.sm) classes.push('fr-badge--sm');
            
            // Type / Color mapping
            if (options.type) {
                switch(options.type) {
                    case 'success': classes.push('fr-badge--success'); break;
                    case 'error':   classes.push('fr-badge--error'); break;
                    case 'info':    classes.push('fr-badge--info'); break;
                    case 'warning': classes.push('fr-badge--warning'); break;
                    case 'new':     classes.push('fr-badge--new'); break;
                }
            } else if (options.color) {
                // Custom color (needs to follow DSFR class naming like fr-badge--green-menthe)
                classes.push('fr-badge--' + options.color);
            }
            
            // Icon handling (DSFR badges have icons by default for semantic types)
            if (options.noIcon) {
                classes.push('fr-badge--no-icon');
            }

            return '<p class="' + classes.join(' ') + '">' + options.label + '</p>';
        },

        /**
         * Scans the page for specific elements to transform into badges
         * Example: <span data-dsfr-badge="success">Succès</span>
         */
        init: function() {
            var elements = document.querySelectorAll('[data-dsfr-badge]');
            // ES5 compatible loop (NodeList.forEach is ES6)
            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                var type = el.getAttribute('data-dsfr-badge');
                var sm = el.getAttribute('data-dsfr-sm') !== null;
                var noIcon = el.getAttribute('data-dsfr-no-icon') !== null;
                var html = window.DsfrBadge.render({
                    label: el.innerText,
                    type: type,
                    sm: sm,
                    noIcon: noIcon
                });
                el.outerHTML = html;
            }
        }
    };

    // Auto-init on page load
    $(function() { window.DsfrBadge.init(); });

})();
