/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Logo.js]] */
(function() {
    // DSFR Logo Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/bloc-marque

    window.DsfrLogo = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Logo component initialized');
        }
    };

    $(function() {
        if (window.DsfrLogo) {
            window.DsfrLogo.init();
        }
    });
})();
