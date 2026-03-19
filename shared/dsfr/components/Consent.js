/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Consent.js]] */
(function() {
    // DSFR Consent Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/gestionnaire-de-consentement

    window.DsfrConsent = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Consent component initialized');
        }
    };

    $(function() {
        if (window.DsfrConsent) {
            window.DsfrConsent.init();
        }
    });
})();
