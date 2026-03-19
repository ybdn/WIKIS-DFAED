/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Input.js]] */
(function() {
    // DSFR Input Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/champ-de-saisie

    window.DsfrInput = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Input component initialized');
        }
    };

    $(function() {
        if (window.DsfrInput) {
            window.DsfrInput.init();
        }
    });
})();
