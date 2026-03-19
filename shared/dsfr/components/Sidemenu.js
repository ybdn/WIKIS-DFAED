/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Sidemenu.js]] */
(function() {
    // DSFR Sidemenu Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/menu-lateral

    window.DsfrSidemenu = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Sidemenu component initialized');
        }
    };

    $(function() {
        if (window.DsfrSidemenu) {
            window.DsfrSidemenu.init();
        }
    });
})();
