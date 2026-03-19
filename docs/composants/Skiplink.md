# Composant : Liens d'évitement (Skiplink)

**Fichier source :** `shared/dsfr/components/Skiplink.js`
**Page production :** `MediaWiki:Dsfr/components/Skiplink.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Lien d'évitement](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/lien-d-evitement)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Liens d'accessibilité invisibles par défaut, visibles lors de la navigation au clavier (touche Tab), permettant de sauter directement aux zones principales de la page. Ce composant s'injecte automatiquement au début du `<body>` sans intervention dans le Wikitext. Les IDs cibles (`contenu`, `header-navigation`, `footer`) sont posés par `Layout.js`.

---

## Syntaxe Wikitext

Ce composant s'active automatiquement sans balisage requis. Les liens par défaut pointent vers `#contenu`, `#header-navigation` et `#footer`.

Pour personnaliser les liens, placer le bloc déclaratif suivant dans la page :

```html
<div class="dsfr-skiplinks">
  <span data-target="contenu">Contenu</span>
  <span data-target="recherche">Recherche</span>
  <span data-target="footer">Pied de page</span>
</div>
```

### Tableau des attributs — mode déclaratif

| Attribut | Obligatoire | Description |
|----------|-------------|-------------|
| `data-target` | Oui | ID de l'ancre cible dans la page |
| Texte interne | Oui | Libellé du lien d'évitement |

### Liens par défaut (mode automatique)

| Libellé | ID cible |
|---------|----------|
| Contenu | `#contenu` |
| Menu | `#header-navigation` |
| Pied de page | `#footer` |

---

## Exemples

### Mode automatique (aucune configuration requise)

Le composant s'injecte de lui-même si les IDs `contenu`, `header-navigation` et `footer` existent dans la page (posés par `Layout.js`).

### Mode déclaratif avec ancres personnalisées

```html
<div class="dsfr-skiplinks">
  <span data-target="contenu">Aller au contenu</span>
  <span data-target="barre-recherche">Aller à la recherche</span>
  <span data-target="menu-lateral">Aller au menu latéral</span>
</div>
```

---

## Structure HTML générée

```html
<div class="fr-skiplinks">
  <nav aria-label="Accès rapide" class="fr-container">
    <ul class="fr-skiplinks__list">
      <li><a class="fr-link" href="#contenu">Contenu</a></li>
      <li><a class="fr-link" href="#header-navigation">Menu</a></li>
      <li><a class="fr-link" href="#footer">Pied de page</a></li>
    </ul>
  </nav>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le composant vérifie l'existence des ancres cibles dans le DOM avant d'injecter les liens (les liens pointant vers des IDs absents sont ignorés).
- Si `.fr-skiplinks` existe déjà, l'injection est annulée (protection anti-doublon).
- En mode déclaratif, le `.dsfr-skiplinks` est retiré du DOM après traitement.
- Ce composant est généralement chargé systématiquement par `Common.js` et ne nécessite pas d'action manuelle.
