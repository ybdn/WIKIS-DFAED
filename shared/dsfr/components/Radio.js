/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Radio.js]] */
(function() {
    // DSFR Radio Component — Groupe de boutons radio
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/bouton-radio
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-radio-group"
    //        data-legend="Choisir une option"
    //        data-name="choix"
    //        data-error="Veuillez sélectionner une option">
    //     <div class="dsfr-radio" data-label="Option A" data-value="a"></div>
    //     <div class="dsfr-radio" data-label="Option B" data-value="b" data-checked="true"></div>
    //     <div class="dsfr-radio" data-label="Option C" data-value="c" data-hint="Aide sur C"></div>
    //   </div>
    //
    // Attributs de .dsfr-radio-group :
    //   data-legend   (optionnel)  Légende du fieldset
    //   data-name     (obligatoire) Attribut name partagé par tous les radios
    //   data-error    (optionnel)  Message d'erreur du groupe
    //   data-valid    (optionnel)  Message de validation du groupe
    //   data-inline   (optionnel)  "true" → fr-fieldset--inline (disposition horizontale)
    //
    // Attributs de chaque .dsfr-radio :
    //   data-label    (obligatoire) Libellé
    //   data-value    (optionnel)  Valeur (défaut : index)
    //   data-hint     (optionnel)  Texte d'aide sous le label
    //   data-checked  (optionnel)  "true" → sélectionné par défaut
    //   data-disabled (optionnel)  "true" → désactivé

    var _counter = 0;

    window.DsfrRadio = {

        transform: function() {
            var groups = document.querySelectorAll('.dsfr-radio-group');
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];
                if (group.getAttribute('data-dsfr-transformed') === 'true') continue;

                _counter++;
                var groupId = 'radio-group-dsfr-' + _counter;
                var msgId   = 'msg-' + groupId;

                var legend  = group.getAttribute('data-legend') || '';
                var name    = group.getAttribute('data-name')   || groupId;
                var error   = group.getAttribute('data-error')  || '';
                var valid   = group.getAttribute('data-valid')  || '';
                var inline  = group.getAttribute('data-inline') === 'true';

                var radios = group.querySelectorAll('.dsfr-radio');
                if (!radios.length) continue;

                // Légende
                var legendHtml = '';
                if (legend) {
                    legendHtml = '<legend class="fr-fieldset__legend fr-text--regular">' + legend + '</legend>';
                }

                // Items radio
                var itemsHtml = '';
                for (var j = 0; j < radios.length; j++) {
                    var radio    = radios[j];
                    var radioId  = 'radio-dsfr-' + _counter + '-' + j;
                    var hintId   = 'hint-' + radioId;

                    var rLabel    = radio.getAttribute('data-label')    || ('Option ' + (j + 1));
                    var rValue    = radio.getAttribute('data-value')    || String(j);
                    var rHint     = radio.getAttribute('data-hint')     || '';
                    var rChecked  = radio.getAttribute('data-checked')  === 'true';
                    var rDisabled = radio.getAttribute('data-disabled') === 'true';

                    var inputAttrs = 'type="radio" id="' + radioId + '" name="' + name + '" value="' + rValue + '"';
                    if (rChecked)  inputAttrs += ' checked';
                    if (rDisabled) inputAttrs += ' disabled';
                    if (rHint)     inputAttrs += ' aria-describedby="' + hintId + '"';

                    var labelHtml = '<label class="fr-label" for="' + radioId + '">' + rLabel;
                    if (rHint) labelHtml += '<span class="fr-hint-text" id="' + hintId + '">' + rHint + '</span>';
                    labelHtml += '</label>';

                    itemsHtml +=
                        '<div class="fr-radio-group">' +
                            '<input ' + inputAttrs + '>' +
                            labelHtml +
                        '</div>';
                }

                // Message
                var messageHtml = '';
                if (error) messageHtml = '<p class="fr-error-text" id="' + msgId + '">' + error + '</p>';
                if (valid) messageHtml = '<p class="fr-valid-text" id="' + msgId + '">' + valid + '</p>';

                // Fieldset classes
                var cls = 'fr-fieldset';
                if (error)  cls += ' fr-fieldset--error';
                if (valid)  cls += ' fr-fieldset--valid';
                if (inline) cls += ' fr-fieldset--inline';

                group.outerHTML =
                    '<fieldset class="' + cls + '" id="' + groupId + '" data-dsfr-transformed="true">' +
                        legendHtml +
                        '<div class="fr-fieldset__content">' + itemsHtml + '</div>' +
                        messageHtml +
                    '</fieldset>';
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Radio component initialized');
        }
    };

    $(function() {
        window.DsfrRadio.init();
    });

})();
