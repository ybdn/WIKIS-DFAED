# Composant : Indicateur d'étapes (Stepper)

**Fichier source :** `staging_area/dsfr/components/Stepper.js`
**Page production :** `MediaWiki:Dsfr/components/Stepper.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Indicateur d'étapes](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/indicateur-d-etapes/)

---

## Description

L'indicateur d'étapes informe l'utilisateur de sa progression dans un parcours multi-étapes (formulaire en plusieurs parties, procédure guidée, etc.). Il affiche :

- le numéro de l'étape courante et le total,
- une barre de progression visuelle,
- le titre de l'étape en cours,
- optionnellement, le titre de l'étape suivante.

---

## Syntaxe Wikitext

Le composant se déclare avec un `<div>` portant la classe `dsfr-stepper` et des attributs `data-*` :

```html
<div class="dsfr-stepper"
     data-current="1"
     data-total="3"
     data-title="Vos informations personnelles"
     data-next="Vos coordonnées"></div>
```

### Tableau des attributs

| Attribut          | Obligatoire | Description                                                             | Valeur par défaut |
|-------------------|-------------|-------------------------------------------------------------------------|-------------------|
| `data-current`    | Oui         | Numéro de l'étape en cours (entier ≥ 1)                                | —                 |
| `data-total`      | Oui         | Nombre total d'étapes (entier ≥ 1)                                     | —                 |
| `data-title`      | Oui         | Titre de l'étape en cours                                              | —                 |
| `data-next`       | Non         | Titre de l'étape suivante. Omis sur la dernière étape.                 | *(absent)*        |
| `data-title-level`| Non         | Niveau sémantique du titre : `"h2"`, `"h3"` ou `"h4"`                | `"h2"`            |

---

## Exemples

### Étape intermédiaire (avec étape suivante)

```html
<div class="dsfr-stepper"
     data-current="2"
     data-total="4"
     data-title="Vos coordonnées"
     data-next="Récapitulatif"></div>
```

**Rendu HTML généré :**

```html
<div class="fr-stepper">
  <h2 class="fr-stepper__title">
    <span class="fr-stepper__state">Étape 2 sur 4</span>
    Vos coordonnées
  </h2>
  <div class="fr-stepper__steps"
       data-fr-current-step="2"
       data-fr-steps="4"></div>
  <p class="fr-stepper__details">
    <span class="fr-text--bold">Étape suivante :</span> Récapitulatif
  </p>
</div>
```

---

### Dernière étape (sans étape suivante)

```html
<div class="dsfr-stepper"
     data-current="4"
     data-total="4"
     data-title="Confirmation et envoi"></div>
```

**Rendu HTML généré :**

```html
<div class="fr-stepper">
  <h2 class="fr-stepper__title">
    <span class="fr-stepper__state">Étape 4 sur 4</span>
    Confirmation et envoi
  </h2>
  <div class="fr-stepper__steps"
       data-fr-current-step="4"
       data-fr-steps="4"></div>
</div>
```

---

### Avec niveau de titre personnalisé

```html
<div class="dsfr-stepper"
     data-current="1"
     data-total="2"
     data-title="Saisie des données"
     data-next="Validation"
     data-title-level="h3"></div>
```

---

## Comportement du composant

- Le composant est **purement CSS-driven** côté DSFR : la barre de progression est rendue automatiquement par le CSS DSFR grâce aux attributs `data-fr-current-step` et `data-fr-steps`.
  Aucun JavaScript DSFR supplémentaire n'est requis.
- Le JS du wiki transforme la syntaxe simplifiée `dsfr-stepper` en structure DSFR valide au chargement de la page.
- La transformation est **idempotente** : un élément déjà transformé ne l'est pas une seconde fois.
- Les valeurs de `data-current` hors de l'intervalle `[1, total]` sont automatiquement clampées.

---

## Insertion depuis l'éditeur de page

Dans l'éditeur DSFR, le bouton **"Composants DSFR"** propose deux raccourcis :

| Entrée de menu                          | Insère                                              |
|-----------------------------------------|-----------------------------------------------------|
| Indicateur d'étapes (étape courante)    | Étape 1/3 avec titre et étape suivante préremplis   |
| Indicateur d'étapes (dernière étape)    | Étape 3/3 — confirmation, sans étape suivante       |

Modifiez ensuite les attributs `data-current`, `data-total`, `data-title` et `data-next` selon vos besoins.

---

## Déploiement en production

| Fichier local                                        | Page MediaWiki de production                          |
|------------------------------------------------------|-------------------------------------------------------|
| `staging_area/dsfr/components/Stepper.js`            | `MediaWiki:Dsfr/components/Stepper.js`               |

Pensez aussi à mettre à jour `MediaWiki:Common.js` pour inclure `'components/Stepper'` dans le tableau `dsfrModules` si ce n'est pas encore fait.

---

## Contraintes techniques

- Code ES5 strict (pas de `const`/`let`/`=>`/backticks) — compatibilité minifier MediaWiki 1.31.
- La barre de progression visuelle nécessite que le CSS DSFR v1.12.1+ soit chargé.
- Le composant ne gère pas la navigation entre étapes (ce n'est pas son rôle — il est purement indicatif).
