/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Accordion.js]] */
(function() {
    // DSFR Accordion Component (Lightweight Polyfill)
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/accordeon
    
    window.DsfrAccordion = {
        /**
         * Initializes accordion behavior for existing HTML provided by templates/users
         * Targets standard DSFR structure: .fr-accordion__btn[aria-controls] -> .fr-collapse[id]
         */
        /**
         * Transforms simplified HTML structures (safe for Wikitext) into complex DSFR Accordions.
         * MediaWiki often strips <button> tags and aria-attributes in Wikitext.
         * 
         * Input Pattern:
         * <div class="dsfr-accordion-item">
         *    <div class="dsfr-accordion-title">Titre</div>
         *    <div class="dsfr-accordion-content">Contenu</div>
         * </div>
         */
        transform: function() {
            $('.dsfr-accordion-item').each(function(index) {
                var $source = $(this);
                
                // Avoid double transformation
                if ($source.hasClass('fr-accordion')) return;

                var $titleEl = $source.find('.dsfr-accordion-title');
                var $contentEl = $source.find('.dsfr-accordion-content');

                if ($titleEl.length === 0 || $contentEl.length === 0) return;

                // Unique IDs
                var uniqueId = 'accordion-' + Date.now() + '-' + index;
                
                // Content Cleaning Strategy
                // MediaWiki often wraps simple text in <p> or <pre> if formatted strictly.
                // We want to unwrap the title to avoid "block in button" issues.
                var titleHtml = $titleEl.html().trim();
                
                // If title is wrapped in a single <p>, <pre> or <code>, unwrap it.
                if ($titleEl.children().length === 1) {
                    var $child = $titleEl.children().first();
                    if (['P', 'PRE', 'CODE'].indexOf($child.prop('tagName')) !== -1) {
                        titleHtml = $child.html();
                    }
                }

                // Build DSFR Structure
                var $accordion = $('<section>').addClass('fr-accordion');
                var $titleHeader = $('<h3>').addClass('fr-accordion__title');
                
                var $btn = $('<button>')
                    .addClass('fr-accordion__btn')
                    .attr('aria-expanded', 'false')
                    .attr('aria-controls', uniqueId)
                    .html(titleHtml); 

                var $collapse = $('<div>')
                    .addClass('fr-collapse')
                    .attr('id', uniqueId)
                    .html($contentEl.html()); 

                // Assemble
                $titleHeader.append($btn);
                $accordion.append($titleHeader).append($collapse);

                // Replace source
                $source.replaceWith($accordion);
            });
        },

        init: function() {
            // 1. Transform safe-HTML into DSFR components
            this.transform();

            // 2. Handle Interaction (Event Delegation)
            $(document.body).on('click', '.fr-accordion__btn', function(e) {
                var $btn = $(this);
                e.preventDefault(); 

                var targetId = $btn.attr('aria-controls');
                if (!targetId) return;

                var $target = $('#' + targetId);
                if ($target.length === 0) return;

                var isExpanded = $btn.attr('aria-expanded') === 'true';

                if (isExpanded) {
                    $btn.attr('aria-expanded', 'false');
                    $target.removeClass('fr-collapse--expanded');
                } else {
                    $btn.attr('aria-expanded', 'true');
                    $target.addClass('fr-collapse--expanded');
                }
            });

            console.log('[DSFR] Accordion component initialized');
        }
    };

    // Auto-init immediately when loaded
    $(function() { 
        window.DsfrAccordion.init(); 
    });

})();
