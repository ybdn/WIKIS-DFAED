/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Highlight.js]] */
(function() {
    // DSFR Highlight Component (Mise en exergue)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/mise-en-exergue

    window.DsfrHighlight = {
        /**
         * Transforms simplified wikitext-safe HTML into DSFR Highlight structures.
         *
         * Input Pattern:
         * <div class="dsfr-highlight">Texte mis en exergue</div>
         *
         * Attributs optionnels :
         *   data-color="green-menthe"  → fr-highlight--green-menthe
         *   data-size="sm"             → fr-text--sm
         *   data-size="lg"             → fr-text--lg
         */
        transform: function() {
            $('.dsfr-highlight').each(function() {
                var $source = $(this);
                if ($source.hasClass('fr-highlight')) return;

                var color = $source.attr('data-color') || '';
                var size  = $source.attr('data-size')  || '';

                var classes = ['fr-highlight'];
                if (color) classes.push('fr-highlight--' + color);

                var $highlight = $('<div>').addClass(classes.join(' '));

                var innerHtml = $source.html().trim();

                // Si le contenu n'est pas déjà dans un <p>, l'envelopper
                if ($source.children('p, div, ul, ol').length === 0) {
                    var $p = $('<p>');
                    if (size) $p.addClass('fr-text--' + size);
                    $p.html(innerHtml);
                    $highlight.append($p);
                } else {
                    if (size) {
                        $source.children('p').addClass('fr-text--' + size);
                    }
                    $highlight.html(innerHtml);
                }

                $source.replaceWith($highlight);
            });
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Highlight component initialized');
        }
    };

    $(function() {
        window.DsfrHighlight.init();
    });
})();
