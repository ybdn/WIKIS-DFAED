/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningApp.js]] */
/**
 * Orchestrateur principal du module Planning.
 * - Detecte la page courante (Planning:Consultation / Planning:Gestion)
 * - Verifie les droits (bureaucrate pour la gestion)
 * - Cree l'interface a onglets (P4S / Journalier)
 * - Initialise les vues et le panneau personnel
 */
(function () {

    /* ================================================================= */
    /*  POLLING — attente des dependances                                 */
    /* ================================================================= */

    var attempts = 0;
    var maxAttempts = 300; // 15s

    function tryMount() {
        var ready = window.jQuery &&
                    window.mw &&
                    window.mw.config &&
                    window.PlanningData &&
                    window.PlanningMissionsP4S &&
                    window.PlanningMissionsJournalier &&
                    window.PlanningP4S &&
                    window.PlanningJournalier &&
                    window.PlanningPersonnel;

        if (!ready) {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryMount, 50);
            } else {
                console.error('[Planning] Timeout — dependances non chargees.');
            }
            return;
        }

        $(function () { mountApp(); });
    }

    /* ================================================================= */
    /*  MOUNT                                                             */
    /* ================================================================= */

    function mountApp() {
        /* --- Ne pas monter en mode edition/historique --- */
        var action = mw.config.get('wgAction');
        if (action !== 'view') return;

        /* --- Detect page --- */
        var pageName = mw.config.get('wgPageName');
        var isConsultation = (pageName === 'Planning:Consultation');
        var isGestion = (pageName === 'Planning:Gestion');

        if (!isConsultation && !isGestion) return;

        /* --- Check permissions for Gestion --- */
        var userGroups = mw.config.get('wgUserGroups') || [];
        var isBureaucrat = false;
        for (var i = 0; i < userGroups.length; i++) {
            if (userGroups[i] === 'bureaucrat' || userGroups[i] === 'sysop') {
                isBureaucrat = true; break;
            }
        }

        if (isGestion && !isBureaucrat) {
            $('#mw-content-text').html(
                '<div class="fr-alert fr-alert--error" style="margin:2rem 0;">' +
                '<h3 class="fr-alert__title">Acces refuse</h3>' +
                '<p>Seuls les bureaucrates peuvent acceder au mode Gestion.</p>' +
                '<p><a class="fr-link" href="' + mw.util.getUrl('Planning:Consultation') + '">Aller en mode Consultation</a></p>' +
                '</div>'
            );
            return;
        }

        var mode = isGestion ? 'gestion' : 'consultation';
        console.log('[Planning] Mode: ' + mode + ' | Bureaucrat: ' + isBureaucrat);

        /* --- Load personnel then build UI --- */
        window.PlanningData.loadPersonnel(function (err, personnel) {
            personnel = personnel || [];

            if (isGestion && personnel.length === 0) {
                console.log('[Planning] Aucun personnel — affichage du panneau de gestion.');
            }

            buildUI(mode, personnel, isGestion && isBureaucrat);
        });
    }

    /* ================================================================= */
    /*  BUILD UI                                                          */
    /* ================================================================= */

    function buildUI(mode, personnel, canEdit) {
        var $content = $('#mw-content-text');
        $content.empty();

        /* --- Load CSS --- */
        var isLocal = window.location.hostname === 'localhost';
        var cssHref = isLocal
            ? '/staging_area/dsfr/planning/Planning.css?v=' + Date.now()
            : mw.config.get('wgScript') + '?title=MediaWiki:Dsfr/planning/Style.css&action=raw&ctype=text/css';
        if (!document.getElementById('planning-css')) {
            var link = document.createElement('link');
            link.id = 'planning-css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssHref;
            document.head.appendChild(link);
        }

        /* --- Main container --- */
        var html = '<div class="planning-app" id="planning-app">';

        /* Titre */
        html += '<h2 style="margin-bottom:1rem;">';
        html += canEdit ? 'Planning \u2014 Gestion' : 'Planning \u2014 Consultation';
        html += '</h2>';

        /* Tabs */
        html += '<div class="planning-tabs">';
        html += '<button class="planning-tab active" data-panel="p4s-panel">P4S \u2014 Planning Mensuel</button>';
        html += '<button class="planning-tab" data-panel="jour-panel">Service Journalier</button>';
        html += '</div>';

        /* Panels */
        html += '<div class="planning-panel active" id="p4s-panel"></div>';
        html += '<div class="planning-panel" id="jour-panel"></div>';

        /* Personnel (gestion only) */
        if (canEdit) {
            html += '<div id="personnel-panel"></div>';
        }

        html += '</div>';
        $content.html(html);

        /* --- Init tabs --- */
        $('.planning-tab').on('click', function () {
            var targetId = $(this).data('panel');
            $('.planning-tab').removeClass('active');
            $(this).addClass('active');
            $('.planning-panel').removeClass('active');
            $('#' + targetId).addClass('active');
        });

        /* --- Init views --- */
        window.PlanningP4S.init($('#p4s-panel'), personnel, canEdit);
        window.PlanningJournalier.init($('#jour-panel'), personnel, canEdit);

        /* --- Init personnel panel --- */
        if (canEdit) {
            window.PlanningPersonnel.init($('#personnel-panel'), personnel, function (updatedPersonnel) {
                /* Refresh views with new personnel list */
                window.PlanningP4S._personnel = updatedPersonnel;
                window.PlanningP4S.loadAndRender();
                window.PlanningJournalier._personnel = updatedPersonnel;
                window.PlanningJournalier.loadAndRender();
            });
        }

        console.log('[Planning] App mounted — ' + personnel.length + ' agents.');
    }

    /* ================================================================= */
    /*  START                                                             */
    /* ================================================================= */

    tryMount();

}());
