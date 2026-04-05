/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningApp.js]] */
/**
 * Orchestrateur principal du module Planning.
 * - Detecte la page courante (Planning:Consultation / Planning:Gestion)
 * - Verifie les droits (bureaucrate pour la gestion)
 * - Cree l'interface a onglets (P4S / Journalier)
 * - Initialise les vues et le panneau personnel
 */
(function () {

    var GRADE_ORDER = ['GAR','GCA','GDI','GBR','COL','LCL','CEN','CNE','LTN','SLT',
                       'ASP','MAJ','ADC','ADJ','MDC','GND','MDL','ELG','BRC','BRI','GAV'];

    var ROLE_ORDER = ['commandement', 'chefs_pole', 'csf', 'formation', 'experts'];

    function sortPersonnelByGrade(arr) {
        arr.sort(function (a, b) {
            var rra = ROLE_ORDER.indexOf(a.role || 'experts');
            var rrb = ROLE_ORDER.indexOf(b.role || 'experts');
            if (rra < 0) rra = ROLE_ORDER.length;
            if (rrb < 0) rrb = ROLE_ORDER.length;
            if (rra !== rrb) return rra - rrb;
            var ga = (a.grade || '').toUpperCase();
            var gb = (b.grade || '').toUpperCase();
            var ra = GRADE_ORDER.indexOf(ga);
            var rb = GRADE_ORDER.indexOf(gb);
            if (ra < 0) ra = GRADE_ORDER.length;
            if (rb < 0) rb = GRADE_ORDER.length;
            if (ra !== rb) return ra - rb;
            return (a.id || '').localeCompare(b.id || '');
        });
        return arr;
    }

    /* ================================================================= */
    /*  POLLING — attente des dependances                                 */
    /* ================================================================= */

    var attempts = 0;
    var maxAttempts = 300; // 15s
    var loadingShown = false;

    function showLoadingIndicator() {
        if (loadingShown) return;
        loadingShown = true;
        var $ct = document.getElementById('mw-content-text');
        if ($ct) {
            $ct.innerHTML = '<div style="text-align:center;padding:3rem;">' +
                '<div style="font-size:1.1rem;color:#666;margin-bottom:0.5rem;">Chargement du module Planning...</div>' +
                '<div style="color:#999;font-size:0.8rem;">Si ce message persiste, verifiez la console (F12).</div>' +
                '</div>';
        }
    }

    function getMissing() {
        var deps = [
            ['jQuery', !!window.jQuery],
            ['mw', !!(window.mw && window.mw.config)],
            ['PlanningData', !!window.PlanningData],
            ['PlanningMissionsP4S', !!window.PlanningMissionsP4S],
            ['PlanningMissionsJournalier', !!window.PlanningMissionsJournalier],
            ['PlanningP4S', !!window.PlanningP4S],
            ['PlanningJournalier', !!window.PlanningJournalier],
            ['PlanningPersonnel', !!window.PlanningPersonnel],
            ['PlanningPrevision', !!window.PlanningPrevision]
        ];
        var missing = [];
        for (var i = 0; i < deps.length; i++) {
            if (!deps[i][1]) missing.push(deps[i][0]);
        }
        return missing;
    }

    function tryMount() {
        var missing = getMissing();
        var ready = missing.length === 0;

        if (!ready) {
            attempts++;
            if (attempts === 20) {
                /* Apres 1s, afficher un indicateur de chargement */
                showLoadingIndicator();
                console.log('[Planning] Attente des dependances... Manquantes: ' + missing.join(', '));
            }
            if (attempts < maxAttempts) {
                setTimeout(tryMount, 50);
            } else {
                console.error('[Planning] Timeout apres 15s — dependances manquantes: ' + missing.join(', '));
                var $ct = document.getElementById('mw-content-text');
                if ($ct) {
                    $ct.innerHTML = '<div class="fr-alert fr-alert--error" style="margin:2rem 0;">' +
                        '<h3 class="fr-alert__title">Erreur de chargement</h3>' +
                        '<p>Le module Planning n\'a pas pu charger toutes ses dependances.</p>' +
                        '<p><strong>Modules manquants :</strong> ' + missing.join(', ') + '</p>' +
                        '<p>Verifiez que les pages <code>MediaWiki:Dsfr/planning/*.js</code> existent en preprod.</p>' +
                        '</div>';
                }
            }
            return;
        }

        console.log('[Planning] Toutes les dependances chargees (' + attempts + ' tentatives).');
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
        var isPrevision = (pageName === 'Planning:Prevision');

        if (!isConsultation && !isGestion && !isPrevision) return;

        /* --- Prevision page (tous les agents connectes) --- */
        if (isPrevision) {
            var isLocalPrev = window.location.hostname === 'localhost';
            var cssHrefPrev = isLocalPrev
                ? '/staging_area/dsfr/planning/Planning.css?v=' + Date.now()
                : mw.config.get('wgScript') + '?title=MediaWiki:Dsfr/planning/Style.css&action=raw&ctype=text/css';
            if (!document.getElementById('planning-css')) {
                var linkPrev = document.createElement('link');
                linkPrev.id = 'planning-css';
                linkPrev.rel = 'stylesheet';
                linkPrev.type = 'text/css';
                linkPrev.href = cssHrefPrev;
                document.head.appendChild(linkPrev);
            }
            window.PlanningData.loadPersonnel(function (err, personnelPrev) {
                personnelPrev = personnelPrev || [];
                sortPersonnelByGrade(personnelPrev);
                var activePrev = [];
                for (var i = 0; i < personnelPrev.length; i++) {
                    if (personnelPrev[i].actif !== false) activePrev.push(personnelPrev[i]);
                }
                window.PlanningPrevision.init($('#mw-content-text'), activePrev);
            });
            return;
        }

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
            sortPersonnelByGrade(personnel);

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

        /* --- Modify page H1 --- */
        var $h1 = $('#firstHeading');
        if ($h1.length) {
            $h1.text(canEdit ? 'Planning - Gestion' : 'Planning - Consultation');
        }

        /* --- Main container --- */
        var html = '<div class="planning-app" id="planning-app">';

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

        /* --- Pleine largeur par défaut (onglet P4S actif) --- */
        $('body').addClass('planning-fullwidth');

        /* --- Init tabs --- */
        $('.planning-tab').on('click', function () {
            var targetId = $(this).data('panel');
            $('.planning-tab').removeClass('active');
            $(this).addClass('active');
            $('.planning-panel').removeClass('active');
            $('#' + targetId).addClass('active');
            /* Largeur standard pour Journalier, pleine largeur pour P4S */
            if (targetId === 'jour-panel') {
                $('body').removeClass('planning-fullwidth');
            } else {
                $('body').addClass('planning-fullwidth');
            }
        });

        /* --- Filter active personnel for planning views --- */
        var activePersonnel = [];
        for (var i = 0; i < personnel.length; i++) {
            if (personnel[i].actif !== false) activePersonnel.push(personnel[i]);
        }

        /* --- Init views (active personnel only) --- */
        window.PlanningP4S.init($('#p4s-panel'), activePersonnel, canEdit);
        window.PlanningJournalier.init($('#jour-panel'), activePersonnel, canEdit);

        /* --- Init personnel panel (full list) --- */
        if (canEdit) {
            window.PlanningPersonnel.init($('#personnel-panel'), personnel, function (updatedPersonnel) {
                /* Refresh views with updated active personnel */
                sortPersonnelByGrade(updatedPersonnel);
                var updatedActive = [];
                for (var j = 0; j < updatedPersonnel.length; j++) {
                    if (updatedPersonnel[j].actif !== false) updatedActive.push(updatedPersonnel[j]);
                }
                window.PlanningP4S._personnel = updatedActive;
                window.PlanningP4S.loadAndRender();
                window.PlanningJournalier._personnel = updatedActive;
                window.PlanningJournalier.loadAndRender();
            });
        }

        console.log('[Planning] App mounted — ' + activePersonnel.length + '/' + personnel.length + ' agents actifs.');
    }

    /* ================================================================= */
    /*  START                                                             */
    /* ================================================================= */

    tryMount();

}());
