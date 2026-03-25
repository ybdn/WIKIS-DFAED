/* SOURCE FILE FOR: [[MediaWiki:Dsfr/Footer.js]] */
$(function() {
    // Wait for Config
    var config = window.DsfrConfig || {
        footer: {
            desc: "Wiki interne",
            links: [],
            bottomLinks: [],
            pageTools: []
        },
        service: { logoText: ["République", "Française"] }
    };

    var footerLinksHtml = config.footer.links.map(function(link) {
        return '<li class="fr-footer__content-item"><a class="fr-footer__content-link" target="_blank" href="' + link.href + '">' + link.label + '</a></li>';
    }).join('');

    // Build bottom links with special handling for tools link
    var bottomLinksHtml = config.footer.bottomLinks.map(function(link) {
        var idAttr = link.id ? ' id="' + link.id + '"' : '';
        var dataAttr = link.isToolsLink ? ' data-tools-trigger="true"' : '';
        return '<li class="fr-footer__bottom-item"><a class="fr-footer__bottom-link"' + idAttr + dataAttr + ' href="' + link.href + '">' + link.label + '</a></li>';
    }).join('');

    var logoHtml = config.service.logoText.join('<br>');

    // Build page tools HTML for modal
    var pageToolsHtml = '';
    if (config.footer.pageTools && config.footer.pageTools.length > 0) {
        pageToolsHtml = config.footer.pageTools.map(function(tool) {
            var href = '#';
            if (tool.specialPage) {
                // Link to special page, potentially with current page as target
                var currentPage = mw.config.get('wgPageName') || '';
                if (tool.specialPage === 'Special:Whatlinkshere' || 
                    tool.specialPage === 'Special:Recentchangeslinked') {
                    href = mw.util.getUrl(tool.specialPage + '/' + currentPage);
                } else {
                    href = mw.util.getUrl(tool.specialPage);
                }
            } else if (tool.action) {
                // Action on current page
                if (tool.action === 'permalink') {
                    var revId = mw.config.get('wgRevisionId');
                    href = mw.util.getUrl(mw.config.get('wgPageName'), { oldid: revId });
                } else if (tool.action === 'info') {
                    href = mw.util.getUrl(mw.config.get('wgPageName'), { action: 'info' });
                }
            }
            return '<li><a class="fr-link fr-link--icon-left fr-icon-arrow-right-line" href="' + href + '">' + tool.label + '</a></li>';
        }).join('');
    }

    // CRITICAL: Uses id="dsfr-footer" to avoid conflict with MediaWiki id="footer"
    var homepageUrl = mw.util.getUrl('Accueil');
    var dsfrFooter = '' +
    '<footer class="fr-footer" role="contentinfo" id="dsfr-footer">' +
    '    <div class="fr-container">' +
    '        <div class="fr-footer__body">' +
    '            <div class="fr-footer__brand fr-enlarge-link">' +
    '                <p class="fr-logo">' +
                        logoHtml +
    '                </p>' +
    '                <a class="fr-footer__brand-link" href="' + homepageUrl + '" title="Retour a l\'accueil du site">' +
    '                    <img src="" class="fr-footer__logo" alt="" aria-hidden="true" />' +
    '                </a>' +
    '            </div>' +
    '            <div class="fr-footer__content">' +
    '                <p class="fr-footer__content-desc">' +
                         config.footer.desc +
    '                </p>' +
    '                <ul class="fr-footer__content-list">' +
                         footerLinksHtml +
    '                </ul>' +
    '            </div>' +
    '        </div>' +
    '        <div class="fr-footer__bottom">' +
    '            <ul class="fr-footer__bottom-list">' +
                     bottomLinksHtml +
    '            </ul>' +
    '            <div class="fr-footer__bottom-copy">' +
    '                <p>Sauf mention contraire, tous les contenus de ce site sont sous <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank">licence etalab-2.0</a></p>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</footer>';

    // Tools Modal HTML
    var toolsModalHtml = '' +
    '<dialog id="dsfr-tools-modal" class="fr-modal" role="dialog" aria-labelledby="dsfr-tools-modal-title">' +
    '    <div class="fr-container fr-container--fluid fr-container-md">' +
    '        <div class="fr-grid-row fr-grid-row--center">' +
    '            <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">' +
    '                <div class="fr-modal__body">' +
    '                    <div class="fr-modal__header">' +
    '                        <button class="fr-btn--close fr-btn" title="Fermer" aria-controls="dsfr-tools-modal" id="dsfr-tools-modal-close">Fermer</button>' +
    '                    </div>' +
    '                    <div class="fr-modal__content">' +
    '                        <h1 id="dsfr-tools-modal-title" class="fr-modal__title">' +
    '                            <span class="fr-icon-tools-line fr-icon--lg" aria-hidden="true"></span>' +
    '                            Outils de la page' +
    '                        </h1>' +
    '                        <ul class="fr-links-group">' +
                                 pageToolsHtml +
    '                        </ul>' +
    '                    </div>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</dialog>';

    // Insert Footer
    $('body').append(dsfrFooter);
    
    // Insert Tools Modal
    $('body').append(toolsModalHtml);
    
    // Tools Modal Logic (ES5 Compatible)
    var toolsLink = document.getElementById('dsfr-tools-link');
    var toolsModal = document.getElementById('dsfr-tools-modal');
    var toolsModalClose = document.getElementById('dsfr-tools-modal-close');
    
    if (toolsLink && toolsModal) {
        // Open modal
        toolsLink.addEventListener('click', function(e) {
            e.preventDefault();
            toolsModal.setAttribute('aria-modal', 'true');
            toolsModal.classList.add('fr-modal--opened');
            // For older browsers without dialog support
            toolsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Close modal - button
        if (toolsModalClose) {
            toolsModalClose.addEventListener('click', function(e) {
                e.preventDefault();
                toolsModal.classList.remove('fr-modal--opened');
                toolsModal.removeAttribute('aria-modal');
                toolsModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Close modal - backdrop click
        toolsModal.addEventListener('click', function(e) {
            if (e.target === toolsModal) {
                toolsModal.classList.remove('fr-modal--opened');
                toolsModal.removeAttribute('aria-modal');
                toolsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Close modal - Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && toolsModal.classList.contains('fr-modal--opened')) {
                toolsModal.classList.remove('fr-modal--opened');
                toolsModal.removeAttribute('aria-modal');
                toolsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    console.log('[DSFR] Footer injected with tools modal');
});
