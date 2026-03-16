# Composant Carte (`Card`)

> Composant DSFR — [Documentation officielle](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/carte/code-de-la-carte)

Permet d'afficher des cartes DSFR dans les pages des deux wikis (DFAED-NG et DocDFAED), à l'unité ou regroupées en grille responsive.

---

## Fichiers

| Fichier source | Page MediaWiki de production |
|---|---|
| `wiki-DFAED-NG/staging_area/dsfr/components/Card.js` | `MediaWiki:Dsfr/components/Card.js` |
| `wiki-DocDFAED/staging_area/dsfr/components/Card.js` | `MediaWiki:Dsfr/components/Card.js` |

---

## Syntaxe wikitext

### Carte simple

```html
<div class="dsfr-card" data-title="Titre de la carte" data-url="Nom_Page_Wiki">
  Description de la carte.
</div>
```

Le contenu du `<div>` devient la description. Si MediaWiki l'enrobe dans un `<p>`, le composant le déballe automatiquement.

### Grille de cartes

```html
<div class="dsfr-card-grid" data-cols="3">
  <div class="dsfr-card-item" data-title="Carte 1" data-url="Page1">Description 1</div>
  <div class="dsfr-card-item" data-title="Carte 2" data-url="Page2">Description 2</div>
  <div class="dsfr-card-item" data-title="Carte 3" data-url="Page3">Description 3</div>
</div>
```

`data-cols` accepte `2`, `3` (défaut) ou `4`. Les colonnes sont responsives (mobile → 1 colonne, tablette → 2, bureau → nombre demandé).

---

## Attributs

### Sur `.dsfr-card` et `.dsfr-card-item`

| Attribut | Obligatoire | Valeurs | Description |
|---|---|---|---|
| `data-title` | Oui | texte libre | Titre affiché dans la carte |
| `data-url` | Non | nom de page wiki ou URL | Si nom de page wiki (sans `/`), résolu via `mw.util.getUrl()`. Si URL absolue (`http…`) ou chemin absolu (`/…`), utilisé tel quel. |
| `data-desc` | Non | texte/HTML | Description alternative au contenu du `<div>` |
| `data-detail` | Non | texte libre | Texte affiché en bas de carte (catégorie, lieu…) |
| `data-detail-icon` | Non | classe DSFR | Icône associée au détail, ex : `fr-icon-map-pin-2-line` |
| `data-badge` | Non | texte libre | Texte du badge affiché dans la zone `fr-card__start` |
| `data-badge-type` | Non | `new` · `info` · `success` · `warning` · `error` | Couleur sémantique du badge (défaut : `new`) |
| `data-image` | Non | URL | URL de l'image d'illustration |
| `data-image-alt` | Non | texte libre | Texte alternatif de l'image (défaut : vide) |
| `data-horizontal` | Non | `"true"` | Disposition horizontale (image à droite du texte) |
| `data-shadow` | Non | `"true"` | Ajoute une ombre portée (`fr-card--shadow`) |
| `data-grey` | Non | `"true"` | Fond gris (`fr-card--grey`) |
| `data-no-arrow` | Non | `"true"` | Masque la flèche de navigation (`fr-card--no-arrow`) |

### Sur `.dsfr-card-grid` uniquement

| Attribut | Obligatoire | Valeurs | Description |
|---|---|---|---|
| `data-cols` | Non | `2` · `3` · `4` | Nombre de colonnes (défaut : `3`) |

---

## Exemples

### Carte avec badge et détail

```html
<div class="dsfr-card"
  data-title="Procédure d'identification"
  data-url="Procedure_identification"
  data-badge="Mis à jour"
  data-badge-type="success"
  data-detail="Identification dactyloscopique"
  data-detail-icon="fr-icon-fingerprint-line">
  Protocole complet pour la saisie et la comparaison d'empreintes digitales.
</div>
```

### Carte avec image et ombre

```html
<div class="dsfr-card"
  data-title="Guide FAED"
  data-url="Guide_FAED"
  data-image="/images/guide-faed.jpg"
  data-image-alt="Couverture du guide FAED"
  data-shadow="true">
  Guide d'utilisation de l'application FAED à destination des enquêteurs.
</div>
```

### Carte sans lien (titre non cliquable)

```html
<div class="dsfr-card" data-title="Information générale">
  Contenu informatif sans lien de navigation.
</div>
```

### Grille 2 colonnes

```html
<div class="dsfr-card-grid" data-cols="2">
  <div class="dsfr-card-item" data-title="Module A" data-url="Module_A" data-badge="Nouveau" data-badge-type="info">
    Présentation du module A.
  </div>
  <div class="dsfr-card-item" data-title="Module B" data-url="Module_B">
    Présentation du module B.
  </div>
</div>
```

### Grille 4 colonnes avec fond gris

```html
<div class="dsfr-card-grid" data-cols="4">
  <div class="dsfr-card-item" data-title="Étape 1" data-url="Etape_1" data-grey="true">Description étape 1.</div>
  <div class="dsfr-card-item" data-title="Étape 2" data-url="Etape_2" data-grey="true">Description étape 2.</div>
  <div class="dsfr-card-item" data-title="Étape 3" data-url="Etape_3" data-grey="true">Description étape 3.</div>
  <div class="dsfr-card-item" data-title="Étape 4" data-url="Etape_4" data-grey="true">Description étape 4.</div>
</div>
```

---

## Structure HTML générée

### Carte simple (avec lien)

```html
<div class="fr-card fr-enlarge-link">
  <div class="fr-card__body">
    <div class="fr-card__content">
      <h3 class="fr-card__title">
        <a href="/wiki/Nom_Page" class="fr-card__link">Titre</a>
      </h3>
      <p class="fr-card__desc">Description</p>
      <!-- si badge -->
      <div class="fr-card__start">
        <ul class="fr-badges-group">
          <li><p class="fr-badge fr-badge--info">Label</p></li>
        </ul>
      </div>
      <!-- si détail -->
      <div class="fr-card__end">
        <p class="fr-card__detail fr-icon-map-pin-2-line">Catégorie</p>
      </div>
    </div>
  </div>
  <!-- si image -->
  <div class="fr-card__header">
    <div class="fr-card__img">
      <img class="fr-responsive-img" src="..." alt="">
    </div>
  </div>
</div>
```

### Grille (3 colonnes)

```html
<ul class="fr-grid-row fr-grid-row--gutters fr-grid-row--equal-height">
  <li class="fr-col-12 fr-col-md-6 fr-col-lg-4">
    <div class="fr-card fr-enlarge-link">…</div>
  </li>
  <!-- … -->
</ul>
```

---

## Classes de grille responsive

| `data-cols` | Mobile | Tablette | Bureau |
|---|---|---|---|
| `2` | 1 colonne (`fr-col-12`) | 2 colonnes (`fr-col-md-6`) | 2 colonnes |
| `3` (défaut) | 1 colonne | 2 colonnes (`fr-col-md-6`) | 3 colonnes (`fr-col-lg-4`) |
| `4` | 1 colonne | 2 colonnes (`fr-col-sm-6`) | 4 colonnes (`fr-col-lg-3`) |

---

## Notes techniques

- **ES5 strict** : le fichier n'utilise que `var`, `function(){}` et la concaténation de chaînes — compatible avec le minifier MediaWiki 1.31.
- **Déballage automatique** : si MediaWiki enrobe le contenu du `<div>` dans un `<p>`, `<pre>` ou `<div>`, le composant en extrait l'HTML intérieur pour éviter un double enrobage dans `fr-card__desc`.
- **Résolution d'URL** : les noms de page wiki sont résolus via `mw.util.getUrl()`, jamais en dur. Les URL absolues et les chemins commençant par `/` sont passés tels quels.
- **Idempotence** : un élément déjà transformé (possède `fr-card` ou `fr-grid-row`) est ignoré lors d'un second appel à `init()`.
- **Ordre de transformation** : les grilles (`.dsfr-card-grid`) sont traitées avant les cartes autonomes (`.dsfr-card`) pour éviter tout conflit si les deux classes coexistent sur un même élément.
