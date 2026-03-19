/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Dropdown.js]] */
(function() {
    // DSFR Dropdown Component — Bouton avec menu déroulant
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/menu-deroulant
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-dropdown" data-label="Actions">
    //     <ul>
    //       <li><a href="url">Option 1</a></li>
    //       <li><a href="url">Option 2</a></li>
    //     </ul>
    //   </div>
    //
    // Attributs du conteneur (.dsfr-dropdown) :
    //   data-label   (obligatoire) Libellé du bouton
    //   data-icon    (optionnel)   Classe d'icône DSFR supplémentaire sur le bouton
    //   data-size    (optionnel)   "sm" | "lg"
    //   data-kind    (optionnel)   "secondary" | "tertiary" | "tertiary-no-outline" (défaut : primaire)

    var _counter = 0;

    window.DsfrDropdown = {

        transform: function() {
            var els = document.querySelectorAll('.dsfr-dropdown');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var label = el.getAttribute('data-label') || 'Menu';
                var icon  = el.getAttribute('data-icon') || '';
                var size  = el.getAttribute('data-size') || '';
                var kind  = el.getAttribute('data-kind') || '';

                var $el = $(el);
                var items = el.querySelectorAll('li');
                if (!items.length) continue;

                _counter++;
                var menuId = 'dropdown-menu-' + _counter;

                // Construire les classes du bouton
                var btnCls = 'fr-btn fr-icon-arrow-down-s-line fr-btn--icon-right';
                if (size)  btnCls += ' fr-btn--' + size;
                if (kind)  btnCls += ' fr-btn--' + kind;
                if (icon)  btnCls += ' ' + icon;

                // Construire les items du menu
                var menuItems = '';
                for (var j = 0; j < items.length; j++) {
                    var link = items[j].querySelector('a');
                    if (!link) continue;
                    var href = link.getAttribute('href') || '#';
                    var text = link.innerHTML;
                    menuItems += '<li><a class="fr-nav__link" href="' + href + '">' + text + '</a></li>';
                }

                var html =
                    '<div class="fr-menu" data-dsfr-transformed="true">' +
                        '<button class="' + btnCls + '"' +
                            ' aria-expanded="false"' +
                            ' aria-controls="' + menuId + '">' +
                            label +
                        '</button>' +
                        '<div class="fr-collapse fr-menu" id="' + menuId + '" role="navigation">' +
                            '<ul class="fr-menu__list">' + menuItems + '</ul>' +
                        '</div>' +
                    '</div>';

                el.outerHTML = html;
            }
        },

        _bindEvents: function() {
            // Ouvrir/fermer au clic sur le bouton
            $(document.body).on('click', '.fr-menu > .fr-btn[aria-controls]', function(e) {
                var $btn     = $(this);
                var targetId = $btn.attr('aria-controls');
                if (!targetId) return;

                var $menu    = $('#' + targetId);
                if (!$menu.length) return;

                var isOpen = $btn.attr('aria-expanded') === 'true';

                // Fermer tous les autres dropdowns avant d'ouvrir
                $('.fr-menu > .fr-btn[aria-expanded="true"]').not($btn).each(function() {
                    var otherId = $(this).attr('aria-controls');
                    $(this).attr('aria-expanded', 'false');
                    if (otherId) $('#' + otherId).removeClass('fr-collapse--expanded');
                });

                if (isOpen) {
                    $btn.attr('aria-expanded', 'false');
                    $menu.removeClass('fr-collapse--expanded');
                } else {
                    $btn.attr('aria-expanded', 'true');
                    $menu.addClass('fr-collapse--expanded');
                }

                e.stopPropagation();
            });

            // Fermer au clic en dehors
            $(document).on('click', function() {
                $('.fr-menu > .fr-btn[aria-expanded="true"]').each(function() {
                    var id = $(this).attr('aria-controls');
                    $(this).attr('aria-expanded', 'false');
                    if (id) $('#' + id).removeClass('fr-collapse--expanded');
                });
            });

            // Fermer avec Escape
            $(document).on('keydown', function(e) {
                if ((e.key && e.key === 'Escape') || e.keyCode === 27) {
                    $('.fr-menu > .fr-btn[aria-expanded="true"]').each(function() {
                        var id = $(this).attr('aria-controls');
                        $(this).attr('aria-expanded', 'false');
                        if (id) $('#' + id).removeClass('fr-collapse--expanded');
                    });
                }
            });
        },

        init: function() {
            this.transform();
            this._bindEvents();
            console.log('[DSFR] Dropdown component initialized');
        }
    };

    $(function() {
        window.DsfrDropdown.init();
    });

})();
