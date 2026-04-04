/* SOURCE FILE FOR: [[MediaWiki:Dsfr/oce/OceConfig.js]] */
/**
 * Configuration du module OCE (Ordonnances de Commission d'Expert).
 * Statuts, priorites, couleurs et labels.
 */
window.OceConfig = {

    statuts: [
        { code: 'en_attente', label: 'En attente',  badge: 'fr-badge--info',    bg: '#E8EDFF', fg: '#000091' },
        { code: 'en_cours',   label: 'En cours',    badge: 'fr-badge--warning', bg: '#FEF7DA', fg: '#716043' },
        { code: 'termine',    label: 'Termine',     badge: 'fr-badge--success', bg: '#B8FEC9', fg: '#18753C' },
        { code: 'cloture',    label: 'Cloture',     badge: 'fr-badge--new',     bg: '#E5E5E5', fg: '#3A3A3A' }
    ],

    priorites: [
        { code: 'normale', label: 'Normale' },
        { code: 'urgente', label: 'Urgente' }
    ],

    /** Seuils echeance (jours) */
    echeance: {
        vert: 30,   // > 30 jours
        orange: 0,  // 0-30 jours
        rouge: -1   // depassee
    },

    getStatut: function (code) {
        for (var i = 0; i < this.statuts.length; i++) {
            if (this.statuts[i].code === code) return this.statuts[i];
        }
        return this.statuts[0];
    },

    /** Retourne les jours restants avant echeance */
    joursRestants: function (dateEcheance) {
        if (!dateEcheance) return null;
        var parts = dateEcheance.split('-');
        var ech = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        return Math.ceil((ech.getTime() - now.getTime()) / 86400000);
    },

    /** Retourne la classe CSS pour la couleur d'echeance */
    echeanceClass: function (dateEcheance) {
        var j = this.joursRestants(dateEcheance);
        if (j === null) return '';
        if (j < 0) return 'oce-echeance-depassee';
        if (j <= 30) return 'oce-echeance-proche';
        return 'oce-echeance-ok';
    },

    formatDate: function (isoDate) {
        if (!isoDate) return '';
        var parts = isoDate.split('-');
        if (parts.length < 3) return isoDate;
        return parts[2] + '/' + parts[1] + '/' + parts[0];
    },

    todayISO: function () {
        var d = new Date();
        var m = d.getMonth() + 1;
        var day = d.getDate();
        return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
    },

    nowISO: function () {
        var d = new Date();
        var m = d.getMonth() + 1;
        var day = d.getDate();
        var h = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();
        return d.getFullYear() + '-' +
            (m < 10 ? '0' : '') + m + '-' +
            (day < 10 ? '0' : '') + day + 'T' +
            (h < 10 ? '0' : '') + h + ':' +
            (min < 10 ? '0' : '') + min + ':' +
            (sec < 10 ? '0' : '') + sec;
    }
};
