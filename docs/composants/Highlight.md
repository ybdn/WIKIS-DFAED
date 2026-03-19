# Composant : Mise en exergue (Highlight)

**Fichier source :** `shared/dsfr/components/Highlight.js`
**Page production :** `MediaWiki:Dsfr/components/Highlight.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Mise en exergue](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/mise-en-exergue)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Bloc typographique avec une bordure colorée à gauche destiné à mettre en valeur un extrait de texte important, sans la sémantique d'une alerte. Utile pour isoler une définition, un point réglementaire clé ou une note de contexte.

---

## Syntaxe Wikitext

```html
<div class="dsfr-highlight">Texte mis en exergue.</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-color` | Non | Couleur DSFR de la bordure (ex: `green-menthe`, `blue-ecume`) | couleur par défaut |
| `data-size` | Non | Taille du texte : `sm`, `lg` | — |

---

## Exemples

### Note réglementaire

```html
<div class="dsfr-highlight">
  Conformément à l'article L. 133-2 du Code de la sécurité intérieure, tout accès à la base FAED
  doit être tracé et justifié par le numéro d'affaire correspondant.
</div>
```

### Définition avec couleur

```html
<div class="dsfr-highlight" data-color="blue-ecume">
  <strong>Empreinte latente</strong> : trace dactyloscopique laissée involontairement sur une surface,
  non visible à l'œil nu sans traitement préalable.
</div>
```

### Texte grand format

```html
<div class="dsfr-highlight" data-size="lg">
  Ce guide est la référence officielle pour les agents du DFAED. Toute procédure non documentée
  ici doit être validée par le chef de département.
</div>
```

---

## Structure HTML générée

```html
<!-- Sans couleur ni taille spécifique -->
<div class="fr-highlight">
  <p>Texte mis en exergue.</p>
</div>

<!-- Avec couleur et taille -->
<div class="fr-highlight fr-highlight--blue-ecume">
  <p class="fr-text--lg">Texte grand format.</p>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Si le contenu est du texte brut, il est automatiquement enveloppé dans un `<p>`.
- Si le contenu contient déjà des balises bloc (`<p>`, `<div>`, `<ul>`, `<ol>`), elles sont conservées et la classe de taille est appliquée au premier `<p>` trouvé.
