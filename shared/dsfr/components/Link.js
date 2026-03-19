/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Link.js]] */
(function() {
    // DSFR Link Component — Lien avec icône
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/lien
    //
    // Usage dans le Wikitext :
    //   <span class="dsfr-link" data-type="external" data-href="https://...">Texte</span>
    //   <a class="dsfr-link" data-type="external" href="https://...">Texte</a>
    //   <span class="dsfr-link" data-type="download" data-href="url">Fichier</span>
    //   <span class="dsfr-link" data-type="back" data-href="url">Retour</span>
    //
    // Attributs :
    //   data-type   (obligatoire) "external" | "download" | "back"
    //   data-href   (optionnel si déjà un <a>) URL cible
    //   data-size   (optionnel) "sm" | "lg" pour fr-link--sm / fr-link--lg

    var TYPE_CONFIG = {
        'external': {
            icon: 'fr-icon-external-link-line',
            iconPos: 'right',
            target: '_blank',
            rel: 'noopener noreferrer'
        },
        'download': {
            icon: 'fr-icon-download-line',
            iconPos: 'right',
            target: '',
            rel: ''
        },
        'back': {
            icon: 'fr-icon-arrow-left-line',
            iconPos: 'left',
            target: '',
            rel: ''
        }
    };

    window.DsfrLink = {

        transform: function() {
            var els = document.querySelectorAll('.dsfr-link');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var type = el.getAttribute('data-type') || 'external';
                var cfg = TYPE_CONFIG[type] || TYPE_CONFIG['external'];
                var href = el.getAttribute('data-href') || el.getAttribute('href') || '#';
                var size = el.getAttribute('data-size') || '';
                var text = el.innerHTML;

                var cls = 'fr-link';
                if (size) cls += ' fr-link--' + size;
                cls += ' ' + cfg.icon;
                cls += ' fr-link--icon-' + cfg.iconPos;

                var attrs = 'class="' + cls + '" href="' + href + '"';
                if (cfg.target) attrs += ' target="' + cfg.target + '"';
                if (cfg.rel)    attrs += ' rel="' + cfg.rel + '"';

                var html = '<a ' + attrs + ' data-dsfr-transformed="true">' + text + '</a>';
                el.outerHTML = html;
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Link component initialized');
        }
    };

    $(function() {
        window.DsfrLink.init();
    });

})();
