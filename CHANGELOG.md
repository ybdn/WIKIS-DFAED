# Journal des modifications — WIKIS-DFAED

Vue d'ensemble des versions des deux wikis du DFAED.
Les journaux détaillés se trouvent dans chaque sous-projet.

---

## Projets

| Wiki | Version actuelle | Prochaine version | Journal détaillé |
|------|-----------------|-------------------|------------------|
| DFAED-NG | **2.1.0** | 2.2.0 (non publié) | [wiki-DFAED-NG/CHANGELOG.md](wiki-DFAED-NG/CHANGELOG.md) |
| DocDFAED | **1.0.0** | 1.1.0 (non publié) | [wiki-DocDFAED/CHANGELOG.md](wiki-DocDFAED/CHANGELOG.md) |

---

## Résumé des versions — wiki-DFAED-NG

### [Non publié] — 2.2.0

- **Loader anti-FOUC complet** : `shared/Common.css` masque tout le body + overlay spinner DSFR (#000091) pendant le chargement. Failsafe CSS 4s + JS 5s.
- **Architecture `shared/`** : base de code commune aux deux wikis. `staging_area/` réduit à `Config.js` + `Common.js`.
- Composant **Stepper** opérationnel (indicateur d'étapes avec syntaxe `data-*`).
- Composant **Card** opérationnel (carte simple + grille 2/3/4 colonnes, badge, détail, image, variantes).
- **36 composants implémentés** dans `shared/dsfr/components/` — 5 actifs, 31 disponibles à l'activation.
- **36 docs Markdown** dans `docs/composants/` — un par composant.
- Fix : race condition `Header.js`, artefacts MW dans `Layout.js`, reset `list-style` DSFR.

### [2.1.0] — 2026-02-26

- Composants DSFR : **Accordion**, **Alert**, **Badge** (opérationnels).
- Barre d'édition WikiEditor remplacée par une interface DSFR (`EditPage.js`) avec icônes SVG personnalisées et sélecteur de couleur.
- 46 stubs de composants DSFR préparés pour les prochaines itérations.

### [2.0.0] — 2026-02-26

- Migration stack : MediaWiki 1.23.8 → **1.31.16** (LTS), PHP 5.6 → **7.4**.
- Ajout de **Semantic MediaWiki 3.2.3** via Composer.
- Architecture DSFR complète : `Config.js`, `Layout.js`, `Header.js`, `Footer.js`, `Common.js` (refonte).
- Fil d'Ariane dynamique, polling jQuery/mw.util résilient, modale d'outils.

### [1.0.0] — 2024

- Environnement Docker initial (MW 1.23.8, PHP 5.6).
- Architecture "Zéro FOUC" : overlay anti-flash + CSS DSFR préchargé côté serveur.
- Workflow copy-paste `staging_area/` → pages `MediaWiki:`.

---

## Résumé des versions — wiki-DocDFAED

### [Non publié] — 1.1.0

- **Loader anti-FOUC complet** : `shared/Common.css` masque tout le body + overlay spinner DSFR pendant le chargement.
- **Architecture `shared/`** : base de code commune aux deux wikis.
- Composants **Card** et **Stepper** opérationnels.
- **6 composants supplémentaires actifs** : Download, Summary, Tab, Table, Tag, Tooltip.
- **36 composants implémentés** dans `shared/dsfr/components/` — 11 actifs, 25 disponibles.
- **36 docs Markdown** dans `docs/composants/` — un par composant.
- `Common.css` enrichi de styles custom (tableaux, infoboxes, formulaires).
- Fix : race condition `Header.js`, artefacts MW, barre d'outils `EditPage.js` (3 corrections).

### [1.0.0] — 2026-03-16

- Initialisation de l'environnement Docker (port 8081, stack identique à DFAED-NG v2.1.0).
- Thème DSFR complet porté depuis DFAED-NG.
- Navigation spécifique DocDFAED configurée dans `Config.js` (7 entrées : Accueil, Documentation, Formation, Planning, OCE, Historique, Application FAED).
- Composants Accordion, Alert, Badge actifs. 49 stubs prêts.
