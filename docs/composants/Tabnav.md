# Composant : Navigation tertiaire (Tabnav)

**Fichier source :** `shared/dsfr/components/Tabnav.js`
**Page production :** `MediaWiki:Dsfr/components/Tabnav.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Navigation secondaire](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/navigation-secondaire)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Navigation tertiaire sous forme d'onglets de navigation entre plusieurs pages (liens `<a href>`). Différent du composant Tab : Tabnav génère des liens inter-pages, tandis que Tab affiche des panneaux de contenu inline sur la même page. Utilisé pour structurer une section du wiki en sous-pages accessibles via des onglets.

---

## Syntaxe Wikitext

```html
<div class="dsfr-tabnav" data-label="Navigation de section">
  <ul>
    <li class="current"><a href="/Page_active">Page active</a></li>
    <li><a href="/Autre_page">Autre page</a></li>
    <li><a href="/Troisième_page">Troisième page</a></li>
  </ul>
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Non | `aria-label` sur la liste de navigation | `Navigation` |
| `class="current"` sur `<li>` | Non | Marque l'onglet actif (`aria-selected="true"`) | — |

---

## Exemples

### Navigation entre pages de procédures

```html
<div class="dsfr-tabnav" data-label="Procédures d'identification">
  <ul>
    <li class="current"><a href="/Identification_digitale">Empreintes digitales</a></li>
    <li><a href="/Identification_palmaire">Empreintes palmaires</a></li>
    <li><a href="/Identification_chaussure">Traces de chaussures</a></li>
  </ul>
</div>
```

### Navigation dans la documentation technique

```html
<div class="dsfr-tabnav" data-label="Documentation FAED">
  <ul>
    <li><a href="/Doc_FAED_introduction">Introduction</a></li>
    <li><a href="/Doc_FAED_saisie">Saisie</a></li>
    <li class="current"><a href="/Doc_FAED_traitement">Traitement</a></li>
    <li><a href="/Doc_FAED_archivage">Archivage</a></li>
  </ul>
</div>
```

---

## Structure HTML générée

```html
<div class="fr-tabs">
  <ul class="fr-tabs__list" role="tablist" aria-label="Procédures d'identification">
    <li role="presentation">
      <a class="fr-tabs__tab" href="/Identification_digitale"
         aria-selected="true" tabindex="0">
        Empreintes digitales
      </a>
    </li>
    <li role="presentation">
      <a class="fr-tabs__tab" href="/Identification_palmaire"
         aria-selected="false" tabindex="-1">
        Empreintes palmaires
      </a>
    </li>
  </ul>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Tabnav génère uniquement des liens inter-pages. Pour des panneaux de contenu inline, utiliser le composant **Tab**.
- L'onglet actif (`class="current"` sur `<li>`) reçoit `aria-selected="true"` et `tabindex="0"` ; les autres reçoivent `aria-selected="false"` et `tabindex="-1"`.
- Aucun comportement JavaScript de changement d'onglet n'est géré : la navigation se fait par rechargement de page.
