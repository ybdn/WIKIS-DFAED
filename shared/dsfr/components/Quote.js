/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Quote.js]] */
(function() {
    // DSFR Quote / Citation Component
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/citation
    
    /**
     * Transforms simplified HTML structures (Wikitext-safe) into DSFR Quote components.
     * 
     * Input Pattern (safe for MediaWiki Wikitext):
     * <div class="dsfr-quote">
     *     <div class="dsfr-quote-text">« Le texte de la citation »</div>
     *     <div class="dsfr-quote-author">Nom de l'auteur</div>
     *     <div class="dsfr-quote-source">Nom de l'ouvrage</div>
     *     <div class="dsfr-quote-source">Détail 1</div>
     *     <div class="dsfr-quote-source">Détail 2</div>
     *     <div class="dsfr-quote-link" data-href="https://lien.fr">Texte du lien</div>
     *     <div class="dsfr-quote-image" data-src="/chemin/image.jpg"></div>
     * </div>
     * 
     * Optional modifiers on container:
     * - data-column="true" : layout en colonne (fr-quote--column)
     * - data-size="lg" : grande taille de texte (fr-text--lg)
     * - data-cite="https://source.fr" : URL de la source pour l'attribut cite
     * 
     * Output (DSFR structure):
     * <figure class="fr-quote">
     *     <blockquote cite="https://source.fr">
     *         <p>« Le texte de la citation »</p>
     *     </blockquote>
     *     <figcaption>
     *         <p class="fr-quote__author">Nom de l'auteur</p>
     *         <ul class="fr-quote__source">
     *             <li><cite>Nom de l'ouvrage</cite></li>
     *             <li>Détail 1</li>
     *             <li>Détail 2</li>
     *             <li><a href="https://lien.fr">Texte du lien</a></li>
     *         </ul>
     *         <div class="fr-quote__image">
     *             <img class="fr-responsive-img" src="/chemin/image.jpg" alt="" />
     *         </div>
     *     </figcaption>
     * </figure>
     */

    window.DsfrQuote = {
        transform: function() {
            var self = this;
            
            $('.dsfr-quote').each(function() {
                var $source = $(this);
                
                // Avoid double transformation
                if ($source.hasClass('fr-quote')) return;
                
                // Extract data attributes
                var isColumn = $source.attr('data-column') === 'true';
                var textSize = $source.attr('data-size') || '';
                var citeUrl = $source.attr('data-cite') || '';
                
                // Extract content elements
                var $textEl = $source.find('.dsfr-quote-text').first();
                var $authorEl = $source.find('.dsfr-quote-author').first();
                var $sourceEls = $source.find('.dsfr-quote-source');
                var $linkEl = $source.find('.dsfr-quote-link').first();
                var $imageEl = $source.find('.dsfr-quote-image').first();
                
                // Skip if no text content
                if ($textEl.length === 0) return;
                
                // --- Build DSFR Structure ---
                
                // Main figure container
                var figureClass = 'fr-quote';
                if (isColumn) {
                    figureClass += ' fr-quote--column';
                }
                var $figure = $('<figure>').addClass(figureClass);
                
                // Blockquote
                var $blockquote = $('<blockquote>');
                if (citeUrl) {
                    $blockquote.attr('cite', citeUrl);
                }
                
                // Text paragraph with optional size class
                var $textP = $('<p>');
                if (textSize === 'lg') {
                    $textP.addClass('fr-text--lg');
                } else if (textSize === 'sm') {
                    $textP.addClass('fr-text--sm');
                }
                $textP.html(self.cleanContent($textEl));
                $blockquote.append($textP);
                $figure.append($blockquote);
                
                // Figcaption (only if we have author, source, or image)
                var hasAuthor = $authorEl.length > 0;
                var hasSources = $sourceEls.length > 0 || $linkEl.length > 0;
                var hasImage = $imageEl.length > 0 && $imageEl.attr('data-src');
                
                if (hasAuthor || hasSources || hasImage) {
                    var $figcaption = $('<figcaption>');
                    
                    // Author
                    if (hasAuthor) {
                        var $authorP = $('<p>').addClass('fr-quote__author');
                        $authorP.html(self.cleanContent($authorEl));
                        $figcaption.append($authorP);
                    }
                    
                    // Sources list
                    if (hasSources) {
                        var $sourceUl = $('<ul>').addClass('fr-quote__source');
                        var firstSource = true;
                        
                        // Add source elements
                        $sourceEls.each(function() {
                            var $li = $('<li>');
                            var content = self.cleanContent($(this));
                            
                            // First source is typically the main work title -> wrapped in <cite>
                            if (firstSource) {
                                $li.html('<cite>' + content + '</cite>');
                                firstSource = false;
                            } else {
                                $li.html(content);
                            }
                            $sourceUl.append($li);
                        });
                        
                        // Add link element if present
                        if ($linkEl.length > 0) {
                            var linkHref = $linkEl.attr('data-href') || '#';
                            var linkText = self.cleanContent($linkEl);
                            var $linkLi = $('<li>');
                            var $link = $('<a>').attr('href', linkHref).html(linkText);
                            $linkLi.append($link);
                            $sourceUl.append($linkLi);
                        }
                        
                        $figcaption.append($sourceUl);
                    }
                    
                    // Image
                    if (hasImage) {
                        var imageSrc = $imageEl.attr('data-src');
                        var $imageDiv = $('<div>').addClass('fr-quote__image');
                        var $img = $('<img>')
                            .addClass('fr-responsive-img')
                            .attr('src', imageSrc)
                            .attr('alt', ''); // Alt vide car image illustrative
                        $imageDiv.append($img);
                        $figcaption.append($imageDiv);
                    }
                    
                    $figure.append($figcaption);
                }
                
                // Replace source with DSFR structure
                $source.replaceWith($figure);
            });
        },
        
        /**
         * Cleans HTML content potentially wrapped by MediaWiki (p, pre, code tags)
         * @param {jQuery} $el - Element to extract content from
         * @returns {string} - Cleaned HTML content
         */
        cleanContent: function($el) {
            var html = $el.html();
            if (!html) return '';
            
            html = html.trim();
            
            // If wrapped in a single block element, unwrap
            if ($el.children().length === 1) {
                var $child = $el.children().first();
                var tagName = $child.prop('tagName');
                if (tagName && ['P', 'PRE', 'CODE', 'SPAN'].indexOf(tagName) !== -1) {
                    html = $child.html();
                }
            }
            
            return html;
        },
        
        init: function() {
            this.transform();
            console.log('[DSFR] Quote/Citation component initialized');
        }
    };

    // Auto-init when DOM is ready
    $(function() {
        if (window.DsfrQuote) {
            window.DsfrQuote.init();
        }
    });
})();
