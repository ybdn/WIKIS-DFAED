# Journal des modifications — wiki-DocDFAED

Tous les changements notables de ce projet sont documentés ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [Non publié]

### Anti-FOUC — Loader complet

- **`shared/Common.css`** : refonte de la section anti-FOUC.
  - `body` entier masqué + overlay fond bleu clair + spinner DSFR via `html::before` / `html::after`.
  - Révélation en 0.3s via `html.dsfr-ready`. Failsafe CSS 4s + JS 5s.
- **`LocalSettings.php`** : chemin CSS corrigé vers `/shared/Common.css`.

### Architecture — Refonte en base commune partagée

- **Dossier `shared/`** (à la racine du dépôt) : nouvelle base de code commune aux deux wikis.
  - `shared/Common.css` — styles globaux communs.
  - `shared/dsfr/Layout.js`, `Header.js`, `Footer.js`, `EditPage.js`, `Style.css` — modules core.
  - `shared/dsfr/components/` — 36 composants disponibles.
- **`staging_area/`** réduit à l'essentiel de cette instance : `Common.js` (orchestrateur) + `dsfr/Config.js` (navigation, branding).
- **`staging_area/Common.js`** : refonte — deux listes séparées (`localModules` pour Config, `sharedModules` pour tout le reste), chemins locaux `shared/dsfr/` en dev, pages `MediaWiki:Dsfr/` en prod.

### Ajouts

- **`dsfr/components/Card.js`** : Composant carte DSFR complet.
  - Carte simple via `.dsfr-card` : titre, description, lien (interne via `mw.util.getUrl()` ou URL absolue), badge (types `new`, `info`, `success`, `warning`, `error`), détail avec icône optionnelle, image d'illustration.
  - Grille responsive via `.dsfr-card-grid` : 2, 3 (défaut) ou 4 colonnes, adaptatif mobile → tablette → bureau (`fr-grid-row--equal-height`).
  - Variantes : `data-horizontal`, `data-shadow`, `data-grey`, `data-no-arrow`.
  - Déballage automatique du `<p>` injecté par le parseur MediaWiki autour du contenu des `<div>`.
  - `data-image` : support des fichiers wiki (`File:Image.png` / `Fichier:Image.png`) en plus des URL directes, via `Special:FilePath`.
  - `data-image-ratio` : contrôle du ratio de l'image (`16x9`, `32x9`, `3x4`, `2x3`, `4x3`, `1x1`) via les classes DSFR `fr-ratio-*`.
  - `data-horizontal` étendu : `"tier"` (⅓ image / ⅔ contenu) et `"half"` (50/50) en plus de `"true"` (défaut).
- **`dsfr/EditPage.js`** : ajout de 5 entrées dans le menu déroulant "Composants DSFR" : Carte (simple), Carte (avec badge et détail), Grille de cartes (2 colonnes), Grille de cartes (3 colonnes), Grille de cartes (4 colonnes).

- **`dsfr/components/Stepper.js`** : implémentation complète du composant "Indicateur d'étapes" DSFR. Transformation des éléments `.dsfr-stepper` (data-current, data-total, data-title, data-next, data-title-level) en structure `fr-stepper` valide. Support de la dernière étape (sans `fr-stepper__details`).
- **`dsfr/EditPage.js`** : ajout de 2 entrées dans le menu "Composants DSFR" : Indicateur d'étapes (étape courante), Indicateur d'étapes (dernière étape).

- **`dsfr/components/Download.js`** : composant lien de téléchargement DSFR. Résolution automatique des fichiers wiki (`File:`/`Fichier:`) via `mw.util.getUrl()`. Génère la structure `fr-download` avec titre, description, format et poids.
- **`dsfr/components/Summary.js`** : sommaire auto-généré depuis les titres `h2`/`h3` `.mw-headline`, remplaçant le `__TOC__` natif MediaWiki. Liens ancres générés via les IDs existants.
- **`dsfr/components/Tab.js`** : onglets DSFR (`fr-tabs`) avec comportement clic/clavier ES5 (sans le JS DSFR natif). Syntaxe `.dsfr-tab-group` / `.dsfr-tab`.
- **`dsfr/components/Table.js`** : auto-wrapping des `.wikitable` en `fr-table` + mode explicite `dsfr-table`. Ajoute `fr-table--bordered`, `fr-table--no-scroll`, etc. selon les attributs `data-*`.
- **`dsfr/components/Tag.js`** : étiquettes simples et groupes (`fr-tags-group`). Distinct du Badge — sans couleur sémantique, utilisé pour le filtrage et le référencement.
- **`dsfr/components/Tooltip.js`** : infobulles bouton (clic) + lien (survol/focus). Comportement manuel (JS DSFR non chargé).
- **`dsfr/EditPage.js`** : ajout de 6 entrées dans le menu "Composants DSFR" : Téléchargement, Sommaire, Onglet, Tableau DSFR, Tag simple, Tooltip.

- **Composants implémentés dans `shared/dsfr/components/`** (36 composants, disponibles pour activation via `Common.js`) :
  - **Actifs sur ce wiki** : Accordion, Alert, Badge, Card, Stepper, Download, Summary, Tab, Table, Tag, Tooltip.
  - **Implémentés, non encore activés** : Breadcrumb, Button, Callout, Checkbox, Dropdown, Form, Highlight, Input, Link, Modal, Notice, Pagination, Quote, Radio, Search, Segmented, Select, Share, Sidemenu, Skiplink, Tabnav, Tile, Toggle, Transcription, Upload.

- **`Common.css`** : styles custom extensifs — remises en forme des tableaux MediaWiki, infoboxes, éléments de navigation, formulaires.
- **Documentation (`docs/composants/`)** : 36 fichiers Markdown — un par composant disponible dans `shared/`. Couvre la syntaxe wikitext, les attributs `data-*`, les exemples et la structure HTML générée.

### Corrections

- **`dsfr/Style.css`** : fix pastilles bleues sur les listes DSFR. MediaWiki applique `list-style: disc` sur tous les `<ul>`, polluant les composants `.fr-nav__list`, `.fr-grid-row`, `.fr-btns-group`, `.fr-menu__list`, etc. Ajout d'un reset `list-style: none !important` ciblant tous les éléments `ul[class*="fr-"]` et `li[class*="fr-"]`.
- **`dsfr/Style.css`** : masquage de la numérotation automatique des sections et application de la typographie DSFR aux titres de contenu (`h1`–`h6`).
- **`dsfr/Header.js`** : fix race condition — attente explicite de `DsfrConfig` avant le montage du header, évitant un affichage avec une navigation vide.
- **`dsfr/Layout.js`** : suppression du sommaire automatique MediaWiki (`.toc`) et nettoyage des artefacts natifs MW résiduels dans l'interface DSFR.
- **`dsfr/EditPage.js`** : 3 corrections successives — affichage de la barre d'outils et du volet "Composants DSFR".

---

## [1.0.0] — 2026-03-16

### Ajouts

- **Environnement Docker** basé sur l'architecture du wiki DFAED-NG.
  - Stack : MediaWiki 1.31.16, Semantic MediaWiki 3.2.3, PHP 7.4, MariaDB 10.4.
  - Port **8081** (8080 réservé à DFAED-NG).
  - Volume DB : `db_data_docdfa`.
- **`LocalSettings.php`** : configuration MediaWiki avec sitename *DocDFAED*, chargement des assets DSFR v1.12.1 (CDN jsDelivr) et des assets locaux via hook `BeforePageDisplay`.
- **Extension WikiEditor** activée.
- **Workflow copy-paste** `staging_area/` → pages `MediaWiki:`.
- **Architecture "Zéro FOUC"** : overlay blanc injecté immédiatement par `Common.js` + CSS DSFR préchargé côté serveur.
- **Thème DSFR complet** (porté depuis DFAED-NG) :
  - `Common.js` : orchestrateur de chargement avec anti-FOUC et détection d'environnement.
  - `dsfr/Config.js` : navigation spécifique DocDFAED — **7 entrées** : Accueil (lien direct), Documentation (sous-menus : ASQ, Veille professionnelle), Formation (Formations internes, Formations externes), Planning (Consultation, Gestion), OCE (Consultation, Gestion), Historique (lien direct), Application FAED (lien direct).
  - `dsfr/Layout.js` : nettoyage DOM MediaWiki + fil d'Ariane dynamique.
  - `dsfr/Header.js` : header DSFR avec polling jQuery/mw.util, menus de navigation et authentification.
  - `dsfr/Footer.js` : footer Marianne avec modale d'outils.
  - `dsfr/EditPage.js` : barre d'édition DSFR avec icônes SVG personnalisées.
  - `Common.css` + `dsfr/Style.css` : surcharges CSS DSFR.
- **Composants DSFR actifs** : Accordion, Alert, Badge (portés depuis DFAED-NG).
- **49 stubs de composants DSFR** prêts à implémenter (liste complète dans `staging_area/dsfr/components/`).
