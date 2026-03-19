/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Navigation.js]] */
(function() {
    // DSFR Navigation Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/navigation-principale

    window.DsfrNavigation = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Navigation component initialized');
        }
    };

    $(function() {
        if (window.DsfrNavigation) {
            window.DsfrNavigation.init();
        }
    });
})();
