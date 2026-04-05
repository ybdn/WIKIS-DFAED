/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Skiplink.js]] */
(function() {
    // DSFR Skiplink Component (Liens d'évitement)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/lien-d-evitement
    // Ce composant injecte automatiquement les liens d'évitement en début de body.
    // Les IDs cibles (#contenu, #header-navigation, #footer) sont posés par Layout.js.

    window.DsfrSkiplink = {
        /**
         * Liens d'évitement par défaut.
         * Chaque lien : { label, target }
         * target = ID de l'ancre cible dans la page.
         */
        defaultLinks: [
            { label: 'Contenu',          target: 'contenu' },
            { label: 'Menu',             target: 'header-navigation' },
            { label: 'Pied de page',     target: 'footer' }
        ],

        /**
         * Injecte les skiplinks au tout début de <body>.
         * Ne fait rien si un .fr-skiplinks existe déjà.
         *
         * Peut aussi transformer une liste déclarative :
         * <div class="dsfr-skiplinks">
         *   <span data-target="contenu">Contenu</span>
         *   <span data-target="recherche">Recherche</span>
         * </div>
         */
        inject: function() {
            // Éviter la double injection
            if ($('.fr-skiplinks').length) return;

            var links;
            var $decl = $('.dsfr-skiplinks').first();

            if ($decl.length) {
                // Liens déclaratifs
                links = [];
                $decl.find('[data-target]').each(function() {
                    var $el = $(this);
                    links.push({ label: $el.text().trim(), target: $el.attr('data-target') });
                });
                $decl.remove();
            } else {
                links = this.defaultLinks;
            }

            // Vérifier que les ancres cibles existent avant d'ajouter les liens
            var validLinks = [];
            for (var i = 0; i < links.length; i++) {
                if ($('#' + links[i].target).length) {
                    validLinks.push(links[i]);
                }
            }

            if (validLinks.length === 0) return;

            var $nav = $('<nav>').attr('aria-label', 'Accès rapide').addClass('fr-container');
            var $ul  = $('<ul>').addClass('fr-skiplinks__list');

            for (var j = 0; j < validLinks.length; j++) {
                var $li = $('<li>');
                var $a  = $('<a>').addClass('fr-link')
                    .attr('href', '#' + validLinks[j].target)
                    .text(validLinks[j].label);
                $li.append($a);
                $ul.append($li);
            }

            $nav.append($ul);

            var $skiplinks = $('<div>').addClass('fr-skiplinks').append($nav);
            $(document.body).prepend($skiplinks);
        },

        init: function() {
            this.inject();
            console.log('[DSFR] Skiplink component initialized');
        }
    };

    $(function() {
        window.DsfrSkiplink.init();
    });
})();
