/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Pagination.js]] */
(function() {
    // DSFR Pagination Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/pagination

    window.DsfrPagination = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Pagination component initialized');
        }
    };

    $(function() {
        if (window.DsfrPagination) {
            window.DsfrPagination.init();
        }
    });
})();
