/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Highlight.js]] */
(function() {
    // DSFR Highlight Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/mise-en-exergue

    window.DsfrHighlight = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Highlight component initialized');
        }
    };

    $(function() {
        if (window.DsfrHighlight) {
            window.DsfrHighlight.init();
        }
    });
})();
