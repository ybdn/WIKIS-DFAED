/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Input.js]] */
(function() {
    // DSFR Input Component — Champ de saisie avec label, hint, erreur
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/champ-de-saisie
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-input"
    //        data-label="Nom"
    //        data-name="nom"
    //        data-placeholder="Votre nom..."
    //        data-hint="Format : Prénom NOM"
    //        data-required="true">
    //   </div>
    //
    // Attributs :
    //   data-label        (obligatoire) Libellé du champ
    //   data-name         (optionnel)  Attribut name du <input>
    //   data-type         (optionnel)  Type HTML (défaut : "text") — text | email | tel | url | number | date | textarea
    //   data-placeholder  (optionnel)  Texte de remplacement
    //   data-hint         (optionnel)  Texte d'aide sous le label
    //   data-value        (optionnel)  Valeur initiale
    //   data-error        (optionnel)  Message d'erreur (active l'état erreur)
    //   data-valid        (optionnel)  Message de validation (active l'état succès)
    //   data-required     (optionnel)  "true" → champ obligatoire
    //   data-disabled     (optionnel)  "true" → champ désactivé
    //   data-rows         (optionnel)  Nombre de lignes pour textarea (défaut : 5)

    var _counter = 0;

    window.DsfrInput = {

        transform: function() {
            var els = document.querySelectorAll('.dsfr-input');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                _counter++;
                var inputId = 'input-dsfr-' + _counter;
                var hintId  = 'hint-' + inputId;
                var msgId   = 'msg-' + inputId;

                var label       = el.getAttribute('data-label')       || 'Champ';
                var name        = el.getAttribute('data-name')        || inputId;
                var type        = el.getAttribute('data-type')        || 'text';
                var placeholder = el.getAttribute('data-placeholder') || '';
                var hint        = el.getAttribute('data-hint')        || '';
                var value       = el.getAttribute('data-value')       || '';
                var error       = el.getAttribute('data-error')       || '';
                var valid       = el.getAttribute('data-valid')       || '';
                var required    = el.getAttribute('data-required')    === 'true';
                var disabled    = el.getAttribute('data-disabled')    === 'true';
                var rows        = el.getAttribute('data-rows')        || '5';

                // État du groupe
                var groupCls = 'fr-input-group';
                if (error) groupCls += ' fr-input-group--error';
                if (valid) groupCls += ' fr-input-group--valid';

                // Label
                var labelHtml = '<label class="fr-label" for="' + inputId + '">' + label;
                if (hint) labelHtml += ' <span class="fr-hint-text" id="' + hintId + '">' + hint + '</span>';
                labelHtml += '</label>';

                // Attributs du champ
                var inputCls   = 'fr-input';
                if (error) inputCls += ' fr-input--error';
                if (valid) inputCls += ' fr-input--valid';

                var inputAttrs = 'class="' + inputCls + '"' +
                    ' id="' + inputId + '"' +
                    ' name="' + name + '"';
                if (placeholder) inputAttrs += ' placeholder="' + placeholder + '"';
                if (required)    inputAttrs += ' required';
                if (disabled)    inputAttrs += ' disabled';
                if (hint)        inputAttrs += ' aria-describedby="' + hintId + '"';
                if (error || valid) inputAttrs += ' aria-describedby="' + (hint ? hintId + ' ' : '') + msgId + '"';

                // Champ
                var fieldHtml;
                if (type === 'textarea') {
                    fieldHtml = '<textarea ' + inputAttrs + ' rows="' + rows + '">' + value + '</textarea>';
                } else {
                    fieldHtml = '<input type="' + type + '" ' + inputAttrs;
                    if (value) fieldHtml += ' value="' + value + '"';
                    fieldHtml += '>';
                }

                // Message erreur/succès
                var messageHtml = '';
                if (error) {
                    messageHtml = '<p class="fr-error-text" id="' + msgId + '">' + error + '</p>';
                } else if (valid) {
                    messageHtml = '<p class="fr-valid-text" id="' + msgId + '">' + valid + '</p>';
                }

                el.outerHTML =
                    '<div class="' + groupCls + '" data-dsfr-transformed="true">' +
                        labelHtml +
                        fieldHtml +
                        messageHtml +
                    '</div>';
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Input component initialized');
        }
    };

    $(function() {
        window.DsfrInput.init();
    });

})();
