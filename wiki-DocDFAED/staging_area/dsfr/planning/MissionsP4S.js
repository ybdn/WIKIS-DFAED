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
    { code: "",   label: "(vide)",                  bg: "#FFFFFF", fg: "#3a3a3a" },
/* PERMANENCES */    
    { code: "M",  label: "Matin",                   bg: "#E8EDFF", fg: "#000091" },
    { code: "AM", label: "Apres-midi",              bg: "#FFE8D4", fg: "#716043" },
    { code: "WE", label: "Week-end",                bg: "#FFD4D8", fg: "#910000" },
/* ABSENCES */
    { code: "R",  label: "Repos",                   bg: "#B8FEC9", fg: "#18753C" },
    { code: "RR", label: "Repos retard",            bg: "#B8FEC9", fg: "#18753C" },
    { code: "P",  label: "Permissions",             bg: "#B8FEC9", fg: "#18753C" },
    { code: "PM",  label: "Permission matin",       bg: "#B8FEC9", fg: "#18753C" },
    { code: "PAM",  label: "Permission après-midi", bg: "#B8FEC9", fg: "#18753C" },
    { code: "CM",  label: "Congé maladie",          bg: "#B8FEC9", fg: "#18753C" },
/* FORMATION */
    { code: "F",  label: "Formation",               bg: "#B8FEC9", fg: "#18753C" },
    { code: "TIR", label: "Tir",                    bg: "#B8FEC9", fg: "#18753C" },
    { code: "OPJ", label: "OPJ",                    bg: "#B8FEC9", fg: "#18753C" }
];
