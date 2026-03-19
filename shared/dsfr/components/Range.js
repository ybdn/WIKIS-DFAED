/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Range.js]] */
(function() {
    // DSFR Range Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/curseur

    window.DsfrRange = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Range component initialized');
        }
    };

    $(function() {
        if (window.DsfrRange) {
            window.DsfrRange.init();
        }
    });
})();
