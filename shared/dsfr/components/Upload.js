/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Upload.js]] */
(function() {
    // DSFR Upload Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/ajout-de-fichier

    window.DsfrUpload = {
        transform: function() {
            // Input: <div class="dsfr-upload" data-label="Ajouter un fichier" data-hint="Taille max: 10 Mo"></div>
            $('.dsfr-upload').each(function(index) {
                var $source = $(this);
                if ($source.hasClass('fr-upload-group')) return;

                var label = $source.attr('data-label') || 'Ajouter un fichier';
                var hint = $source.attr('data-hint');
                var uniqueId = 'file-upload-' + Date.now() + '-' + index;
                var name = $source.attr('data-name') || uniqueId;

                var $group = $('<div>').addClass('fr-upload-group');
                var $label = $('<label>')
                    .addClass('fr-label')
                    .attr('for', uniqueId)
                    .text(label);

                if (hint) {
                    var $hint = $('<span>').addClass('fr-hint-text').text(hint);
                    $label.append($hint);
                }

                var $input = $('<input>')
                    .addClass('fr-upload')
                    .attr('type', 'file')
                    .attr('id', uniqueId)
                    .attr('name', name);

                $group.append($label).append($input);
                $source.replaceWith($group);
            });
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Upload component initialized');
        }
    };

    $(function() {
        if (window.DsfrUpload) {
            window.DsfrUpload.init();
        }
    });
})();
