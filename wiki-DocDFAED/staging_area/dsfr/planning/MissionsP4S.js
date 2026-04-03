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
    { code: "",   label: "(vide)",         bg: "#FFFFFF", fg: "#3a3a3a" },
    { code: "M",  label: "Matin",          bg: "#E8EDFF", fg: "#000091" },
    { code: "AM", label: "Apres-midi",     bg: "#FFE8D4", fg: "#716043" },
    { code: "R",  label: "Repos",          bg: "#B8FEC9", fg: "#18753C" },
    { code: "RR", label: "Repos retard",   bg: "#D2F9E4", fg: "#18753C" },
    { code: "P",  label: "Permissions",    bg: "#FFD4D8", fg: "#CE0500" }
];
