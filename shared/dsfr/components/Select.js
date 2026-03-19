/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Select.js]] */
(function() {
    // DSFR Select Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/liste-deroulante

    window.DsfrSelect = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Select component initialized');
        }
    };

    $(function() {
        if (window.DsfrSelect) {
            window.DsfrSelect.init();
        }
    });
})();
