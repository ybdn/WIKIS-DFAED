# Composant : Menu latéral (Sidemenu)

**Fichier source :** `shared/dsfr/components/Sidemenu.js`
**Page production :** `MediaWiki:Dsfr/components/Sidemenu.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Menu latéral](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/menu-lateral)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Navigation secondaire latérale avec support des sous-menus imbriqués et indication de la page active. Idéal pour structurer la navigation au sein d'une section du wiki (procédures, guides, documentation thématique). La page courante est marquée automatiquement via la classe `current`. Supporte le mode sticky pleine hauteur.

---

## Syntaxe Wikitext

```html
<div class="dsfr-sidemenu">
  <div class="dsfr-sidemenu-title">Dans cette rubrique</div>
  <ul>
    <li><a href="/Accueil_procédures">Accueil</a></li>
    <li><a href="/Identification" class="current">Identification</a></li>
    <li class="active">
      <span class="dsfr-sidemenu-group">Empreintes</span>
      <ul>
        <li><a href="/Empreintes_digitales">Empreintes digitales</a></li>
        <li><a href="/Empreintes_palmaires">Empreintes palmaires</a></li>
      </ul>
    </li>
  </ul>
</div>
```

### Tableau des attributs

| Élément / Attribut | Obligatoire | Description |
|--------------------|-------------|-------------|
| `.dsfr-sidemenu-title` | Non | Titre affiché en haut du menu (desktop) |
| `<ul>` direct enfant | Oui | Liste des éléments de navigation |
| `class="current"` sur `<a>` | Non | Marque le lien comme page active (`aria-current="page"`) |
| `class="active"` sur `<li>` | Non | Déplie automatiquement le sous-menu parent |
| `.dsfr-sidemenu-group` dans `<li>` | Non | Label d'un groupe avec sous-menu (alternative à un `<a>`) |
| `data-sticky` sur `.dsfr-sidemenu` | Non | Présence de l'attribut → `fr-sidemenu--sticky-full-height` |

---

## Exemples

### Menu simple pour section procédures

```html
<div class="dsfr-sidemenu">
  <div class="dsfr-sidemenu-title">Procédures FAED</div>
  <ul>
    <li><a href="/Procédures_FAED">Vue d'ensemble</a></li>
    <li><a href="/Procédure_saisie" class="current">Procédure de saisie</a></li>
    <li><a href="/Procédure_identification">Procédure d'identification</a></li>
    <li><a href="/Procédure_archivage">Archivage</a></li>
  </ul>
</div>
```

### Menu avec sous-menu et mode sticky

```html
<div class="dsfr-sidemenu" data-sticky>
  <div class="dsfr-sidemenu-title">Documentation technique</div>
  <ul>
    <li><a href="/Documentation">Introduction</a></li>
    <li class="active">
      <span class="dsfr-sidemenu-group">Bases de données</span>
      <ul>
        <li><a href="/Base_FAED" class="current">Base FAED</a></li>
        <li><a href="/Base_FNAEG">Base FNAEG</a></li>
      </ul>
    </li>
    <li><a href="/Glossaire">Glossaire</a></li>
  </ul>
</div>
```

---

## Structure HTML générée

```html
<nav class="fr-sidemenu" aria-labelledby="fr-sidemenu-title-1">
  <div class="fr-sidemenu__inner">
    <button class="fr-sidemenu__btn" hidden aria-controls="fr-sidemenu-wrapper-1" aria-expanded="false">
      Dans cette rubrique
    </button>
    <div class="fr-collapse" id="fr-sidemenu-wrapper-1">
      <p class="fr-sidemenu__title" id="fr-sidemenu-title-1">Dans cette rubrique</p>
      <ul class="fr-sidemenu__list">
        <li class="fr-sidemenu__item">
          <a class="fr-sidemenu__link" href="/Accueil_procédures" target="_self">Accueil</a>
        </li>
        <li class="fr-sidemenu__item">
          <a class="fr-sidemenu__link" href="/Identification"
             target="_self" aria-current="page">Identification</a>
        </li>
        <!-- Sous-menu : -->
        <li class="fr-sidemenu__item fr-sidemenu__item--active">
          <button class="fr-sidemenu__btn" aria-expanded="true"
                  aria-controls="fr-sidemenu-wrapper-1-sub-1">Empreintes</button>
          <div class="fr-collapse fr-collapse--expanded" id="fr-sidemenu-wrapper-1-sub-1">
            <ul class="fr-sidemenu__list">
              <li class="fr-sidemenu__item">
                <a class="fr-sidemenu__link" href="/Empreintes_digitales" target="_self">
                  Empreintes digitales
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- La construction des sous-menus est récursive : plusieurs niveaux d'imbrication sont supportés.
- Un `<li>` est considéré actif (sous-menu déplié) si : il a la classe `active`, la classe `fr-sidemenu__item--active`, ou s'il contient un `<a class="current">`.
- Le bouton mobile est masqué par défaut (`hidden`) et s'affiche via le CSS DSFR en dessous du breakpoint `md`.
