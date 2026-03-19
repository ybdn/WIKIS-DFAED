/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Transcription.js]] */
(function() {
    // DSFR Transcription Component — Bloc pliable de transcription textuelle (accessibilité vidéo)
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/transcription
    //
    // Usage dans le Wikitext :
    //   <div class="dsfr-transcription">
    //     <div class="dsfr-transcription-title">Transcription</div>
    //     <div class="dsfr-transcription-content">Texte de la transcription...</div>
    //   </div>
    //
    // Attributs optionnels du conteneur :
    //   data-title   Titre du bouton si pas de .dsfr-transcription-title (défaut : "Transcription")

    var _counter = 0;

    window.DsfrTranscription = {

        transform: function() {
            var els = document.querySelectorAll('.dsfr-transcription');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.getAttribute('data-dsfr-transformed') === 'true') continue;

                var $el = $(el);
                var $titleEl   = $el.find('.dsfr-transcription-title').first();
                var $contentEl = $el.find('.dsfr-transcription-content').first();

                if (!$contentEl.length) continue;

                _counter++;
                var collapseId = 'transcription-collapse-' + _counter;
                var wrapperId  = 'transcription-' + _counter;

                var titleText = $titleEl.length
                    ? $titleEl.text().trim()
                    : (el.getAttribute('data-title') || 'Transcription');

                var contentHtml = $contentEl.html();

                var html =
                    '<div class="fr-transcription" id="' + wrapperId + '" data-dsfr-transformed="true">' +
                        '<button class="fr-transcription__btn"' +
                            ' aria-expanded="false"' +
                            ' aria-controls="' + collapseId + '">' +
                            titleText +
                        '</button>' +
                        '<div class="fr-collapse" id="' + collapseId + '">' +
                            '<div class="fr-transcription__footer">' +
                                '<div class="fr-transcription__actions-group"></div>' +
                            '</div>' +
                            '<div class="fr-transcription__content">' +
                                contentHtml +
                            '</div>' +
                        '</div>' +
                    '</div>';

                el.outerHTML = html;
            }
        },

        _bindEvents: function() {
            $(document.body).on('click', '.fr-transcription__btn', function(e) {
                var $btn = $(this);
                e.preventDefault();

                var targetId = $btn.attr('aria-controls');
                if (!targetId) return;

                var $target = $('#' + targetId);
                if (!$target.length) return;

                var isExpanded = $btn.attr('aria-expanded') === 'true';
                if (isExpanded) {
                    $btn.attr('aria-expanded', 'false');
                    $target.removeClass('fr-collapse--expanded');
                } else {
                    $btn.attr('aria-expanded', 'true');
                    $target.addClass('fr-collapse--expanded');
                }
            });
        },

        init: function() {
            this.transform();
            this._bindEvents();
            console.log('[DSFR] Transcription component initialized');
        }
    };

    $(function() {
        window.DsfrTranscription.init();
    });

})();
