# Composant : Sommaire (Summary)

**Fichier source :** `wiki-DocDFAED/staging_area/dsfr/components/Summary.js`
**Page production :** `MediaWiki:Dsfr/components/Summary.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Sommaire](https://www.systeme-de-design.gouv.fr/composants/sommaire)
**Wiki cible :** DocDFAED uniquement

---

## Description

Le Sommaire génère automatiquement une table des matières DSFR en scannant les titres `h2` et `h3` de la page. Il remplace le sommaire natif MediaWiki (`__TOC__`) avec un rendu visuel conforme au DSFR.

---

## Syntaxe Wikitext

```html
<div class="dsfr-summary"></div>
```

Placez ce bloc à l'endroit où vous souhaitez que le sommaire apparaisse (généralement en haut de page, après l'introduction).

### Avec titre personnalisé

```html
<div class="dsfr-summary" data-title="Dans cette page"></div>
```

### Titres h2 uniquement (sans h3)

```html
<div class="dsfr-summary" data-depth="1"></div>
```

### Tableau des attributs

| Attribut      | Obligatoire | Description                                                                 | Valeur par défaut |
|---------------|-------------|-----------------------------------------------------------------------------|-------------------|
| `data-title`  | Non         | Titre affiché au-dessus du sommaire                                         | `"Sommaire"`      |
| `data-depth`  | Non         | Profondeur : `1` = h2 uniquement, `2` = h2 + h3                            | `2`               |

---

## Exemple

**Page avec les titres suivants :**
- `== Présentation ==`
- `== Procédures ==`
- `=== Saisie ===`
- `=== Validation ===`
- `== Contacts ==`

**Markup :**

```html
<div class="dsfr-summary" data-title="Dans cette page"></div>
```

**Rendu HTML généré :**

```html
<nav class="fr-summary" role="navigation" aria-labelledby="fr-summary-title-1">
  <p class="fr-summary__title" id="fr-summary-title-1">Dans cette page</p>
  <ol class="fr-summary__list">
    <li>
      <a class="fr-summary__link" href="#Présentation">Présentation</a>
    </li>
    <li>
      <a class="fr-summary__link" href="#Procédures">Procédures</a>
      <ol class="fr-summary__list">
        <li><a class="fr-summary__link" href="#Saisie">Saisie</a></li>
        <li><a class="fr-summary__link" href="#Validation">Validation</a></li>
      </ol>
    </li>
    <li>
      <a class="fr-summary__link" href="#Contacts">Contacts</a>
    </li>
  </ol>
</nav>
```

---

## Comportement du composant

- Le composant scanne uniquement les titres présents dans `.mw-parser-output` (le contenu de la page, hors header/footer DSFR).
- Seuls les titres dotés d'un ID (`<span class="mw-headline" id="...">`) sont inclus — ce qui correspond à tous les titres créés avec la syntaxe wiki (`==`, `===`).
- Si aucun titre n'est trouvé, l'élément `dsfr-summary` est supprimé silencieusement.
- Le sommaire natif MediaWiki (`__TOC__`) est masqué par `Style.css` — le composant DSFR le remplace entièrement.
- Plusieurs sommaires peuvent coexister sur une même page (IDs générés uniques).

> **Conseil** : évitez d'utiliser simultanément `__TOC__` et `<div class="dsfr-summary">`. Préférez toujours la version DSFR.

---

## Insertion depuis l'éditeur de page

Dans le bouton **"Composants DSFR"** :

| Entrée de menu         | Insère                                      |
|------------------------|---------------------------------------------|
| Sommaire (automatique) | `<div class="dsfr-summary"></div>`          |

---

## Déploiement en production

| Fichier local                                       | Page MediaWiki de production                  |
|-----------------------------------------------------|-----------------------------------------------|
| `staging_area/dsfr/components/Summary.js`           | `MediaWiki:Dsfr/components/Summary.js`        |

---

## Contraintes techniques

- Code ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le composant dépend de la présence de `.mw-parser-output` dans le DOM (standard MediaWiki).
- Composant disponible sur **DocDFAED uniquement**.
