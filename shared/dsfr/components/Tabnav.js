/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tabnav.js]] */
(function() {
    // DSFR Tabnav Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/navigation-tertiaire

    window.DsfrTabnav = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Tabnav component initialized');
        }
    };

    $(function() {
        if (window.DsfrTabnav) {
            window.DsfrTabnav.init();
        }
    });
})();
