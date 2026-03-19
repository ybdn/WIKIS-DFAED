/*
 * -------------------------------------------------------------------------
 * SOURCE FILE FOR: MediaWiki:Common.js (AUTO-DETECT PATH)
 * -------------------------------------------------------------------------
 * Pattern : base commune + configuration d'instance
 *   — Config.js     : navigation propre à cette instance (staging_area/dsfr/)
 *   — Autres modules : base commune partagée (shared/dsfr/ en local)
 *
 * Anti-FOUC : deux failsafes garantissent que le contenu devient visible.
 *   — JS  : setTimeout 5000ms ci-dessous
 *   — CSS : animation différée 4s dans Common.css
 * -------------------------------------------------------------------------
 */

(function () {

    $(function () {
        var apiPath = mw.config.get('wgScript');
        var isLocal = window.location.hostname === 'localhost';

        // Config est spécifique à cette instance — toujours chargé depuis staging_area/dsfr/
        var localModules = [
            'Config'
        ];

        // Modules de la base commune — shared/dsfr/ en local, MediaWiki:Dsfr/ en prod
        var sharedModules = [
            'Layout',
            'Header',
            'Footer',
            'EditPage',
            'components/Accordion',
            'components/Alert',
            'components/Badge',
            'components/Card',
            'components/Stepper',
            'components/Tooltip',
            'components/Table',
            'components/Tab',
            'components/Download',
            'components/Tag',
            'components/Summary'
        ];

        var allModules = localModules.concat(sharedModules);
        var total    = allModules.length;
        var loaded   = 0;
        var revealed = false;

        function reveal() {
            if (revealed) return;
            revealed = true;
            document.documentElement.classList.add('dsfr-ready');
            console.log('[DSFR] Ready — all modules loaded (' + total + ')');
        }

        var failsafe = setTimeout(function() {
            console.warn('[DSFR] Failsafe triggered — revealing after timeout');
            reveal();
        }, 5000);

        function onModuleLoaded() {
            loaded++;
            if (loaded >= total) {
                clearTimeout(failsafe);
                reveal();
            }
        }

        console.log('[DSFR] Loading ' + total + ' modules — env: ' + (isLocal ? 'local' : 'prod'));

        if (isLocal) {
            // Config : depuis staging_area/dsfr/ (spécifique à cette instance)
            localModules.forEach(function(m) {
                var s = document.createElement('script');
                s.src = '/staging_area/dsfr/' + m + '.js?v=' + Date.now();
                s.onload  = onModuleLoaded;
                s.onerror = onModuleLoaded;
                document.head.appendChild(s);
            });
            // Base commune : depuis shared/dsfr/
            sharedModules.forEach(function(m) {
                var s = document.createElement('script');
                s.src = '/shared/dsfr/' + m + '.js?v=' + Date.now();
                s.onload  = onModuleLoaded;
                s.onerror = onModuleLoaded;
                document.head.appendChild(s);
            });
        } else {
            // PROD : CSS de personnalisation
            var cssLink = document.createElement('link');
            cssLink.rel  = 'stylesheet';
            cssLink.type = 'text/css';
            cssLink.href = apiPath + '?title=MediaWiki:Dsfr/Style.css&action=raw&ctype=text/css';
            document.head.appendChild(cssLink);

            // PROD : tous les modules depuis MediaWiki:Dsfr/ (inchangé)
            allModules.forEach(function(m) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src  = apiPath + '?title=MediaWiki:Dsfr/' + m + '.js&action=raw&ctype=text/javascript';
                s.onload  = onModuleLoaded;
                s.onerror = onModuleLoaded;
                document.head.appendChild(s);
                console.log('[DSFR] Loading module:', m);
            });
        }
    });

}());
