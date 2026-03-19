/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Checkbox.js]] */
(function() {
    // DSFR Checkbox Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/case-a-cocher

    window.DsfrCheckbox = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Checkbox component initialized');
        }
    };

    $(function() {
        if (window.DsfrCheckbox) {
            window.DsfrCheckbox.init();
        }
    });
})();
