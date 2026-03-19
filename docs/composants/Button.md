# Composant : Bouton (Button)

**Fichier source :** `shared/dsfr/components/Button.js`
**Page production :** `MediaWiki:Dsfr/components/Button.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Bouton](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/bouton)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Élément d'action principal de l'interface. Peut être rendu comme un bouton cliquable ou comme un lien stylisé. Supporte quatre variantes visuelles, trois tailles et des icônes DSFR positionnées à gauche ou à droite du libellé.

---

## Syntaxe Wikitext

```html
<span class="dsfr-btn">Libellé du bouton</span>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-href` | Non | URL cible → génère un `<a>` au lieu d'un `<button>` | — |
| `data-variant` | Non | Style : `primary`, `secondary`, `tertiary`, `tertiary-no-outline` | `primary` |
| `data-size` | Non | Taille : `sm`, `md`, `lg` | `md` |
| `data-icon` | Non | Classe icône DSFR (ex: `fr-icon-download-line`) | — |
| `data-icon-position` | Non | Position de l'icône : `left`, `right` | `left` |

---

## Exemples

### Bouton primaire simple

```html
<span class="dsfr-btn">Soumettre le dossier</span>
```

### Lien stylisé en bouton secondaire

```html
<span class="dsfr-btn" data-href="/Procédure_identification" data-variant="secondary">
  Voir la procédure
</span>
```

### Bouton avec icône téléchargement

```html
<span class="dsfr-btn"
      data-href="/Fichier:Guide_FAED.pdf"
      data-icon="fr-icon-download-line"
      data-icon-position="right">
  Télécharger le guide
</span>
```

### Bouton tertiaire petit format

```html
<span class="dsfr-btn" data-variant="tertiary" data-size="sm">Annuler</span>
```

---

## Structure HTML générée

```html
<!-- Bouton standard -->
<button class="fr-btn">Soumettre le dossier</button>

<!-- Lien secondaire avec icône -->
<a class="fr-btn fr-btn--secondary fr-icon-download-line fr-btn--icon-right"
   href="/Fichier:Guide_FAED.pdf">
  Télécharger le guide
</a>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le composant expose aussi `window.DsfrButton.render(options)` pour un usage programmatique.
- `<span>` est recommandé pour usage inline en Wikitext ; `<div>` peut être utilisé pour un usage bloc.
- `data-variant="primary"` ne génère pas de classe supplémentaire (c'est le style par défaut de `fr-btn`).
