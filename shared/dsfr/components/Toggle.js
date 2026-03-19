/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Toggle.js]] */
(function() {
    // DSFR Toggle Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/interrupteur

    window.DsfrToggle = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Toggle component initialized');
        }
    };

    $(function() {
        if (window.DsfrToggle) {
            window.DsfrToggle.init();
        }
    });
})();
