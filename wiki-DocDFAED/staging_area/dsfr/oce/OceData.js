/* SOURCE FILE FOR: [[MediaWiki:Dsfr/oce/OceData.js]] */
/**
 * Service de donnees pour le module OCE.
 * Lecture/ecriture via l'API MediaWiki (page JSON unique).
 * Reutilise Planning:Data/Personnel pour la liste du personnel.
 */
(function () {

    var DATA_PAGE = 'OCE:Data/Liste';
    var PERSONNEL_PAGE = 'Planning:Data/Personnel';

    var GRADE_ORDER = ['GAR','GCA','GDI','GBR','COL','LCL','CEN','CNE','LTN','SLT',
                       'ASP','MAJ','ADC','ADJ','MDC','GND','MDL','ELG','BRC','BRI','GAV'];

    /* ------------------------------------------------------------------ */
    /*  API MediaWiki — lecture / ecriture                                 */
    /* ------------------------------------------------------------------ */

    function readPage(pageTitle, callback) {
        $.ajax({
            url: mw.config.get('wgScript'),
            data: { title: pageTitle, action: 'raw' },
            dataType: 'text',
            success: function (text) {
                try {
                    callback(null, JSON.parse(text));
                } catch (e) {
                    callback(null, null);
                }
            },
            error: function () {
                callback(null, null);
            }
        });
    }

    function writePage(pageTitle, data, summary, callback) {
        mw.loader.using('mediawiki.api', function () {
            var api = new mw.Api();
            api.postWithToken('csrf', {
                action: 'edit',
                title: pageTitle,
                text: JSON.stringify(data, null, 2),
                summary: summary || 'Mise a jour OCE'
            }).done(function (result) {
                if (result && result.edit && result.edit.result === 'Success') {
                    callback(null);
                } else {
                    callback('Erreur lors de la sauvegarde');
                }
            }).fail(function (code) {
                callback('Erreur: ' + code);
            });
        });
    }

    /* ------------------------------------------------------------------ */
    /*  API publique                                                       */
    /* ------------------------------------------------------------------ */

    window.OceData = {

        /** Charge toutes les OCE (actives + archive) avec migration auto */
        load: function (cb) {
            readPage(DATA_PAGE, function (err, data) {
                if (!data) {
                    data = { oce: [], archive: [] };
                }
                if (!data.oce) data.oce = [];
                if (!data.archive) data.archive = [];
                /* Migration: dateReception -> dateArriveeOrdonnance */
                var lists = [data.oce, data.archive];
                for (var l = 0; l < lists.length; l++) {
                    for (var i = 0; i < lists[l].length; i++) {
                        var o = lists[l][i];
                        if (o.dateReception && !o.dateArriveeOrdonnance) {
                            o.dateArriveeOrdonnance = o.dateReception;
                            delete o.dateReception;
                        }
                        if (o.nbCliches === undefined) o.nbCliches = 0;
                    }
                }
                cb(null, data);
            });
        },

        /** Sauvegarde l'ensemble des donnees OCE */
        save: function (data, cb) {
            writePage(DATA_PAGE, data, 'Maj OCE', cb);
        },

        /** Charge la liste du personnel (reutilise Planning:Data/Personnel) */
        loadPersonnel: function (cb) {
            readPage(PERSONNEL_PAGE, function (err, data) {
                cb(null, data || []);
            });
        },

        /** Sauvegarde la liste du personnel */
        savePersonnel: function (data, cb) {
            writePage(PERSONNEL_PAGE, data, 'Maj personnel', cb);
        },

        /* ---------------------------------------------------------------- */
        /*  Helpers OCE                                                     */
        /* ---------------------------------------------------------------- */

        /** Trouve une OCE par numero */
        findByNumero: function (oceList, numero) {
            for (var i = 0; i < oceList.length; i++) {
                if (oceList[i].numero === numero) return i;
            }
            return -1;
        },

        /** Ajoute une entree d'historique */
        addHistorique: function (oce, action, de, vers) {
            if (!oce.historique) oce.historique = [];
            oce.historique.push({
                date: window.OceConfig.nowISO(),
                user: mw.config.get('wgUserName') || 'Inconnu',
                action: action,
                de: de || null,
                vers: vers || null
            });
        },

        /** Groupe les OCE par agent */
        groupByAgent: function (oceList, personnel) {
            var groups = {};
            var agentOrder = [];
            var agentMap = {};

            /* Build personnel map */
            for (var p = 0; p < personnel.length; p++) {
                agentMap[personnel[p].id] = personnel[p];
                if (personnel[p].actif !== false) {
                    agentOrder.push(personnel[p].id);
                }
            }

            /* Tri par grade desc puis ID croissant */
            agentOrder.sort(function (a, b) {
                var ga = agentMap[a] ? (agentMap[a].grade || '').toUpperCase() : '';
                var gb = agentMap[b] ? (agentMap[b].grade || '').toUpperCase() : '';
                var ra = GRADE_ORDER.indexOf(ga);
                var rb = GRADE_ORDER.indexOf(gb);
                if (ra < 0) ra = GRADE_ORDER.length;
                if (rb < 0) rb = GRADE_ORDER.length;
                if (ra !== rb) return ra - rb;
                return a.localeCompare(b);
            });

            /* Init groups in personnel order */
            for (var a = 0; a < agentOrder.length; a++) {
                groups[agentOrder[a]] = [];
            }

            /* Distribute OCE */
            for (var i = 0; i < oceList.length; i++) {
                var agentId = oceList[i].agent;
                if (!groups[agentId]) {
                    groups[agentId] = [];
                    /* Agent parti ou inconnu — ajout en fin de l'ordre */
                    agentOrder.push(agentId);
                }
                groups[agentId].push(oceList[i]);
            }

            /* Sort each group by echeance */
            for (var g in groups) {
                if (groups.hasOwnProperty(g)) {
                    groups[g].sort(function (a, b) {
                        return (a.dateEcheance || '').localeCompare(b.dateEcheance || '');
                    });
                }
            }

            return { groups: groups, order: agentOrder, agentMap: agentMap };
        }
    };

}());
