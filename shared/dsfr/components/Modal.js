/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Modal.js]] */
(function() {
    // DSFR Modal Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/modale

    window.DsfrModal = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Modal component initialized');
        }
    };

    $(function() {
        if (window.DsfrModal) {
            window.DsfrModal.init();
        }
    });
})();
