/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Callout.js]] */
(function() {
    // DSFR Callout Component (Mise en avant)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/mise-en-avant

    window.DsfrCallout = {
        /**
         * Transforms simplified wikitext-safe HTML into DSFR Callout structures.
         *
         * Input Pattern:
         * <div class="dsfr-callout">
         *   <div class="dsfr-callout-title">Titre</div>
         *   <div class="dsfr-callout-text">Texte descriptif...</div>
         *   <div class="dsfr-callout-link"><a href="url">Bouton action</a></div>
         * </div>
         *
         * Attributs optionnels sur le wrapper :
         *   data-color="green-menthe"          → fr-callout--green-menthe
         *   data-icon="fr-icon-information-line" → classe icône supplémentaire
         */
        transform: function() {
            $('.dsfr-callout').each(function() {
                var $source = $(this);
                if ($source.hasClass('fr-callout')) return;

                var $titleEl   = $source.find('.dsfr-callout-title').first();
                var $textEl    = $source.find('.dsfr-callout-text').first();
                var $linkEl    = $source.find('.dsfr-callout-link').first();
                var color      = $source.attr('data-color') || '';
                var icon       = $source.attr('data-icon')  || '';

                var classes = ['fr-callout'];
                if (color) classes.push('fr-callout--' + color);
                if (icon)  classes.push(icon);

                var $callout = $('<div>').addClass(classes.join(' '));

                if ($titleEl.length) {
                    var titleHtml = $titleEl.html().trim();
                    // Unwrap single <p>/<pre>/<code> pour éviter "block dans heading"
                    if ($titleEl.children().length === 1) {
                        var $child = $titleEl.children().first();
                        if (['P', 'PRE', 'CODE'].indexOf($child.prop('tagName')) !== -1) {
                            titleHtml = $child.html();
                        }
                    }
                    $callout.append($('<h3>').addClass('fr-callout__title').html(titleHtml));
                }

                if ($textEl.length) {
                    $callout.append($('<p>').addClass('fr-callout__text').html($textEl.html().trim()));
                }

                if ($linkEl.length) {
                    var $a = $linkEl.find('a').first();
                    if ($a.length) {
                        var $ul = $('<ul>').addClass('fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-sm');
                        var $li = $('<li>');
                        var $btn = $('<a>').addClass('fr-btn')
                            .attr('href', $a.attr('href') || '#')
                            .text($a.text());
                        $li.append($btn);
                        $ul.append($li);
                        $callout.append($ul);
                    }
                }

                $source.replaceWith($callout);
            });
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Callout component initialized');
        }
    };

    $(function() {
        window.DsfrCallout.init();
    });
})();
