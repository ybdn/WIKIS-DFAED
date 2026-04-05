/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Table.js]] */
(function() {
    // DSFR Table Component — Tableau
    // Documentation : https://www.systeme-de-design.gouv.fr/composants/tableau
    //
    // Mode 1 — Automatique : les tableaux MediaWiki (.wikitable) sont wrappés dans fr-table.
    //
    // Mode 2 — Explicite (markup wikitext) :
    //   <div class="dsfr-table"
    //        data-caption="Titre du tableau"
    //        data-scrollable>
    //     {| ... |}  ← le tableau wiki doit être à l'intérieur
    //   </div>
    //
    // Attributs (mode 2) :
    //   data-caption      (optionnel)  Titre du tableau (légende <caption>)
    //   data-scrollable   (optionnel)  Active le défilement horizontal (attribut seul, sans valeur)
    //   data-no-caption   (optionnel)  Masque visuellement la légende (fr-table--no-caption)

    window.DsfrTable = {

        /**
         * Wrape un élément <table> dans la structure fr-table.
         * @param {HTMLElement} table - L'élément <table> à transformer
         * @param {string} [caption]  - Texte de légende à injecter
         * @param {boolean} [scrollable]
         * @param {boolean} [noCaption]
         */
        wrapTable: function(table, caption, scrollable, noCaption) {
            if (table.getAttribute('data-dsfr-transformed') === 'true') return;
            table.setAttribute('data-dsfr-transformed', 'true');

            // Injecter ou mettre à jour la légende
            if (caption) {
                var existingCaption = table.querySelector('caption');
                if (existingCaption) {
                    existingCaption.textContent = caption;
                } else {
                    var capEl = document.createElement('caption');
                    capEl.textContent = caption;
                    table.insertBefore(capEl, table.firstChild);
                }
            }

            // Créer le wrapper fr-table
            var wrapper = document.createElement('div');
            var cls = 'fr-table';
            if (scrollable) cls += ' fr-table--scroll';
            if (noCaption)  cls += ' fr-table--no-caption';
            wrapper.className = cls;

            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        },

        /**
         * Mode 1 : applique fr-table aux .wikitable existants dans .mw-parser-output
         */
        transformWikitables: function() {
            var content = document.querySelector('.mw-parser-output');
            if (!content) return;

            var tables = content.querySelectorAll('table.wikitable');
            for (var i = 0; i < tables.length; i++) {
                var table = tables[i];
                // Ne pas re-transformer et ne pas toucher aux tables déjà wrappées
                if (table.getAttribute('data-dsfr-transformed') === 'true') continue;
                if (table.parentNode && table.parentNode.className &&
                    (table.parentNode.className.indexOf('fr-table') !== -1 ||
                     table.parentNode.className.indexOf('dsfr-table') !== -1)) continue;

                window.DsfrTable.wrapTable(table, null, false, false);
            }
        },

        /**
         * Mode 2 : transforme les éléments .dsfr-table explicites
         */
        transformExplicit: function() {
            var wrappers = document.querySelectorAll('.dsfr-table');
            for (var i = 0; i < wrappers.length; i++) {
                var el = wrappers[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;
                el.setAttribute('data-dsfr-transformed', 'true');

                var caption    = el.getAttribute('data-caption') || null;
                var scrollable = el.hasAttribute('data-scrollable');
                var noCaption  = el.hasAttribute('data-no-caption');

                var table = el.querySelector('table');
                if (!table) continue;

                // Détacher la table du wrapper .dsfr-table et reconstruire
                var cls = 'fr-table';
                if (scrollable) cls += ' fr-table--scroll';
                if (noCaption)  cls += ' fr-table--no-caption';
                el.className = cls;

                if (caption) {
                    var existingCaption = table.querySelector('caption');
                    if (existingCaption) {
                        existingCaption.textContent = caption;
                    } else {
                        var capEl = document.createElement('caption');
                        capEl.textContent = caption;
                        table.insertBefore(capEl, table.firstChild);
                    }
                }

                table.setAttribute('data-dsfr-transformed', 'true');
            }
        },

        transform: function() {
            // transformExplicit en premier : les .dsfr-table sont traités avant
            // que transformWikitables ne tente de wraper leurs tables enfants.
            this.transformExplicit();
            this.transformWikitables();
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Table component initialized');
        }
    };

    $(function() {
        window.DsfrTable.init();
    });

})();
