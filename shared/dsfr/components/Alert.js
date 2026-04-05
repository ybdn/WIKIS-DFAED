/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Alert.js]] */
(function() {
    // DSFR Alert Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/alerte

    window.DsfrAlert = {
        transform: function() {
            // Input: <div class="dsfr-alert" data-type="info" data-title="Titre de l'alerte">Contenu de l'alerte</div>
            $('.dsfr-alert').each(function(index) {
                var $source = $(this);
                if ($source.hasClass('fr-alert')) return;

                var type = $source.attr('data-type') || 'info'; // info, success, warning, error
                var title = $source.attr('data-title');
                var content = $source.html(); 
                var closable = $source.attr('data-closable') === 'true';

                // Map type to class
                var typeClass = 'fr-alert--' + type;

                var $alert = $('<div>').addClass('fr-alert').addClass(typeClass);
                
                if (title) {
                    var $title = $('<h3>').addClass('fr-alert__title').text(title);
                    $alert.append($title);
                }

                var $p = $('<p>').html(content);
                $alert.append($p);

                if (closable) {
                    var $btn = $('<button>')
                        .addClass('fr-btn--close fr-btn')
                        .attr('title', 'Masquer le message')
                        .text('Masquer le message')
                        .on('click', function() {
                            $alert.remove();
                        });
                    $alert.append($btn);
                }

                $source.replaceWith($alert);
            });
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Alert component initialized');
        }
    };

    $(function() {
        if (window.DsfrAlert) {
            window.DsfrAlert.init();
        }
    });
})();
