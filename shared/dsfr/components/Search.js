/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Search.js]] */
(function() {
    // DSFR Search Component — Barre de recherche intégrée MediaWiki
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/barre-de-recherche
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-search"
    //        data-label="Recherche"
    //        data-placeholder="Rechercher dans le wiki...">
    //   </div>
    //
    // Attributs :
    //   data-label        (optionnel) Label accessible (défaut : "Recherche")
    //   data-placeholder  (optionnel) Texte de remplacement
    //   data-action       (optionnel) URL du formulaire (défaut : URL Special:Search MW)
    //   data-param        (optionnel) Nom du paramètre de recherche (défaut : "search")
    //   data-size         (optionnel) "lg" → fr-search-bar--lg

    var _counter = 0;

    window.DsfrSearch = {

        transform: function() {
            var els = document.querySelectorAll('.dsfr-search');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                _counter++;
                var inputId = 'search-dsfr-' + _counter;

                var label       = el.getAttribute('data-label')       || 'Recherche';
                var placeholder = el.getAttribute('data-placeholder') || 'Rechercher...';
                var size        = el.getAttribute('data-size')        || '';
                var param       = el.getAttribute('data-param')       || 'search';

                // Déterminer l'URL d'action via MW si disponible, sinon via data-action
                var actionUrl = el.getAttribute('data-action') || '';
                if (!actionUrl) {
                    if (window.mw && mw.config) {
                        actionUrl = mw.config.get('wgScript') || '/index.php';
                    } else {
                        actionUrl = '/index.php';
                    }
                }

                var cls = 'fr-search-bar';
                if (size) cls += ' fr-search-bar--' + size;

                // Si action est une page spéciale MediaWiki, ajouter title comme param caché
                var hiddenInputs = '';
                if (!el.getAttribute('data-action')) {
                    // Formulaire de recherche MW standard : action wgScript + title=Special:Search
                    hiddenInputs = '<input type="hidden" name="title" value="Special:Search">';
                }

                el.outerHTML =
                    '<div class="' + cls + '" role="search" data-dsfr-transformed="true">' +
                        '<form action="' + actionUrl + '" method="get">' +
                            hiddenInputs +
                            '<label class="fr-label" for="' + inputId + '">' + label + '</label>' +
                            '<input class="fr-input"' +
                                ' type="search"' +
                                ' id="' + inputId + '"' +
                                ' name="' + param + '"' +
                                ' placeholder="' + placeholder + '"' +
                                ' aria-label="' + label + '">' +
                            '<button class="fr-btn" type="submit" title="' + label + '">' +
                                label +
                            '</button>' +
                        '</form>' +
                    '</div>';
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Search component initialized');
        }
    };

    $(function() {
        window.DsfrSearch.init();
    });

})();
