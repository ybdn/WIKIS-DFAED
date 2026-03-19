/* SOURCE FILE FOR: [[MediaWiki:Dsfr/Layout.js]] */
/* 
    Responsabilités : 
    1. Charger les libs externes (CSS/JS DSFR)
    2. Nettoyer le DOM natif MediaWiki
    3. Préparer le conteneur de contenu
*/

// 1. Load DSFR Resources
// We load CSS here AS A FALLBACK in case LocalSettings.php isn't restarted or cached.
// Redundant loading is handled by browser cache, so no harm done.
mw.loader.load('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/dsfr.min.css', 'text/css');
mw.loader.load('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/utility/utility.min.css', 'text/css');
mw.loader.load('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/utility/icons/icons.min.css', 'text/css');

// Load DSFR JS Module
var script = document.createElement('script');
script.type = 'module';
script.src = 'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/dsfr.module.min.js';
document.head.appendChild(script);

$(function() {
    console.log('[DSFR] Layout Cleaning starting...');

    // 2. Add DSFR classes to main content container
    $('#content').addClass('fr-container fr-my-4w');

    // 3. Hide native elements (Sidebar, Footer, etc.) BUT Keep #mw-head for Tabs/Tools
    $('#mw-panel, #siteNotice, .mw-footer, #footer, .vector-sticky-header').hide();

    // Remove useless MW chrome
    $('#mw-page-base, #mw-head-base, .mw-editTools, .limitreport').remove();

    // Supprimer le sommaire automatique MediaWiki (remplacé par le composant Summary.js)
    $('#toc').remove();

    // 4. BREADCRUMB — Replaces the H1 page title with a DSFR fil d'Ariane
    var pageName = mw.config.get('wgPageName') || '';
    var pageTitle = mw.config.get('wgTitle') || '';
    var action = mw.config.get('wgAction');

    // Only show breadcrumb in view mode (not edit/submit)
    if (action === 'view' && pageName) {
        // Parse page name into segments using ':' and '/' as hierarchy separators
        // e.g. "Documentation:ASQ:1-00_Sommaire" → ["Documentation", "ASQ", "1-00 Sommaire"]
        // e.g. "NeoDK:Fiches_pratiques/Detail"   → ["NeoDK", "Fiches pratiques", "Detail"]
        var rawSegs = []; // raw parts (with underscores, for link reconstruction)
        var seps = [];    // separators between parts (':' or '/')

        var colonParts = pageName.split(':');
        for (var ci = 0; ci < colonParts.length; ci++) {
            var slashParts = colonParts[ci].split('/');
            for (var si = 0; si < slashParts.length; si++) {
                rawSegs.push(slashParts[si]);
                if (si < slashParts.length - 1) {
                    seps.push('/');
                }
            }
            if (ci < colonParts.length - 1) {
                seps.push(':');
            }
        }

        var labels = [];
        for (var idx = 0; idx < rawSegs.length; idx++) {
            labels.push(rawSegs[idx].replace(/_/g, ' '));
        }

        // Don't show breadcrumb on the homepage
        if (pageName !== 'Accueil' && rawSegs.length > 0) {
            var breadcrumbId = 'breadcrumb-' + Date.now();
            var breadcrumbHtml = '' +
                '<nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">' +
                '  <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="' + breadcrumbId + '">Voir le fil d\'Ariane</button>' +
                '  <div class="fr-collapse" id="' + breadcrumbId + '">' +
                '    <ol class="fr-breadcrumb__list">' +
                '      <li><a class="fr-breadcrumb__link" href="' + mw.util.getUrl('Accueil') + '">Accueil</a></li>';

            // Build intermediate links (all segments except the last one)
            for (var s = 0; s < rawSegs.length - 1; s++) {
                // Reconstruct the wiki page name up to segment s
                var linkTarget = rawSegs[0];
                for (var k = 1; k <= s; k++) {
                    linkTarget += seps[k - 1] + rawSegs[k];
                }
                breadcrumbHtml += '<li><a class="fr-breadcrumb__link" href="' + mw.util.getUrl(linkTarget) + '">' + labels[s] + '</a></li>';
            }

            // Last segment = current page (no link)
            var lastLabel = labels[labels.length - 1];
            breadcrumbHtml += '<li><a class="fr-breadcrumb__link" aria-current="page">' + lastLabel + '</a></li>';

            breadcrumbHtml += '' +
                '    </ol>' +
                '  </div>' +
                '</nav>';

            // Find the H1 and replace with breadcrumb + clean title
            var $h1 = $('#firstHeading, .firstHeading, .mw-first-heading').first();
            if ($h1.length) {
                $h1.before(breadcrumbHtml);
                // Replace H1 content with just the last segment (clean title)
                $h1.text(lastLabel);
            }
        }
    }

    console.log('[DSFR] Layout Cleaning done.');
});
