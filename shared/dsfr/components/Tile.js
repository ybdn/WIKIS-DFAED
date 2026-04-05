/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tile.js]] */
(function() {
    // DSFR Tile Component (Tuile)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/tuile

    window.DsfrTile = {
        /**
         * Construit un élément fr-tile à partir d'un .dsfr-tile-item.
         * @param {jQuery} $source - L'élément source
         * @param {number} index   - Index pour générer des IDs uniques
         * @returns {jQuery}
         */
        buildTile: function($source, index) {
            var $titleEl  = $source.find('.dsfr-tile-title').first();
            var $descEl   = $source.find('.dsfr-tile-desc').first();
            var $detailEl = $source.find('.dsfr-tile-detail').first();
            var $imgEl    = $source.find('.dsfr-tile-img').first();

            var horizontal = $source.attr('data-horizontal') !== undefined;
            var noEnlarge  = $source.attr('data-no-enlarge') !== undefined;
            var color      = $source.attr('data-color') || '';

            var tileClasses = ['fr-tile'];
            if (!noEnlarge) tileClasses.push('fr-enlarge-link');
            if (horizontal) tileClasses.push('fr-tile--horizontal');
            if (color)      tileClasses.push('fr-tile--' + color);

            var $tile    = $('<div>').addClass(tileClasses.join(' ')).attr('id', 'dsfr-tile-' + index);
            var $body    = $('<div>').addClass('fr-tile__body');
            var $content = $('<div>').addClass('fr-tile__content');

            // Titre — obligatoire
            if ($titleEl.length) {
                var $a = $titleEl.find('a').first();
                var $h3 = $('<h3>').addClass('fr-tile__title');
                if ($a.length) {
                    $h3.append($('<a>').attr('href', $a.attr('href') || '#').html($a.html()));
                } else {
                    $h3.html($titleEl.html().trim());
                }
                $content.append($h3);
            }

            // Description
            if ($descEl.length) {
                $content.append($('<p>').addClass('fr-tile__desc').html($descEl.html().trim()));
            }

            // Détail (texte secondaire, ex: catégorie, date)
            if ($detailEl.length) {
                $content.append($('<p>').addClass('fr-tile__detail').html($detailEl.html().trim()));
            }

            $body.append($content);

            // Image : valeur texte ou data-src
            if ($imgEl.length) {
                var imgSrc = $imgEl.text().trim() || $imgEl.attr('data-src') || '';
                var imgAlt = $imgEl.attr('data-alt') || '';
                if (imgSrc) {
                    var $header = $('<div>').addClass('fr-tile__header');
                    $header.append(
                        $('<img>').addClass('fr-responsive-img')
                            .attr('src', imgSrc)
                            .attr('alt', imgAlt)
                    );
                    $tile.append($body).append($header);
                } else {
                    $tile.append($body);
                }
            } else {
                $tile.append($body);
            }

            return $tile;
        },

        /**
         * Transforms .dsfr-tiles grids and standalone .dsfr-tile-item elements.
         *
         * Pattern grille :
         * <div class="dsfr-tiles" data-cols="3">
         *   <div class="dsfr-tile-item">
         *     <div class="dsfr-tile-title"><a href="url">Titre</a></div>
         *     <div class="dsfr-tile-desc">Description</div>
         *     <div class="dsfr-tile-img">https://url/image.jpg</div>
         *   </div>
         * </div>
         *
         * Pattern tuile isolée :
         * <div class="dsfr-tile-item">
         *   <div class="dsfr-tile-title"><a href="#">Titre</a></div>
         *   <div class="dsfr-tile-desc">Description</div>
         * </div>
         *
         * Attributs optionnels sur .dsfr-tile-item :
         *   data-horizontal     → fr-tile--horizontal
         *   data-no-enlarge     → retire fr-enlarge-link
         *   data-color="grey"   → fr-tile--grey
         * data-cols sur .dsfr-tiles : 2, 3 (défaut), 4
         */
        transform: function() {
            var tileIndex = 0;

            // Mode grille
            $('.dsfr-tiles').each(function() {
                var $wrapper = $(this);
                if ($wrapper.hasClass('fr-grid-row')) return;

                var cols = parseInt($wrapper.attr('data-cols') || '3', 10);
                var colClass;
                switch (cols) {
                    case 2:  colClass = 'fr-col-12 fr-col-md-6'; break;
                    case 4:  colClass = 'fr-col-12 fr-col-md-3'; break;
                    default: colClass = 'fr-col-12 fr-col-md-4';
                }

                var $grid = $('<div>').addClass('fr-grid-row fr-grid-row--gutters');

                $wrapper.find('.dsfr-tile-item').each(function() {
                    var $tile = window.DsfrTile.buildTile($(this), tileIndex++);
                    var $col  = $('<div>').addClass(colClass);
                    $col.append($tile);
                    $grid.append($col);
                });

                $wrapper.replaceWith($grid);
            });

            // Tuiles isolées restantes (non encapsulées dans .dsfr-tiles)
            $('.dsfr-tile-item').each(function() {
                var $item = $(this);
                if ($item.closest('.fr-grid-row').length) return;
                $item.replaceWith(window.DsfrTile.buildTile($item, tileIndex++));
            });
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Tile component initialized');
        }
    };

    $(function() {
        window.DsfrTile.init();
    });
})();
