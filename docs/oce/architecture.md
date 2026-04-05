# Module OCE — Architecture technique

## Vue d'ensemble

Le module OCE (Ordonnances de Commission d'Expert) est un tableau de suivi intégré au wiki DocDFAED. Il permet de suivre l'état d'avancement des OCE attribuées à chaque personnel du département.

**Deux modes d'accès :**

| Page | Accès | Fonctionnalités |
|------|-------|-----------------|
| `OCE:Consultation` | Tous les utilisateurs | Lecture seule : tableau groupé, filtres, recherche |
| `OCE:Gestion` | Bureaucrates / sysop | CRUD complet, personnel, historique, statistiques |

---

## Stockage des données

### Page JSON unique

```
OCE:Data/Liste
```

Structure :

```json
{
  "oce": [
    {
      "numero": "2026/042",
      "agent": "dupont",
      "delivrePar": "TGI Marseille",
      "objet": "Trace latente affaire X",
      "dateReception": "2026-02-15",
      "dateEcheance": "2026-05-15",
      "statut": "en_cours",
      "priorite": "normale",
      "commentaire": "",
      "historique": [
        {
          "date": "2026-02-15T10:00:00",
          "user": "Admin",
          "action": "Création",
          "de": null,
          "vers": null
        }
      ]
    }
  ],
  "archive": []
}
```

### Personnel partagé

Le module OCE réutilise la même source de données personnel que le planning :

```
Planning:Data/Personnel
```

Les modifications du personnel depuis l'onglet Personnel du module OCE sont immédiatement visibles dans le module Planning, et inversement.

---

## Cycle de vie d'une OCE

```
En attente → En cours → Terminé → Clôturé → [Archiver]
                                                  ↓
                                              archive[]
```

| Statut | Badge DSFR | Description |
|--------|------------|-------------|
| En attente | `fr-badge--info` (bleu) | OCE reçue, pas encore commencée |
| En cours | `fr-badge--warning` (orange) | Travail en cours |
| Terminé | `fr-badge--success` (vert) | Travail fini |
| Clôturé | `fr-badge--new` (gris) | Dossier fermé |

**Clôturer** et **Archiver** sont deux actions séparées :
- Clôturé reste visible dans le tableau (filtrable via checkbox)
- Archiver déplace l'OCE dans `archive[]`, masquée par défaut

---

## Fichiers du module

```
staging_area/dsfr/oce/
├── OceConfig.js    →  MediaWiki:Dsfr/oce/OceConfig.js
├── OceData.js      →  MediaWiki:Dsfr/oce/OceData.js
├── OceTable.js     →  MediaWiki:Dsfr/oce/OceTable.js
├── OceForm.js      →  MediaWiki:Dsfr/oce/OceForm.js
├── OceStats.js     →  MediaWiki:Dsfr/oce/OceStats.js
├── OceApp.js       →  MediaWiki:Dsfr/oce/OceApp.js
└── Oce.css         →  MediaWiki:Dsfr/oce/Style.css
```

| Fichier | Rôle | Global exporté |
|---------|------|----------------|
| `OceConfig.js` | Statuts, priorités, couleurs, helpers de dates | `window.OceConfig` |
| `OceData.js` | CRUD API MediaWiki (load/save JSON) | `window.OceData` |
| `OceTable.js` | Tableau groupé par agent, filtres, actions | `window.OceTable` |
| `OceForm.js` | Modale de création / édition d'OCE | `window.OceForm` |
| `OceStats.js` | Tableau statistiques agents × mois | `window.OceStats` |
| `OceApp.js` | Orchestrateur : routing, permissions, onglets | (IIFE auto-exec) |
| `Oce.css` | Styles DSFR pour tout le module | — |

---

## Chargement

### Conditionnel dans Common.js

Les modules OCE ne sont chargés que si le nom de la page commence par `OCE:` :

```javascript
if (currentPage.indexOf('OCE:') === 0) {
    var oceModules = [
        'oce/OceConfig',
        'oce/OceData',
        'oce/OceTable',
        'oce/OceForm',
        'oce/OceStats',
        'oce/OceApp'
    ];
    // ... chargement dynamique
}
```

### Polling des dépendances (OceApp.js)

`OceApp.js` poll toutes les 50ms (max 15s) l'existence des globals :
- `window.OceConfig`
- `window.OceData`
- `window.OceTable`
- `window.OceForm`
- `window.OceStats`

Une fois toutes prêtes, il appelle `mountApp()`.

---

## Contrôle d'accès

### Côté client (OceApp.js)

```javascript
var userGroups = mw.config.get('wgUserGroups') || [];
var isBureaucrat = false;
for (var i = 0; i < userGroups.length; i++) {
    if (userGroups[i] === 'bureaucrat' || userGroups[i] === 'sysop') {
        isBureaucrat = true; break;
    }
}
```

Si un non-bureaucrate accède à `OCE:Gestion`, il voit une alerte d'erreur avec un lien vers `OCE:Consultation`.

### Recommandation côté serveur (LocalSettings.php)

```php
$wgPageRestrictions['OCE:Gestion'] = ['edit' => 'bureaucrat'];
```

---

## Interface utilisateur

### Mode Consultation

- Compteurs en haut (total, par statut)
- Barre de recherche + filtres (statut, priorité)
- Checkbox "Afficher clôturées"
- Tableau groupé par agent (accordéons dépliables)
- Échéances colorées : vert (>30j), orange (≤30j), rouge (dépassée)

### Mode Gestion — 3 onglets

#### Onglet Suivi
- Même vue que consultation + bouton "Nouvelle OCE"
- Modification d'une OCE existante (clic sur ✏️)
- Changement de statut rapide (dropdown dans la ligne)
- Bouton "Archiver" sur les OCE clôturées
- Bouton "Historique" pour voir le journal des modifications
- Checkbox "Afficher archivées"

#### Onglet Personnel
- Interface CRUD identique au planning
- Ajout, modification, départ, réactivation, réordonnement
- Source de données partagée avec le planning

#### Onglet Statistiques
- Sélecteur d'année (navigation ◀ ▶)
- Tableau agents × mois (janvier à décembre)
- Comptage basé sur la date de réception
- Ligne totaux en bas, colonne total annuel
- Inclut OCE actives + archivées de l'année

---

## Traçabilité

Chaque action est enregistrée dans le champ `historique[]` de l'OCE :

```json
{
  "date": "2026-04-04T14:30:00",
  "user": "Admin",
  "action": "Statut",
  "de": "en_attente",
  "vers": "en_cours"
}
```

Actions tracées :
- **Création** : nouvelle OCE
- **Modification** : changement de champs
- **Statut** : changement de statut (avec ancien → nouveau)
- **Archivage** : déplacement vers archive

L'historique est visible uniquement en mode Gestion via le bouton 📋 sur chaque ligne.

---

## Formulaire nouvelle OCE / modification

### Champs obligatoires
- **Agent** (select parmi le personnel actif)
- **N° OCE** (texte libre, sert d'identifiant unique — non modifiable en édition)
- **Délivré par** (texte libre — juridiction émettrice)
- **Date de réception** (date, pré-remplie à aujourd'hui en création)
- **Date d'échéance** (date)

### Champs optionnels
- Objet (description libre)
- Priorité (Normale / Urgente, défaut : Normale)
- Commentaire (textarea)

---

## Déploiement en production

1. Créer les pages wiki :
   - `OCE:Consultation`
   - `OCE:Gestion`

2. Copier les 7 fichiers vers MediaWiki :
   - `MediaWiki:Dsfr/oce/OceConfig.js`
   - `MediaWiki:Dsfr/oce/OceData.js`
   - `MediaWiki:Dsfr/oce/OceTable.js`
   - `MediaWiki:Dsfr/oce/OceForm.js`
   - `MediaWiki:Dsfr/oce/OceStats.js`
   - `MediaWiki:Dsfr/oce/OceApp.js`
   - `MediaWiki:Dsfr/oce/Style.css`

3. Mettre à jour `MediaWiki:Common.js` avec le bloc de chargement conditionnel OCE.

4. (Optionnel) Protéger les pages de données :
   ```php
   $wgPageRestrictions['OCE:Gestion'] = ['edit' => 'bureaucrat'];
   ```
