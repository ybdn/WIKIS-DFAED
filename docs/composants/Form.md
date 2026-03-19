# Composant : Formulaire (Form)

**Fichier source :** `shared/dsfr/components/Form.js`
**Page production :** `MediaWiki:Dsfr/components/Form.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Formulaire](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/formulaire)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Conteneur de groupe de champs (`fieldset` DSFR) permettant de regrouper visuellement et sémantiquement plusieurs champs de formulaire. Utilisé comme enveloppe autour d'autres composants DSFR (`dsfr-input`, `dsfr-checkbox`, `dsfr-radio-group`, etc.). Supporte légende, texte d'aide global, et messages d'état.

---

## Syntaxe Wikitext

```html
<div class="dsfr-form-group" data-legend="Informations sur le dossier">
  <!-- Champs DSFR imbriqués -->
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-legend` | Non | Légende du fieldset (titre du groupe) | — |
| `data-hint` | Non | Texte d'aide affiché sous la légende | — |
| `data-error` | Non | Message d'erreur global du groupe | — |
| `data-valid` | Non | Message de succès global du groupe | — |

---

## Exemples

### Groupe de champs avec légende

```html
<div class="dsfr-form-group" data-legend="Identification de la personne">
  <div class="dsfr-input" data-label="Nom" data-name="nom"></div>
  <div class="dsfr-input" data-label="Prénom" data-name="prenom"></div>
  <div class="dsfr-input" data-label="Date de naissance" data-name="ddn" data-type="date"></div>
</div>
```

### Groupe avec aide et état d'erreur

```html
<div class="dsfr-form-group"
     data-legend="Critères de recherche"
     data-hint="Renseigner au moins un critère obligatoire"
     data-error="Veuillez compléter les champs obligatoires">
  <div class="dsfr-input" data-label="Numéro de dossier" data-name="dossier"></div>
  <div class="dsfr-checkbox" data-label="Recherche étendue" data-name="etendue"></div>
</div>
```

### Groupe validé

```html
<div class="dsfr-form-group"
     data-legend="Données biométriques"
     data-valid="Les données ont été enregistrées avec succès">
  <div class="dsfr-input" data-label="Référence empreintes" data-name="ref_emp"></div>
</div>
```

---

## Structure HTML générée

```html
<fieldset class="fr-fieldset">
  <legend class="fr-fieldset__legend fr-text--regular">
    Identification de la personne
    <!-- Si data-hint présent : -->
    <span class="fr-hint-text">Texte d'aide</span>
  </legend>
  <div class="fr-fieldset__content">
    <!-- Champs DSFR imbriqués -->
  </div>
  <!-- Si data-error présent : -->
  <p class="fr-error-text">Message d'erreur</p>
</fieldset>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Ce composant est un conteneur : il ne génère pas de champ lui-même.
- `data-error` et `data-valid` sont mutuellement exclusifs ; l'erreur a la priorité.
- Le contenu interne (`innerHTML`) est préservé tel quel dans `.fr-fieldset__content`.
