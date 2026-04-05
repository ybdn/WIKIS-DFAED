# Composant : Champ de saisie (Input)

**Fichier source :** `shared/dsfr/components/Input.js`
**Page production :** `MediaWiki:Dsfr/components/Input.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Champ de saisie](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/champ-de-saisie)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Champ de saisie textuelle avec label, texte d'aide, placeholder et gestion des états erreur/succès. Prend en charge tous les types HTML standards ainsi que la zone de texte multilignes (`textarea`). Utilisé dans les formulaires de recherche, de saisie de données ou de validation.

---

## Syntaxe Wikitext

```html
<div class="dsfr-input"
     data-label="Nom"
     data-name="nom">
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Oui | Libellé affiché au-dessus du champ | `Champ` |
| `data-name` | Non | Attribut `name` de l'input | ID auto-généré |
| `data-type` | Non | Type HTML : `text`, `email`, `tel`, `url`, `number`, `date`, `textarea` | `text` |
| `data-placeholder` | Non | Texte de remplacement | — |
| `data-hint` | Non | Texte d'aide sous le label | — |
| `data-value` | Non | Valeur initiale du champ | — |
| `data-error` | Non | Message d'erreur (active l'état erreur) | — |
| `data-valid` | Non | Message de validation (active l'état succès) | — |
| `data-required` | Non | `"true"` → champ obligatoire | — |
| `data-disabled` | Non | `"true"` → champ désactivé | — |
| `data-rows` | Non | Nombre de lignes pour `textarea` | `5` |

---

## Exemples

### Champ texte simple

```html
<div class="dsfr-input" data-label="Numéro de dossier" data-name="dossier"></div>
```

### Champ obligatoire avec aide

```html
<div class="dsfr-input"
     data-label="Référence affaire"
     data-name="reference"
     data-hint="Format : AA-AAAA-XXXXXX"
     data-placeholder="Ex: 75-2026-001234"
     data-required="true">
</div>
```

### Zone de texte pour commentaires

```html
<div class="dsfr-input"
     data-label="Observations"
     data-name="observations"
     data-type="textarea"
     data-rows="8"
     data-placeholder="Décrire les circonstances particulières...">
</div>
```

### Champ avec état erreur

```html
<div class="dsfr-input"
     data-label="Date de naissance"
     data-name="ddn"
     data-type="date"
     data-error="La date renseignée est postérieure à aujourd'hui">
</div>
```

### Champ validé

```html
<div class="dsfr-input"
     data-label="Empreinte référence"
     data-name="empreinte_ref"
     data-value="EMP-2026-0042"
     data-valid="Référence trouvée dans la base FAED">
</div>
```

---

## Structure HTML générée

```html
<div class="fr-input-group">
  <label class="fr-label" for="input-dsfr-1">
    Numéro de dossier
    <span class="fr-hint-text" id="hint-input-dsfr-1">Format : AA-AAAA-XXXXXX</span>
  </label>
  <input class="fr-input" type="text" id="input-dsfr-1" name="dossier"
         placeholder="Ex: 75-2026-001234" required aria-describedby="hint-input-dsfr-1">
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- `data-error` et `data-valid` sont mutuellement exclusifs ; l'erreur a la priorité.
- `data-type="textarea"` génère un `<textarea>` au lieu d'un `<input>`.
- Les IDs sont auto-générés et incrémentaux.
