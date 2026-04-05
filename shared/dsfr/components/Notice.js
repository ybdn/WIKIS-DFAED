/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Notice.js]] */
(function() {
    // DSFR Notice Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/bandeau-d-information-importante

    window.DsfrNotice = {
        transform: function() {
            // Input: <div class="dsfr-notice" data-type="info" data-title="Titre important">Message du bandeau</div>
            $('.dsfr-notice').each(function(index) {
                var $source = $(this);
                if ($source.hasClass('fr-notice')) return;

                var type = $source.attr('data-type') || 'info';
                var title = $source.attr('data-title');
                var content = $source.html(); 
                var closable = $source.attr('data-closable') === 'true';

                var typeClass = 'fr-notice--' + type;

                var $notice = $('<div>').addClass('fr-notice').addClass(typeClass);
                var $container = $('<div>').addClass('fr-container');
                var $body = $('<div>').addClass('fr-notice__body');
                var $p = $('<p>');

                if (title) {
                    var $titleSpan = $('<span>').addClass('fr-notice__title').text(title + ' : ');
                    $p.append($titleSpan);
                }
                
                $p.append($('<span>').html(content));
                $body.append($p);

                if (closable) {
                    var $btn = $('<button>')
                        .addClass('fr-btn--close fr-btn')
                        .attr('title', 'Masquer le message')
                        .text('Masquer le message')
                        .on('click', function() {
                            $notice.remove();
                        });
                    $body.append($btn);
                }

                $container.append($body);
                $notice.append($container);
                $source.replaceWith($notice);
            });
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Notice component initialized');
        }
    };

    $(function() {
        if (window.DsfrNotice) {
            window.DsfrNotice.init();
        }
    });
})();
