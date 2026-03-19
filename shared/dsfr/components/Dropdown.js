/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Dropdown.js]] */
(function() {
    // DSFR Dropdown Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/menu-deroulant

    window.DsfrDropdown = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Dropdown component initialized');
        }
    };

    $(function() {
        if (window.DsfrDropdown) {
            window.DsfrDropdown.init();
        }
    });
})();
