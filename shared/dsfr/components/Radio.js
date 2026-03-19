/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Radio.js]] */
(function() {
    // DSFR Radio Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/bouton-radio

    window.DsfrRadio = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Radio component initialized');
        }
    };

    $(function() {
        if (window.DsfrRadio) {
            window.DsfrRadio.init();
        }
    });
})();
