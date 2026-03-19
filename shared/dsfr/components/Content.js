/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Content.js]] */
(function() {
    // DSFR Content Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/contenu-medias

    window.DsfrContent = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Content component initialized');
        }
    };

    $(function() {
        if (window.DsfrContent) {
            window.DsfrContent.init();
        }
    });
})();
