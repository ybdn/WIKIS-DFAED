/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Composition.js]] */
(function() {
    // DSFR Composition Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/zone-d-expression-visuelle

    window.DsfrComposition = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Composition component initialized');
        }
    };

    $(function() {
        if (window.DsfrComposition) {
            window.DsfrComposition.init();
        }
    });
})();
