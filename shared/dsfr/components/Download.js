/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Download.js]] */
(function() {
    // DSFR Download Component — Téléchargement de fichier
    // Documentation : https://www.systeme-de-design.gouv.fr/composants/telechargement-de-fichier
    //
    // Usage dans le Wikitext :
    //   <span class="dsfr-download"
    //         data-href="Fichier:Document.pdf"
    //         data-label="Procédure de traitement des demandes"
    //         data-detail="PDF — 500 Ko"></span>
    //
    // Attributs :
    //   data-href      (obligatoire)  URL absolue ou nom de page wiki (ex: "Fichier:Note.pdf")
    //                                 Si commence par "Fichier:" ou "File:", l'URL wiki est résolue.
    //   data-label     (obligatoire)  Nom du document affiché
    //   data-detail    (optionnel)    Informations secondaires (format, taille, date)
    //                                 Ex: "PDF — 1,2 Mo" ou "DOCX — Mis à jour le 12/01/2025"
    //   data-download  (optionnel)    Valeur de l'attribut download (force le téléchargement)
    //                                 Présence seule suffit. Omis par défaut (ouverture dans l'onglet).

    window.DsfrDownload = {

        /**
         * Génère la structure HTML DSFR d'un lien de téléchargement.
         * @param {Object} opts
         * @param {string} opts.href     - URL du fichier
         * @param {string} opts.label    - Nom du document
         * @param {string} [opts.detail] - Informations secondaires
         * @param {boolean} [opts.download] - Attribut download
         * @returns {string} HTML string
         */
        render: function(opts) {
            if (!opts || !opts.href || !opts.label) return '';

            var href = opts.href;

            // Résoudre les pages wiki Fichier: via mw.util
            if (href.indexOf('Fichier:') === 0 || href.indexOf('File:') === 0) {
                if (window.mw && window.mw.util) {
                    href = window.mw.util.getUrl(href);
                }
            }

            var downloadAttr = opts.download ? ' download' : '';
            var detailHtml = opts.detail
                ? '<span class="fr-download__detail">' + opts.detail + '</span>'
                : '';

            return '<div class="fr-download">' +
                '<p>' +
                    '<a href="' + href + '" class="fr-download__link"' + downloadAttr + '>' +
                        opts.label +
                        detailHtml +
                    '</a>' +
                '</p>' +
            '</div>';
        },

        /**
         * Parcourt le DOM et transforme les éléments .dsfr-download.
         */
        transform: function() {
            var items = document.querySelectorAll('.dsfr-download');
            for (var i = 0; i < items.length; i++) {
                var el = items[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var href   = el.getAttribute('data-href') || '';
                var label  = el.getAttribute('data-label') || '';
                if (!href || !label) continue;

                var html = window.DsfrDownload.render({
                    href:     href,
                    label:    label,
                    detail:   el.getAttribute('data-detail') || '',
                    download: el.hasAttribute('data-download')
                });

                if (html) {
                    el.outerHTML = html;
                }
            }
        },

        init: function() {
            this.transform();
            console.log('[DSFR] Download component initialized');
        }
    };

    $(function() {
        window.DsfrDownload.init();
    });

})();
