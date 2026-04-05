/* SOURCE FILE FOR: [[MediaWiki:Dsfr/oce/OceApp.js]] */
/**
 * Orchestrateur principal du module OCE.
 * - Detecte la page courante (OCE:Consultation / OCE:Gestion)
 * - Verifie les droits (bureaucrate pour la gestion)
 * - Cree l'interface a onglets (Suivi / Personnel / Statistiques)
 * - Initialise les vues
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
                    window.OceConfig &&
                    window.OceData &&
                    window.OceTable &&
                    window.OceForm &&
                    window.OceStats;

        if (!ready) {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryMount, 50);
            } else {
                console.error('[OCE] Timeout — dependances non chargees.');
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
        var isConsultation = (pageName === 'OCE:Consultation');
        var isGestion = (pageName === 'OCE:Gestion');

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
                '<p><a class="fr-link" href="' + mw.util.getUrl('OCE:Consultation') + '">Aller en mode Consultation</a></p>' +
                '</div>'
            );
            return;
        }

        var canEdit = isGestion && isBureaucrat;
        console.log('[OCE] Mode: ' + (canEdit ? 'gestion' : 'consultation') + ' | Bureaucrat: ' + isBureaucrat);

        /* --- Load data then build UI --- */
        window.OceData.loadPersonnel(function (err, personnel) {
            personnel = personnel || [];
            window.OceData.load(function (err2, data) {
                data = data || { oce: [], archive: [] };
                buildUI(canEdit, data, personnel);
            });
        });
    }

    /* ================================================================= */
    /*  BUILD UI                                                          */
    /* ================================================================= */

    function buildUI(canEdit, data, personnel) {
        var $content = $('#mw-content-text');
        $content.empty();

        /* --- Load CSS --- */
        var isLocal = window.location.hostname === 'localhost';
        var cssHref = isLocal
            ? '/staging_area/dsfr/oce/Oce.css?v=' + Date.now()
            : mw.config.get('wgScript') + '?title=MediaWiki:Dsfr/oce/Style.css&action=raw&ctype=text/css';
        if (!document.getElementById('oce-css')) {
            var link = document.createElement('link');
            link.id = 'oce-css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssHref;
            document.head.appendChild(link);
        }

        /* --- Modify page H1 --- */
        var $h1 = $('#firstHeading');
        if ($h1.length) {
            $h1.text(canEdit ? 'OCE - Gestion' : 'OCE - Consultation');
        }

        /* --- Main container --- */
        var html = '<div class="oce-app" id="oce-app">';

        /* Tabs */
        html += '<div class="oce-tabs">';
        html += '<button class="oce-tab active" data-panel="oce-suivi-panel">Suivi</button>';
        if (canEdit) {
            html += '<button class="oce-tab" data-panel="oce-personnel-panel">Personnel</button>';
        }
        html += '<button class="oce-tab" data-panel="oce-stats-panel">Statistiques</button>';
        html += '</div>';

        /* Panels */
        html += '<div class="oce-panel active" id="oce-suivi-panel"></div>';
        if (canEdit) {
            html += '<div class="oce-panel" id="oce-personnel-panel"></div>';
        }
        html += '<div class="oce-panel" id="oce-stats-panel"></div>';

        html += '</div>';
        $content.html(html);

        /* --- Init tabs --- */
        $('.oce-tab').on('click', function () {
            var targetId = $(this).data('panel');
            $('.oce-tab').removeClass('active');
            $(this).addClass('active');
            $('.oce-panel').removeClass('active');
            $('#' + targetId).addClass('active');
        });

        /* --- Init table (suivi) --- */
        window.OceTable.init($('#oce-suivi-panel'), data, personnel, canEdit, function () {
            /* On dirty change — refresh stats */
            window.OceStats.refresh(window.OceTable.getData(), personnel);
        });

        /* --- Init personnel panel (gestion only) --- */
        if (canEdit) {
            initPersonnelPanel($('#oce-personnel-panel'), personnel, data);
        }

        /* --- Init stats (consultation et gestion) --- */
        window.OceStats.init($('#oce-stats-panel'), data, personnel);

        console.log('[OCE] App mounted — ' + (data.oce || []).length + ' OCE actives, ' + (data.archive || []).length + ' archivees.');
    }

    /* ================================================================= */
    /*  PERSONNEL PANEL (embedded, same pattern as PlanningPersonnel)     */
    /* ================================================================= */

    function initPersonnelPanel($container, personnel, data) {
        var GRADE_ORDER = ['GAR','GCA','GDI','GBR','COL','LCL','CEN','CNE','LTN','SLT',
                           'ASP','MAJ','ADC','ADJ','MDC','GND','MDL','ELG','BRC','BRI','GAV'];

        function sortPersonnelByGrade(arr) {
            arr.sort(function (a, b) {
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

        /* Reuse PlanningPersonnel pattern but write to same data source */
        var _personnel = [];
        for (var i = 0; i < personnel.length; i++) {
            var p = {};
            for (var k in personnel[i]) {
                if (personnel[i].hasOwnProperty(k)) p[k] = personnel[i][k];
            }
            if (p.actif === undefined) p.actif = true;
            _personnel.push(p);
        }

        var _editingIndex = -1;
        var _isDirty = false;

        function render() {
            var wasOpen = !!$('#oce-personnel-details').prop('open');

            var actifs = [];
            var partis = [];
            for (var i = 0; i < _personnel.length; i++) {
                if (_personnel[i].actif !== false) {
                    actifs.push({ data: _personnel[i], index: i });
                } else {
                    partis.push({ data: _personnel[i], index: i });
                }
            }

            var h = '<div class="oce-personnel">';
            h += '<details id="oce-personnel-details" open>';
            h += '<summary class="oce-personnel-summary">Gestion du personnel (' + actifs.length + ' actif' + (actifs.length > 1 ? 's' : '') + ')</summary>';

            /* Save bar */
            var pDirtyClass = _isDirty ? ' dirty' : '';
            var pDirtyText = _isDirty ? 'Modifications non enregistrees' : 'Aucune modification';
            var pDirtyDisabled = _isDirty ? '' : ' disabled';
            h += '<div class="oce-save-bar' + pDirtyClass + '" id="oce-perso-save-bar">';
            h += '<span class="oce-save-status" id="oce-perso-save-status">' + pDirtyText + '</span>';
            h += '<button class="fr-btn fr-btn--sm" id="oce-perso-save-btn"' + pDirtyDisabled + '>Enregistrer</button>';
            h += '</div>';

            /* Active */
            h += '<h4 style="margin-top:1rem;margin-bottom:0.5rem;">Personnel actif (' + actifs.length + ')</h4>';
            h += '<table class="oce-personnel-table">';
            h += '<thead><tr><th>ID</th><th>Nom</th><th>Grade</th><th style="min-width:100px;">Actions</th></tr></thead>';
            h += '<tbody>';

            for (var a = 0; a < actifs.length; a++) {
                var pp = actifs[a].data;
                var idx = actifs[a].index;
                var isEditing = (_editingIndex === idx);

                h += '<tr data-index="' + idx + '">';
                if (isEditing) {
                    h += '<td><input class="fr-input fr-input--sm" type="text" id="oce-perso-edit-id" value="' + esc(pp.id) + '" style="width:100px;"></td>';
                    h += '<td><input class="fr-input fr-input--sm" type="text" id="oce-perso-edit-nom" value="' + esc(pp.nom) + '" style="width:180px;"></td>';
                    h += '<td><input class="fr-input fr-input--sm" type="text" id="oce-perso-edit-grade" value="' + esc(pp.grade || '') + '" style="width:80px;"></td>';
                    h += '<td>';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--secondary oce-perso-confirm" title="Confirmer">\u2713</button> ';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary oce-perso-cancel" title="Annuler">\u2715</button>';
                    h += '</td>';
                } else {
                    h += '<td>' + escH(pp.id) + '</td>';
                    h += '<td>' + escH(pp.nom) + '</td>';
                    h += '<td>' + escH(pp.grade || '') + '</td>';
                    h += '<td>';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary oce-perso-edit" title="Modifier">\u270F\uFE0F</button> ';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary oce-perso-depart" title="Depart">\uD83D\uDCE4</button>';
                    h += '</td>';
                }
                h += '</tr>';
            }

            if (actifs.length === 0) {
                h += '<tr><td colspan="4" style="text-align:center;color:#666;">Aucun personnel actif</td></tr>';
            }
            h += '</tbody></table>';

            /* Add form */
            h += '<div class="oce-personnel-add">';
            h += '<input class="fr-input" type="text" id="oce-perso-add-id" placeholder="Identifiant" style="max-width:150px;">';
            h += '<input class="fr-input" type="text" id="oce-perso-add-nom" placeholder="Nom complet" style="max-width:200px;">';
            h += '<input class="fr-input" type="text" id="oce-perso-add-grade" placeholder="Grade" style="max-width:100px;">';
            h += '<button class="fr-btn fr-btn--sm fr-btn--secondary" id="oce-perso-add-btn">Ajouter</button>';
            h += '</div>';

            /* Departed */
            if (partis.length > 0) {
                h += '<details style="margin-top:1rem;">';
                h += '<summary style="cursor:pointer;font-weight:700;color:#666;">Personnel parti (' + partis.length + ')</summary>';
                h += '<table class="oce-personnel-table" style="opacity:0.7;margin-top:0.5rem;">';
                h += '<thead><tr><th>ID</th><th>Nom</th><th>Grade</th><th>Date depart</th><th>Actions</th></tr></thead>';
                h += '<tbody>';
                for (var b = 0; b < partis.length; b++) {
                    var pd = partis[b].data;
                    var idxP = partis[b].index;
                    h += '<tr data-index="' + idxP + '">';
                    h += '<td>' + escH(pd.id) + '</td>';
                    h += '<td>' + escH(pd.nom) + '</td>';
                    h += '<td>' + escH(pd.grade || '') + '</td>';
                    h += '<td>' + (pd.dateDepart || '\u2014') + '</td>';
                    h += '<td>';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary oce-perso-reactivate" title="Reactiver">\u21A9\uFE0F</button> ';
                    h += '<button class="fr-btn fr-btn--sm fr-btn--tertiary oce-perso-del" title="Supprimer">\uD83D\uDDD1\uFE0F</button>';
                    h += '</td>';
                    h += '</tr>';
                }
                h += '</tbody></table>';
                h += '</details>';
            }

            h += '</details></div>';
            $container.html(h);
            if (wasOpen) {
                $('#oce-personnel-details').prop('open', true);
            }
            bindEvents();
        }

        function markDirty() {
            _isDirty = true;
            $('#oce-perso-save-bar').addClass('dirty');
            $('#oce-perso-save-status').text('Modifications non enregistrees');
            $('#oce-perso-save-btn').prop('disabled', false);
        }

        function bindEvents() {
            /* Unbind previous delegated events to avoid stacking */
            $container.off('click.oceperso keypress.oceperso');

            /* Save */
            $('#oce-perso-save-btn').on('click', function () {
                $('#oce-perso-save-status').text('Enregistrement en cours...');
                $('#oce-perso-save-btn').prop('disabled', true);
                window.OceData.savePersonnel(_personnel, function (err) {
                    if (err) {
                        alert('Erreur : ' + err);
                        markDirty();
                    } else {
                        _isDirty = false;
                        $('#oce-perso-save-bar').removeClass('dirty').addClass('saved');
                        $('#oce-perso-save-status').text('Enregistre avec succes');
                        /* Refresh other panels with updated personnel */
                        window.OceTable.refresh(null, _personnel);
                        window.OceStats.refresh(null, _personnel);
                        setTimeout(function () {
                            if (!_isDirty) {
                                $('#oce-perso-save-bar').removeClass('saved');
                                $('#oce-perso-save-status').text('Aucune modification');
                            }
                        }, 2500);
                    }
                });
            });

            /* Add */
            $('#oce-perso-add-btn').on('click', addAgent);
            $container.on('keypress.oceperso', '#oce-perso-add-id, #oce-perso-add-nom, #oce-perso-add-grade', function (e) {
                if (e.which === 13) addAgent();
            });

            /* Edit */
            $container.on('click.oceperso', '.oce-perso-edit', function () {
                _editingIndex = $(this).closest('tr').data('index');
                render();
                $('#oce-perso-edit-id').focus();
            });

            /* Confirm edit */
            $container.on('click.oceperso', '.oce-perso-confirm', confirmEdit);
            $container.on('keypress.oceperso', '#oce-perso-edit-id, #oce-perso-edit-nom, #oce-perso-edit-grade', function (e) {
                if (e.which === 13) confirmEdit();
            });

            /* Cancel edit */
            $container.on('click.oceperso', '.oce-perso-cancel', function () {
                _editingIndex = -1;
                render();
            });

            /* Departure */
            $container.on('click.oceperso', '.oce-perso-depart', function () {
                var idx = $(this).closest('tr').data('index');
                var agent = _personnel[idx];
                if (confirm('Marquer ' + agent.nom + ' comme parti ?')) {
                    agent.actif = false;
                    agent.dateDepart = window.OceConfig.todayISO();
                    render();
                    markDirty();
                }
            });

            /* Reactivate */
            $container.on('click.oceperso', '.oce-perso-reactivate', function () {
                var idx = $(this).closest('tr').data('index');
                _personnel[idx].actif = true;
                delete _personnel[idx].dateDepart;
                sortPersonnelByGrade(_personnel);
                render();
                markDirty();
            });

            /* Delete */
            $container.on('click.oceperso', '.oce-perso-del', function () {
                var idx = $(this).closest('tr').data('index');
                if (confirm('Supprimer definitivement ' + _personnel[idx].nom + ' ?')) {
                    _personnel.splice(idx, 1);
                    render();
                    markDirty();
                }
            });

        }

        function addAgent() {
            var id = $('#oce-perso-add-id').val().trim().toLowerCase().replace(/\s+/g, '_');
            var nom = $('#oce-perso-add-nom').val().trim();
            var grade = $('#oce-perso-add-grade').val().trim();
            if (!id || !nom) { alert('Identifiant et nom obligatoires.'); return; }
            for (var i = 0; i < _personnel.length; i++) {
                if (_personnel[i].id === id) { alert('Identifiant deja utilise.'); return; }
            }
            _personnel.push({ id: id, nom: nom, grade: grade, actif: true });
            sortPersonnelByGrade(_personnel);
            render();
            markDirty();
        }

        function confirmEdit() {
            if (_editingIndex < 0) return;
            var newId = $('#oce-perso-edit-id').val().trim().toLowerCase().replace(/\s+/g, '_');
            var newNom = $('#oce-perso-edit-nom').val().trim();
            var newGrade = $('#oce-perso-edit-grade').val().trim();
            if (!newId || !newNom) { alert('Identifiant et nom obligatoires.'); return; }
            for (var i = 0; i < _personnel.length; i++) {
                if (i !== _editingIndex && _personnel[i].id === newId) { alert('Identifiant deja utilise.'); return; }
            }
            var oldId = _personnel[_editingIndex].id;
            if (newId !== oldId) {
                if (!confirm('Changer l\'identifiant de "' + oldId + '" en "' + newId + '" ne migrera pas les OCE existantes.\n\nContinuer ?')) return;
            }
            _personnel[_editingIndex].id = newId;
            _personnel[_editingIndex].nom = newNom;
            _personnel[_editingIndex].grade = newGrade;
            _editingIndex = -1;
            sortPersonnelByGrade(_personnel);
            render();
            markDirty();
        }

        function escH(s) {
            if (!s) return '';
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        function esc(s) {
            if (!s) return '';
            return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        render();
    }

    /* ================================================================= */
    /*  START                                                             */
    /* ================================================================= */

    tryMount();

}());
