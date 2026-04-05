/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tabnav.js]] */
(function() {
    // DSFR Tabnav Component — Navigation tertiaire (onglets de navigation entre pages)
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/navigation-secondaire
    //
    // Différence vs Tab.js : Tabnav = liens <a href> entre pages, Tab = panneaux de contenu inline.
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-tabnav" data-label="Navigation de section">
    //     <ul>
    //       <li class="current"><a href="url">Page active</a></li>
    //       <li><a href="url">Autre page</a></li>
    //     </ul>
    //   </div>
    //
    // Attributs du conteneur (.dsfr-tabnav) :
    //   data-label   (optionnel) aria-label sur la liste (défaut : "Navigation")

    var _counter = 0;

    window.DsfrTabnav = {

        transform: function() {
            var containers = document.querySelectorAll('.dsfr-tabnav');
            for (var i = 0; i < containers.length; i++) {
                var el = containers[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var label = el.getAttribute('data-label') || 'Navigation';
                var items = el.querySelectorAll('li');
                if (!items.length) continue;

                _counter++;
                var listHtml = '<ul class="fr-tabs__list" role="tablist" aria-label="' + label + '">';

                for (var j = 0; j < items.length; j++) {
                    var li = items[j];
                    var link = li.querySelector('a');
                    if (!link) continue;

                    var isCurrent = li.className.indexOf('current') !== -1;
                    var href = link.getAttribute('href') || '#';
                    var text = link.innerHTML;

                    var btnCls = 'fr-tabs__tab';
                    var selectedAttr = isCurrent ? ' aria-selected="true" tabindex="0"' : ' aria-selected="false" tabindex="-1"';

                    listHtml +=
                        '<li role="presentation">' +
                            '<a class="' + btnCls + '" href="' + href + '"' + selectedAttr + '>' +
                                text +
                            '</a>' +
                        '</li>';
                }

                listHtml += '</ul>';

                el.outerHTML = '<div class="fr-tabs" data-dsfr-transformed="true">' + listHtml + '</div>';
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Tabnav component initialized');
        }
    };

    $(function() {
        window.DsfrTabnav.init();
    });

})();
