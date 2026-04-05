/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Pagination.js]] */
(function() {
    // DSFR Pagination Component
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/pagination

    window.DsfrPagination = {
        /**
         * Renders a DSFR pagination HTML string.
         * @param {Object} options
         * @param {number}   options.current  - Page courante (1-indexée)
         * @param {number}   options.total    - Nombre total de pages
         * @param {function} options.getUrl   - Callback(page) → URL string
         * @param {number}   [options.window] - Nombre de pages visibles de chaque côté (défaut 2)
         * @returns {string} HTML string
         */
        render: function(options) {
            if (!options || !options.total || !options.getUrl) return '';

            var current  = options.current || 1;
            var total    = options.total;
            var win      = options.window !== undefined ? options.window : 2;
            var getUrl   = options.getUrl;

            var $nav  = $('<nav>').attr('role', 'navigation').attr('aria-label', 'Pagination').addClass('fr-pagination');
            var $ul   = $('<ul>').addClass('fr-pagination__list');

            // Bouton "Première"
            var $firstLi = $('<li>');
            var $first = $('<a>').addClass('fr-pagination__link fr-pagination__link--first')
                .attr('aria-label', 'Première page')
                .attr('href', current > 1 ? getUrl(1) : '#');
            if (current <= 1) $first.attr('aria-disabled', 'true');
            $firstLi.append($first);
            $ul.append($firstLi);

            // Bouton "Précédente"
            var $prevLi = $('<li>');
            var $prev = $('<a>').addClass('fr-pagination__link fr-pagination__link--prev')
                .attr('aria-label', 'Page précédente')
                .attr('href', current > 1 ? getUrl(current - 1) : '#');
            if (current <= 1) $prev.attr('aria-disabled', 'true');
            $prevLi.append($prev);
            $ul.append($prevLi);

            // Pages numérotées
            var from = Math.max(1, current - win);
            var to   = Math.min(total, current + win);

            // Ellipse début
            if (from > 1) {
                var $eLi = $('<li>');
                $eLi.append($('<a>').addClass('fr-pagination__link').attr('aria-hidden', 'true').text('...'));
                $ul.append($eLi);
            }

            for (var p = from; p <= to; p++) {
                var $pLi = $('<li>');
                var $pA  = $('<a>').addClass('fr-pagination__link')
                    .attr('href', p !== current ? getUrl(p) : '#')
                    .attr('aria-label', 'Page ' + p)
                    .text(p);
                if (p === current) {
                    $pA.attr('aria-current', 'page');
                    $pA.addClass('fr-pagination__link--active');
                }
                $pLi.append($pA);
                $ul.append($pLi);
            }

            // Ellipse fin
            if (to < total) {
                var $eLi2 = $('<li>');
                $eLi2.append($('<a>').addClass('fr-pagination__link').attr('aria-hidden', 'true').text('...'));
                $ul.append($eLi2);
            }

            // Bouton "Suivante"
            var $nextLi = $('<li>');
            var $next = $('<a>').addClass('fr-pagination__link fr-pagination__link--next')
                .attr('aria-label', 'Page suivante')
                .attr('href', current < total ? getUrl(current + 1) : '#');
            if (current >= total) $next.attr('aria-disabled', 'true');
            $nextLi.append($next);
            $ul.append($nextLi);

            // Bouton "Dernière"
            var $lastLi = $('<li>');
            var $last = $('<a>').addClass('fr-pagination__link fr-pagination__link--last')
                .attr('aria-label', 'Dernière page')
                .attr('href', current < total ? getUrl(total) : '#');
            if (current >= total) $last.attr('aria-disabled', 'true');
            $lastLi.append($last);
            $ul.append($lastLi);

            $nav.append($ul);
            return $('<div>').append($nav).html();
        },

        /**
         * Transforms .dsfr-pagination elements into DSFR pagination navs.
         *
         * Input Pattern :
         * <div class="dsfr-pagination"
         *      data-current="2"
         *      data-total="10"
         *      data-url-pattern="/Special:Recherche?page={page}">
         * </div>
         *
         * data-url-pattern : chaîne avec {page} comme placeholder.
         */
        transform: function() {
            $('.dsfr-pagination').each(function() {
                var $el      = $(this);
                if ($el.hasClass('fr-pagination')) return;

                var current  = parseInt($el.attr('data-current') || '1', 10);
                var total    = parseInt($el.attr('data-total') || '1', 10);
                var pattern  = $el.attr('data-url-pattern') || '?page={page}';

                var html = window.DsfrPagination.render({
                    current: current,
                    total:   total,
                    getUrl:  function(p) {
                        return pattern.replace('{page}', p);
                    }
                });

                $el.replaceWith($(html));
            });
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Pagination component initialized');
        }
    };

    $(function() {
        window.DsfrPagination.init();
    });
})();
