/* SOURCE FILE FOR: [[MediaWiki:Dsfr/planning/MissionsJournalier.js]] */
/**
 * Configuration des missions pour le Service Journalier.
 * Modifiez cette liste pour ajouter/supprimer des codes missions.
 *
 * Proprietes :
 *   code  : Code court affiche dans les cellules du planning
 *   label : Libelle complet (dropdown et legende)
 *   bg    : Couleur de fond de la cellule (hexadecimal)
 *   fg    : Couleur du texte (hexadecimal)
 */
window.PlanningMissionsJournalier = [
    { code: "",      label: "(vide)",                        bg: "#FFFFFF", fg: "#3a3a3a" },

/* MISSIONS */
    { code: "MMO",   label: "MetaMorpho",                    bg: "#e8edff", fg: "#000091" },
    { code: "T41",   label: "Alphanu",                       bg: "#d8f5f5", fg: "#009099" },
    { code: "ID",    label: "Identification",                bg: "#ffe9e9", fg: "#c9191e" },
    { code: "AD",    label: "Administration de base",        bg: "#fff3bf", fg: "#695240" },
    { code: "CA",    label: "Conduite admin. de l'unite",    bg: "#e9edf5", fg: "#2f4077" },
    { code: "CO",    label: "Correction traces",             bg: "#f5ede8", fg: "#6e3b2a" },
    { code: "J",     label: "Mission particuliere",          bg: "#f6f6f6", fg: "#3a3a3a" },

/* PERMANENCES */
    { code: "PO",    label: "Permanence Operationnelle",     bg: "#f2e6fd", fg: "#6a00f4" },

/* FORMATION */
    { code: "F",     label: "Formation",                     bg: "#dffee6", fg: "#18753c" },
    { code: "SPORT", label: "Sport",                         bg: "#fee9e2", fg: "#b34000" },

/* MALADIE */
    { code: "CM",    label: "Conge maladie",                 bg: "#fce8f5", fg: "#7c0059" },

/* ABSENCES */
    { code: "R",     label: "Repos",                         bg: "#eeeeee", fg: "#666666" },
    { code: "RR",    label: "Repos recuperateur",            bg: "#eeeeee", fg: "#666666" },
    { code: "P",     label: "Permissions",                   bg: "#eeeeee", fg: "#666666" }
];
