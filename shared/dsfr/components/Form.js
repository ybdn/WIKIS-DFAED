/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Form.js]] */
(function() {
    // DSFR Form Component — Groupe de champs (fieldset DSFR)
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/formulaire
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-form-group" data-legend="Informations personnelles">
    //     ... champs DSFR (dsfr-input, dsfr-checkbox, dsfr-radio-group...) ...
    //   </div>
    //
    // Attributs du conteneur :
    //   data-legend    (optionnel) Légende du fieldset
    //   data-hint      (optionnel) Texte d'aide sous la légende
    //   data-error     (optionnel) Message d'erreur global du groupe
    //   data-valid     (optionnel) Message de succès global du groupe

    window.DsfrForm = {

        transform: function() {
            var els = document.querySelectorAll('.dsfr-form-group');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var legend = el.getAttribute('data-legend') || '';
                var hint   = el.getAttribute('data-hint')   || '';
                var error  = el.getAttribute('data-error')  || '';
                var valid  = el.getAttribute('data-valid')  || '';
                var inner  = el.innerHTML;

                var cls = 'fr-fieldset';
                if (error) cls += ' fr-fieldset--error';
                if (valid) cls += ' fr-fieldset--valid';

                var legendHtml = '';
                if (legend) {
                    legendHtml = '<legend class="fr-fieldset__legend fr-text--regular">' + legend;
                    if (hint) legendHtml += '<span class="fr-hint-text">' + hint + '</span>';
                    legendHtml += '</legend>';
                }

                var messageHtml = '';
                if (error) {
                    messageHtml += '<p class="fr-error-text">' + error + '</p>';
                } else if (valid) {
                    messageHtml += '<p class="fr-valid-text">' + valid + '</p>';
                }

                var html =
                    '<fieldset class="' + cls + '" data-dsfr-transformed="true">' +
                        legendHtml +
                        '<div class="fr-fieldset__content">' + inner + '</div>' +
                        messageHtml +
                    '</fieldset>';

                el.outerHTML = html;
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Form component initialized');
        }
    };

    $(function() {
        window.DsfrForm.init();
    });

})();
