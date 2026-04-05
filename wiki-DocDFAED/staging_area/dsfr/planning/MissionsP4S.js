/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/MissionsP4S.js]] */
/**
 * Configuration des missions pour le planning P4S (mensuel).
 * Modifiez cette liste pour ajouter/supprimer des codes missions.
 *
 * Proprietes :
 *   code  : Code court affiche dans les cellules du planning
 *   label : Libelle complet (dropdown et legende)
 *   bg    : Couleur de fond de la cellule (hexadecimal)
 *   fg    : Couleur du texte (hexadecimal)
 */
window.PlanningMissionsP4S = [
    { code: "",    label: "(vide)",                  bg: "#FFFFFF", fg: "#3a3a3a" },

/* PERMANENCES */
    { code: "M",   label: "Matin",                   bg: "#e8edff", fg: "#000091" },
    { code: "AM",  label: "Apres-midi",              bg: "#fff3bf", fg: "#695240" },
    { code: "WE",  label: "Week-end",                bg: "#ffe9e9", fg: "#c9191e" },

/* ABSENCES */
    { code: "R",   label: "Repos",                   bg: "#dffee6", fg: "#18753c" },
    { code: "RR",  label: "Repos recup.",            bg: "#dffee6", fg: "#18753c" },
    { code: "P",   label: "Permissions",             bg: "#dffee6", fg: "#18753c" },
    { code: "PM",  label: "Perm. matin",        bg: "#dffee6", fg: "#18753c" },
    { code: "PAM", label: "Perm. apres-midi",   bg: "#dffee6", fg: "#18753c" },

/* MALADIE */
    { code: "CM",  label: "Conge maladie",           bg: "#fce8f5", fg: "#7c0059" },

/* FORMATION */
    { code: "F",   label: "Formation",               bg: "#f2e6fd", fg: "#6a00f4" },
    { code: "TIR", label: "Tir",                     bg: "#f2e6fd", fg: "#6a00f4" },
    { code: "OPJ", label: "OPJ",                     bg: "#f2e6fd", fg: "#6a00f4" }
];
