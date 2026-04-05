# DocDFAED — Environnement de développement

Environnement de développement local Dockerisé pour concevoir et tester les scripts (JS) et styles (CSS) du wiki **DocDFAED** en production.

DocDFAED est la plateforme de documentation interne du Département du Fichier Automatisé des Empreintes Digitales (DFAED — Gendarmerie nationale). Accès restreint aux agents du département, hébergé par le BSII / Pôle judiciaire.

## Stack

| Composant | Version |
| ----------- | --------- |
| MediaWiki | 1.31.16 (LTS) |
| Semantic MediaWiki | 3.2.3 |
| PHP | 7.4 |
| MariaDB | 10.4 |

## Démarrage rapide

1. **Prérequis** : Docker Desktop installé.

2. **Lancer le serveur** :

   ```bash
   docker compose up -d
   ```

3. **Premier démarrage uniquement** — initialiser les tables (MediaWiki + SMW) :

   ```bash
   docker compose exec mediawiki php maintenance/update.php --quick
   ```

4. **Accéder au Wiki local** : [http://localhost:8081](http://localhost:8081)
   - **User** : `admin`
   - **Pass** : `admin123`

> Le wiki DFAED-NG tourne sur le port **8080**. DocDFAED utilise le port **8081** pour éviter les conflits.

## Workflow de développement

L'édition se fait dans `staging_area/` (Config.js + Common.js propres à DocDFAED) et dans `../shared/` (base commune aux deux wikis).

> **CONTRAINTE TECHNIQUE — Compatibilité prod (MediaWiki 1.31)**
> Le Wiki de production ne supporte pas le JavaScript moderne dans son minifier.
>
> - **INTERDIT** : `const`, `let`, les backticks `` ` ``, les fonctions fléchées `=>`.
> - **OBLIGATOIRE** : `var`, la concaténation `'a' + 'b'`, et `function() {}` classique.
> **RÈGLE IMPORTANTE** : Chaque fichier doit commencer par `/* SOURCE FILE FOR: [[MediaWiki:NomDeLaPage]] */`

### Déploiement en Production (Copy-Paste)

Le Wiki de production n'a pas accès à ce dépôt Git. Mise à jour via l'interface web uniquement.

| Source locale | Page Wiki de production | Rôle |
| -------------- | ------------------------- | ------ |
| `staging_area/Common.js` | `MediaWiki:Common.js` | Loader & chef d'orchestre (À copier en priorité) |
| `staging_area/dsfr/Config.js` | `MediaWiki:Dsfr/Config.js` | Navigation, branding, footer DocDFAED |
| `shared/Common.css` | `MediaWiki:Common.css` | Styles de base |
| `shared/dsfr/Layout.js` | `MediaWiki:Dsfr/Layout.js` | Nettoyage DOM & fil d'Ariane |
| `shared/dsfr/Header.js` | `MediaWiki:Dsfr/Header.js` | Header DSFR |
| `shared/dsfr/Footer.js` | `MediaWiki:Dsfr/Footer.js` | Pied de page |
| `shared/dsfr/EditPage.js` | `MediaWiki:Dsfr/EditPage.js` | Barre d'édition DSFR |
| `shared/dsfr/Style.css` | `MediaWiki:Dsfr/Style.css` | Styles DSFR & overrides |
| `shared/dsfr/components/*.js` | `MediaWiki:Dsfr/components/*.js` | Composants DSFR (voir liste ci-dessous) |
| `staging_area/dsfr/planning/MissionsP4S.js` | `MediaWiki:Dsfr/planning/MissionsP4S.js` | Config missions Planning Mensuel |
| `staging_area/dsfr/planning/MissionsJournalier.js` | `MediaWiki:Dsfr/planning/MissionsJournalier.js` | Config missions Service Journalier |
| `staging_area/dsfr/planning/PlanningData.js` | `MediaWiki:Dsfr/planning/PlanningData.js` | Service de données (API MW + jours fériés) |
| `staging_area/dsfr/planning/PlanningP4S.js` | `MediaWiki:Dsfr/planning/PlanningP4S.js` | Vue Planning Mensuel |
| `staging_area/dsfr/planning/PlanningJournalier.js` | `MediaWiki:Dsfr/planning/PlanningJournalier.js` | Vue Service Journalier |
| `staging_area/dsfr/planning/PlanningPersonnel.js` | `MediaWiki:Dsfr/planning/PlanningPersonnel.js` | Gestion du personnel (CRUD) |
| `staging_area/dsfr/planning/PlanningApp.js` | `MediaWiki:Dsfr/planning/PlanningApp.js` | Orchestrateur (routing, tabs, permissions) |
| `staging_area/dsfr/planning/Planning.css` | `MediaWiki:Dsfr/planning/Style.css` | Styles DSFR du module Planning |

### Navigation configurée (Config.js)

| Entrée | Type | Sous-éléments |
| -------- | ------ | --------------- |
| Accueil | Lien | — |
| Documentation | Menu | ASQ, Veille professionnelle |
| Formation | Menu | Formations internes, Formations externes |
| Planning | Menu | Consultation, Gestion |
| OCE | Menu | Consultation, Gestion |
| Historique | Lien | — |
| Application FAED | Lien | — |

### Composants DSFR (stubs)

49 composants présents dans `staging_area/dsfr/components/` — tous structurés, à implémenter selon les besoins :

**Actifs** : Accordion, Alert, Badge, Card, Stepper, Download, Summary, Tab, Table, Tag, Tooltip (11 composants chargés dans `sharedModules`)

**Disponibles dans `shared/`, non encore activés** : Breadcrumb, Button, Callout, Checkbox, Dropdown, Form, Highlight, Input, Link, Modal, Notice, Pagination, Quote, Radio, Search, Segmented, Select, Share, Sidemenu, Skiplink, Tabnav, Tile, Toggle, Transcription, Upload

---

## Module Planning

Application de planning intégrée au wiki, avec deux vues et deux modes d'accès.

### Vues

| Vue | Description |
| --- | ----------- |
| **P4S — Planning Mensuel** | Grille agents × jours du mois. Week-ends et jours fériés FR colorés. |
| **Service Journalier** | Grille agents × heures (07h–20h). |

### Accès

| Mode | Page wiki | Droits |
| ---- | --------- | ------ |
| **Consultation** | `Planning:Consultation` | Tous les utilisateurs — lecture seule |
| **Gestion** | `Planning:Gestion` | Bureaucrates / Sysop — édition cellules, gestion personnel, compteurs |

### Fonctionnalités

- ✏️ Édition par clic sur cellule → menu déroulant des missions
- 📊 Compteurs par personnel (Gestion uniquement)
- 📅 Navigation ◄ ► par mois (P4S) ou par jour (Journalier)
- 🎨 Colorisation week-ends et jours fériés français
- 👥 Gestion du personnel (ajouter, modifier, réordonner, marquer départ)
- 🖨️ Export PDF via impression navigateur
- 💾 Sauvegarde via bouton « Enregistrer »

### Stockage des données (pages wiki JSON)

Les données sont stockées dans des pages wiki au format JSON, créées automatiquement via l'API MediaWiki :

| Page wiki | Contenu |
| --------- | ------- |
| `Planning:Data/Personnel` | Liste des agents (id, nom, grade, statut actif/parti) |
| `Planning:Data/P4S/YYYY-MM` | Planning mensuel (ex: `Planning:Data/P4S/2026-04`) |
| `Planning:Data/Journalier/YYYY-MM-DD` | Service journalier (ex: `Planning:Data/Journalier/2026-04-03`) |

> **Note** : Les données de planning d'un agent parti restent dans les pages JSON historiques. Seul son statut change dans la liste du personnel.

### Configuration des missions

Les codes missions sont définis dans des fichiers JS éditables :

- `staging_area/dsfr/planning/MissionsP4S.js` — codes du planning mensuel (M, AM, R, RR, P…)
- `staging_area/dsfr/planning/MissionsJournalier.js` — codes du service journalier (MMO, T41, PO, ID…)

Chaque mission a un `code`, un `label`, et des couleurs (`bg`, `fg`).

### Mise en place en production

1. Créer les pages `Planning:Consultation` et `Planning:Gestion` (contenu minimal)
2. Copier les 8 fichiers JS/CSS du planning vers les pages `MediaWiki:Dsfr/planning/*`
3. Mettre à jour `MediaWiki:Common.js` (bloc de chargement conditionnel Planning)

---

## Architecture "Zéro FOUC"

1. **Loader immédiat** : `Common.js` injecte un overlay blanc dès la première milliseconde.
2. **CSS préchargé** : `LocalSettings.php` injecte le CSS DSFR côté serveur via `addHeadItem`.
3. **Header résilient** : `Header.js` attend que MediaWiki soit prêt avant de s'afficher et retirer l'overlay.

Ordre de chargement : `Config → Layout → Header → Footer → EditPage → components`

## Semantic MediaWiki

L'environnement local embarque SMW 3.2.3, identique à la version de production. Permet de tester les requêtes `{{#ask:}}`, propriétés SMW et templates sémantiques directement en local.

## Commandes utiles

```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Reconstruire l'image (après modif du Dockerfile)
docker compose up -d --build

# Logs en temps réel
docker compose logs -f mediawiki

# Accès shell dans le container
docker compose exec mediawiki bash

# Réinitialiser la base de données (supprime toutes les données)
docker compose down -v
docker compose up -d
docker compose exec mediawiki php maintenance/update.php --quick
```
