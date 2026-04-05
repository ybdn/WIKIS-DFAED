/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Summary.js]] */
(function() {
    // DSFR Summary Component — Sommaire
    // Documentation : https://www.systeme-de-design.gouv.fr/composants/sommaire
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-summary"></div>
    //
    //   Avec titre personnalisé :
    //   <div class="dsfr-summary" data-title="Dans cette page"></div>
    //
    //   Avec profondeur personnalisée (h2 uniquement) :
    //   <div class="dsfr-summary" data-depth="1"></div>
    //
    // Attributs :
    //   data-title   (optionnel)  Titre du sommaire (défaut : "Sommaire")
    //   data-depth   (optionnel)  Profondeur maximale : 1 = h2 seulement, 2 = h2+h3 (défaut : 2)
    //
    // Le composant génère automatiquement le sommaire en scannant les h2 et h3
    // présents dans .mw-parser-output après l'élément dsfr-summary.
    // Les titres MediaWiki ont un <span id="..."> — ces IDs sont utilisés comme ancres.
    //
    // Note : le __TOC__ MediaWiki natif est masqué par Style.css (DSFR prend le relais).

    var _summaryCounter = 0;

    window.DsfrSummary = {

        /**
         * Collecte les titres h2 (et h3 si depth >= 2) depuis le contenu de la page.
         * @param {number} depth - Profondeur (1 ou 2)
         * @returns {Array} tableau de { level, id, text }
         */
        collectHeadings: function(depth) {
            var content = document.querySelector('.mw-parser-output');
            if (!content) return [];

            var selector = (depth >= 2) ? 'h2, h3' : 'h2';
            var headings = content.querySelectorAll(selector);
            var result = [];

            for (var i = 0; i < headings.length; i++) {
                var h = headings[i];

                // MediaWiki wrape le texte dans un <span class="mw-headline" id="...">
                var span = h.querySelector('.mw-headline');
                if (!span) continue;

                var id   = span.getAttribute('id') || '';
                var text = span.textContent || span.innerText || '';

                // Ignorer les titres sans ID (ex: titres injectés par nos composants)
                if (!id || !text) continue;

                result.push({
                    level: parseInt(h.tagName.replace('H', ''), 10),
                    id:    id,
                    text:  text
                });
            }

            return result;
        },

        /**
         * Génère la structure HTML DSFR du sommaire.
         * @param {Array}  headings    - Tableau de { level, id, text }
         * @param {string} title       - Titre du sommaire
         * @param {string} titleId     - ID du titre pour aria-labelledby
         * @returns {string} HTML string
         */
        render: function(headings, title, titleId) {
            if (!headings || !headings.length) return '';

            var html = '<nav class="fr-summary" role="navigation" aria-labelledby="' + titleId + '">';
            html += '<p class="fr-summary__title" id="' + titleId + '">' + title + '</p>';
            html += '<ol class="fr-summary__list">';

            var inSubList = false;

            for (var i = 0; i < headings.length; i++) {
                var h = headings[i];
                var link = '<a class="fr-summary__link" href="#' + h.id + '">' + h.text + '</a>';

                if (h.level === 2) {
                    // Fermer une sous-liste ouverte
                    if (inSubList) {
                        html += '</ol></li>';
                        inSubList = false;
                    }
                    // Regarder si le h2 suivant est un h3 (pour ouvrir un sous-niveau)
                    var nextIsH3 = (i + 1 < headings.length && headings[i + 1].level === 3);
                    if (nextIsH3) {
                        html += '<li>' + link;
                        html += '<ol class="fr-summary__list">';
                        inSubList = true;
                    } else {
                        html += '<li>' + link + '</li>';
                    }
                } else if (h.level === 3) {
                    html += '<li>' + link + '</li>';
                }
            }

            // Fermer une sous-liste restée ouverte
            if (inSubList) {
                html += '</ol></li>';
            }

            html += '</ol></nav>';
            return html;
        },

        /**
         * Parcourt le DOM et génère les sommaires .dsfr-summary.
         */
        transform: function() {
            var items = document.querySelectorAll('.dsfr-summary');
            for (var i = 0; i < items.length; i++) {
                var el = items[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var title = el.getAttribute('data-title') || 'Sommaire';
                var depth = parseInt(el.getAttribute('data-depth') || '2', 10);

                _summaryCounter++;
                var titleId  = 'fr-summary-title-' + _summaryCounter;
                var headings = window.DsfrSummary.collectHeadings(depth);

                if (!headings.length) {
                    // Aucun titre trouvé : supprimer silencieusement le placeholder
                    el.parentNode.removeChild(el);
                    continue;
                }

                var html = window.DsfrSummary.render(headings, title, titleId);
                if (html) {
                    el.outerHTML = html;
                }
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Summary component initialized');
        }
    };

    $(function() {
        window.DsfrSummary.init();
    });

})();
