# WIKIS-DFAED — Dépôt de développement

Dépôt regroupant les environnements de développement locaux des deux wikis du **Département du Fichier Automatisé des Empreintes Digitales (DFAED)** de la Gendarmerie nationale.

## Les deux wikis

### Wiki DFAED-NG

Wiki de documentation destiné à l'ensemble des **enquêteurs de la gendarmerie nationale** pour les accompagner dans l'utilisation de l'application FAED.

- **Public** : Enquêteurs GN (accès intranet)
- **Hébergeur** : STIG (niveau national)
- **URL prod** : Intranet gendarmerie

### Wiki DocDFAED

Wiki de recensement des **processus internes du département DFAED**. Accès restreint aux agents du département.

- **Public** : Agents DFAED uniquement
- **Hébergeur** : BSII / Pôle judiciaire

---

## Stack commune

| Composant | Version |
|-----------|---------|
| MediaWiki | 1.31 (LTS) |
| Semantic MediaWiki | 3.2.3 |
| PHP | 7.4 |
| MariaDB | 10.4 |

---

## Mission : Transformation DSFR

L'objectif de ce dépôt est de transformer progressivement l'interface des deux wikis pour qu'elle soit conforme au **[Système de Design de l'État Français (DSFR)](https://www.systeme-de-design.gouv.fr/)**.

Cette transformation se fait **sans modifier le cœur de MediaWiki** : elle repose uniquement sur des pages `MediaWiki:Common.js`, `MediaWiki:Common.css` et des sous-pages JS/CSS injectées côté client.

### Principes de l'approche

- **Zéro FOUC** : un overlay loader est injecté immédiatement pour masquer l'interface native MediaWiki le temps que le thème DSFR se charge.
- **Pas de skin personnalisée** : le skin MonoBook reste actif, le DOM natif est nettoyé et remplacé par des composants DSFR via JavaScript.
- **ES5 strict** : la prod MediaWiki 1.31 requiert du JavaScript ES5 pur (pas de `const`, `let`, arrow functions, ni backticks).
- **Déploiement manuel** : aucun accès SSH/Git vers la production — le code est copié-collé dans l'interface web MediaWiki.
- **Environnement Docker local** : un environnement Dockerisé reproduit fidèlement la stack de production pour le développement et les tests.

---

## Structure du dépôt

```bash
WIKIS-DFAED/
├── README.md               ← ce fichier
├── CLAUDE.md               ← instructions pour Claude Code
├── CHANGELOG.md            ← résumé des versions des deux wikis
│
├── shared/                 ← base de code commune aux deux wikis
│   ├── Common.css          ← styles globaux communs
│   └── dsfr/
│       ├── Layout.js       ← nettoyage DOM + fil d'Ariane
│       ├── Header.js       ← header DSFR + auth
│       ├── Footer.js       ← pied de page + modal outils
│       ├── EditPage.js     ← barre d'édition DSFR
│       ├── Style.css       ← overrides CSS DSFR
│       └── components/     ← 36 composants DSFR implémentés
│
├── docs/
│   └── composants/         ← 36 docs Markdown (un par composant)
│
├── wiki-DFAED-NG/          ← chantier DSFR actif
│   ├── README.md           ← démarrage rapide (Docker)
│   ├── CLAUDE.md           ← règles techniques détaillées
│   ├── CHANGELOG.md        ← historique des versions
│   ├── docker-compose.yml  ← orchestration des services
│   ├── Dockerfile          ← image MW 1.31.16 + SMW 3.2.3
│   ├── LocalSettings.php   ← config MediaWiki locale
│   ├── staging_area/       ← spécifique à cette instance
│   │   ├── Common.js       ← orchestrateur + sélection des modules
│   │   └── dsfr/
│   │       └── Config.js   ← navigation, textes, logos DFAED-NG
│   └── imports_externes/   ← exports XML pour tests
│
└── wiki-DocDFAED/          ← chantier actif (wiki interne département)
    ├── staging_area/       ← spécifique à cette instance
    │   ├── Common.js       ← orchestrateur + sélection des modules
    │   └── dsfr/
    │       └── Config.js   ← navigation, textes, logos DocDFAED
    └── …
```

---

## Démarrage rapide (wiki-DFAED-NG)

**Prérequis** : Docker Desktop installé.

```bash
cd wiki-DFAED-NG

# Lancer l'environnement
docker compose up -d

# Premier démarrage uniquement : initialiser les tables
docker compose exec mediawiki php maintenance/update.php --quick
```

Accès : [http://localhost:8080](http://localhost:8080) — `admin` / `admin123`

Pour la documentation complète du workflow de développement et du déploiement, voir [`wiki-DFAED-NG/README.md`](wiki-DFAED-NG/README.md).

---

## Workflow de développement

1. **Éditer** les fichiers dans `wiki-DFAED-NG/staging_area/`
2. **Tester** en rafraîchissant [http://localhost:8080](http://localhost:8080)
3. **Déployer** en copiant-collant le contenu dans les pages `MediaWiki:*` via l'interface web de production

### Table de correspondance

| Source locale | Page de production |
|---------------|--------------------|
| `staging_area/Common.js` | `MediaWiki:Common.js` ← déployer en premier |
| `staging_area/dsfr/Config.js` | `MediaWiki:Dsfr/Config.js` |
| `shared/Common.css` | `MediaWiki:Common.css` |
| `shared/dsfr/Layout.js` | `MediaWiki:Dsfr/Layout.js` |
| `shared/dsfr/Header.js` | `MediaWiki:Dsfr/Header.js` |
| `shared/dsfr/Footer.js` | `MediaWiki:Dsfr/Footer.js` |
| `shared/dsfr/EditPage.js` | `MediaWiki:Dsfr/EditPage.js` |
| `shared/dsfr/Style.css` | `MediaWiki:Dsfr/Style.css` |
| `shared/dsfr/components/*.js` | `MediaWiki:Dsfr/components/*.js` |

---

## État d'avancement

| Wiki | Statut | Version |
|------|--------|---------|
| DFAED-NG | Chantier actif — thème DSFR opérationnel | v2.1.0 → 2.2.0 en cours |
| DocDFAED | Chantier actif — thème DSFR opérationnel | v1.0.0 → 1.1.0 en cours |

### Composants DSFR (base `shared/`) — 36 implémentés

**Actifs sur DFAED-NG** : Accordion, Alert, Badge, Card, Stepper

**Actifs sur DocDFAED** : Accordion, Alert, Badge, Card, Stepper, Download, Summary, Tab, Table, Tag, Tooltip

**Disponibles (à activer dans `Common.js`)** : Breadcrumb, Button, Callout, Checkbox, Dropdown, Form, Highlight, Input, Link, Modal, Notice, Pagination, Quote, Radio, Search, Segmented, Select, Share, Sidemenu, Skiplink, Tabnav, Tile, Toggle, Transcription, Upload

**Documentation** : 36 fichiers Markdown dans `docs/composants/`
