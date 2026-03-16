# CLAUDE.md — Instructions pour Claude Code

Ce fichier contient les règles et le contexte à respecter pour toute assistance sur ce projet.

## Contexte

Environnement de développement local pour le wiki **DocDFAED**, plateforme de documentation interne du Département du Fichier Automatisé des Empreintes Digitales (DFAED — Gendarmerie nationale). Accès restreint aux agents du département. Hébergé par le BSII / Pôle judiciaire.

Le code développé ici est déployé manuellement en production via copy-paste dans l'interface web MediaWiki.

## Stack locale

| Composant | Version |
|-----------|---------|
| MediaWiki | 1.31.16 (LTS) |
| Semantic MediaWiki | 3.2.3 (via Composer, dans `vendor/`) |
| PHP | 7.4 |
| MariaDB | 10.4 |
| Docker Compose | v2 |

## Accès local

- **URL** : [http://localhost:8081](http://localhost:8081)
- **User** : `admin` / **Pass** : `admin123`

## Règles absolues

### Déploiement
- Ne jamais suggérer de `git push` vers la prod ni de connexion SSH.
- La prod est mise à jour uniquement via copy-paste dans les pages `MediaWiki:NomDuFichier`.

### JavaScript — Compatibilité ES5 obligatoire
Le code JS dans `staging_area/` doit être compatible avec le minifier de la production.

**Interdit :**
```js
const x = 1;         // non
let y = 2;           // non
const fn = () => {}; // non
`template ${var}`    // non
```

**Obligatoire :**
```js
var x = 1;
var fn = function() {};
'template ' + var
```

### PHP — LocalSettings.php
- CSS externe : `$out->addHeadItem('key', '<link rel="stylesheet" href="...">')`
- Script : `$out->addScript('<script src="..."></script>')`
- `$out->addScriptFile()` supprimé depuis MW 1.24 — ne pas l'utiliser.
- SMW activé via `enableSemantics('localhost')` uniquement — ne pas ajouter `wfLoadExtension('SemanticMediaWiki')`.

## Architecture clé

### Fichiers importants
- `docker-compose.yml` — services (port 8081)
- `Dockerfile` — image PHP 7.4 + MW 1.31.16 + SMW via Composer
- `LocalSettings.php` — config MW + chargement assets DSFR
- `staging_area/` — tout le code métier (JS/CSS)

### Modules actifs

| Fichier local | Page production |
|--------------|-----------------|
| `staging_area/Common.css` | `MediaWiki:Common.css` |
| `staging_area/Common.js` | `MediaWiki:Common.js` |
| `staging_area/dsfr/Config.js` | `MediaWiki:Dsfr/Config.js` |
| `staging_area/dsfr/Layout.js` | `MediaWiki:Dsfr/Layout.js` |
| `staging_area/dsfr/Header.js` | `MediaWiki:Dsfr/Header.js` |
| `staging_area/dsfr/Footer.js` | `MediaWiki:Dsfr/Footer.js` |
| `staging_area/dsfr/EditPage.js` | `MediaWiki:Dsfr/EditPage.js` |
| `staging_area/dsfr/Style.css` | `MediaWiki:Dsfr/Style.css` |
| `staging_area/dsfr/components/*.js` | `MediaWiki:Dsfr/components/*.js` |

### Navigation (Config.js)

Structure configurée dans `DsfrConfig.navigation` :
- **Accueil** — lien direct
- **Documentation** — menu : ASQ, Veille professionnelle
- **Formation** — menu : Formations internes, Formations externes
- **Planning** — menu : Consultation, Gestion
- **OCE** — menu : Consultation, Gestion
- **Historique** — lien direct
- **Application FAED** — lien direct

### Composants (stubs à implémenter)

49 stubs dans `staging_area/dsfr/components/` :

Accordion, Alert, Badge, Breadcrumb, Button, Callout, Card, Checkbox, Combobox, Composition, Connect, Consent, Content, Display, Download, Dropdown, Follow, Form, Highlight, Input, Link, Logo, Modal, Navigation, Notice, Pagination, Password, Quote, Radio, Range, Search, Segmented, Select, Share, Sidemenu, Skiplink, Stepper, Summary, Tab, Tabnav, Table, Tag, Tile, Toggle, Tooltip, Transcription, Translate, Upload, User

### Commandes fréquentes

```bash
# Démarrer l'environnement
docker compose up -d

# Rebuild après modif du Dockerfile
docker compose up -d --build

# Initialiser/mettre à jour la DB (premier démarrage)
docker compose exec mediawiki php maintenance/update.php --quick

# Shell dans le container MW
docker compose exec mediawiki bash

# Reset complet (supprime la DB)
docker compose down -v
```

### Semantic MediaWiki
SMW est installé dans `vendor/mediawiki/semantic-media-wiki/` (pas dans `extensions/`).
Le script `maintenance/populateHashField.php` a un bug de chemin connu quand SMW est dans `vendor/` — patché dans le Dockerfile via `sed`.

## Ce qu'il ne faut pas faire
- Ne pas modifier `composer.json` manuellement — patché via `jq` dans le Dockerfile.
- Ne pas ajouter `wfLoadExtension('SemanticMediaWiki')` dans `LocalSettings.php`.
- Ne pas utiliser le port 8080 (réservé au wiki DFAED-NG).
- Ne pas coder de chemins en dur — utiliser `mw.util.getUrl()` et `mw.config.get()`.
