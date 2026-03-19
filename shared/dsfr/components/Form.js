/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Form.js]] */
(function() {
    // DSFR Form Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/formulaire

    window.DsfrForm = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Form component initialized');
        }
    };

    $(function() {
        if (window.DsfrForm) {
            window.DsfrForm.init();
        }
    });
})();
