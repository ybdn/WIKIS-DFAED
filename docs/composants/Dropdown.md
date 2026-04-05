# Composant : Menu déroulant (Dropdown)

**Fichier source :** `shared/dsfr/components/Dropdown.js`
**Page production :** `MediaWiki:Dsfr/components/Dropdown.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Menu déroulant](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/menu-deroulant)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Bouton ouvrant un menu contextuel avec une liste de liens ou d'actions. Utile pour regrouper plusieurs actions ou navigations secondaires sous un bouton unique. Le menu se ferme automatiquement lors d'un clic en dehors ou par la touche Échap.

---

## Syntaxe Wikitext

```html
<div class="dsfr-dropdown" data-label="Actions">
  <ul>
    <li><a href="url">Option 1</a></li>
    <li><a href="url">Option 2</a></li>
  </ul>
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Oui | Libellé du bouton déclencheur | `Menu` |
| `data-icon` | Non | Classe d'icône DSFR supplémentaire sur le bouton | — |
| `data-size` | Non | Taille du bouton : `sm`, `lg` | — |
| `data-kind` | Non | Variante du bouton : `secondary`, `tertiary`, `tertiary-no-outline` | primaire |

---

## Exemples

### Menu d'actions sur un dossier

```html
<div class="dsfr-dropdown" data-label="Actions sur le dossier">
  <ul>
    <li><a href="/Consulter_dossier">Consulter</a></li>
    <li><a href="/Modifier_dossier">Modifier</a></li>
    <li><a href="/Archiver_dossier">Archiver</a></li>
  </ul>
</div>
```

### Menu secondaire petit format

```html
<div class="dsfr-dropdown" data-label="Plus d'options" data-kind="secondary" data-size="sm">
  <ul>
    <li><a href="/Exporter">Exporter en PDF</a></li>
    <li><a href="/Imprimer">Imprimer</a></li>
  </ul>
</div>
```

---

## Structure HTML générée

```html
<div class="fr-menu">
  <button class="fr-btn fr-icon-arrow-down-s-line fr-btn--icon-right"
          aria-expanded="false"
          aria-controls="dropdown-menu-1">
    Actions sur le dossier
  </button>
  <div class="fr-collapse fr-menu" id="dropdown-menu-1" role="navigation">
    <ul class="fr-menu__list">
      <li><a class="fr-nav__link" href="/Consulter_dossier">Consulter</a></li>
      <li><a class="fr-nav__link" href="/Modifier_dossier">Modifier</a></li>
      <li><a class="fr-nav__link" href="/Archiver_dossier">Archiver</a></li>
    </ul>
  </div>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- La flèche `fr-icon-arrow-down-s-line` est toujours ajoutée au bouton déclencheur.
- Un seul dropdown peut être ouvert à la fois : l'ouverture d'un nouveau ferme les autres.
- Fermeture par clic extérieur et par touche Échap.
