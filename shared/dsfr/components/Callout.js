/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Callout.js]] */
(function() {
    // DSFR Callout Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/mise-en-avant

    window.DsfrCallout = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Callout component initialized');
        }
    };

    $(function() {
        if (window.DsfrCallout) {
            window.DsfrCallout.init();
        }
    });
})();
