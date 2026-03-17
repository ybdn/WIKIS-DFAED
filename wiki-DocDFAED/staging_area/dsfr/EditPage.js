/* SOURCE FILE FOR: [[MediaWiki:Dsfr/EditPage.js]] */
(function() {
    var action = mw.config.get('wgAction');
    if (action !== 'edit' && action !== 'submit') return;

    function insertTags(open, close, sample) {
        var txtarea = document.getElementById('wpTextbox1');
        if (!txtarea) return;
        if (window.mw && window.mw.toolbar && window.mw.toolbar.insertTags) {
            window.mw.toolbar.insertTags(open, close, sample);
            return;
        }
        var startPos = txtarea.selectionStart;
        var endPos = txtarea.selectionEnd;
        var scrollTop = txtarea.scrollTop;
        var val = txtarea.value;
        var selText = val.substring(startPos, endPos) || sample;
        txtarea.value = val.substring(0, startPos) + open + selText + close + val.substring(endPos);
        txtarea.selectionStart = startPos + open.length;
        txtarea.selectionEnd = startPos + open.length + selText.length;
        txtarea.scrollTop = scrollTop;
        txtarea.focus();
    }

    $(function() {
        console.log('[DSFR] Edit Page logic starting...');

        // Custom icon classes to match DSFR icon system (mask-image on ::before/::after)
        // DSFR buttons auto-style ::before/::after only for classes matching [class^="fr-icon-"].
        // Our "dsfr-icon-*" classes don't match, so we must provide ALL base pseudo-element properties.
        var iconBase =
            'content:"";display:inline-block;vertical-align:middle;' +
            'width:1rem;height:1rem;' +
            'background-color:currentColor;' +
            '-webkit-mask-size:100% 100%;mask-size:100% 100%;' +
            '-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;';

        var customIconsCss =
            '.dsfr-icon-underline::before{' + iconBase +
                '-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M8 3v9a4 4 0 0 0 8 0V3h2v9a6 6 0 0 1-12 0V3h2zM4 20h16v2H4v-2z\'/%3E%3C/svg%3E");' +
                'mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M8 3v9a4 4 0 0 0 8 0V3h2v9a6 6 0 0 1-12 0V3h2zM4 20h16v2H4v-2z\'/%3E%3C/svg%3E")' +
            '}' +
            '.dsfr-icon-align-center::before{' + iconBase +
                '-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M3 4h18v2H3V4zm2 4h14v2H5V8zm-2 4h18v2H3v-2zm2 4h14v2H5v-2zm-2 4h18v2H3v-2z\'/%3E%3C/svg%3E");' +
                'mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M3 4h18v2H3V4zm2 4h14v2H5V8zm-2 4h18v2H3v-2zm2 4h14v2H5v-2zm-2 4h18v2H3v-2z\'/%3E%3C/svg%3E")' +
            '}' +
            '.dsfr-icon-align-right::before{' + iconBase +
                '-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M3 4h18v2H3V4zm4 4h14v2H7V8zm-4 4h18v2H3v-2zm4 4h14v2H7v-2zm-4 4h18v2H3v-2z\'/%3E%3C/svg%3E");' +
                'mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M3 4h18v2H3V4zm4 4h14v2H7V8zm-4 4h18v2H3v-2zm4 4h14v2H7v-2zm-4 4h18v2H3v-2z\'/%3E%3C/svg%3E")' +
            '}' +
            '.dsfr-icon-align-justify::before{' + iconBase +
                '-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z\'/%3E%3C/svg%3E");' +
                'mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z\'/%3E%3C/svg%3E")' +
            '}' +
            '.dsfr-icon-font-color::before{' + iconBase +
                '-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M15.2459 14H8.75407L7.15407 18H5L11 3H13L19 18H16.8459L15.2459 14ZM14.4459 12L12 5.88516L9.55407 12H14.4459ZM3 20H21V22H3V20Z\'/%3E%3C/svg%3E");' +
                'mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M15.2459 14H8.75407L7.15407 18H5L11 3H13L19 18H16.8459L15.2459 14ZM14.4459 12L12 5.88516L9.55407 12H14.4459ZM3 20H21V22H3V20Z\'/%3E%3C/svg%3E")' +
            '}' +
            '.dsfr-icon-highlight::before{' + iconBase +
                '-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M15.5858 2.58579L21.4142 8.41421L18.5858 11.2426L16.4645 9.12132L12.9289 12.6569L14.3431 14.0711L12.9289 15.4853L7.27208 9.82843L8.68629 8.41421L10.1005 9.82843L13.636 6.29289L11.5147 4.17157L14.3431 1.34315ZM17.1716 12.6569L19.2929 14.7782C20.0739 15.5592 20.0739 16.8256 19.2929 17.6066L16.1111 20.7884C15.7206 21.1789 15.1906 21.3982 14.6365 21.3982L13.2223 21.3982L13.2223 20.6929C13.2223 19.5883 12.3268 18.6929 11.2223 18.6929L9.80808 18.6929C8.70351 18.6929 7.80808 17.7974 7.80808 16.6929L7.80808 15.2787C6.70351 15.2787 5.80808 14.3833 5.80808 13.2787L5.80808 11.8645L3.68675 9.74313L6.51518 6.91471L17.1716 17.5711C17.9526 18.3521 19.2189 18.3521 19.9999 17.5711L21.4141 16.1569L17.1716 11.9142ZM5.80808 21.3982L3.00008 21.3982L3.00008 18.592L6.18228 15.4098C6.72124 15.9488 7.45331 16.2787 8.2223 16.2787L9.80808 16.2787C10.1473 16.2787 10.4223 16.5538 10.4223 16.8929L10.4223 18.6929C10.4223 19.8219 11.3193 20.7431 12.4428 20.7925L12.6223 20.7929L14.6365 20.7929C15.0035 20.7929 15.3562 20.6479 15.617 20.3871L17.5001 18.504L8.50008 9.50402L5.80808 12.192L5.80808 13.2787C5.80808 14.8213 7.06096 16.0742 8.60351 16.0742L8.60808 17.504L5.80808 17.504Z\'/%3E%3C/svg%3E");' +
                'mask-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M15.5858 2.58579L21.4142 8.41421L18.5858 11.2426L16.4645 9.12132L12.9289 12.6569L14.3431 14.0711L12.9289 15.4853L7.27208 9.82843L8.68629 8.41421L10.1005 9.82843L13.636 6.29289L11.5147 4.17157L14.3431 1.34315ZM17.1716 12.6569L19.2929 14.7782C20.0739 15.5592 20.0739 16.8256 19.2929 17.6066L16.1111 20.7884C15.7206 21.1789 15.1906 21.3982 14.6365 21.3982L13.2223 21.3982L13.2223 20.6929C13.2223 19.5883 12.3268 18.6929 11.2223 18.6929L9.80808 18.6929C8.70351 18.6929 7.80808 17.7974 7.80808 16.6929L7.80808 15.2787C6.70351 15.2787 5.80808 14.3833 5.80808 13.2787L5.80808 11.8645L3.68675 9.74313L6.51518 6.91471L17.1716 17.5711C17.9526 18.3521 19.2189 18.3521 19.9999 17.5711L21.4141 16.1569L17.1716 11.9142ZM5.80808 21.3982L3.00008 21.3982L3.00008 18.592L6.18228 15.4098C6.72124 15.9488 7.45331 16.2787 8.2223 16.2787L9.80808 16.2787C10.1473 16.2787 10.4223 16.5538 10.4223 16.8929L10.4223 18.6929C10.4223 19.8219 11.3193 20.7431 12.4428 20.7925L12.6223 20.7929L14.6365 20.7929C15.0035 20.7929 15.3562 20.6479 15.617 20.3871L17.5001 18.504L8.50008 9.50402L5.80808 12.192L5.80808 13.2787C5.80808 14.8213 7.06096 16.0742 8.60351 16.0742L8.60808 17.504L5.80808 17.504Z\'/%3E%3C/svg%3E")' +
            '}';

        // --- Color picker popover CSS ---
        var pickerCss =
            '#dsfr-editor-toolbar .fr-btns-group{flex-wrap:nowrap !important;}' +
            '#dsfr-editor-toolbar .fr-btn{padding:0.25rem !important;min-height:0 !important;height:2rem !important;width:2rem !important;}' +
            '.dsfr-color-tool{position:relative;display:inline-flex;align-items:center;}' +
            '.dsfr-color-tool__main{border-top-right-radius:0 !important;border-bottom-right-radius:0 !important;margin-right:0 !important;}' +
            '.dsfr-color-tool__toggle{border-top-left-radius:0 !important;border-bottom-left-radius:0 !important;margin-left:0 !important;padding:0.25rem 0.25rem !important;min-width:1.25rem !important;width:auto !important;}' +
            '.dsfr-color-tool__toggle::before{content:"";display:inline-block;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid currentColor;}' +
            '#dsfr-editor-toolbar .dsfr-color-tool{flex-direction:column !important;align-items:center;}' +
            '#dsfr-editor-toolbar .dsfr-color-tool__main{border-radius:4px 4px 0 0 !important;border-bottom-left-radius:0 !important;border-bottom-right-radius:0 !important;margin-right:0 !important;}' +
            '#dsfr-editor-toolbar .dsfr-color-tool__toggle{border-radius:0 0 4px 4px !important;border-top-left-radius:0 !important;border-top-right-radius:0 !important;width:2rem !important;min-width:0 !important;padding:0.125rem 0 !important;margin-left:0 !important;}' +
            '#dsfr-editor-toolbar .dsfr-color-tool__toggle::before{border-top:4px solid transparent !important;border-bottom:4px solid transparent !important;border-left:5px solid currentColor !important;border-right:none !important;}' +
            '.dsfr-color-picker{display:none;position:absolute;top:0;left:calc(100% + 0.25rem);z-index:2001;background:#fff;border:1px solid #ddd;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.12);padding:0.5rem;min-width:180px;}' +
            '.dsfr-color-picker.dsfr-color-picker--open{display:block;}' +
            '.dsfr-color-picker__grid{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;}' +
            '.dsfr-color-swatch{width:24px;height:24px;border-radius:50% !important;border:2px solid transparent;cursor:pointer;padding:0 !important;transition:transform .1s,border-color .1s;box-shadow:none !important;outline:none !important;min-height:0 !important;}' +
            '.dsfr-color-swatch::before,.dsfr-color-swatch::after{content:none !important;display:none !important;}' +
            '.dsfr-color-swatch:hover{transform:scale(1.2);border-color:#000091;}' +
            '.dsfr-color-swatch--active{border-color:#000091;box-shadow:0 0 0 2px #000091;}' +
            '.dsfr-color-preview{width:100%;height:4px;border-radius:0 0 2px 2px;position:absolute;bottom:2px;left:0;}' +
            '.dsfr-comp-group-hd{display:flex;align-items:center;justify-content:space-between;padding:0.55rem 1rem;cursor:pointer;background:#f6f6f6;border-bottom:1px solid #eee;font-weight:600;font-size:0.875rem;color:#3a3a3a;}' +
            '.dsfr-comp-group-hd:hover{background:#ececec;}' +
            '.dsfr-comp-group-arrow{font-size:0.6rem;transition:transform 0.15s;display:inline-block;margin-left:0.5rem;}' +
            '.dsfr-comp-group-hd.is-open .dsfr-comp-group-arrow{transform:rotate(90deg);}' +
            '.dsfr-comp-group-body{display:none;background:#fff;}' +
            '.dsfr-comp-group-body.is-open{display:block;}' +
            '.dsfr-comp-sub-link{display:block;padding:0.45rem 1rem 0.45rem 1.75rem;color:#161616;text-decoration:none;border-bottom:1px solid #f0f0f0;font-size:0.8125rem;}' +
            '.dsfr-comp-sub-link:hover{background:#f0f0ff;color:#000091;}' +
            '.dsfr-comp-direct-lk{display:block;padding:0.6rem 1rem;color:#161616;text-decoration:none;border-bottom:1px solid #eee;font-size:0.875rem;}' +
            '.dsfr-comp-direct-lk:hover{background:#f6f6f6;color:#000091;}' +
            '#dsfr-editor-wrap{display:flex;align-items:stretch;position:relative;}' +
            '#dsfr-editor-wrap .CodeMirror{flex:1;min-width:0;border-radius:0 4px 4px 0;}';

        $('head').append('<style>' + customIconsCss + pickerCss + '</style>');

        // 1. NON-DESTRUCTIVE CLEANUP (Hide & Empty)
        // We empty the toolbar containers to ensure they are visually gone even if display toggles back.
        // We do NOT optimize by removing native submit buttons; we just hide them.
        
        var attempts = 0;
        var policeInterval = setInterval(function() {
            // Target the specific WikiEditor toolbar structure
            var $toolbar = $('.wikiEditor-ui-top, .wikiEditor-ui-toolbar, #wikiEditor-ui-toolbar');
            if ($toolbar.length) {
                // Emptying it makes it content-less, thus invisible even if display:block
                $toolbar.empty().remove(); 
                // We physically remove it because it doesn't contain the submit buttons (those are in .editButtons)
            }
            
            // Hide other garbage but keep them in DOM if needed by MW (unlikely for these)
            $('.mw-editTools, .wikiEditor-ui-tabs, .mw-editnotice, .warningbox, .previewnote, .firstHeading').hide().css('display', 'none !important');

            // Hide native buttons (don't remove/empty as they are needed for form submission)
            $('.editButtons').hide().css('display', 'none !important');

            // Remove useless MW chrome elements
            $('#mw-page-base, #mw-head-base, .limitreport').remove();

            attempts++;
            if (attempts > 50) clearInterval(policeInterval); // Check for 5 seconds
        }, 100);

        // 2. TEXTAREA & TOOLBAR
        // Le textarea #wpTextbox1 est caché par CodeMirror — on ne le stylise pas.
        // CodeMirror est l'éditeur affiché ; ses styles visuels DSFR sont dans Style.css.
        var $textarea = $('#wpTextbox1');

        if ($('#dsfr-editor-toolbar').length) $('#dsfr-editor-toolbar').remove();
        
        var $dsfrToolbar = $('<div id="dsfr-editor-toolbar" style="display:flex;flex-direction:column;align-items:center;width:2.5rem;background:#f6f6f6;border:1px solid #ddd;border-right:none;border-radius:4px 0 0 4px;padding:0.25rem 0;flex-shrink:0;overflow-y:auto;overflow-x:visible;position:relative;z-index:10;"></div>');
        
        // --- Standard Tools ---
        // --- Palette colors for pickers ---
        var paletteColors = [
            { hex: '#000091', label: 'Bleu DSFR' },
            { hex: '#e1000f', label: 'Rouge Marianne' },
            { hex: '#008941', label: 'Vert' },
            { hex: '#ff6f00', label: 'Orange' },
            { hex: '#6e445a', label: 'Prune' },
            { hex: '#161616', label: 'Noir' },
            { hex: '#3a3a3a', label: 'Gris foncé' },
            { hex: '#666666', label: 'Gris' },
            { hex: '#009099', label: 'Turquoise' },
            { hex: '#7b4fbf', label: 'Violet' },
            { hex: '#ce614a', label: 'Terracotta' },
            { hex: '#a94645', label: 'Bordeaux' }
        ];
        var highlightColors = [
            { hex: '#fceea6', label: 'Jaune clair' },
            { hex: '#fee9e5', label: 'Rose pâle' },
            { hex: '#e3e3fd', label: 'Bleu pâle' },
            { hex: '#b8fec9', label: 'Vert pâle' },
            { hex: '#fddede', label: 'Rouge pâle' },
            { hex: '#feecc2', label: 'Orange pâle' },
            { hex: '#d2e9ff', label: 'Bleu ciel' },
            { hex: '#f5f5f5', label: 'Gris clair' },
            { hex: '#c7ebe0', label: 'Menthe' },
            { hex: '#e8d8f4', label: 'Lavande' },
            { hex: '#ffe0b2', label: 'Pêche' },
            { hex: '#ffffff', label: 'Blanc (retirer)' }
        ];

        // State: last selected colors
        var currentFontColor = '#000091';
        var currentHighlightColor = '#fceea6';

        // Builder: creates a color tool (split button + picker)
        function buildColorTool(id, iconClass, title, colors, getColor, setColor, cssProp, sampleText) {
            var $wrapper = $('<span class="dsfr-color-tool" id="' + id + '"></span>');
            // Main button - applies current color
            var $main = $('<button type="button" class="fr-btn fr-btn--tertiary-no-outline dsfr-color-tool__main ' + iconClass + '" title="' + title + '" style="position:relative;"></button>');
            // Color preview bar under the icon
            var $preview = $('<span class="dsfr-color-preview"></span>');
            $preview.css('background-color', getColor());
            $main.append($preview);
            // Dropdown toggle arrow
            var $toggle = $('<button type="button" class="fr-btn fr-btn--tertiary-no-outline dsfr-color-tool__toggle" title="Choisir une couleur" aria-expanded="false"></button>');
            // Picker popover
            var $picker = $('<div class="dsfr-color-picker"></div>');
            var $grid = $('<div class="dsfr-color-picker__grid"></div>');

            $.each(colors, function(i, c) {
                var $swatch = $('<button type="button" class="dsfr-color-swatch" title="' + c.label + '" data-color="' + c.hex + '"></button>');
                $swatch[0].style.setProperty('background-color', c.hex, 'important');
                if (c.hex === '#ffffff') $swatch[0].style.setProperty('border-color', '#ddd', 'important');
                if (c.hex === getColor()) $swatch.addClass('dsfr-color-swatch--active');
                $swatch.on('click', function(e) {
                    e.stopPropagation();
                    setColor(c.hex);
                    $preview.css('background-color', c.hex);
                    $grid.find('.dsfr-color-swatch').removeClass('dsfr-color-swatch--active');
                    $(this).addClass('dsfr-color-swatch--active');
                    // Apply immediately
                    insertTags('<span style="' + cssProp + ':' + c.hex + ';">', '</span>', sampleText);
                    $picker.removeClass('dsfr-color-picker--open');
                    $toggle.attr('aria-expanded', 'false');
                });
                $grid.append($swatch);
            });
            $picker.append($grid);

            // Main click: apply current color
            $main.on('click', function(e) {
                e.stopPropagation();
                insertTags('<span style="' + cssProp + ':' + getColor() + ';">', '</span>', sampleText);
            });

            // Toggle click: open/close picker
            $toggle.on('click', function(e) {
                e.stopPropagation();
                // Close all other pickers
                $('.dsfr-color-picker').not($picker).removeClass('dsfr-color-picker--open');
                $picker.toggleClass('dsfr-color-picker--open');
                $(this).attr('aria-expanded', $picker.hasClass('dsfr-color-picker--open') ? 'true' : 'false');
            });

            $wrapper.append($main).append($toggle).append($picker);
            return $wrapper;
        }

        var basicTools = [
            { icon: 'fr-icon-bold', title: "Gras", open: "'''", close: "'''", sample: "Gras" },
            { icon: 'fr-icon-italic', title: "Italique", open: "''", close: "''", sample: "Italique" },
            { icon: 'dsfr-icon-underline', title: "Souligné", open: "<u>", close: "</u>", sample: "Souligné" },
            { type: 'color-font' },
            { type: 'color-highlight' },
            { type: 'sep' },
            { icon: 'fr-icon-h-1', title: "Titre 2", open: "\n== ", close: " ==\n", sample: "Titre" },
            { icon: 'fr-icon-h-2', title: "Titre 3", open: "\n=== ", close: " ===\n", sample: "Sous-titre" },
            { icon: 'fr-icon-h-3', title: "Titre 4", open: "\n==== ", close: " ====\n", sample: "Sous-sous-titre" },
            { type: 'sep' },
            { icon: 'fr-icon-align-left', title: "Aligner à gauche", open: '<div style="text-align:left;">\n', close: "\n</div>", sample: "Texte" },
            { icon: 'dsfr-icon-align-center', title: "Centrer", open: '<div style="text-align:center;">\n', close: "\n</div>", sample: "Texte" },
            { icon: 'dsfr-icon-align-right', title: "Aligner à droite", open: '<div style="text-align:right;">\n', close: "\n</div>", sample: "Texte" },
            { icon: 'dsfr-icon-align-justify', title: "Justifier", open: '<div style="text-align:justify;">\n', close: "\n</div>", sample: "Texte" },
            { type: 'sep' },
            { icon: 'fr-icon-list-ordered', title: "Liste numérotée", open: "\n# ", close: "", sample: "Item" },
            { icon: 'fr-icon-list-unordered', title: "Liste à puces", open: "\n* ", close: "", sample: "Item" },
            { type: 'sep' },
            { icon: 'fr-icon-link', title: "Lien interne", open: "[[", close: "]]", sample: "Page" },
            { icon: 'fr-icon-links-line', title: "Lien externe", open: "[", close: "]", sample: "http://url Titre" },
            { icon: 'fr-icon-image-line', title: "Image", open: "[[Fichier:", close: "|thumb|Légende]]", sample: "Exemple.jpg" },
            { type: 'sep' }
        ];

        var $grp = $('<ul class="fr-btns-group" style="flex-direction:column !important;flex-wrap:nowrap !important;align-items:center;margin:0;padding:0;list-style:none;width:100%;"></ul>');
        
        $.each(basicTools, function(i, tool) {
            if (tool.type === 'sep') {
                $grp.append('<li style="border-top:1px solid #ddd; margin:0.35rem auto; width:1.5rem;"></li>');
            } else if (tool.type === 'color-font') {
                var $li = $('<li></li>');
                $li.append(buildColorTool(
                    'dsfr-font-color-tool',
                    'dsfr-icon-font-color',
                    'Couleur du texte',
                    paletteColors,
                    function() { return currentFontColor; },
                    function(c) { currentFontColor = c; },
                    'color',
                    'Texte en couleur'
                ));
                $grp.append($li);
            } else if (tool.type === 'color-highlight') {
                var $li = $('<li></li>');
                $li.append(buildColorTool(
                    'dsfr-highlight-tool',
                    'dsfr-icon-highlight',
                    'Surligner',
                    highlightColors,
                    function() { return currentHighlightColor; },
                    function(c) { currentHighlightColor = c; },
                    'background-color',
                    'Texte surligné'
                ));
                $grp.append($li);
            } else {
                var $btn = $('<button type="button" class="fr-btn fr-btn--tertiary-no-outline ' + tool.icon + '" title="' + tool.title + '"></button>');
                $btn.click(function() { insertTags(tool.open, tool.close, tool.sample); });
                $grp.append($('<li></li>').append($btn));
            }
        });

        // --- BUTTTON "Ajouter un composant DSFR" ---
        var $compLi = $('<li style="position:relative;"></li>');
        var $compBtn = $('<button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-icon-layout-grid-line" aria-expanded="false" title="Composants DSFR"></button>');

        var $menu = $('<div class="fr-menu" style="display:none; position:absolute; top:0; left:100%; z-index:2000; background:white; border:1px solid #ddd; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.1); min-width:280px; max-height:80vh; overflow-y:auto;"></div>');
        var $menuList = $('<ul class="fr-menu__list" style="margin:0; padding:0; list-style:none;"></ul>');

        var componentGroups = [
            {
                label: "Accordéon",
                open: '<div class="dsfr-accordion-item">\n  <div class="dsfr-accordion-title">Titre de l\'accordéon</div>\n  <div class="dsfr-accordion-content">\n',
                close: "\n  </div>\n</div>",
                sample: "Contenu caché"
            },
            {
                label: "Alerte",
                items: [
                    { label: "Info", open: '<div class="dsfr-alert" data-type="info" data-title="Information">\n', close: "\n</div>", sample: "Contenu de l'alerte" },
                    { label: "Succès", open: '<div class="dsfr-alert" data-type="success" data-title="Succès">\n', close: "\n</div>", sample: "Opération réussie" },
                    { label: "Erreur", open: '<div class="dsfr-alert" data-type="error" data-title="Erreur">\n', close: "\n</div>", sample: "Une erreur est survenue" }
                ]
            },
            {
                label: "Badge",
                items: [
                    { label: "Succès", open: '<span data-dsfr-badge="success">', close: '</span>', sample: "Nouveau" },
                    { label: "Info", open: '<span data-dsfr-badge="info">', close: '</span>', sample: "Brouillon" }
                ]
            },
            {
                label: "Carte",
                items: [
                    { label: "Simple", open: '<div class="dsfr-card" data-title="Titre de la carte" data-url="Nom_Page_Wiki">\n', close: '\n</div>', sample: 'Description de la carte.' },
                    { label: "Avec badge et détail", open: '<div class="dsfr-card" data-title="Titre de la carte" data-url="Nom_Page_Wiki" data-badge="Nouveau" data-badge-type="new" data-detail="Catégorie">\n', close: '\n</div>', sample: 'Description de la carte.' },
                    { label: "Grille 2 colonnes", open: '<div class="dsfr-card-grid" data-cols="2">\n<div class="dsfr-card-item" data-title="Carte 1" data-url="Page_1">Description 1</div>\n<div class="dsfr-card-item" data-title="Carte 2" data-url="Page_2">Description 2</div>\n</div>', close: '', sample: '' },
                    { label: "Grille 3 colonnes", open: '<div class="dsfr-card-grid" data-cols="3">\n<div class="dsfr-card-item" data-title="Carte 1" data-url="Page_1">Description 1</div>\n<div class="dsfr-card-item" data-title="Carte 2" data-url="Page_2">Description 2</div>\n<div class="dsfr-card-item" data-title="Carte 3" data-url="Page_3">Description 3</div>\n</div>', close: '', sample: '' },
                    { label: "Grille 4 colonnes", open: '<div class="dsfr-card-grid" data-cols="4">\n<div class="dsfr-card-item" data-title="Carte 1" data-url="Page_1">Description 1</div>\n<div class="dsfr-card-item" data-title="Carte 2" data-url="Page_2">Description 2</div>\n<div class="dsfr-card-item" data-title="Carte 3" data-url="Page_3">Description 3</div>\n<div class="dsfr-card-item" data-title="Carte 4" data-url="Page_4">Description 4</div>\n</div>', close: '', sample: '' }
                ]
            },
            {
                label: "Citation",
                open: '<div class="fr-quote">\n  <blockquote>\n    <p>« ',
                close: ' »</p>\n  </blockquote>\n  <figcaption>\n    <p class="fr-quote__author">Auteur</p>\n  </figcaption>\n</div>',
                sample: "Citation"
            },
            {
                label: "Indicateur d'étapes",
                items: [
                    { label: "Étape en cours", open: '<div class="dsfr-stepper" data-current="1" data-total="3" data-title="Titre de l\'étape en cours" data-next="Titre de l\'étape suivante"></div>', close: '', sample: '' },
                    { label: "Dernière étape", open: '<div class="dsfr-stepper" data-current="3" data-total="3" data-title="Confirmation et envoi"></div>', close: '', sample: '' }
                ]
            },
            {
                label: "Infobulle",
                items: [
                    { label: "Bouton icône", open: '<span class="dsfr-tooltip" data-content="Texte de l\'infobulle" data-trigger="button"></span>', close: '', sample: '' },
                    { label: "Lien texte", open: '<span class="dsfr-tooltip" data-content="Texte de l\'infobulle" data-trigger="link" data-label="Voir plus"></span>', close: '', sample: '' }
                ]
            },
            {
                label: "Mise en avant",
                open: '<div class="fr-callout">\n  <h3 class="fr-callout__title">Titre mise en avant</h3>\n  <p class="fr-callout__text">\n',
                close: "\n  </p>\n</div>",
                sample: "Texte important"
            },
            {
                label: "Onglets",
                items: [
                    { label: "2 onglets", open: '<div class="dsfr-tabs">\n  <div class="dsfr-tab" data-title="Premier onglet">Contenu du premier onglet</div>\n  <div class="dsfr-tab" data-title="Deuxième onglet">Contenu du deuxième onglet</div>\n</div>', close: '', sample: '' },
                    { label: "3 onglets", open: '<div class="dsfr-tabs">\n  <div class="dsfr-tab" data-title="Onglet 1">Contenu 1</div>\n  <div class="dsfr-tab" data-title="Onglet 2">Contenu 2</div>\n  <div class="dsfr-tab" data-title="Onglet 3">Contenu 3</div>\n</div>', close: '', sample: '' }
                ]
            },
            {
                label: "Sommaire automatique",
                open: '<div class="dsfr-summary"></div>',
                close: '',
                sample: ''
            },
            {
                label: "Tableau",
                items: [
                    { label: "Simple", open: '<div class="dsfr-table" data-caption="Titre du tableau">\n{| class="wikitable"\n! Colonne 1 !! Colonne 2 !! Colonne 3\n|-\n| Valeur A || Valeur B || Valeur C\n|}\n</div>', close: '', sample: '' },
                    { label: "Défilant", open: '<div class="dsfr-table" data-caption="Titre du tableau" data-scrollable>\n{| class="wikitable"\n! Colonne 1 !! Colonne 2 !! Colonne 3\n|-\n| Valeur A || Valeur B || Valeur C\n|}\n</div>', close: '', sample: '' }
                ]
            },
            {
                label: "Tag / Étiquette",
                items: [
                    { label: "Simple", open: '<span data-dsfr-tag>', close: '</span>', sample: 'Étiquette' },
                    { label: "Avec icône", open: '<span data-dsfr-tag data-icon="fr-icon-check-line">', close: '</span>', sample: 'Validé' },
                    { label: "Groupe de tags", open: '<span class="dsfr-tags-group"><span data-dsfr-tag>Tag 1</span> <span data-dsfr-tag>Tag 2</span></span>', close: '', sample: '' }
                ]
            },
            {
                label: "Téléchargement",
                open: '<span class="dsfr-download" data-href="Fichier:Nom-du-fichier.pdf" data-label="Nom du document" data-detail="PDF — Taille"></span>',
                close: '',
                sample: ''
            }
        ];

        $.each(componentGroups, function(idx, group) {
            var $item = $('<li></li>');
            if (group.items) {
                var $hd = $('<div class="dsfr-comp-group-hd">' + group.label + '<span class="dsfr-comp-group-arrow">&#9658;</span></div>');
                var $body = $('<ul class="dsfr-comp-group-body" style="margin:0;padding:0;list-style:none;"></ul>');
                $hd.on('click', function(e) {
                    e.stopPropagation();
                    $(this).toggleClass('is-open');
                    $body.toggleClass('is-open');
                });
                $.each(group.items, function(jdx, subItem) {
                    var $subLi = $('<li></li>');
                    var $subLink = $('<a href="#" class="dsfr-comp-sub-link">' + subItem.label + '</a>');
                    (function(si) {
                        $subLink.on('click', function(e) {
                            e.preventDefault();
                            insertTags(si.open, si.close, si.sample);
                            $menu.hide();
                            $compBtn.attr('aria-expanded', 'false');
                        });
                    })(subItem);
                    $subLi.append($subLink);
                    $body.append($subLi);
                });
                $item.append($hd).append($body);
            } else {
                var $link = $('<a href="#" class="dsfr-comp-direct-lk">' + group.label + '</a>');
                (function(g) {
                    $link.on('click', function(e) {
                        e.preventDefault();
                        insertTags(g.open, g.close, g.sample);
                        $menu.hide();
                        $compBtn.attr('aria-expanded', 'false');
                    });
                })(group);
                $item.append($link);
            }
            $menuList.append($item);
        });
        
        var $docItem = $('<li><a href="https://www.systeme-de-design.gouv.fr/version-courante/fr/composants" target="_blank" style="display:block; padding:0.75rem 1rem; color:#000091; font-weight:bold; text-decoration:none; background:#f5f5fe;">Voir la documentation officielle ↗</a></li>');
        $menuList.append($docItem);
        $menu.append($menuList); $compLi.append($compBtn).append($menu);

        $compBtn.click(function(e) {
            e.stopPropagation();
            if ($menu.is(':visible')) { $menu.hide(); $(this).attr('aria-expanded', 'false'); }
            else { $('.fr-menu').hide(); $menu.show(); $(this).attr('aria-expanded', 'true'); }
        });
        $(document).click(function() {
            $menu.hide(); $compBtn.attr('aria-expanded', 'false');
            // Close all color pickers too
            $('.dsfr-color-picker').removeClass('dsfr-color-picker--open');
        });
        $grp.prepend($('<li style="border-top:1px solid #ddd; margin:0.35rem auto; width:1.5rem;"></li>'));
        $grp.prepend($compLi);
        $dsfrToolbar.append($grp);

        // Insérer la toolbar avant CodeMirror (éditeur actif).
        // Polling court car CodeMirror peut s'initialiser après notre script.
        var cmToolbarAttempts = 0;
        var cmToolbarInterval = setInterval(function() {
            var $cm = $('.CodeMirror').first();
            if ($cm.length) {
                $cm.wrap('<div id="dsfr-editor-wrap"></div>');
                $('#dsfr-editor-wrap').prepend($dsfrToolbar);
                clearInterval(cmToolbarInterval);
            } else if (cmToolbarAttempts >= 20) {
                // Fallback : CodeMirror absent (désactivé par l'utilisateur)
                $textarea.before($dsfrToolbar);
                clearInterval(cmToolbarInterval);
            }
            cmToolbarAttempts++;
        }, 50);

        // 3. ACTION BAR (Sticky)
        if ($('#dsfr-edit-bar').length) $('#dsfr-edit-bar').remove();
        var pageName = mw.config.get('wgTitle').replace(/_/g, ' ');
        var isNew = mw.config.get('wgArticleId') === 0;
        var titleText = (isNew ? 'Création : ' : 'Modification : ') + pageName;

        var $bar = $('<div id="dsfr-edit-bar"></div>');
        var $row = $('<div class="fr-grid-row fr-grid-row--middle fr-container"></div>');

        $row.append('<div class="fr-col"><p class="fr-mb-0 fr-text--bold" style="font-size:1.125rem;">' + titleText + '</p></div>');

        var $bCol = $('<div class="fr-col-auto"><ul class="fr-btns-group fr-btns-group--inline fr-btns-group--sm fr-mb-0"></ul></div>');
        var $bUl = $bCol.find('ul');

        function addBtn(label, icon, cls, clickFn) {
            var $b = $('<button type="button" class="fr-btn '+cls+' '+icon+' fr-btn--icon-left" style="width: auto !important; max-width: none !important;">'+label+'</button>');
            $b.click(clickFn);
            $bUl.append($('<li></li>').append($b));
        }

        // Action Buttons
        addBtn("Annuler", "fr-icon-close-circle-line", "fr-btn--secondary", function() {
            var $c = $('#mw-editformCancel');
            if ($c.length && $c.attr('href')) window.location.href = $c.attr('href');
            else window.history.back();
        });
        addBtn("Voir les modifications", "fr-icon-scales-3-line", "fr-btn--tertiary", function() {
            $('#wpDiff').click();
        });
        addBtn("Prévisualiser", "fr-icon-eye-line", "fr-btn--tertiary", function() {
            $('#wpPreview').click();
        });
        addBtn("Publier", "fr-icon-save-line", "fr-btn--primary", function() {
            if (!$('#wpSummary').val() && !isNew && !confirm('Résumé vide ?')) return;
            $('#wpSave').click();
        });

        $row.append($bCol); $bar.append($row); $('#content').prepend($bar);

        // 4. EDIT OPTIONS SECTION
        var $editOptions = $('.editOptions');
        if ($editOptions.length) {
            // Wrap in a styled container
            $editOptions.attr('id', 'dsfr-edit-options');

            // 4a. SUMMARY INPUT
            var $sum = $('#wpSummary');
            var $summaryLabel = $('#wpSummaryLabel');
            // Remove OOUI wrapper structure
            if ($summaryLabel.length) {
                $summaryLabel.replaceWith(
                    '<div class="fr-input-group" id="dsfr-summary-group">' +
                        '<label class="fr-label" for="wpSummary">Résumé de vos modifications</label>' +
                        '<div class="fr-input-wrap" id="dsfr-summary-wrap"></div>' +
                    '</div>'
                );
                // Re-grab input (may have been detached) and insert
                var $sumInput = $sum.length ? $sum : $('[name="wpSummary"]');
                $sumInput.addClass('fr-input').attr('placeholder', 'Ex: Correction orthographique, ajout section...');
                $sumInput.css({ 'max-width': 'none', 'width': '100%' });
                $('#dsfr-summary-wrap').append($sumInput);
            }

            // 4b. CHECKBOXES - Restyle as DSFR
            var $checkboxes = $('.editCheckboxes');
            if ($checkboxes.length) {
                var $dsfrCheckboxes = $('<div class="fr-fieldset" id="dsfr-edit-checkboxes"><div class="fr-fieldset__content"></div></div>');
                var $content = $dsfrCheckboxes.find('.fr-fieldset__content');

                // Minor edit checkbox
                var $minorCb = $('#wpMinoredit');
                if ($minorCb.length) {
                    $content.append(
                        '<div class="fr-checkbox-group">' +
                            '<input type="checkbox" id="wpMinoredit-dsfr" name="wpMinoredit" ' + ($minorCb.is(':checked') ? 'checked' : '') + '>' +
                            '<label class="fr-label" for="wpMinoredit-dsfr">Modification mineure</label>' +
                        '</div>'
                    );
                    // Sync with original
                    $content.find('#wpMinoredit-dsfr').on('change', function() { $minorCb.prop('checked', this.checked).trigger('change'); });
                }

                // Watch checkbox
                var $watchCb = $('#wpWatchthis');
                if ($watchCb.length) {
                    $content.append(
                        '<div class="fr-checkbox-group">' +
                            '<input type="checkbox" id="wpWatchthis-dsfr" name="wpWatchthis-dsfr" ' + ($watchCb.is(':checked') ? 'checked' : '') + '>' +
                            '<label class="fr-label" for="wpWatchthis-dsfr">Suivre cette page</label>' +
                        '</div>'
                    );
                    $content.find('#wpWatchthis-dsfr').on('change', function() { $watchCb.prop('checked', this.checked).trigger('change'); });
                }

                $checkboxes.hide();
                $checkboxes.after($dsfrCheckboxes);
            }

            // 4c. COPYRIGHT NOTICE - Collapse into a subtle DSFR notice
            var $copyWarn = $('#editpage-copywarn');
            if ($copyWarn.length) {
                var $notice = $(
                    '<div class="fr-notice fr-notice--info" id="dsfr-copy-notice">' +
                        '<div class="fr-container">' +
                            '<div class="fr-notice__body">' +
                                '<p class="fr-notice__title">En publiant, vous acceptez les conditions de contribution.</p>' +
                                '<button class="fr-btn--close fr-btn" title="Voir les détails" type="button" id="dsfr-copy-toggle" style="background:transparent !important; color:#000091 !important; font-size:0.875rem; border:none; cursor:pointer; padding:0.25rem 0.5rem;">Voir les détails</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );
                $copyWarn.hide();
                $copyWarn.before($notice);

                // Toggle details
                $notice.find('#dsfr-copy-toggle').on('click', function() {
                    if ($copyWarn.is(':visible')) {
                        $copyWarn.slideUp(200);
                        $(this).text('Voir les détails');
                    } else {
                        $copyWarn.slideDown(200);
                        $(this).text('Masquer les détails');
                    }
                });
            }

            // 4d. BOTTOM ACTION BUTTONS
            var $bottomBtns = $(
                '<div id="dsfr-edit-bottom-actions">' +
                    '<ul class="fr-btns-group fr-btns-group--inline fr-btns-group--sm fr-btns-group--right">' +
                        '<li><button type="button" class="fr-btn fr-btn--secondary fr-icon-close-circle-line fr-btn--icon-left" id="dsfr-bottom-cancel" style="width:auto !important; max-width:none !important;">Annuler</button></li>' +
                        '<li><button type="button" class="fr-btn fr-btn--tertiary fr-icon-eye-line fr-btn--icon-left" id="dsfr-bottom-preview" style="width:auto !important; max-width:none !important;">Prévisualiser</button></li>' +
                        '<li><button type="button" class="fr-btn fr-btn--primary fr-icon-save-line fr-btn--icon-left" id="dsfr-bottom-save" style="width:auto !important; max-width:none !important;">Publier</button></li>' +
                    '</ul>' +
                '</div>'
            );

            $editOptions.append($bottomBtns);

            $bottomBtns.find('#dsfr-bottom-cancel').on('click', function() {
                var $c = $('#mw-editformCancel');
                if ($c.length && $c.attr('href')) window.location.href = $c.attr('href');
                else window.history.back();
            });
            $bottomBtns.find('#dsfr-bottom-preview').on('click', function() {
                $('#wpPreview').click();
            });
            $bottomBtns.find('#dsfr-bottom-save').on('click', function() {
                if (!$('#wpSummary').val() && !isNew && !confirm('Résumé vide ?')) return;
                $('#wpSave').click();
            });
        }
    });
})();
