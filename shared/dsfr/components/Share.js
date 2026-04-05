/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Share.js]] */
(function() {
    // DSFR Share Component (Partage)
    // Documentation: https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/partage
    // Adapté au contexte intranet : réseaux sociaux remplacés par options internes (copier lien, email).

    window.DsfrShare = {
        /**
         * Injecte ou transforme un bloc de partage DSFR.
         *
         * Input Pattern :
         * <div class="dsfr-share"
         *      data-title="Partager la page"
         *      data-email
         *      data-copy>
         * </div>
         *
         * Attributs optionnels :
         *   data-title="..."  → Titre du bloc (défaut "Partager la page")
         *   data-email        → Ajoute lien "Envoyer par mail"
         *   data-copy         → Ajoute bouton "Copier le lien"
         *   data-print        → Ajoute bouton "Imprimer"
         */
        transform: function() {
            $('.dsfr-share').each(function() {
                var $el    = $(this);
                if ($el.hasClass('fr-share')) return;

                var title  = $el.attr('data-title') || 'Partager la page';
                var email  = $el.attr('data-email')  !== undefined;
                var copy   = $el.attr('data-copy')   !== undefined;
                var print  = $el.attr('data-print')  !== undefined;
                var pageUrl   = window.location.href;
                var pageTitle = document.title;

                var $share = $('<div>').addClass('fr-share');
                $share.append($('<p>').addClass('fr-share__title').text(title));

                var $ul = $('<ul>').addClass('fr-btns-group');

                if (email) {
                    var mailto = 'mailto:?subject=' + encodeURIComponent(pageTitle) +
                                 '&body=' + encodeURIComponent(pageUrl);
                    var $liEmail = $('<li>');
                    $liEmail.append(
                        $('<a>').addClass('fr-btn fr-btn--tertiary-no-outline fr-icon-mail-line fr-btn--icon-left')
                            .attr('href', mailto)
                            .text('Envoyer par mail')
                    );
                    $ul.append($liEmail);
                }

                if (copy) {
                    var $liCopy = $('<li>');
                    var $copyBtn = $('<button>')
                        .addClass('fr-btn fr-btn--tertiary-no-outline fr-icon-links-fill fr-btn--icon-left')
                        .attr('data-dsfr-copy-url', pageUrl)
                        .text('Copier le lien');
                    $liCopy.append($copyBtn);
                    $ul.append($liCopy);
                }

                if (print) {
                    var $liPrint = $('<li>');
                    $liPrint.append(
                        $('<button>')
                            .addClass('fr-btn fr-btn--tertiary-no-outline fr-icon-printer-line fr-btn--icon-left')
                            .attr('data-dsfr-print', true)
                            .text('Imprimer')
                    );
                    $ul.append($liPrint);
                }

                $share.append($ul);
                $el.replaceWith($share);
            });
        },

        bindEvents: function() {
            // Copier le lien dans le presse-papiers
            $(document.body).on('click', '[data-dsfr-copy-url]', function() {
                var url     = $(this).attr('data-dsfr-copy-url');
                var $btn    = $(this);
                var origTxt = $btn.text();

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(function() {
                        $btn.text('Lien copié !');
                        setTimeout(function() { $btn.text(origTxt); }, 2000);
                    });
                } else {
                    // Fallback pour les navigateurs sans clipboard API
                    var $tmp = $('<textarea>').val(url).css({ position: 'fixed', top: '-1000px' });
                    $(document.body).append($tmp);
                    $tmp[0].select();
                    document.execCommand('copy');
                    $tmp.remove();
                    $btn.text('Lien copié !');
                    setTimeout(function() { $btn.text(origTxt); }, 2000);
                }
            });

            // Imprimer la page
            $(document.body).on('click', '[data-dsfr-print]', function() {
                window.print();
            });
        },

        init: function() {
            this.transform();
            this.bindEvents();
            console.log('[DSFR] Share component initialized');
        }
    };

    $(function() {
        window.DsfrShare.init();
    });
})();
