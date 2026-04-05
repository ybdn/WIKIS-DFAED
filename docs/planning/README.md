# Module Planning — DocDFAED

Module de gestion des plannings du département DFAED, intégré au wiki DocDFAED (MediaWiki 1.31 / DSFR).

---

## Pages wiki concernées

| Page wiki | Rôle |
|---|---|
| `Planning:Consultation` | Vue lecture seule (tous les agents connectés) |
| `Planning:Gestion` | Vue édition (bureaucrates et sysops uniquement) |

---

## Architecture des fichiers

```
planning/
├── PlanningApp.js          — Orchestrateur : détection de page, droits, montage de l'UI
├── PlanningData.js         — Couche données : lecture/écriture via API MediaWiki, utilitaires dates
├── PlanningP4S.js          — Vue P4S (planning mensuel : agents × jours)
├── PlanningJournalier.js   — Vue Service journalier (agents × heures 07h–20h)
├── PlanningPersonnel.js    — CRUD personnel (mode Gestion uniquement)
├── MissionsP4S.js          — Référentiel des codes missions P4S
├── MissionsJournalier.js   — Référentiel des codes missions journalier
└── Planning.css            — Styles du module
```

Pages de production correspondantes : `MediaWiki:Dsfr/planning/<NomDuFichier>`.

---

## Stockage des données

Toutes les données sont stockées sous forme de **pages wiki au format JSON brut** dans l'espace de noms `Planning:Data/`. L'API MediaWiki est utilisée pour la lecture (`action=raw`) et l'écriture (`action=edit` avec token CSRF).

### Structure des pages

| Page wiki | Granularité | Contenu |
|---|---|---|
| `Planning:Data/Personnel` | Unique | Liste complète des agents |
| `Planning:Data/P4S/YYYY-MM` | 1 par mois | Affectations P4S `{ agentId: { "1": "M", "2": "R", … } }` |
| `Planning:Data/CommentsP4S/YYYY-MM` | 1 par mois | Commentaires par cellule P4S `{ agentId: { "1": "texte" } }` |
| `Planning:Data/Journalier/YYYY-MM-DD` | 1 par jour | Affectations horaires `{ agentId: { "07": "MMO", "08": "PO", … } }` |
| `Planning:Data/CommentsJournalier/YYYY-MM-DD` | 1 par jour | Commentaires par cellule horaire |
| `Planning:Data/CommentaireJour/YYYY-MM-DD` | 1 par jour | Commentaire global de journée `{ "text": "…" }` |

### Volume estimé

- ~24 pages/an pour le P4S (12 données + 12 commentaires)
- ~1095 pages/an pour le journalier (365 × 3 types)
- Les pages non renseignées ne sont jamais créées

### Conservation

Aucune purge automatique. Les données sont conservées indéfiniment. MediaWiki maintient un **historique complet des révisions** à chaque sauvegarde.

### Consulter le JSON brut

```
http://localhost:8081/index.php?title=Planning:Data/Personnel&action=raw
http://localhost:8081/index.php?title=Planning:Data/P4S/2026-04&action=raw
http://localhost:8081/index.php?title=Planning:Data/Journalier/2026-04-04&action=raw
```

---

## Structure d'un agent

Stockée dans `Planning:Data/Personnel` :

```json
[
  { "id": "dupont", "nom": "DUPONT Jean", "grade": "MDC", "actif": true },
  { "id": "martin", "nom": "MARTIN Sophie", "grade": "GAV", "actif": false, "dateDepart": "2026-04-01" }
]
```

- `id` : identifiant technique unique, minuscules, sans espaces (clé dans les données de planning)
- `actif: false` : l'agent n'apparaît plus dans les grilles mais ses données historiques sont conservées
- Supprimer définitivement un agent laisse ses anciennes données en **orphelin** dans les pages de planning

---

## Codes missions

### P4S (planning mensuel) — `MissionsP4S.js`

| Code | Libellé | Fond | Texte |
|---|---|---|---|
| *(vide)* | (vide) | `#FFFFFF` | `#3a3a3a` |
| `M` | Matin | `#E8EDFF` | `#000091` |
| `AM` | Après-midi | `#FFE8D4` | `#716043` |
| `WE` | Week-end | `#FFD4D8` | `#910000` |
| `R` | Repos | `#B8FEC9` | `#18753C` |
| `RR` | Repos retard | `#B8FEC9` | `#18753C` |
| `P` | Permissions | `#B8FEC9` | `#18753C` |
| `F` | Formation | `#B8FEC9` | `#18753C` |

### Service journalier — `MissionsJournalier.js`

| Code | Libellé | Fond | Texte |
|---|---|---|---|
| *(vide)* | (vide) | `#FFFFFF` | `#3a3a3a` |
| `MMO` | MetaMorpho | `#E8EDFF` | `#000091` |
| `T41` | Alphanu | `#FFE8D4` | `#716043` |
| `PO` | Permanence Opérationnelle | `#FFD4D8` | `#CE0500` |
| `ID` | Identification | `#D2E9F7` | `#0063CB` |
| `J` | Mission particulière | `#FFFFFF` | `#000000` |

Pour ajouter/modifier un code : éditer directement `MissionsP4S.js` ou `MissionsJournalier.js`.

---

## Droits d'accès

| Groupe | Consultation | Gestion |
|---|---|---|
| Tout utilisateur connecté | Oui | Non |
| `bureaucrat` | Oui | Oui |
| `sysop` | Oui | Oui |

Le contrôle se fait côté client dans `PlanningApp.js` via `mw.config.get('wgUserGroups')`.

---

## Fonctionnement de la vue P4S

- Grille **agents (lignes) × jours du mois (colonnes)**
- Navigation mois par mois (boutons ◄ ►)
- Weekends et jours fériés français signalés visuellement
- **Clic gauche** sur une cellule → dropdown de sélection du code mission
- **Clic droit** sur une cellule (mode Gestion) → saisie d'un commentaire
- Compteurs annuels en mode Gestion : charge tous les mois de janvier au mois courant à l'affichage (jusqu'à 12 requêtes parallèles)
- Bouton **Imprimer / PDF** disponible

---

## Fonctionnement de la vue Service journalier

- Grille **agents (lignes) × heures 07h–20h (colonnes)**
- Navigation jour par jour (boutons ◄ ►)
- **Clic gauche** → dropdown de sélection du code mission
- **Clic droit** (mode Gestion) → commentaire par cellule horaire
- Zone **Commentaires** en bas de page : texte libre pour la journée entière
- Compteurs de la journée en mode Gestion

---

## Gestion du personnel

Panneau disponible uniquement en mode Gestion, en bas de page.

| Action | Effet |
|---|---|
| Ajouter | Crée un agent avec `actif: true` |
| Modifier | Édition inline de l'ID, du nom et du grade |
| Départ de l'unité | Passe `actif: false`, enregistre `dateDepart` — données conservées |
| Réactiver | Repasse `actif: true`, supprime `dateDepart` |
| Supprimer | Suppression définitive (données orphelines dans le planning) |
| ▲ / ▼ | Réordonne les agents actifs dans la grille |

**Attention** : modifier l'ID d'un agent ne migre pas ses données de planning existantes. Les anciennes entrées resteront indexées sous l'ancien ID.

---

## Ordre de chargement des scripts

`PlanningApp.js` attend via polling (toutes les 50 ms, max 15 s) que les dépendances suivantes soient disponibles dans `window` :

1. `PlanningData`
2. `PlanningMissionsP4S`
3. `PlanningMissionsJournalier`
4. `PlanningP4S`
5. `PlanningJournalier`
6. `PlanningPersonnel`

Les scripts doivent donc tous être chargés avant `PlanningApp.js`.

---

## Notes techniques

- Tout le code est en **ES5** (contrainte du minifier MediaWiki 1.31)
- Aucun chemin codé en dur : `mw.config.get('wgScript')` et `mw.util.getUrl()` partout
- En développement local (`localhost`), le CSS est chargé depuis `/staging_area/dsfr/planning/Planning.css` avec cache-bust `?v=Date.now()`
- En production, le CSS est servi depuis `MediaWiki:Dsfr/planning/Style.css`
