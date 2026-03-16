/* SOURCE FILE FOR: [[MediaWiki:Dsfr/Config.js]] */
window.DsfrConfig = {
    service: {
        title: "DocDFAED (dev)",
        tagline: "Département du Fichier Automatisé des Empreintes Digitales",
        logoText: ["Ministère", "de l'Intérieur"]
    },
 
    /**
     * Navigation principale - Structure DSFR
     * Types: 
     *   - "link" : lien simple
     *   - "menu" : menu déroulant avec sous-éléments
     */
    navigation: [
        { type: "link", label: "Accueil", page: "Accueil" },
        {
            type: "menu",
            label: "Documentation",
            id: "menu-documentation",
            items: [
                { label: "ASQ", page: "Documentation:ASQ" },
                { label: "Veille professionnelle", page: "Documentation:Veille_professionnelle" }
            ]
        },
        {
            type: "menu",
            label: "Formation",
            id: "menu-formation",
            items: [
                { label: "Formations internes", page: "Formation:Formations_internes" },
                { label: "Formations externes", page: "Formation:Formation_externes" }
            ]
        },
        {
            type: "menu",
            label: "Planning",
            id: "menu-planning",
            items: [
                { label: "Consultation", page: "Planning:Consultation" },
                { label: "Gestion", page: "Planning:Gestion" }
            ]
        },
        {
            type: "menu",
            label: "OCE",
            id: "menu-oce",
            items: [
                { label: "Consultation", page: "OCE:Consultation" },
                { label: "Gestion", page: "OCE:Gestion" }
            ]
        },
        { type: "link", label: "Historique", page: "Historique" },
        { type: "link", label: "Application FAED", page: "#" }
    ],
 
    footer: {
        desc: "Ce wiki est la plateforme de documentation interne du DFAED.",
        links: [
            { label: "legifrance.gouv.fr", href: "https://legifrance.gouv.fr" },
            { label: "gouvernement.fr", href: "https://gouvernement.fr" },
            { label: "service-public.fr", href: "https://service-public.fr" }
        ],
        bottomLinks: [
            { label: "Mentions légales", href: "#" },
            { label: "Plan du site", href: "#" },
            { label: "Outils de la page", href: "#", id: "dsfr-tools-link", isToolsLink: true }
        ],
        /* Outils de la page - affichés dans un panneau modal */
        pageTools: [
            { label: "Pages liées", specialPage: "Special:Whatlinkshere" },
            { label: "Suivi des pages liées", specialPage: "Special:Recentchangeslinked" },
            { label: "Importer un fichier", specialPage: "Special:Upload" },
            { label: "Pages spéciales", specialPage: "Special:SpecialPages" },
            { label: "Adresse de cette version", action: "permalink" },
            { label: "Information sur la page", action: "info" },
            { label: "Chercher les propriétés", specialPage: "Special:SearchByProperty" }
        ]
    }
};
