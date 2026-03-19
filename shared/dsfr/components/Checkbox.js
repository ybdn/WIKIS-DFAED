/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Checkbox.js]] */
(function() {
    // DSFR Checkbox Component — Case à cocher (seule ou en groupe)
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/case-a-cocher
    //
    // === Checkbox seule ===
    //   <div class="dsfr-checkbox"
    //        data-label="J'accepte les conditions"
    //        data-name="accept"
    //        data-value="oui"
    //        data-hint="Texte d'aide"
    //        data-checked="true">
    //   </div>
    //
    // === Groupe de cases à cocher ===
    //   <div class="dsfr-checkbox-group" data-legend="Vos choix" data-name="choix">
    //     <div class="dsfr-checkbox" data-label="Option A" data-value="a"></div>
    //     <div class="dsfr-checkbox" data-label="Option B" data-value="b" data-checked="true"></div>
    //   </div>
    //
    // Attributs de .dsfr-checkbox :
    //   data-label    (obligatoire) Libellé
    //   data-name     (optionnel si dans un groupe)
    //   data-value    (optionnel)  Valeur (défaut : "on")
    //   data-hint     (optionnel)  Texte d'aide sous le label
    //   data-checked  (optionnel)  "true" → coché par défaut
    //   data-disabled (optionnel)  "true" → désactivé
    //   data-error    (optionnel)  Message d'erreur (sur .dsfr-checkbox seul uniquement)
    //
    // Attributs de .dsfr-checkbox-group :
    //   data-legend   (optionnel)  Légende du groupe
    //   data-name     (optionnel)  Attribut name commun à toutes les cases
    //   data-error    (optionnel)  Message d'erreur du groupe
    //   data-valid    (optionnel)  Message de validation du groupe

    var _counter = 0;

    function _buildCheckbox(el, nameOverride) {
        _counter++;
        var cbId  = 'checkbox-dsfr-' + _counter;
        var hintId = 'hint-' + cbId;

        var label    = el.getAttribute('data-label')    || 'Option';
        var name     = nameOverride || el.getAttribute('data-name') || cbId;
        var value    = el.getAttribute('data-value')    || 'on';
        var hint     = el.getAttribute('data-hint')     || '';
        var checked  = el.getAttribute('data-checked')  === 'true';
        var disabled = el.getAttribute('data-disabled') === 'true';

        var inputAttrs = 'type="checkbox" id="' + cbId + '" name="' + name + '" value="' + value + '"';
        if (checked)  inputAttrs += ' checked';
        if (disabled) inputAttrs += ' disabled';
        if (hint)     inputAttrs += ' aria-describedby="' + hintId + '"';

        var labelHtml = '<label class="fr-label" for="' + cbId + '">' + label;
        if (hint) labelHtml += '<span class="fr-hint-text" id="' + hintId + '">' + hint + '</span>';
        labelHtml += '</label>';

        return '<div class="fr-checkbox-group">' +
            '<input ' + inputAttrs + '>' +
            labelHtml +
        '</div>';
    }

    window.DsfrCheckbox = {

        transform: function() {
            // 1. Transformer les groupes
            var groups = document.querySelectorAll('.dsfr-checkbox-group');
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];
                if (group.getAttribute('data-dsfr-transformed') === 'true') continue;

                var legend   = group.getAttribute('data-legend') || '';
                var nameGrp  = group.getAttribute('data-name')   || '';
                var error    = group.getAttribute('data-error')  || '';
                var valid    = group.getAttribute('data-valid')  || '';

                var legendHtml = '';
                if (legend) {
                    legendHtml = '<legend class="fr-fieldset__legend fr-text--regular">' + legend + '</legend>';
                }

                var items = group.querySelectorAll('.dsfr-checkbox');
                var itemsHtml = '';
                for (var j = 0; j < items.length; j++) {
                    itemsHtml += _buildCheckbox(items[j], nameGrp);
                }

                var messageHtml = '';
                if (error) messageHtml = '<p class="fr-error-text">' + error + '</p>';
                if (valid) messageHtml = '<p class="fr-valid-text">' + valid + '</p>';

                var cls = 'fr-fieldset' + (error ? ' fr-fieldset--error' : '') + (valid ? ' fr-fieldset--valid' : '');

                group.outerHTML =
                    '<fieldset class="' + cls + '" data-dsfr-transformed="true">' +
                        legendHtml +
                        '<div class="fr-fieldset__content">' + itemsHtml + '</div>' +
                        messageHtml +
                    '</fieldset>';
            }

            // 2. Transformer les cases isolées (hors groupe)
            var solos = document.querySelectorAll('.dsfr-checkbox');
            for (var k = 0; k < solos.length; k++) {
                var solo = solos[k];
                if (solo.getAttribute('data-dsfr-transformed') === 'true') continue;
                // Vérifier que ce n'est pas dans un groupe déjà transformé
                if (solo.closest && solo.closest('[data-dsfr-transformed="true"]')) continue;

                var error2 = solo.getAttribute('data-error') || '';
                var cls2 = 'fr-input-group' + (error2 ? ' fr-input-group--error' : '');

                var cbHtml = _buildCheckbox(solo, '');
                var msg2 = error2 ? '<p class="fr-error-text">' + error2 + '</p>' : '';

                solo.outerHTML =
                    '<div class="' + cls2 + '" data-dsfr-transformed="true">' +
                        cbHtml +
                        msg2 +
                    '</div>';
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Checkbox component initialized');
        }
    };

    $(function() {
        window.DsfrCheckbox.init();
    });

})();
