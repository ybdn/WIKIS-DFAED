/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Select.js]] */
(function() {
    // DSFR Select Component — Liste déroulante
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/liste-deroulante
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-select"
    //        data-label="Statut"
    //        data-name="statut"
    //        data-hint="Choisir un statut"
    //        data-options="Option A|val-a,Option B|val-b,Option C|val-c">
    //   </div>
    //
    // Ou avec placeholder au lieu d'une option vide :
    //   <div class="dsfr-select" data-label="..." data-placeholder="Sélectionner..." data-options="...">
    //
    // Attributs :
    //   data-label        (obligatoire) Libellé du select
    //   data-name         (optionnel)  Attribut name du <select>
    //   data-hint         (optionnel)  Texte d'aide sous le label
    //   data-placeholder  (optionnel)  Option vide initiale (défaut : "Sélectionner une option")
    //   data-options      (obligatoire) "Label1|valeur1,Label2|valeur2" — si valeur omise, label = valeur
    //   data-value        (optionnel)  Valeur sélectionnée par défaut
    //   data-error        (optionnel)  Message d'erreur
    //   data-valid        (optionnel)  Message de validation
    //   data-required     (optionnel)  "true" → champ obligatoire
    //   data-disabled     (optionnel)  "true" → champ désactivé

    var _counter = 0;

    window.DsfrSelect = {

        transform: function() {
            var els = document.querySelectorAll('.dsfr-select');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                _counter++;
                var selectId = 'select-dsfr-' + _counter;
                var hintId   = 'hint-' + selectId;
                var msgId    = 'msg-' + selectId;

                var label       = el.getAttribute('data-label')       || 'Sélection';
                var name        = el.getAttribute('data-name')        || selectId;
                var hint        = el.getAttribute('data-hint')        || '';
                var placeholder = el.getAttribute('data-placeholder') || 'Sélectionner une option';
                var optionsRaw  = el.getAttribute('data-options')     || '';
                var defaultVal  = el.getAttribute('data-value')       || '';
                var error       = el.getAttribute('data-error')       || '';
                var valid       = el.getAttribute('data-valid')       || '';
                var required    = el.getAttribute('data-required')    === 'true';
                var disabled    = el.getAttribute('data-disabled')    === 'true';

                // État du groupe
                var groupCls = 'fr-select-group';
                if (error) groupCls += ' fr-select-group--error';
                if (valid) groupCls += ' fr-select-group--valid';

                // Label
                var labelHtml = '<label class="fr-label" for="' + selectId + '">' + label;
                if (hint) labelHtml += ' <span class="fr-hint-text" id="' + hintId + '">' + hint + '</span>';
                labelHtml += '</label>';

                // Select attrs
                var selectCls = 'fr-select';
                if (error) selectCls += ' fr-select--error';
                if (valid) selectCls += ' fr-select--valid';

                var selectAttrs = 'class="' + selectCls + '" id="' + selectId + '" name="' + name + '"';
                if (required) selectAttrs += ' required';
                if (disabled) selectAttrs += ' disabled';

                // Options
                var optionsHtml = '<option value="" selected disabled hidden>' + placeholder + '</option>';
                if (optionsRaw) {
                    var pairs = optionsRaw.split(',');
                    for (var j = 0; j < pairs.length; j++) {
                        var pair   = pairs[j].split('|');
                        var oLabel = pair[0] ? pair[0].trim() : '';
                        var oVal   = pair[1] ? pair[1].trim() : oLabel;
                        if (!oLabel) continue;
                        var selectedAttr = (oVal === defaultVal) ? ' selected' : '';
                        optionsHtml += '<option value="' + oVal + '"' + selectedAttr + '>' + oLabel + '</option>';
                    }
                }

                // Message
                var messageHtml = '';
                if (error) {
                    messageHtml = '<p class="fr-error-text" id="' + msgId + '">' + error + '</p>';
                } else if (valid) {
                    messageHtml = '<p class="fr-valid-text" id="' + msgId + '">' + valid + '</p>';
                }

                el.outerHTML =
                    '<div class="' + groupCls + '" data-dsfr-transformed="true">' +
                        labelHtml +
                        '<select ' + selectAttrs + '>' + optionsHtml + '</select>' +
                        messageHtml +
                    '</div>';
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Select component initialized');
        }
    };

    $(function() {
        window.DsfrSelect.init();
    });

})();
