# CLAUDE.md — Instructions pour Claude Code

Ce fichier couvre le **dépôt racine WIKIS-DFAED**, qui regroupe les environnements de développement des deux wikis du DFAED (Département du Fichier Automatisé des Empreintes Digitales — Gendarmerie nationale).

---

## Contexte métier

| Wiki | Public | Hébergeur | Accès |
|------|--------|-----------|-------|
| **DFAED-NG** | Enquêteurs de la gendarmerie nationale | STIG (niveau national) | Intranet gendarmerie |
| **DocDFAED** | Agents du département DFAED uniquement | BSII / Pôle judiciaire | Interne département |

Les deux wikis tournent sur **MediaWiki 1.31** avec **Semantic MediaWiki** (SMW).

La mission en cours est de **transformer l'interface des deux wikis avec le design DSFR** (Système de Design de l'État Français).

---

## Structure du dépôt

```
WIKIS-DFAED/
├── CLAUDE.md               ← ce fichier
├── README.md               ← vue d'ensemble générale
├── wiki-DFAED-NG/          ← chantier DSFR actif (wiki enquêteurs)
│   ├── CLAUDE.md           ← règles techniques détaillées pour ce wiki
│   ├── README.md           ← doc de démarrage rapide
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── LocalSettings.php
│   ├── staging_area/       ← tout le code JS/CSS à développer ici
│   └── imports_externes/   ← exports XML MediaWiki pour le dev
└── wiki-DocDFAED/          ← chantier actif (wiki interne département)
```

---

## Règle fondamentale de déploiement

**Aucun des deux wikis n'est accessible via Git, SSH ou pipeline CI/CD.**

Le déploiement se fait **uniquement par copy-paste** du code local vers les pages `MediaWiki:NomDuFichier` via l'interface web du wiki de production.

Ne jamais suggérer de `git push`, de connexion SSH, ni de déploiement automatisé.

---

## Règles techniques communes aux deux wikis

### JavaScript — ES5 obligatoire

Le minifier de production (MediaWiki 1.31) ne supporte pas le JavaScript moderne.

| Interdit | Obligatoire |
|----------|-------------|
| `const`, `let` | `var` |
| `() => {}` | `function() {}` |
| Backticks `` ` `` | Concaténation `'a' + 'b'` |
| `Array.from()`, `NodeList.forEach()` sans polyfill | Boucles `for` classiques |

### En-têtes de fichiers

Chaque fichier JS/CSS commence obligatoirement par :

```js
/* SOURCE FILE FOR: [[MediaWiki:NomDeLaPage]] */
```

### Chemins en production

- Jamais de chemins codés en dur (`href="/"`, `action="/index.php"`).
- Toujours utiliser `mw.util.getUrl('NomDePage')` pour les liens wiki.
- Toujours utiliser `mw.config.get('wgScript')` pour le chemin du script.

### LocalSettings.php

- CSS externe : `$out->addHeadItem('key', '<link rel="stylesheet" href="...">')`
- Script : `$out->addScript('<script src="..."></script>')`
- Interdit : `$out->addScriptFile()` (supprimé depuis MW 1.24)
- SMW : uniquement via `enableSemantics('localhost')` — ne pas utiliser `wfLoadExtension('SemanticMediaWiki')`

---

## Chantier DFAED-NG (actif)

Le wiki DFAED-NG est en cours de transformation DSFR. L'environnement de développement local est Dockerisé.

**Pour les règles techniques détaillées, voir [`wiki-DFAED-NG/CLAUDE.md`](wiki-DFAED-NG/CLAUDE.md).**

### Architecture de chargement (résumé)

1. `LocalSettings.php` précharge le CSS DSFR côté serveur (via CDN jsdelivr v1.12.1)
2. `Common.js` injecte immédiatement un overlay loader (anti-FOUC)
3. `Common.js` détecte l'environnement (`localhost` → fichiers locaux, sinon → pages MediaWiki)
4. Les modules sont chargés séquentiellement : `Config → Layout → Header → Footer → EditPage → components`
5. `Header.js` poll jQuery et `mw.util` (toutes les 50ms, max 15s) avant de s'initialiser
6. L'overlay est retiré une fois le header injecté

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
| `staging_area/dsfr/components/Accordion.js` | `MediaWiki:Dsfr/components/Accordion.js` |
| `staging_area/dsfr/components/Alert.js` | `MediaWiki:Dsfr/components/Alert.js` |
| `staging_area/dsfr/components/Badge.js` | `MediaWiki:Dsfr/components/Badge.js` |

---

## Chantier DocDFAED (actif)

Le wiki DocDFAED suit la même architecture que DFAED-NG. `Config.js` est configuré avec le branding et la navigation propres à DocDFAED.

- **Port local** : 8081 (8080 est réservé à DFAED-NG)
- **Volume DB** : `db_data_docdfa`
- **Navigation configurée** : Accueil, Documentation (ASQ, Veille professionnelle), Formation, Planning, OCE, Historique, Application FAED
- **49 stubs** de composants DSFR présents dans `staging_area/dsfr/components/`

**Pour les règles techniques détaillées, voir [`wiki-DocDFAED/CLAUDE.md`](wiki-DocDFAED/CLAUDE.md).**

---

## Commandes Docker (wiki-DFAED-NG)

```bash
# Démarrer l'environnement
docker compose -f wiki-DFAED-NG/docker-compose.yml up -d

# Premier démarrage : initialiser les tables DB
docker compose -f wiki-DFAED-NG/docker-compose.yml exec mediawiki php maintenance/update.php --quick

# Rebuild après modif du Dockerfile
docker compose -f wiki-DFAED-NG/docker-compose.yml up -d --build

# Shell dans le container
docker compose -f wiki-DFAED-NG/docker-compose.yml exec mediawiki bash

# Reset complet (supprime la DB)
docker compose -f wiki-DFAED-NG/docker-compose.yml down -v
```

Ou naviguer dans `wiki-DFAED-NG/` et utiliser `docker compose` directement.

---

## Ce qu'il ne faut jamais faire

- Modifier `composer.json` manuellement (patché via `jq` dans le Dockerfile).
- Ajouter `wfLoadExtension('SemanticMediaWiki')` dans `LocalSettings.php`.
- Utiliser du JavaScript moderne (ES6+) dans les fichiers de `staging_area/`.
- Proposer un déploiement par Git, SSH ou pipeline automatisé.
- Coder en dur des chemins absolus dans les fichiers JS/CSS.
