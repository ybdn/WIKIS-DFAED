/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Link.js]] */
(function() {
    // DSFR Link Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/lien

    window.DsfrLink = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Link component initialized');
        }
    };

    $(function() {
        if (window.DsfrLink) {
            window.DsfrLink.init();
        }
    });
})();
