/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Connect.js]] */
(function() {
    // DSFR Connect Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/bouton-franceconnect

    window.DsfrConnect = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Connect component initialized');
        }
    };

    $(function() {
        if (window.DsfrConnect) {
            window.DsfrConnect.init();
        }
    });
})();
