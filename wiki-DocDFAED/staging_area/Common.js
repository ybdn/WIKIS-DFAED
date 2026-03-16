/* 
 * -------------------------------------------------------------------------
 * SOURCE FILE FOR: MediaWiki:Common.js (AUTO-DETECT PATH)
 * -------------------------------------------------------------------------
 */

(function () {
    // ---------------------------------------------------------------------
    // 0. LOADER
    // ---------------------------------------------------------------------
    (function() {
        var css = '#dsfr-global-loader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 90000; display: flex; align-items: center; justify-content: center; } .dsfr-loader-spinner { width: 48px; height: 48px; border: 5px solid #000091; border-bottom-color: transparent; border-radius: 50%; animation: dsfr-rotation 1s linear infinite; } @keyframes dsfr-rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        var s = document.createElement('style'); s.appendChild(document.createTextNode(css)); document.head.appendChild(s);
        var div = document.createElement('div'); div.id = 'dsfr-global-loader'; div.innerHTML = '<span class="dsfr-loader-spinner"></span>';
        if(document.body) document.body.appendChild(div);
        
        window.DsfrHideLoader = function() { var el=document.getElementById('dsfr-global-loader'); if(el) el.parentNode.removeChild(el); };
        setTimeout(window.DsfrHideLoader, 5000); // Failsafe 5s
    })();

    // ---------------------------------------------------------------------
    // 1. CHARGEMENT DES MODULES (attend jQuery ready)
    // ---------------------------------------------------------------------
    $(function () {
        var apiPath = mw.config.get('wgScript');
        var isLocal = window.location.hostname === 'localhost';

        var dsfrModules = [
            'Config',
            'Layout',
            'Header',
            'Footer',
            'EditPage',
            'components/Accordion',
            'components/Alert',
            'components/Badge',
            'components/Card'
        ];

        console.log('[DSFR] Loading modules from:', apiPath);

        if (isLocal) {
            dsfrModules.forEach(function(m) {
                var s = document.createElement('script');
                s.src = '/staging_area/dsfr/' + m + '.js?v=' + Date.now();
                document.head.appendChild(s);
            });
        } else {
            // PROD : Chargement via balises manuelles

            // 1. Charger le CSS via balise <link>
            var cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.type = 'text/css';
            cssLink.href = apiPath + '?title=MediaWiki:Dsfr/Style.css&action=raw&ctype=text/css';
            document.head.appendChild(cssLink);
            console.log('[DSFR] CSS loaded via <link>');

            // 2. Charger les JS via balises <script>
            dsfrModules.forEach(function(m) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = apiPath + '?title=MediaWiki:Dsfr/' + m + '.js&action=raw&ctype=text/javascript';
                document.head.appendChild(script);
                console.log('[DSFR] Loading module:', m);
            });
        }
    });

}());
