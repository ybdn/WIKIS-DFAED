# Journal des modifications — wiki-DFAED-NG

Tous les changements notables de ce projet sont documentés ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [Non publié]

### Anti-FOUC — Loader complet

- **`shared/Common.css`** : refonte de la section anti-FOUC.
  - Avant : seul `.mw-parser-output` était masqué — le chrome Vector (header, sidebar, footer) restait visible pendant 1-2s.
  - Maintenant : `body` entier masqué (`opacity: 0`) + overlay fond bleu clair (`#f5f5fe`) + spinner DSFR (`#000091`) via `html::before` / `html::after`.
  - Révélation en 0.3s quand `html.dsfr-ready` est ajouté par `Common.js`.
  - Failsafe CSS à 4s (animation) + failsafe JS à 5s (setTimeout) inchangés.
- **`LocalSettings.php`** : chemin CSS corrigé de `/staging_area/Common.css` vers `/shared/Common.css`.

### Architecture — Refonte en base commune partagée

- **Dossier `shared/`** (à la racine du dépôt) : nouvelle base de code commune aux deux wikis.
  - `shared/Common.css` — styles globaux communs.
  - `shared/dsfr/Layout.js`, `Header.js`, `Footer.js`, `EditPage.js`, `Style.css` — modules core.
  - `shared/dsfr/components/` — 36 composants disponibles (voir liste ci-dessous).
- **`staging_area/`** réduit à l'essentiel de cette instance : `Common.js` (orchestrateur) + `dsfr/Config.js` (navigation, branding).
- **`staging_area/Common.js`** : refonte — deux listes séparées (`localModules` pour Config, `sharedModules` pour tout le reste), chemins locaux `shared/dsfr/` en dev, pages `MediaWiki:Dsfr/` en prod.

### Ajouts

- **`dsfr/components/Stepper.js`** : Composant indicateur d'étapes DSFR.
  - Syntaxe wikitext simplifiée via `.dsfr-stepper` et attributs `data-*` : `data-current`, `data-total`, `data-title`, `data-next` (optionnel), `data-title-level` (optionnel, défaut `h2`).
  - Génère la structure DSFR complète : `fr-stepper`, `fr-stepper__title`, `fr-stepper__state`, `fr-stepper__steps` (avec `data-fr-current-step` / `data-fr-steps`), `fr-stepper__details` (absent sur la dernière étape).
  - Clamp automatique des valeurs hors-borne, transformation idempotente.
- **`dsfr/EditPage.js`** : ajout de 2 entrées dans le menu "Composants DSFR" : Indicateur d'étapes (étape courante) et Indicateur d'étapes (dernière étape).

- **`dsfr/components/Card.js`** : Composant carte DSFR complet.
  - Carte simple via `.dsfr-card` : titre, description, lien (interne via `mw.util.getUrl()` ou URL absolue), badge (types `new`, `info`, `success`, `warning`, `error`), détail avec icône optionnelle, image d'illustration.
  - Grille responsive via `.dsfr-card-grid` : 2, 3 (défaut) ou 4 colonnes, adaptatif mobile → tablette → bureau (`fr-grid-row--equal-height`).
  - Variantes : `data-horizontal`, `data-shadow`, `data-grey`, `data-no-arrow`.
  - `data-image` : support des fichiers wiki (`File:Image.png` / `Fichier:Image.png`) en plus des URL directes, via `Special:FilePath`.
  - `data-image-ratio` : contrôle du ratio de l'image (`16x9`, `32x9`, `3x4`, `2x3`, `4x3`, `1x1`) via les classes DSFR `fr-ratio-*`.
  - `data-horizontal` étendu : `"tier"` (⅓ image / ⅔ contenu) et `"half"` (50/50) en plus de `"true"` (défaut).
  - Déballage automatique du `<p>` injecté par le parseur MediaWiki autour du contenu des `<div>`.
- **`dsfr/EditPage.js`** : ajout de 5 entrées dans le menu déroulant "Composants DSFR" : Carte (simple), Carte (avec badge et détail), Grille de cartes (2 colonnes), Grille de cartes (3 colonnes), Grille de cartes (4 colonnes).

- **Composants implémentés dans `shared/dsfr/components/`** (36 composants, disponibles pour activation via `Common.js`) :
  - **Actifs sur ce wiki** : Accordion, Alert, Badge, Card, Stepper.
  - **Implémentés, non encore activés** : Breadcrumb, Button, Callout, Checkbox, Download, Dropdown, Form, Highlight, Input, Link, Modal, Notice, Pagination, Quote, Radio, Search, Segmented, Select, Share, Sidemenu, Skiplink, Summary, Tab, Table, Tabnav, Tag, Tile, Toggle, Tooltip, Transcription, Upload.

- **Documentation (`docs/composants/`)** : 36 fichiers Markdown — un par composant disponible dans `shared/`. Couvre la syntaxe wikitext, les attributs `data-*`, les exemples et la structure HTML générée.

### Corrections

- **`dsfr/Style.css`** : fix pastilles bleues sur les listes DSFR. MediaWiki applique `list-style: disc` sur tous les `<ul>`, polluant les composants `.fr-nav__list`, `.fr-grid-row`, `.fr-btns-group`, `.fr-menu__list`, etc. Ajout d'un reset `list-style: none !important` ciblant tous les éléments `ul[class*="fr-"]` et `li[class*="fr-"]`.
- **`dsfr/Header.js`** : fix race condition — attente explicite de `DsfrConfig` avant le montage du header, évitant un affichage avec une navigation vide sur les chargements lents.
- **`dsfr/Layout.js`** : suppression du sommaire automatique MediaWiki (`.toc`) et nettoyage des artefacts natifs MW résiduels (catégories liées, portlets, éléments MonoBook) qui persistaient dans l'interface DSFR.
- **`dsfr/EditPage.js`** : corrections successives de l'affichage de la barre d'outils et du volet "Composants DSFR".

---

## [2.1.0] — 2026-02-26

### Ajouts

- **`dsfr/components/Accordion.js`** : Composant accordéon DSFR. Convertit les éléments portant la classe `.dsfr-accordion-item` en structure `fr-accordion` standard, avec gestion `aria-expanded`, IDs uniques générés dynamiquement et dépliage par délégation d'événements sur le bouton.
- **`dsfr/components/Alert.js`** : Composant alerte DSFR. Prend en charge les types `info`, `success`, `warning`, `error`, avec titre (balise h3) et bouton de fermeture optionnels configurés via attributs `data-*`.
- **`dsfr/components/Badge.js`** : Composant badge DSFR. Supporte les variantes de type (`success`, `error`, `info`, `warning`, `new`), couleur personnalisée, taille réduite (`sm`) et masquage d'icône.
- **46 stubs de composants DSFR** prêts à implémenter : Breadcrumb, Button, Callout, Card, Checkbox, Combobox, Composition, Connect, Consent, Content, Display, Download, Dropdown, Follow, Form, Highlight, Input, Link, Logo, Modal, Navigation, Notice, Pagination, Password, Quote, Radio, Range, Search, Segmented, Select, Share, Sidemenu, Skiplink, Stepper, Summary, Tab, Tabnav, Table, Tag, Tile, Toggle, Tooltip, Transcription, Translate, Upload, User.
- **Éditeur DSFR (`EditPage.js`)** : nouveau module qui remplace intégralement la toolbar WikiEditor native par une interface DSFR.
  - **Barre d'outils de formatage** : boutons Gras, Italique, Souligné, Titres H2-H4, Alignements (gauche, centre, droite, justifié), Listes ordonnées/non-ordonnées, Liens internes/externes, Images.
  - **Menu déroulant "Composants DSFR"** : insertion rapide d'alertes (info, succès, erreur), accordéons, badges, callouts et citations, avec lien vers la documentation officielle DSFR.
  - **Barre d'actions sticky** : boutons Annuler, Voir les modifications, Prévisualiser et Publier, affichés en haut de page avec le nom de la page en cours d'édition.
  - **Restyling des options d'édition** : champ résumé en `fr-input`, checkboxes en `fr-checkbox-group`, notice copyright en `fr-notice` repliable, boutons d'action dupliqués en bas de page.
- **Icônes SVG custom** : 4 classes d'icônes (`dsfr-icon-underline`, `dsfr-icon-align-center`, `dsfr-icon-align-right`, `dsfr-icon-align-justify`) qui reproduisent le système `mask-image` du DSFR pour les icônes absentes de la v1.12.1.

### Corrections

- **Fix carrés bleus** : les boutons avec icônes custom apparaissaient comme des carrés bleus car les classes `dsfr-icon-*` ne matchaient pas le sélecteur `[class^="fr-icon-"]` du DSFR — ajout des propriétés de base du pseudo-élément (`content`, `display`, `width`, `height`, `background-color`, `mask-size`, `mask-repeat`) pour reproduire le comportement natif.

### Changements

- **Style.css** : ajout de styles pour l'éditeur (toolbar, barre d'actions, options d'édition, masquage des éléments MW natifs).
- **Common.js** : ajout du chargement du module `EditPage.js` sur les pages d'édition.

---

## [2.0.0] — 2026-02-26

### Ajouts

- **Semantic MediaWiki 3.2.3** : installé via Composer, activé avec `enableSemantics('localhost')`. Permet de tester les requêtes `{{#ask:}}`, propriétés SMW et templates sémantiques en local.
- **`dsfr/Config.js`** : Configuration centralisée de l'interface.
  - Identité du service (titre, tagline, texte du logo Marianne).
  - Navigation principale avec 7 rubriques : Accueil, Signalisation, Consultation FAED, Traces papillaires, Échanges Prüm, Appui aux unités, Systèmes d'information, NéoDK — chacune avec sous-menus configurables.
  - Footer : liens institutionnels (Légifrance, Gouvernement, Service-Public), liens de bas de page (Mentions légales, Plan du site, Outils) et outils de la page (7 liens vers pages spéciales MediaWiki).
- **`dsfr/Layout.js`** : Préparation du DOM MediaWiki pour l'intégration DSFR.
  - Masquage des éléments natifs de la skin MonoBook (sidebar `#mw-panel`, footer `#footer`, classe `.mw-footer`, etc.).
  - Injection d'un fil d'Ariane DSFR dynamique construit depuis `wgPageName`, avec analyse des séparateurs `:` et `/` et liens reconstruits via `mw.util.getUrl()`.
  - Remplacement du titre H1 par le dernier segment du chemin de page. Désactivé sur la page d'accueil.
- **`dsfr/Header.js`** : Header DSFR résilient au chargement asynchrone de MediaWiki.
  - Mécanisme de polling sur jQuery et `mw.util` toutes les 50 ms (maximum 300 tentatives = 15 secondes).
  - Extraction des actions natives MediaWiki depuis `#p-views` et `#p-cactions` (Lire, Modifier, Historique, Suivre).
  - Construction des menus de navigation DSFR (liens simples et menus déroulants).
  - Gestion de l'authentification : menus distincts pour utilisateur connecté et anonyme.
  - Retrait de l'overlay loader une fois le header injecté.
- **`dsfr/Footer.js`** : Footer DSFR complet.
  - Structure Marianne avec liens institutionnels configurables depuis `Config.js`.
  - Modale d'outils de la page (dialog avec accès aux pages spéciales MediaWiki).
  - Utilise l'ID `dsfr-footer` pour éviter tout conflit avec l'élément natif `#footer` de MediaWiki.
- **`Common.js`** (refonte) : Orchestrateur de chargement principal.
  - Injection immédiate d'un overlay blanc avec spinner CSS (anti-FOUC), failsafe à 5 secondes.
  - Détection automatique de l'environnement : `localhost` → chargement depuis `staging_area/` ; production → chargement depuis les pages `MediaWiki:Dsfr/*` avec cache-busting horodaté.
  - Chargement séquentiel des modules : Config → Layout → Header → Footer → EditPage → composants.

### Changements

- **MediaWiki** : passage de `1.23.8` à `1.31.16` (LTS — dernière version de la branche 1.31).
- **PHP** : passage de `5.6` (Debian Stretch, EOL) à `7.4` (Debian Bullseye).
- **LocalSettings.php** : suppression des options obsolètes (`$wgScriptExtension`, `$wgDBmysql5`), migration du hook `BeforePageDisplay` vers `addHeadItem()` / `addScript()` (remplacement de `addScriptFile()` supprimé en MW 1.24), passage à `wfLoadExtension('WikiEditor')`.
- **Dockerfile** : refonte complète — nouvelle image de base, ajout de Composer 2, patch du `composer.json` de MW 1.31 via `jq` pour compatibilité Composer 2 (suppression de `wikimedia/composer-merge-plugin` v1.4.1 incompatible, désactivation du blocage des security advisories), correctif du chemin `populateHashField.php` de SMW.

### Infrastructure

- Composer 2 (installé en multi-stage depuis `composer:2`).
- Extensions PHP ajoutées : `mbstring`, `xml`, `zip`, `libonig`.
- Limites PHP relevées : `upload_max_filesize=100M`, `post_max_size=100M`, `memory_limit=256M`.

---

## [1.0.0] — 2024 (initial)

### Ajouts

- Environnement Docker initial : MediaWiki 1.23.8, PHP 5.6, MariaDB 10.4.
- `LocalSettings.php` avec chargement des assets DSFR via le hook `BeforePageDisplay` : CSS DSFR v1.12.1 (CDN jsDelivr) + `Common.js` (attribut `defer`).
- Extension WikiEditor activée.
- Workflow copy-paste `staging_area/` → pages `MediaWiki:`.
- Architecture "Zéro FOUC" : overlay blanc injecté immédiatement par `Common.js` + CSS DSFR préchargé côté serveur via `LocalSettings.php`.
- `staging_area/` servi directement par le conteneur Docker en développement local (hot reload sans rebuild d'image).
