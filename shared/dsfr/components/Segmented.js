/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Segmented.js]] */
(function() {
    // DSFR Segmented Component — Contrôle segmenté (choix exclusif visuel)
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/controle-segmente
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-segmented"
    //        data-legend="Mode d'affichage"
    //        data-name="mode"
    //        data-no-legend="true">
    //     <div class="dsfr-segment" data-label="Liste" data-value="list" data-icon="fr-icon-list-unordered" data-active="true"></div>
    //     <div class="dsfr-segment" data-label="Grille" data-value="grid" data-icon="fr-icon-layout-grid-line"></div>
    //     <div class="dsfr-segment" data-label="Carte" data-value="map" data-icon="fr-icon-map-pin-2-line"></div>
    //   </div>
    //
    // Attributs du conteneur (.dsfr-segmented) :
    //   data-legend     (optionnel)  Légende du groupe
    //   data-name       (obligatoire) Attribut name commun
    //   data-no-legend  (optionnel)  "true" → masquer visuellement la légende (fr-segmented__legend--no-legend)
    //   data-size       (optionnel)  "sm" → fr-segmented--sm
    //
    // Attributs de chaque .dsfr-segment :
    //   data-label    (obligatoire) Texte du segment
    //   data-value    (optionnel)  Valeur radio (défaut : index)
    //   data-icon     (optionnel)  Classe d'icône DSFR (ex: "fr-icon-list-unordered")
    //   data-active   (optionnel)  "true" → segment actif par défaut
    //   data-disabled (optionnel)  "true" → désactivé

    var _counter = 0;

    window.DsfrSegmented = {

        transform: function() {
            var containers = document.querySelectorAll('.dsfr-segmented');
            for (var i = 0; i < containers.length; i++) {
                var el = containers[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                _counter++;
                var groupId = 'segmented-dsfr-' + _counter;

                var legend   = el.getAttribute('data-legend')    || '';
                var name     = el.getAttribute('data-name')      || groupId;
                var noLegend = el.getAttribute('data-no-legend') === 'true';
                var size     = el.getAttribute('data-size')      || '';

                var segments = el.querySelectorAll('.dsfr-segment');
                if (!segments.length) continue;

                // Légende
                var legendCls = 'fr-segmented__legend';
                if (noLegend) legendCls += ' fr-segmented__legend--no-legend';
                var legendHtml = '<legend class="' + legendCls + '">' + (legend || name) + '</legend>';

                // Éléments
                var elementsHtml = '';
                for (var j = 0; j < segments.length; j++) {
                    var seg      = segments[j];
                    var segId    = groupId + '-' + j;
                    var sLabel   = seg.getAttribute('data-label')    || ('Option ' + (j + 1));
                    var sValue   = seg.getAttribute('data-value')    || String(j);
                    var sIcon    = seg.getAttribute('data-icon')     || '';
                    var sActive  = seg.getAttribute('data-active')   === 'true';
                    var sDisabled = seg.getAttribute('data-disabled') === 'true';

                    var inputAttrs = 'type="radio" id="' + segId + '" name="' + name + '" value="' + sValue + '"';
                    if (sActive)   inputAttrs += ' checked';
                    if (sDisabled) inputAttrs += ' disabled';

                    var labelCls = 'fr-label';
                    if (sIcon) labelCls += ' ' + sIcon;

                    elementsHtml +=
                        '<div class="fr-segmented__element">' +
                            '<input ' + inputAttrs + '>' +
                            '<label class="' + labelCls + '" for="' + segId + '">' + sLabel + '</label>' +
                        '</div>';
                }

                // Container classes
                var cls = 'fr-segmented';
                if (size) cls += ' fr-segmented--' + size;

                el.outerHTML =
                    '<fieldset class="' + cls + '" data-dsfr-transformed="true">' +
                        legendHtml +
                        '<div class="fr-segmented__elements">' + elementsHtml + '</div>' +
                    '</fieldset>';
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Segmented component initialized');
        }
    };

    $(function() {
        window.DsfrSegmented.init();
    });

})();
