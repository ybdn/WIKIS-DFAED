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

    function init() {
        var apiPath = mw.config.get('wgScript');
        var isLocal = window.location.hostname === 'localhost';

        // Modules spécifiques à cette instance — toujours chargés depuis staging_area/dsfr/
        var localModules = [
            'Config',
            'Header',
            'Footer'
        ];

        // Modules de la base commune — shared/dsfr/ en local, MediaWiki:Dsfr/ en prod
        var sharedModules = [
            'Layout',
            'EditPage',
            'components/Accordion',
            'components/Alert',
            'components/Badge',
            'components/Breadcrumb',
            'components/Button',
            'components/Callout',
            'components/Card',
            'components/Checkbox',
            'components/Download',
            'components/Dropdown',
            'components/Form',
            'components/Highlight',
            'components/Input',
            'components/Link',
            'components/Modal',
            'components/Notice',
            'components/Pagination',
            'components/Quote',
            'components/Radio',
            'components/Search',
            'components/Segmented',
            'components/Share',
            'components/Sidemenu',
            'components/Skiplink',
            'components/Stepper',
            'components/Summary',
            'components/Tab',
            'components/Tabnav',
            'components/Table',
            'components/Tag',
            'components/Tile',
            'components/Toggle',
            'components/Tooltip',
            'components/Transcription',
            'components/Upload',
            'EasterEgg'
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
        /* ----------------------------------------------------------- */
        /*  PLANNING — chargement conditionnel (pages Planning:*)       */
        /* ----------------------------------------------------------- */
        var currentPage = mw.config.get('wgPageName') || '';
        if (currentPage.indexOf('Planning:') === 0) {
            var planningModules = [
                'planning/MissionsP4S',
                'planning/MissionsJournalier',
                'planning/PlanningData',
                'planning/PlanningP4S',
                'planning/PlanningJournalier',
                'planning/PlanningPersonnel',
                'planning/PlanningApp'
            ];
            console.log('[DSFR] Loading Planning modules (' + planningModules.length + ')');
            planningModules.forEach(function(m) {
                var s = document.createElement('script');
                if (isLocal) {
                    s.src = '/staging_area/dsfr/' + m + '.js?v=' + Date.now();
                } else {
                    s.type = 'text/javascript';
                    s.src = apiPath + '?title=MediaWiki:Dsfr/' + m + '.js&action=raw&ctype=text/javascript';
                }
                s.onload = function() { console.log('[DSFR] Planning module loaded: ' + m); };
                s.onerror = function() { console.error('[DSFR] FAILED to load planning module: ' + m + ' — verifiez que la page MediaWiki:Dsfr/' + m + '.js existe'); };
                document.head.appendChild(s);
            });
        }

        /* ----------------------------------------------------------- */
        /*  OCE — chargement conditionnel (pages OCE:*)                 */
        /* ----------------------------------------------------------- */
        if (currentPage.indexOf('OCE:') === 0) {
            var oceModules = [
                'oce/OceConfig',
                'oce/OceData',
                'oce/OceTable',
                'oce/OceForm',
                'oce/OceStats',
                'oce/OceApp'
            ];
            console.log('[DSFR] Loading OCE modules (' + oceModules.length + ')');
            oceModules.forEach(function(m) {
                var s = document.createElement('script');
                if (isLocal) {
                    s.src = '/staging_area/dsfr/' + m + '.js?v=' + Date.now();
                } else {
                    s.type = 'text/javascript';
                    s.src = apiPath + '?title=MediaWiki:Dsfr/' + m + '.js&action=raw&ctype=text/javascript';
                }
                document.head.appendChild(s);
            });
        }
    }

    function waitForDeps() {
        if (window.jQuery && window.mw && window.mw.config && window.mw.util) {
            init();
        } else {
            setTimeout(waitForDeps, 50);
        }
    }
    waitForDeps();

}());
