/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Card.js]] */
(function() {
    // DSFR Card Component
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/carte/code-de-la-carte
    //
    // =========================================================================
    // SYNTAXE WIKITEXT
    // =========================================================================
    //
    // --- Carte simple ---
    //
    //   <div class="dsfr-card"
    //     data-title="Titre de la carte"
    //     data-url="Nom_Page_Wiki"
    //     data-detail="Catégorie"
    //     data-detail-icon="fr-icon-map-pin-2-line"
    //     data-badge="Nouveau"
    //     data-badge-type="new"
    //     data-image="/path/to/image.jpg"
    //     data-image-alt="Description de l'image"
    //     data-horizontal="true"
    //     data-shadow="true"
    //     data-grey="true"
    //     data-no-arrow="true">
    //     Description de la carte (contenu du div)
    //   </div>
    //
    // --- Grille de cartes (2, 3 ou 4 colonnes) ---
    //
    //   <div class="dsfr-card-grid" data-cols="3">
    //     <div class="dsfr-card-item" data-title="Carte 1" data-url="Page1">Description 1</div>
    //     <div class="dsfr-card-item" data-title="Carte 2" data-url="Page2">Description 2</div>
    //     <div class="dsfr-card-item" data-title="Carte 3" data-url="Page3">Description 3</div>
    //   </div>
    //
    // =========================================================================
    // ATTRIBUTS DISPONIBLES (sur .dsfr-card, .dsfr-card-item)
    // =========================================================================
    //
    //   data-title        [requis]  Titre de la carte
    //   data-url          [opt]     Nom de page wiki ou URL absolue
    //                               → Si nom de page wiki (sans /), utilise mw.util.getUrl()
    //                               → Si URL absolue (commence par http ou /), utilisée telle quelle
    //   data-detail       [opt]     Texte affiché en bas de carte (ex: catégorie, localisation)
    //   data-detail-icon  [opt]     Classe DSFR d'icône pour le détail (ex: fr-icon-map-pin-2-line)
    //   data-badge        [opt]     Texte du badge
    //   data-badge-type   [opt]     Type : new (défaut), info, success, warning, error
    //   data-image        [opt]     URL de l'image d'illustration
    //   data-image-alt    [opt]     Texte alternatif de l'image (défaut: vide)
    //   data-horizontal   [opt]     "true" → disposition horizontale (image à droite)
    //   data-shadow       [opt]     "true" → ombre portée
    //   data-grey         [opt]     "true" → fond gris
    //   data-no-arrow     [opt]     "true" → masque la flèche (fr-card--no-arrow)
    //
    // ATTRIBUT DISPONIBLE (sur .dsfr-card-grid uniquement)
    //
    //   data-cols         [opt]     Nombre de colonnes : 2, 3 (défaut), 4

    window.DsfrCard = {

        /**
         * Extrait le texte/HTML utile du contenu d'un élément.
         * MediaWiki enroule souvent le texte brut dans un <p> — on le déballe.
         */
        extractContent: function($el) {
            var html = $el.html().trim();
            // Si un seul élément enfant de type bloc → on retourne son HTML intérieur
            if ($el.children().length === 1) {
                var $child = $el.children().first();
                var tag = $child.prop('tagName');
                if (tag === 'P' || tag === 'PRE' || tag === 'DIV') {
                    return $child.html().trim();
                }
            }
            return html;
        },

        /**
         * Résout une URL : nom de page wiki → mw.util.getUrl(), sinon passthrough.
         */
        resolveUrl: function(raw) {
            if (!raw) return '';
            // URL absolue ou chemin absolu : utilisé tel quel
            if (raw.indexOf('http') === 0 || raw.indexOf('/') === 0) {
                return raw;
            }
            // Nom de page wiki
            return mw.util.getUrl(raw);
        },

        /**
         * Construit un élément jQuery .fr-card à partir d'un élément source.
         */
        buildCard: function($el) {
            var title        = $el.attr('data-title') || '';
            var rawUrl       = $el.attr('data-url') || '';
            var desc         = $el.attr('data-desc') || this.extractContent($el);
            var detail       = $el.attr('data-detail') || '';
            var detailIcon   = $el.attr('data-detail-icon') || '';
            var badge        = $el.attr('data-badge') || '';
            var badgeType    = $el.attr('data-badge-type') || 'new';
            var image        = $el.attr('data-image') || '';
            var imageAlt     = $el.attr('data-image-alt') || '';
            var isHorizontal = $el.attr('data-horizontal') === 'true';
            var hasShadow    = $el.attr('data-shadow') === 'true';
            var isGrey       = $el.attr('data-grey') === 'true';
            var noArrow      = $el.attr('data-no-arrow') === 'true';

            var resolvedUrl = this.resolveUrl(rawUrl);

            // --- Conteneur principal ---
            var cardClasses = 'fr-card';
            if (resolvedUrl)   cardClasses += ' fr-enlarge-link';
            if (isHorizontal)  cardClasses += ' fr-card--horizontal';
            if (hasShadow)     cardClasses += ' fr-card--shadow';
            if (isGrey)        cardClasses += ' fr-card--grey';
            if (noArrow)       cardClasses += ' fr-card--no-arrow';

            var $card = $('<div>').addClass(cardClasses);

            // --- Body ---
            var $body    = $('<div>').addClass('fr-card__body');
            var $content = $('<div>').addClass('fr-card__content');

            // Titre
            var $titleEl = $('<h3>').addClass('fr-card__title');
            if (resolvedUrl) {
                $titleEl.append(
                    $('<a>').addClass('fr-card__link')
                            .attr('href', resolvedUrl)
                            .text(title)
                );
            } else {
                $titleEl.text(title);
            }
            $content.append($titleEl);

            // Description
            if (desc) {
                $content.append($('<p>').addClass('fr-card__desc').html(desc));
            }

            // Badge (zone "start")
            if (badge) {
                var $start = $('<div>').addClass('fr-card__start');
                var $badgeList = $('<ul>').addClass('fr-badges-group');
                var $badgeItem = $('<li>');
                $badgeItem.append(
                    $('<p>').addClass('fr-badge fr-badge--' + badgeType).text(badge)
                );
                $badgeList.append($badgeItem);
                $start.append($badgeList);
                $content.append($start);
            }

            // Détail (zone "end")
            if (detail) {
                var $end = $('<div>').addClass('fr-card__end');
                var detailClasses = 'fr-card__detail';
                if (detailIcon) detailClasses += ' ' + detailIcon;
                $end.append($('<p>').addClass(detailClasses).text(detail));
                $content.append($end);
            }

            $body.append($content);
            $card.append($body);

            // Image (header — après le body dans le DOM)
            if (image) {
                var $header     = $('<div>').addClass('fr-card__header');
                var $imgWrapper = $('<div>').addClass('fr-card__img');
                $imgWrapper.append(
                    $('<img>').addClass('fr-responsive-img')
                              .attr('src', image)
                              .attr('alt', imageAlt)
                );
                $header.append($imgWrapper);
                $card.append($header);
            }

            return $card;
        },

        /**
         * Transforme les .dsfr-card autonomes.
         */
        transformSingle: function() {
            var self = this;
            $('.dsfr-card').each(function() {
                var $el = $(this);
                if ($el.hasClass('fr-card')) return; // déjà transformé
                $el.replaceWith(self.buildCard($el));
            });
        },

        /**
         * Transforme les .dsfr-card-grid en grille fr-grid-row.
         */
        transformGrid: function() {
            var self = this;
            $('.dsfr-card-grid').each(function() {
                var $grid = $(this);
                if ($grid.hasClass('fr-grid-row')) return; // déjà transformé

                var cols = parseInt($grid.attr('data-cols'), 10) || 3;

                // Classes de colonne responsive selon le nombre de colonnes demandé
                var colClass;
                if (cols === 2) {
                    colClass = 'fr-col-12 fr-col-md-6';
                } else if (cols === 4) {
                    colClass = 'fr-col-12 fr-col-sm-6 fr-col-lg-3';
                } else {
                    // 3 colonnes (défaut)
                    colClass = 'fr-col-12 fr-col-md-6 fr-col-lg-4';
                }

                var $row = $('<ul>').addClass(
                    'fr-grid-row fr-grid-row--gutters fr-grid-row--equal-height'
                );

                $grid.find('.dsfr-card-item').each(function() {
                    var $item = $(this);
                    var $li   = $('<li>').addClass(colClass);
                    $li.append(self.buildCard($item));
                    $row.append($li);
                });

                $grid.replaceWith($row);
            });
        },

        transform: function() {
            // Les grilles d'abord : évite que .dsfr-card-item soit capturé
            // par transformSingle si quelqu'un avait aussi mis .dsfr-card dessus
            this.transformGrid();
            this.transformSingle();
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Card component initialized');
        }
    };

    $(function() {
        if (window.DsfrCard) {
            window.DsfrCard.init();
        }
    });

})();
