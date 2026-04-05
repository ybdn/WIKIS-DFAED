/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tab.js]] */
(function() {
    // DSFR Tab Component — Onglets
    // Documentation : https://www.systeme-de-design.gouv.fr/composants/onglet
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-tabs" data-label="Navigation par onglets">
    //     <div class="dsfr-tab" data-title="Premier onglet">Contenu du premier onglet</div>
    //     <div class="dsfr-tab" data-title="Deuxième onglet">Contenu du second onglet</div>
    //   </div>
    //
    // Attributs du conteneur (.dsfr-tabs) :
    //   data-label     (optionnel)  Label aria-label sur la liste d'onglets (défaut : "Onglets")
    //   data-active    (optionnel)  Index (1-basé) de l'onglet ouvert par défaut (défaut : 1)
    //
    // Attributs de chaque onglet (.dsfr-tab) :
    //   data-title     (obligatoire) Titre affiché dans l'onglet
    //   data-icon      (optionnel)   Classe d'icône DSFR (ex: "fr-icon-file-line")

    var _tabCounter = 0;

    window.DsfrTab = {

        /**
         * Génère la structure HTML DSFR d'un système d'onglets.
         * @param {Object} opts
         * @param {Array}  opts.tabs      - Tableau de { title, content, icon }
         * @param {string} [opts.label]   - aria-label de la liste
         * @param {number} [opts.active]  - Index (0-basé) de l'onglet actif
         * @param {string} opts.id        - Préfixe d'ID unique
         * @returns {string} HTML string
         */
        render: function(opts) {
            if (!opts || !opts.tabs || !opts.tabs.length) return '';

            var id      = opts.id;
            var label   = opts.label || 'Onglets';
            var active  = opts.active || 0;

            var listHtml = '<ul class="fr-tabs__list" role="tablist" aria-label="' + label + '">';
            var panelsHtml = '';

            for (var i = 0; i < opts.tabs.length; i++) {
                var tab        = opts.tabs[i];
                var tabId      = 'tab-' + id + '-' + i;
                var panelId    = 'tab-panel-' + id + '-' + i;
                var isSelected = (i === active);

                var tabCls = 'fr-tabs__tab';
                if (tab.icon) tabCls += ' fr-tabs__tab--icon-left ' + tab.icon;

                listHtml +=
                    '<li role="presentation">' +
                        '<button class="' + tabCls + '"' +
                            ' id="' + tabId + '"' +
                            ' tabindex="' + (isSelected ? '0' : '-1') + '"' +
                            ' role="tab"' +
                            ' aria-selected="' + (isSelected ? 'true' : 'false') + '"' +
                            ' aria-controls="' + panelId + '">' +
                            tab.title +
                        '</button>' +
                    '</li>';

                var panelCls = 'fr-tabs__panel';
                if (isSelected) panelCls += ' fr-tabs__panel--selected';

                panelsHtml +=
                    '<div class="' + panelCls + '"' +
                        ' id="' + panelId + '"' +
                        ' role="tabpanel"' +
                        ' tabindex="0"' +
                        ' aria-labelledby="' + tabId + '">' +
                        tab.content +
                    '</div>';
            }

            listHtml += '</ul>';

            return '<div class="fr-tabs" data-dsfr-transformed="true">' + listHtml + panelsHtml + '</div>';
        },

        /**
         * Parcourt le DOM et transforme les éléments .dsfr-tabs.
         */
        transform: function() {
            var containers = document.querySelectorAll('.dsfr-tabs');
            for (var i = 0; i < containers.length; i++) {
                var el = containers[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var label  = el.getAttribute('data-label') || 'Onglets';
                var active = parseInt(el.getAttribute('data-active') || '1', 10) - 1;
                if (active < 0) active = 0;

                var tabEls = el.querySelectorAll('.dsfr-tab');
                if (!tabEls.length) continue;

                var tabs = [];
                for (var j = 0; j < tabEls.length; j++) {
                    tabs.push({
                        title:   tabEls[j].getAttribute('data-title') || ('Onglet ' + (j + 1)),
                        icon:    tabEls[j].getAttribute('data-icon') || '',
                        content: tabEls[j].innerHTML
                    });
                }

                _tabCounter++;
                var html = window.DsfrTab.render({
                    id:     String(_tabCounter),
                    label:  label,
                    active: active,
                    tabs:   tabs
                });

                if (html) {
                    el.outerHTML = html;
                }
            }
        },

        /**
         * Attache les gestionnaires de clic sur tous les systèmes d'onglets générés.
         */
        _bindEvents: function() {
            var tabsGroups = document.querySelectorAll('.fr-tabs[data-dsfr-transformed="true"]');
            for (var i = 0; i < tabsGroups.length; i++) {
                (function(group) {
                    var buttons = group.querySelectorAll('[role="tab"]');
                    for (var j = 0; j < buttons.length; j++) {
                        (function(btn) {
                            btn.addEventListener('click', function() {
                                var panelId = btn.getAttribute('aria-controls');
                                if (!panelId) return;

                                // Désactiver tous les onglets du groupe
                                var allBtns   = group.querySelectorAll('[role="tab"]');
                                var allPanels = group.querySelectorAll('[role="tabpanel"]');

                                for (var k = 0; k < allBtns.length; k++) {
                                    allBtns[k].setAttribute('aria-selected', 'false');
                                    allBtns[k].setAttribute('tabindex', '-1');
                                }
                                for (var l = 0; l < allPanels.length; l++) {
                                    allPanels[l].className = allPanels[l].className.replace(/\s*fr-tabs__panel--selected/g, '');
                                }

                                // Activer l'onglet cliqué
                                btn.setAttribute('aria-selected', 'true');
                                btn.setAttribute('tabindex', '0');
                                var panel = document.getElementById(panelId);
                                if (panel) {
                                    panel.className += ' fr-tabs__panel--selected';
                                    panel.focus();
                                }
                            });

                            // Navigation clavier (flèches gauche/droite)
                            btn.addEventListener('keydown', function(e) {
                                var key = e.key || e.keyCode;
                                var allBtns = group.querySelectorAll('[role="tab"]');
                                var idx = -1;
                                for (var k = 0; k < allBtns.length; k++) {
                                    if (allBtns[k] === btn) { idx = k; break; }
                                }
                                if (idx === -1) return;

                                var nextIdx = -1;
                                if (key === 'ArrowRight' || key === 39) {
                                    nextIdx = (idx + 1) % allBtns.length;
                                } else if (key === 'ArrowLeft' || key === 37) {
                                    nextIdx = (idx - 1 + allBtns.length) % allBtns.length;
                                }
                                if (nextIdx !== -1) {
                                    allBtns[nextIdx].focus();
                                    allBtns[nextIdx].click();
                                }
                            });
                        })(buttons[j]);
                    }
                })(tabsGroups[i]);
            }
        },

        init: function() {
            this.transform();
            this._bindEvents();
            console.log('[DSFR] Tab component initialized');
        }
    };

    $(function() {
        window.DsfrTab.init();
    });

})();
