/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Search.js]] */
(function() {
    // DSFR Search Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/barre-de-recherche

    window.DsfrSearch = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Search component initialized');
        }
    };

    $(function() {
        if (window.DsfrSearch) {
            window.DsfrSearch.init();
        }
    });
})();
