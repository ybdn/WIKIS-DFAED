# Composant : Case à cocher (Checkbox)

**Fichier source :** `shared/dsfr/components/Checkbox.js`
**Page production :** `MediaWiki:Dsfr/components/Checkbox.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Case à cocher](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/case-a-cocher)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Case à cocher DSFR utilisable seule ou regroupée dans un fieldset. Adapté aux formulaires de recherche, listes de critères ou cases de validation dans les procédures. Supporte les états pré-coché, désactivé et erreur.

---

## Syntaxe Wikitext

### Case à cocher seule

```html
<div class="dsfr-checkbox"
     data-label="J'ai vérifié la concordance des empreintes"
     data-name="verification"
     data-value="oui">
</div>
```

### Groupe de cases à cocher

```html
<div class="dsfr-checkbox-group" data-legend="Types de traces" data-name="types">
  <div class="dsfr-checkbox" data-label="Empreintes digitales" data-value="digitales"></div>
  <div class="dsfr-checkbox" data-label="Empreintes palmaires" data-value="palmaires"></div>
  <div class="dsfr-checkbox" data-label="Traces de chaussures" data-value="chaussures" data-checked="true"></div>
</div>
```

### Tableau des attributs — `.dsfr-checkbox`

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Oui | Libellé affiché à côté de la case | `Option` |
| `data-name` | Non | Attribut `name` de l'input (optionnel si dans un groupe) | ID auto-généré |
| `data-value` | Non | Valeur envoyée par le formulaire | `on` |
| `data-hint` | Non | Texte d'aide affiché sous le label | — |
| `data-checked` | Non | `"true"` → coché par défaut | — |
| `data-disabled` | Non | `"true"` → case désactivée | — |
| `data-error` | Non | Message d'erreur (case isolée uniquement) | — |

### Tableau des attributs — `.dsfr-checkbox-group`

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-legend` | Non | Légende du groupe | — |
| `data-name` | Non | Attribut `name` commun à toutes les cases | — |
| `data-error` | Non | Message d'erreur du groupe | — |
| `data-valid` | Non | Message de validation du groupe | — |

---

## Exemples

### Case obligatoire avec aide

```html
<div class="dsfr-checkbox"
     data-label="Dossier conforme aux exigences réglementaires"
     data-name="conformite"
     data-hint="Vérifier les articles 6 à 9 de la procédure interne">
</div>
```

### Groupe avec erreur

```html
<div class="dsfr-checkbox-group"
     data-legend="Éléments collectés"
     data-name="elements"
     data-error="Sélectionner au moins un type d'élément">
  <div class="dsfr-checkbox" data-label="Empreintes digitales" data-value="digitales"></div>
  <div class="dsfr-checkbox" data-label="ADN" data-value="adn"></div>
</div>
```

---

## Structure HTML générée

```html
<fieldset class="fr-fieldset">
  <legend class="fr-fieldset__legend fr-text--regular">Types de traces</legend>
  <div class="fr-fieldset__content">
    <div class="fr-checkbox-group">
      <input type="checkbox" id="checkbox-dsfr-1" name="types" value="digitales">
      <label class="fr-label" for="checkbox-dsfr-1">Empreintes digitales</label>
    </div>
    <!-- ... autres cases ... -->
  </div>
</fieldset>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Les IDs sont auto-générés et incrémentaux pour garantir l'unicité sur la page.
- Les cases dans un groupe héritent du `data-name` défini sur le groupe.
