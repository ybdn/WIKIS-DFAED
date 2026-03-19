/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Button.js]] */
(function() {
    // DSFR Button Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/bouton

    window.DsfrButton = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Button component initialized');
        }
    };

    $(function() {
        if (window.DsfrButton) {
            window.DsfrButton.init();
        }
    });
})();
