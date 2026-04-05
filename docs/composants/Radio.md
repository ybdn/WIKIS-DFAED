# Composant : Bouton radio (Radio)

**Fichier source :** `shared/dsfr/components/Radio.js`
**Page production :** `MediaWiki:Dsfr/components/Radio.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Bouton radio](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/bouton-radio)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Groupe de boutons radio DSFR permettant une sélection exclusive parmi plusieurs options. Chaque radio peut avoir une aide contextuelle. Le groupe supporte une disposition horizontale et les états erreur/succès.

---

## Syntaxe Wikitext

```html
<div class="dsfr-radio-group" data-legend="Choisir une option" data-name="choix">
  <div class="dsfr-radio" data-label="Option A" data-value="a"></div>
  <div class="dsfr-radio" data-label="Option B" data-value="b" data-checked="true"></div>
</div>
```

### Tableau des attributs — `.dsfr-radio-group`

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-name` | Oui | Attribut `name` partagé par tous les radios | ID auto-généré |
| `data-legend` | Non | Légende du groupe (titre du fieldset) | — |
| `data-error` | Non | Message d'erreur du groupe | — |
| `data-valid` | Non | Message de validation du groupe | — |
| `data-inline` | Non | `"true"` → disposition horizontale | — |

### Tableau des attributs — `.dsfr-radio`

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Oui | Libellé affiché à côté du radio | `Option N` |
| `data-value` | Non | Valeur envoyée | index numérique |
| `data-hint` | Non | Texte d'aide sous le label | — |
| `data-checked` | Non | `"true"` → sélectionné par défaut | — |
| `data-disabled` | Non | `"true"` → désactivé | — |

---

## Exemples

### Choix du type de demande

```html
<div class="dsfr-radio-group" data-legend="Type de demande" data-name="type_demande">
  <div class="dsfr-radio" data-label="Identification judiciaire" data-value="judiciaire"></div>
  <div class="dsfr-radio" data-label="Vérification administrative" data-value="administrative"></div>
  <div class="dsfr-radio" data-label="Urgence absolue" data-value="urgence"
       data-hint="Délai de traitement réduit à 4 heures"></div>
</div>
```

### Groupe horizontal avec validation

```html
<div class="dsfr-radio-group"
     data-legend="Qualité de l'empreinte"
     data-name="qualite"
     data-inline="true"
     data-valid="Qualité validée pour traitement automatique">
  <div class="dsfr-radio" data-label="Bonne" data-value="bonne" data-checked="true"></div>
  <div class="dsfr-radio" data-label="Moyenne" data-value="moyenne"></div>
  <div class="dsfr-radio" data-label="Insuffisante" data-value="insuffisante"></div>
</div>
```

---

## Structure HTML générée

```html
<fieldset class="fr-fieldset" id="radio-group-dsfr-1">
  <legend class="fr-fieldset__legend fr-text--regular">Type de demande</legend>
  <div class="fr-fieldset__content">
    <div class="fr-radio-group">
      <input type="radio" id="radio-dsfr-1-0" name="type_demande" value="judiciaire">
      <label class="fr-label" for="radio-dsfr-1-0">Identification judiciaire</label>
    </div>
    <div class="fr-radio-group">
      <input type="radio" id="radio-dsfr-1-1" name="type_demande" value="administrative">
      <label class="fr-label" for="radio-dsfr-1-1">Vérification administrative</label>
    </div>
  </div>
</fieldset>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- `data-error` et `data-valid` sont mutuellement exclusifs.
- Les IDs sont auto-générés et incluent l'index de groupe et l'index d'item.
