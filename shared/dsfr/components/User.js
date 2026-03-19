/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/User.js]] */
(function() {
    // DSFR User Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/en-tete-connectee

    window.DsfrUser = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] User component initialized');
        }
    };

    $(function() {
        if (window.DsfrUser) {
            window.DsfrUser.init();
        }
    });
})();
