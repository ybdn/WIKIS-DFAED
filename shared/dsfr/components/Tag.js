/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tag.js]] */
(function() {
    // DSFR Tag Component — Étiquette
    // Documentation : https://www.systeme-de-design.gouv.fr/composants/tag
    //
    // À distinguer du Badge (indicateur numérique) — le Tag est une étiquette de catégorisation.
    //
    // Usage dans le Wikitext :
    //
    //   Tag simple :
    //   <span data-dsfr-tag>Étiquette</span>
    //
    //   Tag avec icône :
    //   <span data-dsfr-tag data-icon="fr-icon-check-line">Validé</span>
    //
    //   Tag petit :
    //   <span data-dsfr-tag data-size="sm">Petit</span>
    //
    //   Groupe de tags :
    //   <span class="dsfr-tags-group">
    //     <span data-dsfr-tag>Tag 1</span>
    //     <span data-dsfr-tag data-icon="fr-icon-alert-line">Tag 2</span>
    //   </span>
    //
    // Attributs :
    //   data-dsfr-tag   (présence seule)  Déclare l'élément comme un tag DSFR
    //   data-icon       (optionnel)       Classe d'icône DSFR (ex: "fr-icon-check-line")
    //                                     L'icône s'affiche à gauche du texte.
    //   data-size       (optionnel)       "sm" — taille réduite (fr-tag--sm)

    window.DsfrTag = {

        /**
         * Génère le HTML d'un tag DSFR.
         * @param {string} text         - Texte du tag
         * @param {string} [icon]       - Classe d'icône DSFR
         * @param {string} [size]       - "sm" pour petit
         * @returns {string} HTML string
         */
        render: function(text, icon, size) {
            if (!text) return '';

            var cls = 'fr-tag';
            if (icon) cls += ' fr-tag--icon-left ' + icon;
            if (size === 'sm') cls += ' fr-tag--sm';

            return '<p class="' + cls + '">' + text + '</p>';
        },

        /**
         * Transforme les éléments [data-dsfr-tag] en tags DSFR.
         */
        transformTags: function() {
            var items = document.querySelectorAll('[data-dsfr-tag]');
            for (var i = 0; i < items.length; i++) {
                var el = items[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                // Si cet élément est un enfant direct d'un dsfr-tags-group,
                // il sera traité lors de la transformation du groupe.
                if (el.parentNode &&
                    el.parentNode.className &&
                    el.parentNode.className.indexOf('dsfr-tags-group') !== -1) continue;

                var text = el.textContent || el.innerText || '';
                var icon = el.getAttribute('data-icon') || '';
                var size = el.getAttribute('data-size') || '';

                var html = window.DsfrTag.render(text, icon, size);
                if (html) {
                    el.outerHTML = html;
                }
            }
        },

        /**
         * Transforme les groupes .dsfr-tags-group en fr-tags-group.
         */
        transformGroups: function() {
            var groups = document.querySelectorAll('.dsfr-tags-group');
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];
                if (group.getAttribute('data-dsfr-transformed') === 'true') continue;
                group.setAttribute('data-dsfr-transformed', 'true');

                var tagEls = group.querySelectorAll('[data-dsfr-tag]');
                if (!tagEls.length) continue;

                var listHtml = '<ul class="fr-tags-group">';
                for (var j = 0; j < tagEls.length; j++) {
                    var el   = tagEls[j];
                    var text = el.textContent || el.innerText || '';
                    var icon = el.getAttribute('data-icon') || '';
                    var size = el.getAttribute('data-size') || '';
                    listHtml += '<li>' + window.DsfrTag.render(text, icon, size) + '</li>';
                }
                listHtml += '</ul>';

                group.outerHTML = listHtml;
            }
        },

        transform: function() {
            // Les groupes en premier pour éviter les conflits
            this.transformGroups();
            this.transformTags();
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Tag component initialized');
        }
    };

    $(function() {
        window.DsfrTag.init();
    });

})();
