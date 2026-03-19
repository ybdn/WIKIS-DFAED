/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Transcription.js]] */
(function() {
    // DSFR Transcription Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/transcription

    window.DsfrTranscription = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Transcription component initialized');
        }
    };

    $(function() {
        if (window.DsfrTranscription) {
            window.DsfrTranscription.init();
        }
    });
})();
