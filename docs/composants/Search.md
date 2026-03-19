# Composant : Barre de recherche (Search)

**Fichier source :** `shared/dsfr/components/Search.js`
**Page production :** `MediaWiki:Dsfr/components/Search.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Barre de recherche](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/barre-de-recherche)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Barre de recherche DSFR intégrée au moteur MediaWiki. Par défaut, le formulaire pointe vers `Special:Search` du wiki en utilisant `mw.config.get('wgScript')`. Peut être configurée pour cibler une URL personnalisée. Supporte un label accessible et un texte de remplacement.

---

## Syntaxe Wikitext

```html
<div class="dsfr-search"></div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Non | Label accessible du champ (visible pour les lecteurs d'écran) | `Recherche` |
| `data-placeholder` | Non | Texte de remplacement dans le champ | `Rechercher...` |
| `data-action` | Non | URL cible du formulaire | URL `wgScript` + `Special:Search` |
| `data-param` | Non | Nom du paramètre de recherche | `search` |
| `data-size` | Non | `"lg"` → barre grande taille | — |

---

## Exemples

### Barre de recherche standard

```html
<div class="dsfr-search"
     data-label="Rechercher dans le wiki DFAED"
     data-placeholder="Procédure, formulaire, guide...">
</div>
```

### Barre grande taille

```html
<div class="dsfr-search"
     data-label="Recherche"
     data-placeholder="Rechercher dans la documentation..."
     data-size="lg">
</div>
```

### Recherche dans une section spécifique (URL personnalisée)

```html
<div class="dsfr-search"
     data-label="Recherche dans les procédures"
     data-placeholder="Nom de la procédure..."
     data-action="/index.php"
     data-param="search">
</div>
```

---

## Structure HTML générée

```html
<div class="fr-search-bar" role="search">
  <form action="/index.php" method="get">
    <input type="hidden" name="title" value="Special:Search">
    <label class="fr-label" for="search-dsfr-1">Rechercher dans le wiki DFAED</label>
    <input class="fr-input"
           type="search"
           id="search-dsfr-1"
           name="search"
           placeholder="Procédure, formulaire, guide..."
           aria-label="Rechercher dans le wiki DFAED">
    <button class="fr-btn" type="submit" title="Rechercher dans le wiki DFAED">
      Rechercher dans le wiki DFAED
    </button>
  </form>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Sans `data-action`, le composant utilise automatiquement `mw.config.get('wgScript')` et ajoute `title=Special:Search` en champ caché.
- Avec `data-action` personnalisé, le champ caché `title=Special:Search` n'est pas ajouté.
