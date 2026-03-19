/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Share.js]] */
(function() {
    // DSFR Share Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/partage

    window.DsfrShare = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Share component initialized');
        }
    };

    $(function() {
        if (window.DsfrShare) {
            window.DsfrShare.init();
        }
    });
})();
