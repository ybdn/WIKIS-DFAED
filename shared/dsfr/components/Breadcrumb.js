/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Breadcrumb.js]] */
(function() {
    // DSFR Breadcrumb Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/fil-d-ariane

    window.DsfrBreadcrumb = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Breadcrumb component initialized');
        }
    };

    $(function() {
        if (window.DsfrBreadcrumb) {
            window.DsfrBreadcrumb.init();
        }
    });
})();
