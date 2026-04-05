# Composant : Pagination (Pagination)

**Fichier source :** `shared/dsfr/components/Pagination.js`
**Page production :** `MediaWiki:Dsfr/components/Pagination.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Pagination](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/pagination)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Navigation entre les pages d'un résultat paginé. Affiche les boutons Première, Précédente, pages numérotées avec ellipses, Suivante et Dernière. Utilisé pour les listes de résultats de recherche, les journaux d'activité ou tout contenu réparti sur plusieurs pages.

---

## Syntaxe Wikitext

```html
<div class="dsfr-pagination"
     data-current="2"
     data-total="10"
     data-url-pattern="/Special:Recherche?page={page}">
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-current` | Non | Page courante (indexée à partir de 1) | `1` |
| `data-total` | Non | Nombre total de pages | `1` |
| `data-url-pattern` | Non | Patron d'URL avec `{page}` comme placeholder | `?page={page}` |

---

## Exemples

### Pagination de résultats de recherche

```html
<div class="dsfr-pagination"
     data-current="3"
     data-total="15"
     data-url-pattern="/Special:Search?search=empreintes&page={page}">
</div>
```

### Pagination d'un journal d'activité

```html
<div class="dsfr-pagination"
     data-current="1"
     data-total="8"
     data-url-pattern="/Journal_activité?p={page}">
</div>
```

### Pagination sur une page wiki avec section

```html
<div class="dsfr-pagination"
     data-current="2"
     data-total="5"
     data-url-pattern="/Liste_dossiers?offset={page}">
</div>
```

---

## Structure HTML générée

```html
<nav role="navigation" aria-label="Pagination" class="fr-pagination">
  <ul class="fr-pagination__list">
    <li>
      <a class="fr-pagination__link fr-pagination__link--first"
         aria-label="Première page" href="/Special:Search?page=1"></a>
    </li>
    <li>
      <a class="fr-pagination__link fr-pagination__link--prev"
         aria-label="Page précédente" href="/Special:Search?page=2"></a>
    </li>
    <li>
      <a class="fr-pagination__link" aria-label="Page 1" href="/Special:Search?page=1">1</a>
    </li>
    <li>
      <a class="fr-pagination__link fr-pagination__link--active"
         aria-current="page" aria-label="Page 3" href="#">3</a>
    </li>
    <!-- ... -->
    <li>
      <a class="fr-pagination__link fr-pagination__link--next"
         aria-label="Page suivante" href="/Special:Search?page=4"></a>
    </li>
    <li>
      <a class="fr-pagination__link fr-pagination__link--last"
         aria-label="Dernière page" href="/Special:Search?page=15"></a>
    </li>
  </ul>
</nav>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- La fenêtre de pages affichées de chaque côté de la page courante est de 2 (configurable via `window.DsfrPagination.render()` en programmatique).
- Des ellipses (`...`) sont insérées automatiquement lorsque la plage de pages ne couvre pas les extrémités.
- Le composant expose `window.DsfrPagination.render(options)` pour un usage programmatique.
