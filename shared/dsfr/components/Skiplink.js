/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Skiplink.js]] */
(function() {
    // DSFR Skiplink Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/liens-d-evitement

    window.DsfrSkiplink = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Skiplink component initialized');
        }
    };

    $(function() {
        if (window.DsfrSkiplink) {
            window.DsfrSkiplink.init();
        }
    });
})();
