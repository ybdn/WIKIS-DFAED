/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Follow.js]] */
(function() {
    // DSFR Follow Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/lettre-d-information-et-reseaux-sociaux

    window.DsfrFollow = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Follow component initialized');
        }
    };

    $(function() {
        if (window.DsfrFollow) {
            window.DsfrFollow.init();
        }
    });
})();
