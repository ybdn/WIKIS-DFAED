/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Sidemenu.js]] */
(function() {
    // DSFR Sidemenu Component (Menu latéral)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/menu-lateral

    window.DsfrSidemenu = {
        _counter: 0,

        /**
         * Construit récursivement une liste fr-sidemenu__list depuis un <ul> source.
         * @param {jQuery} $ul     - Liste source
         * @param {string} prefix  - Préfixe pour les IDs
         * @param {number} depth   - Profondeur courante (0 = racine)
         * @returns {jQuery} <ul class="fr-sidemenu__list">
         */
        buildList: function($ul, prefix, depth) {
            var self = this;
            var $list = $('<ul>').addClass('fr-sidemenu__list');
            var subIndex = 0;

            $ul.children('li').each(function() {
                var $li       = $(this);
                var $subUl    = $li.children('ul').first();
                var $groupEl  = $li.children('.dsfr-sidemenu-group').first();
                var $aEl      = $li.children('a').first();
                var isCurrent = $aEl.hasClass('current') || $li.hasClass('current');

                var $dsfrLi = $('<li>').addClass('fr-sidemenu__item');

                if ($subUl.length || $groupEl.length) {
                    // Item avec sous-menu
                    var subId      = prefix + '-sub-' + (++subIndex);
                    var groupLabel = $groupEl.length ? $groupEl.text().trim() : ($aEl.text().trim() || 'Sous-menu');
                    var isActive   = $li.hasClass('active') || $li.hasClass('fr-sidemenu__item--active') ||
                                     $li.find('a.current').length > 0;

                    if (isActive) $dsfrLi.addClass('fr-sidemenu__item--active');

                    var $subBtn = $('<button>')
                        .addClass('fr-sidemenu__btn')
                        .attr('aria-expanded', isActive ? 'true' : 'false')
                        .attr('aria-controls', subId)
                        .text(groupLabel);

                    var $collapse = $('<div>')
                        .addClass('fr-collapse' + (isActive ? ' fr-collapse--expanded' : ''))
                        .attr('id', subId);

                    var $sourceList = $subUl.length ? $subUl : $groupEl.siblings('ul').first();
                    if ($sourceList.length) {
                        $collapse.append(self.buildList($sourceList, subId, depth + 1));
                    }

                    $dsfrLi.append($subBtn).append($collapse);
                } else if ($aEl.length) {
                    // Lien simple
                    var $link = $('<a>').addClass('fr-sidemenu__link')
                        .attr('href', $aEl.attr('href') || '#')
                        .attr('target', '_self')
                        .html($aEl.html());

                    if (isCurrent) $link.attr('aria-current', 'page');

                    $dsfrLi.append($link);
                } else {
                    // Texte brut sans lien
                    $dsfrLi.append($('<span>').addClass('fr-sidemenu__link').html($li.html()));
                }

                $list.append($dsfrLi);
            });

            return $list;
        },

        /**
         * Transforms .dsfr-sidemenu divs into DSFR fr-sidemenu nav elements.
         *
         * Input Pattern :
         * <div class="dsfr-sidemenu">
         *   <div class="dsfr-sidemenu-title">Dans cette rubrique</div>
         *   <ul>
         *     <li><a href="/page" class="current">Page active</a></li>
         *     <li class="active">
         *       <span class="dsfr-sidemenu-group">Groupe</span>
         *       <ul>
         *         <li><a href="/sous-page">Sous-page</a></li>
         *       </ul>
         *     </li>
         *     <li><a href="/autre">Autre page</a></li>
         *   </ul>
         * </div>
         *
         * Attribut optionnel :
         *   data-sticky  → ajoute fr-sidemenu--sticky-full-height
         */
        transform: function() {
            var self = this;

            $('.dsfr-sidemenu').each(function() {
                var $source    = $(this);
                if ($source.hasClass('fr-sidemenu')) return;

                var uid        = 'fr-sidemenu-wrapper-' + (++self._counter);
                var titleId    = 'fr-sidemenu-title-' + self._counter;
                var $titleEl   = $source.find('.dsfr-sidemenu-title').first();
                var $sourceUl  = $source.children('ul').first();
                var sticky     = $source.attr('data-sticky') !== undefined;

                var navClasses = ['fr-sidemenu'];
                if (sticky) navClasses.push('fr-sidemenu--sticky-full-height');

                var $nav   = $('<nav>').addClass(navClasses.join(' ')).attr('aria-labelledby', titleId);
                var $inner = $('<div>').addClass('fr-sidemenu__inner');

                // Bouton responsive mobile
                var btnLabel = $titleEl.length ? $titleEl.text().trim() : 'Dans cette rubrique';
                var $mobileBtn = $('<button>')
                    .addClass('fr-sidemenu__btn')
                    .attr('hidden', true)
                    .attr('aria-controls', uid)
                    .attr('aria-expanded', 'false')
                    .text(btnLabel);

                var $collapse = $('<div>').addClass('fr-collapse').attr('id', uid);

                // Titre visible (desktop)
                if ($titleEl.length) {
                    $collapse.append(
                        $('<p>').addClass('fr-sidemenu__title').attr('id', titleId).text($titleEl.text().trim())
                    );
                }

                // Construire la liste récursivement
                if ($sourceUl.length) {
                    $collapse.append(self.buildList($sourceUl, uid, 0));
                }

                $inner.append($mobileBtn).append($collapse);
                $nav.append($inner);
                $source.replaceWith($nav);
            });
        },

        bindEvents: function() {
            $(document.body).on('click', '.fr-sidemenu__btn', function() {
                var $btn       = $(this);
                var targetId   = $btn.attr('aria-controls');
                if (!targetId) return;

                var $target    = $('#' + targetId);
                var isExpanded = $btn.attr('aria-expanded') === 'true';

                if (isExpanded) {
                    $btn.attr('aria-expanded', 'false');
                    $target.removeClass('fr-collapse--expanded');
                } else {
                    $btn.attr('aria-expanded', 'true');
                    $target.addClass('fr-collapse--expanded');
                }
            });
        },

        init: function() {
            this.transform();
            this.bindEvents();
            console.log('[DSFR] Sidemenu component initialized');
        }
    };

    $(function() {
        window.DsfrSidemenu.init();
    });
})();
