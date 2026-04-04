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
    { code: "",    label: "(vide)",                    bg: "#FFFFFF", fg: "#3a3a3a" },

    { code: "MMO", label: "MetaMorpho",                bg: "#E8EDFF", fg: "#000091" },
    { code: "T41", label: "Alphanu",                   bg: "#FFE8D4", fg: "#716043" },
    { code: "ID",  label: "Identification",            bg: "#FFD4D8", fg: "#7c0300" },
    { code: "AD",  label: "Administration de base",    bg: "#fff9d4", fg: "#7c5b00" },
    { code: "J",   label: "Mission particulière",      bg: "#FFFFFF", fg: "#000000" },

    { code: "PO",  label: "Permanence Opérationnelle", bg: "#dad4ff", fg: "#3000b6" },

    { code: "F",  label: "Formation",                  bg: "#d4ffda", fg: "#297254" },


    { code: "SPORT",   label: "Sport",                     bg: "#ffe7d4", fg: "#ce4100" },


    { code: "R",   label: "Repos",                     bg: "#a1a1a1", fg: "#424242" },
    { code: "RR",  label: "Repos récupérateur",        bg: "#a1a1a1", fg: "#424242" },
    { code: "P",   label: "Permissions",               bg: "#a1a1a1", fg: "#424242" },

];
