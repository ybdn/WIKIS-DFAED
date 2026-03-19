# Composant : Fil d'Ariane (Breadcrumb)

**Fichier source :** `shared/dsfr/components/Breadcrumb.js`
**Page production :** `MediaWiki:Dsfr/components/Breadcrumb.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Fil d'Ariane](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/fil-d-ariane)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Navigation contextuelle indiquant la position de la page courante dans l'arborescence du wiki. Le dernier élément représente la page active et est automatiquement marqué `aria-current="page"`. Un bouton "Voir le fil d'Ariane" est injecté pour la navigation sur mobile.

---

## Syntaxe Wikitext

```html
<div class="dsfr-breadcrumb">
  <span class="dsfr-breadcrumb-item"><a href="/Accueil">Accueil</a></span>
  <span class="dsfr-breadcrumb-item"><a href="/Procedures">Procédures</a></span>
  <span class="dsfr-breadcrumb-item">Levée de doute</span>
</div>
```

### Tableau des attributs

| Élément | Obligatoire | Description |
|---------|-------------|-------------|
| `.dsfr-breadcrumb` | Oui | Conteneur du fil d'Ariane |
| `.dsfr-breadcrumb-item` | Oui (min. 1) | Chaque étape du fil ; le dernier est la page courante |
| `<a href="...">` dans un item | Non | Lien vers la page parente ; absent sur le dernier item |

---

## Exemples

### Navigation dans les procédures FAED

```html
<div class="dsfr-breadcrumb">
  <span class="dsfr-breadcrumb-item"><a href="/Accueil">Accueil</a></span>
  <span class="dsfr-breadcrumb-item"><a href="/Procedures_FAED">Procédures FAED</a></span>
  <span class="dsfr-breadcrumb-item"><a href="/Identification">Identification</a></span>
  <span class="dsfr-breadcrumb-item">Protocole empreintes latentes</span>
</div>
```

### Chemin court (deux niveaux)

```html
<div class="dsfr-breadcrumb">
  <span class="dsfr-breadcrumb-item"><a href="/Accueil">Accueil</a></span>
  <span class="dsfr-breadcrumb-item">Guide opérationnel</span>
</div>
```

---

## Structure HTML générée

```html
<nav role="navigation" aria-label="vous êtes ici :" class="fr-breadcrumb">
  <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">
    Voir le fil d'Ariane
  </button>
  <div class="fr-collapse" id="breadcrumb-1">
    <ol class="fr-breadcrumb__list">
      <li><a class="fr-breadcrumb__link" href="/Accueil">Accueil</a></li>
      <li><a class="fr-breadcrumb__link" href="/Procedures">Procédures</a></li>
      <li><a class="fr-breadcrumb__link" aria-current="page">Levée de doute</a></li>
    </ol>
  </div>
</nav>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le dernier `.dsfr-breadcrumb-item` est toujours traité comme la page courante, qu'il contienne ou non un `<a>`.
- Le bouton collapse (responsive mobile) utilise le même mécanisme que l'Accordéon.
- Plusieurs fils d'Ariane sur la même page reçoivent des IDs auto-incrémentés.
