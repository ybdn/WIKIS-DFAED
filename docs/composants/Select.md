# Composant : Liste déroulante (Select)

**Fichier source :** `shared/dsfr/components/Select.js`
**Page production :** `MediaWiki:Dsfr/components/Select.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Liste déroulante](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/liste-deroulante)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Liste déroulante (`<select>`) DSFR avec label, texte d'aide, placeholder et gestion des états erreur/succès. Les options sont définies via un attribut `data-options` sous forme de paires `Label|valeur` séparées par des virgules.

---

## Syntaxe Wikitext

```html
<div class="dsfr-select"
     data-label="Statut"
     data-options="En cours|en_cours,Clôturé|cloture,Archivé|archive">
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Oui | Libellé affiché au-dessus du select | `Sélection` |
| `data-options` | Oui | Options au format `Label1\|val1,Label2\|val2` (la valeur peut être omise, le label fait alors office de valeur) | — |
| `data-name` | Non | Attribut `name` du `<select>` | ID auto-généré |
| `data-hint` | Non | Texte d'aide sous le label | — |
| `data-placeholder` | Non | Option vide initiale (non sélectionnable) | `Sélectionner une option` |
| `data-value` | Non | Valeur présélectionnée | — |
| `data-error` | Non | Message d'erreur | — |
| `data-valid` | Non | Message de validation | — |
| `data-required` | Non | `"true"` → champ obligatoire | — |
| `data-disabled` | Non | `"true"` → champ désactivé | — |

---

## Exemples

### Sélection du type de trace

```html
<div class="dsfr-select"
     data-label="Type de trace"
     data-name="type_trace"
     data-placeholder="Sélectionner un type de trace"
     data-options="Empreinte digitale|digit,Empreinte palmaire|palm,Trace de chaussure|chaussure">
</div>
```

### Sélection obligatoire avec aide et pré-sélection

```html
<div class="dsfr-select"
     data-label="Unité d'origine"
     data-name="unite"
     data-hint="Sélectionner l'unité ayant transmis le dossier"
     data-options="IRCGN|ircgn,Laboratoire régional|lab_reg,Section de recherches|sr"
     data-value="ircgn"
     data-required="true">
</div>
```

### Sélection avec état erreur

```html
<div class="dsfr-select"
     data-label="Priorité"
     data-name="priorite"
     data-options="Normale|normale,Haute|haute,Urgente|urgente"
     data-error="Veuillez sélectionner une priorité">
</div>
```

---

## Structure HTML générée

```html
<div class="fr-select-group">
  <label class="fr-label" for="select-dsfr-1">
    Type de trace
    <span class="fr-hint-text" id="hint-select-dsfr-1">Texte d'aide</span>
  </label>
  <select class="fr-select" id="select-dsfr-1" name="type_trace">
    <option value="" selected disabled hidden>Sélectionner un type de trace</option>
    <option value="digit">Empreinte digitale</option>
    <option value="palm">Empreinte palmaire</option>
    <option value="chaussure">Trace de chaussure</option>
  </select>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Si la valeur est omise dans `data-options` (ex: `Option A,Option B`), le label est utilisé comme valeur.
- `data-error` et `data-valid` sont mutuellement exclusifs.
- Le placeholder est rendu non sélectionnable (`disabled hidden`) conformément aux recommandations DSFR.
