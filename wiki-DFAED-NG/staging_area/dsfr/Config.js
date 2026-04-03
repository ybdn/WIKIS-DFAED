/* SOURCE FILE FOR: [[MediaWiki:Dsfr/Config.js]] */
window.DsfrConfig = {
    service: {
        title: "Documentation FAED v3",
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
            label: "Signalisation",
            id: "menu-signalisation",
            items: [
                { label: "Procédure de signalisation", page: "Signalisation:Procédure" },
                { label: "Messages types", page: "Signalisation:Messages_types" },
                { label: "Guides utilisateurs", page: "Signalisation:Guides" },
                { label: "Fiches pratiques", page: "Signalisation:Fiches_pratiques" }
            ]
        },
        {
            type: "menu",
            label: "Consultation FAED",
            id: "menu-consultation",
            items: [
                { label: "Procédure de consultation", page: "Consultation:Procédure" },
                { label: "Messages types", page: "Consultation:Messages_types" },
                { label: "Guides utilisateurs", page: "Consultation:Guides" },
                { label: "Fiches pratiques", page: "Consultation:Fiches_pratiques" }
            ]
        },
        {
            type: "menu",
            label: "Traces papillaires",
            id: "menu-traces",
            items: [
                { label: "Procédure de prélèvement et transmission", page: "Traces:Procédure" },
                { label: "Messages types", page: "Traces:Messages_types" },
                { label: "Guides utilisateurs", page: "Traces:Guides" },
                { label: "Fiches pratiques", page: "Traces:Fiches_pratiques" }
            ]
        },
        {
            type: "menu",
            label: "Échanges Prüm",
            id: "menu-echanges",
            items: [
                { label: "Procédure d'échanges", page: "Echanges:Procédure" },
                { label: "Formulaires Prüm", page: "Echanges:Formulaires_Prum" },
                { label: "Messages types", page: "Echanges:Messages_types" },
                { label: "Fiches pratiques", page: "Echanges:Fiches_pratiques" }
            ]
        },
        {
            type: "menu",
            label: "Appui aux unités",
            id: "menu-appui",
            items: [
                { label: "Aide à l'enquête", page: "Appui:Aide_enquete" },
                { label: "Appui opérationnel", page: "Appui:Operationnel" },
                { label: "Soutien technique", page: "Appui:Soutien_technique" },
                { label: "Messages types", page: "Appui:Messages_types" }
            ]
        },
        {
            type: "menu",
            label: "Systèmes d'information",
            id: "menu-si",
            items: [
                { label: "Systèmes nationaux", page: "SI:Systemes_nationaux" },
                { label: "Systèmes européens", page: "SI:Systemes_europeens" },
                { label: "Formulaires et messages types", page: "SI:Formulaires" },
                { label: "Fiches pratiques", page: "SI:Fiches_pratiques" }
            ]
        },
        {
            type: "menu",
            label: "NéoDK",
            id: "menu-neodk",
            items: [
                { label: "Présentation / Prérequis", page: "NeoDK:Presentation" },
                { label: "Signalisation / Consultation", page: "NeoDK:Signalisation_Consultation" },
                { label: "Fiches pratiques", page: "NeoDK:Fiches_pratiques" },
                { label: "Soutien technique", page: "NeoDK:Soutien_technique" }
            ]
        },
        { type: "link", label: "Application FAED", href: "https://faed.sso.gendarmerie.fr/" }
    ],
    
    footer: {
        desc: "Ce wiki est la plateforme de documentation du DFAED à destination des utilisateurs du FAED.",
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
