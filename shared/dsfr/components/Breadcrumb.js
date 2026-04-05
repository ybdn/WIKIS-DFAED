/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Breadcrumb.js]] */
(function() {
    // DSFR Breadcrumb Component (Fil d'Ariane)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/fil-d-ariane

    window.DsfrBreadcrumb = {
        _counter: 0,

        /**
         * Transforms a .dsfr-breadcrumb element into a DSFR fr-breadcrumb nav.
         *
         * Input Pattern :
         * <div class="dsfr-breadcrumb">
         *   <span class="dsfr-breadcrumb-item"><a href="/Accueil">Accueil</a></span>
         *   <span class="dsfr-breadcrumb-item"><a href="/Section">Section</a></span>
         *   <span class="dsfr-breadcrumb-item">Page actuelle</span>
         * </div>
         *
         * Note : le dernier item est automatiquement marqué aria-current="page".
         * Un bouton "Voir le fil d'Ariane" est ajouté pour la responsivité mobile.
         */
        transform: function() {
            var self = this;

            $('.dsfr-breadcrumb').each(function() {
                var $source = $(this);
                if ($source.hasClass('fr-breadcrumb')) return;

                var uid = 'breadcrumb-' + (++self._counter);
                var $items = $source.find('.dsfr-breadcrumb-item');
                if ($items.length === 0) return;

                var $nav = $('<nav>')
                    .attr('role', 'navigation')
                    .attr('aria-label', 'vous êtes ici :')
                    .addClass('fr-breadcrumb');

                // Bouton collapse responsive (mobile)
                var $btn = $('<button>')
                    .addClass('fr-breadcrumb__button')
                    .attr('aria-expanded', 'false')
                    .attr('aria-controls', uid)
                    .text('Voir le fil d\'Ariane');

                var $collapse = $('<div>').addClass('fr-collapse').attr('id', uid);
                var $ol = $('<ol>').addClass('fr-breadcrumb__list');

                $items.each(function(i) {
                    var $item = $(this);
                    var $li   = $('<li>');
                    var isLast = (i === $items.length - 1);
                    var $a = $item.find('a').first();

                    if ($a.length && !isLast) {
                        $li.append(
                            $('<a>').addClass('fr-breadcrumb__link')
                                .attr('href', $a.attr('href') || '#')
                                .html($a.html())
                        );
                    } else {
                        // Dernier item = page actuelle (pas de lien ou texte brut)
                        var label = $a.length ? $a.html() : $item.html();
                        $li.append(
                            $('<a>').addClass('fr-breadcrumb__link')
                                .attr('aria-current', 'page')
                                .html(label)
                        );
                    }

                    $ol.append($li);
                });

                $collapse.append($ol);
                $nav.append($btn).append($collapse);
                $source.replaceWith($nav);
            });
        },

        /**
         * Gestion de l'interaction collapse/expand (responsive mobile).
         * Réutilise le même mécanisme que Accordion.
         */
        bindEvents: function() {
            $(document.body).on('click', '.fr-breadcrumb__button', function() {
                var $btn = $(this);
                var targetId = $btn.attr('aria-controls');
                if (!targetId) return;

                var $target   = $('#' + targetId);
                var isExpanded = $btn.attr('aria-expanded') === 'true';

                if (isExpanded) {
                    $btn.attr('aria-expanded', 'false');
                    $target.removeClass('fr-collapse--expanded');
                } else {
                    $btn.attr('aria-expanded', 'true');
                    $target.addClass('fr-collapse--expanded');
                }
            });
        },

        init: function() {
            this.transform();
            this.bindEvents();
            console.log('[DSFR] Breadcrumb component initialized');
        }
    };

    $(function() {
        window.DsfrBreadcrumb.init();
    });
})();
