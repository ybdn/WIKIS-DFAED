/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Segmented.js]] */
(function() {
    // DSFR Segmented Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/controle-segmente

    window.DsfrSegmented = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Segmented component initialized');
        }
    };

    $(function() {
        if (window.DsfrSegmented) {
            window.DsfrSegmented.init();
        }
    });
})();
