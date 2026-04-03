/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/PlanningData.js]] */
/**
 * Service de donnees pour le module Planning.
 * Lecture/ecriture des donnees via l'API MediaWiki (pages JSON).
 * Utilitaires de dates et jours feries francais.
 */
(function () {

    var BASE_PATH = 'Planning:Data/';

    var MOIS = [
        'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
    ];

    var JOURS_COURTS = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
    var JOURS_LONGS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    /* ------------------------------------------------------------------ */
    /*  Utilitaires dates                                                  */
    /* ------------------------------------------------------------------ */

    function pad(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function getDayOfWeek(year, month, day) {
        return new Date(year, month - 1, day).getDay(); // 0=Di, 6=Sa
    }

    function isWeekend(year, month, day) {
        var dow = getDayOfWeek(year, month, day);
        return dow === 0 || dow === 6;
    }

    /* ------------------------------------------------------------------ */
    /*  Jours feries francais                                              */
    /* ------------------------------------------------------------------ */

    function getEasterDate(year) {
        var a = year % 19;
        var b = Math.floor(year / 100);
        var c = year % 100;
        var d = Math.floor(b / 4);
        var e = b % 4;
        var f = Math.floor((b + 8) / 25);
        var g = Math.floor((b - f + 1) / 3);
        var h = (19 * a + b - d - g + 15) % 30;
        var i = Math.floor(c / 4);
        var k = c % 4;
        var l = (32 + 2 * e + 2 * i - h - k) % 7;
        var m = Math.floor((a + 11 * h + 22 * l) / 451);
        var month = Math.floor((h + l - 7 * m + 114) / 31);
        var day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }

    function getHolidays(year) {
        var easter = getEasterDate(year);
        var eMs = easter.getTime();
        var day = 86400000;
        var list = {};

        function add(d, name) {
            var key = (d.getMonth() + 1) + '-' + d.getDate();
            list[key] = name;
        }

        add(new Date(year, 0, 1),   "Jour de l'An");
        add(new Date(eMs + 1 * day), 'Lundi de Paques');
        add(new Date(year, 4, 1),   'Fete du Travail');
        add(new Date(year, 4, 8),   'Victoire 1945');
        add(new Date(eMs + 39 * day), 'Ascension');
        add(new Date(eMs + 50 * day), 'Lundi de Pentecote');
        add(new Date(year, 6, 14),  'Fete Nationale');
        add(new Date(year, 7, 15),  'Assomption');
        add(new Date(year, 10, 1),  'Toussaint');
        add(new Date(year, 10, 11), 'Armistice');
        add(new Date(year, 11, 25), 'Noel');

        return list;
    }

    var _holidaysCache = {};

    function isHoliday(year, month, day) {
        if (!_holidaysCache[year]) {
            _holidaysCache[year] = getHolidays(year);
        }
        var key = month + '-' + day;
        return !!_holidaysCache[year][key];
    }

    function getHolidayName(year, month, day) {
        if (!_holidaysCache[year]) {
            _holidaysCache[year] = getHolidays(year);
        }
        var key = month + '-' + day;
        return _holidaysCache[year][key] || '';
    }

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
                summary: summary || 'Mise a jour planning'
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

    window.PlanningData = {
        MOIS: MOIS,
        JOURS_COURTS: JOURS_COURTS,
        JOURS_LONGS: JOURS_LONGS,

        pad: pad,
        getDaysInMonth: getDaysInMonth,
        getDayOfWeek: getDayOfWeek,
        isWeekend: isWeekend,
        isHoliday: isHoliday,
        getHolidayName: getHolidayName,

        /* Personnel */
        loadPersonnel: function (cb) {
            readPage(BASE_PATH + 'Personnel', cb);
        },
        savePersonnel: function (data, cb) {
            writePage(BASE_PATH + 'Personnel', data, 'Maj personnel', cb);
        },

        /* P4S mensuel */
        loadP4S: function (year, month, cb) {
            var key = year + '-' + pad(month);
            readPage(BASE_PATH + 'P4S/' + key, cb);
        },
        saveP4S: function (year, month, data, cb) {
            var key = year + '-' + pad(month);
            writePage(BASE_PATH + 'P4S/' + key, data, 'P4S ' + key, cb);
        },

        /* Service journalier */
        loadJournalier: function (year, month, day, cb) {
            var key = year + '-' + pad(month) + '-' + pad(day);
            readPage(BASE_PATH + 'Journalier/' + key, cb);
        },
        saveJournalier: function (year, month, day, data, cb) {
            var key = year + '-' + pad(month) + '-' + pad(day);
            writePage(BASE_PATH + 'Journalier/' + key, data, 'Journalier ' + key, cb);
        }
    };

}());
