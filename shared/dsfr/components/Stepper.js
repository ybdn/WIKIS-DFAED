/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Stepper.js]] */
(function() {
    // DSFR Stepper Component — Indicateur d'étapes
    // Documentation : https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/indicateur-d-etapes/
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-stepper"
    //        data-current="1"
    //        data-total="3"
    //        data-title="Titre de l'étape en cours"
    //        data-next="Titre de l'étape suivante"></div>
    //
    // Attributs :
    //   data-current      (obligatoire) Numéro de l'étape en cours (entier >= 1)
    //   data-total        (obligatoire) Nombre total d'étapes (entier >= 1)
    //   data-title        (obligatoire) Titre de l'étape courante
    //   data-next         (optionnel)   Titre de l'étape suivante — omis sur la dernière étape
    //   data-title-level  (optionnel)   Niveau sémantique du titre : "h2" (défaut), "h3" ou "h4"
    //
    // Exemple rendu final :
    //   <div class="fr-stepper">
    //     <h2 class="fr-stepper__title">
    //       <span class="fr-stepper__state">Étape 1 sur 3</span>
    //       Vos informations personnelles
    //     </h2>
    //     <div class="fr-stepper__steps" data-fr-current-step="1" data-fr-steps="3"></div>
    //     <p class="fr-stepper__details">
    //       <span class="fr-text--bold">Étape suivante :</span> Vos coordonnées
    //     </p>
    //   </div>

    window.DsfrStepper = {

        /**
         * Génère la structure HTML DSFR d'un indicateur d'étapes.
         * @param {Object} opts
         * @param {number} opts.current      - Numéro de l'étape en cours
         * @param {number} opts.total        - Nombre total d'étapes
         * @param {string} opts.title        - Titre de l'étape courante
         * @param {string} [opts.next]       - Titre de l'étape suivante
         * @param {string} [opts.titleLevel] - Niveau du titre : "h2" | "h3" | "h4" (défaut : "h2")
         * @returns {string} HTML string
         */
        render: function(opts) {
            if (!opts || !opts.title || isNaN(opts.current) || isNaN(opts.total)) return '';

            var current = parseInt(opts.current, 10);
            var total   = parseInt(opts.total, 10);

            // Clamp
            if (current < 1) current = 1;
            if (total < 1)   total = 1;
            if (current > total) current = total;

            var tag = (opts.titleLevel === 'h3' || opts.titleLevel === 'h4') ? opts.titleLevel : 'h2';
            var isLast = (current >= total);
            var stateLabel = 'Étape ' + current + ' sur ' + total;

            var html = '<div class="fr-stepper">';
            html += '<' + tag + ' class="fr-stepper__title">';
            html += '<span class="fr-stepper__state">' + stateLabel + '</span>';
            html += opts.title;
            html += '</' + tag + '>';
            html += '<div class="fr-stepper__steps"';
            html += ' data-fr-current-step="' + current + '"';
            html += ' data-fr-steps="' + total + '">';
            html += '</div>';

            if (!isLast && opts.next) {
                html += '<p class="fr-stepper__details">';
                html += '<span class="fr-text--bold">Étape suivante :</span> ' + opts.next;
                html += '</p>';
            }

            html += '</div>';
            return html;
        },

        /**
         * Parcourt le DOM et transforme les éléments `.dsfr-stepper`
         * en indicateurs d'étapes DSFR valides.
         */
        transform: function() {
            var items = document.querySelectorAll('.dsfr-stepper');
            for (var i = 0; i < items.length; i++) {
                var el = items[i];

                // Éviter la double transformation
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var current    = parseInt(el.getAttribute('data-current'), 10);
                var total      = parseInt(el.getAttribute('data-total'), 10);
                var title      = el.getAttribute('data-title') || '';
                var next       = el.getAttribute('data-next') || '';
                var titleLevel = el.getAttribute('data-title-level') || 'h2';

                if (!title || isNaN(current) || isNaN(total)) continue;

                var html = window.DsfrStepper.render({
                    current: current,
                    total: total,
                    title: title,
                    next: next,
                    titleLevel: titleLevel
                });

                if (html) {
                    el.outerHTML = html;
                }
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Stepper component initialized');
        }
    };

    $(function() {
        window.DsfrStepper.init();
    });

})();
