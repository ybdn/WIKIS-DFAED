# Composant : Ajout de fichier (Upload)

**Fichier source :** `shared/dsfr/components/Upload.js`
**Page production :** `MediaWiki:Dsfr/components/Upload.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Ajout de fichier](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/ajout-de-fichier)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Champ de sélection de fichier stylisé DSFR avec label et texte d'aide. Utilisé dans les formulaires nécessitant l'envoi de pièces jointes (rapports, photos de scène, formulaires numérisés). Le composant génère un `<input type="file">` accessible avec son label associé.

---

## Syntaxe Wikitext

```html
<div class="dsfr-upload" data-label="Ajouter un fichier"></div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Non | Libellé du champ de sélection | `Ajouter un fichier` |
| `data-hint` | Non | Texte d'aide sous le label (formats acceptés, taille max, etc.) | — |
| `data-name` | Non | Attribut `name` du `<input type="file">` | ID auto-généré |

---

## Exemples

### Champ simple

```html
<div class="dsfr-upload" data-label="Joindre le rapport de scène"></div>
```

### Champ avec aide sur les formats acceptés

```html
<div class="dsfr-upload"
     data-label="Photo de l'empreinte latente"
     data-hint="Formats acceptés : JPG, PNG, TIFF — Taille maximale : 10 Mo"
     data-name="photo_empreinte">
</div>
```

### Plusieurs champs dans un formulaire

```html
<div class="dsfr-upload"
     data-label="Procès-verbal de saisie"
     data-hint="Format PDF uniquement — Taille maximale : 5 Mo"
     data-name="pv_saisie">
</div>
<div class="dsfr-upload"
     data-label="Formulaire de demande signé"
     data-hint="Format PDF ou image — Taille maximale : 2 Mo"
     data-name="formulaire_signe">
</div>
```

---

## Structure HTML générée

```html
<div class="fr-upload-group">
  <label class="fr-label" for="file-upload-[timestamp]-0">
    Photo de l'empreinte latente
    <span class="fr-hint-text">Formats acceptés : JPG, PNG, TIFF — Taille maximale : 10 Mo</span>
  </label>
  <input class="fr-upload"
         type="file"
         id="file-upload-[timestamp]-0"
         name="photo_empreinte">
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- L'ID est généré via `Date.now()` + index pour garantir l'unicité même si plusieurs champs sont présents.
- Ce composant génère uniquement le champ de sélection côté client. L'envoi effectif nécessite un formulaire `<form>` parent et un traitement côté serveur (hors périmètre MediaWiki standard).
- Pour la sélection multiple, ajouter l'attribut `multiple` directement sur l'input généré via JavaScript personnalisé.
