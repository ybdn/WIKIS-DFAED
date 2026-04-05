/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Toggle.js]] */
(function() {
    // DSFR Toggle Component (Interrupteur)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/interrupteur

    window.DsfrToggle = {
        _counter: 0,

        /**
         * Renders a DSFR Toggle HTML string.
         * @param {Object} options
         * @param {string}   options.id          - ID unique de l'input
         * @param {string}   options.label        - Label de l'interrupteur
         * @param {boolean}  [options.checked]    - État initial (défaut false)
         * @param {boolean}  [options.disabled]   - Désactivé
         * @param {string}   [options.labelOn]    - Texte état activé (optionnel)
         * @param {string}   [options.labelOff]   - Texte état désactivé (optionnel)
         * @returns {string} HTML string
         */
        render: function(options) {
            if (!options || !options.label) return '';

            var id       = options.id;
            var checked  = options.checked  ? ' checked' : '';
            var disabled = options.disabled ? ' disabled' : '';

            var $group   = $('<div>').addClass('fr-toggle');
            var $input   = $('<input>').attr('type', 'checkbox').addClass('fr-toggle__input')
                .attr('id', id)
                .attr('aria-describedby', id + '-hint');
            if (options.checked)  $input.attr('checked', true);
            if (options.disabled) $input.attr('disabled', true);

            var $label = $('<label>').addClass('fr-toggle__label').attr('for', id).text(options.label);

            if (options.labelOn || options.labelOff) {
                $label.attr('data-fr-checked-label',   options.labelOn  || 'Activé');
                $label.attr('data-fr-unchecked-label', options.labelOff || 'Désactivé');
            }

            var $hint = $('<p>').addClass('fr-hint-text').attr('id', id + '-hint');
            if (options.labelOn || options.labelOff) {
                $hint.text(options.checked ?
                    (options.labelOn  || 'Activé') :
                    (options.labelOff || 'Désactivé')
                );
            }

            $group.append($input).append($label).append($hint);
            return $('<div>').append($group).html();
        },

        /**
         * Transforms .dsfr-toggle elements into DSFR toggle switches.
         *
         * Input Pattern :
         * <div class="dsfr-toggle"
         *      data-label="Afficher les détails"
         *      data-checked
         *      data-label-on="Affiché"
         *      data-label-off="Masqué">
         * </div>
         *
         * Pour réagir au changement d'état, écouter l'événement 'change'
         * sur l'input[type="checkbox"] généré.
         */
        transform: function() {
            var self = this;

            $('.dsfr-toggle').each(function() {
                var $el = $(this);
                if ($el.hasClass('fr-toggle')) return;

                var id       = 'dsfr-toggle-' + (++self._counter);
                var label    = $el.attr('data-label') || $el.text().trim() || 'Interrupteur';
                var checked  = $el.attr('data-checked') !== undefined;
                var disabled = $el.attr('data-disabled') !== undefined;
                var labelOn  = $el.attr('data-label-on')  || '';
                var labelOff = $el.attr('data-label-off') || '';

                var html = window.DsfrToggle.render({
                    id:       id,
                    label:    label,
                    checked:  checked,
                    disabled: disabled,
                    labelOn:  labelOn,
                    labelOff: labelOff
                });

                $el.replaceWith($(html));
            });
        },

        /**
         * Met à jour le texte d'hint quand l'état change.
         * Nécessaire car le JS DSFR officiel n'est pas chargé.
         */
        bindEvents: function() {
            $(document.body).on('change', '.fr-toggle__input', function() {
                var $input   = $(this);
                var id       = $input.attr('id');
                var $label   = $('label[for="' + id + '"]');
                var $hint    = $('#' + id + '-hint');
                var isOn     = $input.is(':checked');
                var labelOn  = $label.attr('data-fr-checked-label')   || 'Activé';
                var labelOff = $label.attr('data-fr-unchecked-label') || 'Désactivé';

                if ($hint.length) {
                    $hint.text(isOn ? labelOn : labelOff);
                }
            });
        },

        init: function() {
            this.transform();
            this.bindEvents();
            console.log('[DSFR] Toggle component initialized');
        }
    };

    $(function() {
        window.DsfrToggle.init();
    });
})();
