/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tooltip.js]] */
(function() {
    // DSFR Tooltip Component — Infobulle
    // Documentation : https://www.systeme-de-design.gouv.fr/composants/infobulle
    //
    // Usage dans le Wikitext :
    //
    //   Variante bouton (clic) :
    //   <span class="dsfr-tooltip"
    //         data-content="Texte de l'infobulle"
    //         data-trigger="button"
    //         data-label="Informations complémentaires"></span>
    //
    //   Variante lien (survol/focus) :
    //   <span class="dsfr-tooltip"
    //         data-content="Texte de l'infobulle"
    //         data-trigger="link"
    //         data-label="Voir plus"></span>
    //
    // Attributs :
    //   data-content   (obligatoire)  Texte affiché dans l'infobulle
    //   data-trigger   (optionnel)    "button" (défaut) | "link"
    //   data-label     (optionnel)    Texte accessible du bouton, ou texte du lien
    //                                 Bouton sans label = icône info seule
    //   data-position  (optionnel)    "top" (défaut) | "bottom" | "left" | "right"
    //   data-id        (optionnel)    ID unique (généré automatiquement si absent)

    var _idCounter = 0;

    window.DsfrTooltip = {

        /**
         * Génère la structure HTML DSFR d'une infobulle.
         * @param {Object} opts
         * @param {string} opts.content    - Texte de l'infobulle (obligatoire)
         * @param {string} [opts.trigger]  - "button" (défaut) | "link"
         * @param {string} [opts.label]    - Texte accessible du déclencheur
         * @param {string} [opts.position] - "top" (défaut) | "bottom" | "left" | "right"
         * @param {string} [opts.id]       - ID unique (généré si absent)
         * @returns {string} HTML string
         */
        render: function(opts) {
            if (!opts || !opts.content) return '';

            _idCounter++;
            var id = opts.id || ('fr-tooltip-' + _idCounter);
            var trigger = (opts.trigger === 'link') ? 'link' : 'button';
            var position = opts.position || 'top';

            // Classes de positionnement
            var placementClass = 'fr-placement';
            if (position === 'bottom') {
                placementClass += ' fr-placement--bottom';
            } else if (position === 'left') {
                placementClass += ' fr-placement--left';
            } else if (position === 'right') {
                placementClass += ' fr-placement--right';
            }

            var triggerHtml = '';
            if (trigger === 'link') {
                var linkLabel = opts.label || 'En savoir plus';
                triggerHtml = '<a class="fr-link" href="#" aria-describedby="' + id + '">' + linkLabel + '</a>';
            } else {
                var srLabel = opts.label || 'Informations complémentaires';
                triggerHtml =
                    '<button class="fr-btn fr-btn--tooltip" type="button" aria-describedby="' + id + '">' +
                        '<span class="fr-sr-only">' + srLabel + '</span>' +
                    '</button>';
            }

            var tooltipHtml =
                '<span class="fr-tooltip ' + placementClass + '" id="' + id + '" role="tooltip" aria-hidden="true">' +
                    opts.content +
                '</span>';

            return '<span class="fr-tooltip-group">' + triggerHtml + tooltipHtml + '</span>';
        },

        /**
         * Parcourt le DOM et transforme les éléments `.dsfr-tooltip`
         * en infobulles DSFR valides.
         */
        transform: function() {
            var items = document.querySelectorAll('.dsfr-tooltip');
            for (var i = 0; i < items.length; i++) {
                var el = items[i];

                // Éviter la double transformation
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var content = el.getAttribute('data-content') || '';
                if (!content) continue;

                var html = window.DsfrTooltip.render({
                    content: content,
                    trigger: el.getAttribute('data-trigger') || 'button',
                    label:   el.getAttribute('data-label') || '',
                    position: el.getAttribute('data-position') || 'top',
                    id:      el.getAttribute('data-id') || ''
                });

                if (html) {
                    el.outerHTML = html;
                }
            }
        },

        /**
         * Attache les gestionnaires d'événements sur les déclencheurs générés.
         * Bouton = clic (toggle). Lien = survol + focus.
         */
        _bindEvents: function() {
            // --- Boutons tooltip : affichage au clic ---
            var buttons = document.querySelectorAll('.fr-btn--tooltip');
            for (var i = 0; i < buttons.length; i++) {
                (function(btn) {
                    var targetId = btn.getAttribute('aria-describedby');
                    if (!targetId) return;

                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var tooltip = document.getElementById(targetId);
                        if (!tooltip) return;
                        var isShown = tooltip.className.indexOf('fr-tooltip--shown') !== -1;
                        // Fermer tous les tooltips ouverts avant de basculer
                        window.DsfrTooltip._closeAll();
                        if (!isShown) {
                            tooltip.className += ' fr-tooltip--shown';
                            tooltip.setAttribute('aria-hidden', 'false');
                        }
                    });

                    btn.addEventListener('keydown', function(e) {
                        var key = e.key || e.keyCode;
                        if (key === 'Escape' || key === 27) {
                            window.DsfrTooltip._closeAll();
                        }
                    });
                })(buttons[i]);
            }

            // --- Liens tooltip : affichage au survol et au focus ---
            var links = document.querySelectorAll('.fr-tooltip-group .fr-link[aria-describedby]');
            for (var j = 0; j < links.length; j++) {
                (function(link) {
                    var targetId = link.getAttribute('aria-describedby');
                    if (!targetId) return;

                    function showTooltip() {
                        var tooltip = document.getElementById(targetId);
                        if (!tooltip) return;
                        tooltip.className += ' fr-tooltip--shown';
                        tooltip.setAttribute('aria-hidden', 'false');
                    }

                    function hideTooltip() {
                        var tooltip = document.getElementById(targetId);
                        if (!tooltip) return;
                        tooltip.className = tooltip.className.replace(/\s*fr-tooltip--shown/g, '');
                        tooltip.setAttribute('aria-hidden', 'true');
                    }

                    link.addEventListener('mouseenter', showTooltip);
                    link.addEventListener('mouseleave', hideTooltip);
                    link.addEventListener('focus',      showTooltip);
                    link.addEventListener('blur',       hideTooltip);

                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                    });
                })(links[j]);
            }

            // --- Fermer au clic en dehors d'un tooltip ---
            document.addEventListener('click', function() {
                window.DsfrTooltip._closeAll();
            });
        },

        /**
         * Ferme toutes les infobulles actuellement affichées.
         */
        _closeAll: function() {
            var tooltips = document.querySelectorAll('.fr-tooltip--shown');
            for (var i = 0; i < tooltips.length; i++) {
                tooltips[i].className = tooltips[i].className.replace(/\s*fr-tooltip--shown/g, '');
                tooltips[i].setAttribute('aria-hidden', 'true');
            }
        },

        init: function() {
            this.transform();
            this._bindEvents();
            console.log('[DSFR] Tooltip component initialized');
        }
    };

    $(function() {
        window.DsfrTooltip.init();
    });

})();
