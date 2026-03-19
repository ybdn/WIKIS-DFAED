# Composant : Citation (Quote)

**Fichier source :** `shared/dsfr/components/Quote.js`
**Page production :** `MediaWiki:Dsfr/components/Quote.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Citation](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/citation)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Bloc de citation DSFR comprenant le texte cité, l'auteur, des sources bibliographiques, un lien et une image optionnelle. Utilisé pour citer des textes réglementaires, des extraits de rapports officiels ou des références jurisprudentielles dans les pages du wiki.

---

## Syntaxe Wikitext

```html
<div class="dsfr-quote">
  <div class="dsfr-quote-text">« Le texte de la citation »</div>
  <div class="dsfr-quote-author">Nom de l'auteur</div>
  <div class="dsfr-quote-source">Titre de l'ouvrage ou du texte</div>
</div>
```

### Tableau des attributs — conteneur

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-column` | Non | `"true"` → disposition en colonne (`fr-quote--column`) | — |
| `data-size` | Non | Taille du texte : `sm`, `lg` | — |
| `data-cite` | Non | URL de la source pour l'attribut HTML `cite` | — |

### Éléments internes

| Élément | Obligatoire | Description |
|---------|-------------|-------------|
| `.dsfr-quote-text` | Oui | Texte de la citation (dans `<blockquote>`) |
| `.dsfr-quote-author` | Non | Nom de l'auteur |
| `.dsfr-quote-source` | Non | Source(s) — le premier est encadré dans `<cite>`, les suivants en texte libre (répétable) |
| `.dsfr-quote-link` + `data-href` | Non | Lien vers la source |
| `.dsfr-quote-image` + `data-src` | Non | Image illustrative (portrait de l'auteur, logo) |

---

## Exemples

### Citation réglementaire

```html
<div class="dsfr-quote" data-cite="https://www.legifrance.gouv.fr/...">
  <div class="dsfr-quote-text">
    « Toute demande de consultation du fichier automatisé des empreintes digitales doit être
    motivée par la nécessité d'une enquête judiciaire en cours. »
  </div>
  <div class="dsfr-quote-author">Code de procédure pénale</div>
  <div class="dsfr-quote-source">Article 706-54</div>
  <div class="dsfr-quote-source">Version consolidée au 1er janvier 2026</div>
</div>
```

### Citation avec lien

```html
<div class="dsfr-quote">
  <div class="dsfr-quote-text">
    « L'identification par empreintes digitales constitue une preuve médico-légale recevable
    devant toute juridiction française. »
  </div>
  <div class="dsfr-quote-author">Institut National de Police Scientifique</div>
  <div class="dsfr-quote-source">Guide de dactyloscopie opérationnelle, 2025</div>
  <div class="dsfr-quote-link" data-href="/Fichier:Guide_dactyloscopie_2025.pdf">
    Consulter le guide complet
  </div>
</div>
```

### Citation en disposition colonne

```html
<div class="dsfr-quote" data-column="true" data-size="lg">
  <div class="dsfr-quote-text">
    « La qualité de l'empreinte latente conditionne la fiabilité de toute identification. »
  </div>
  <div class="dsfr-quote-author">Chef du département DFAED</div>
</div>
```

---

## Structure HTML générée

```html
<figure class="fr-quote">
  <blockquote cite="https://www.legifrance.gouv.fr/...">
    <p>« Toute demande de consultation... »</p>
  </blockquote>
  <figcaption>
    <p class="fr-quote__author">Code de procédure pénale</p>
    <ul class="fr-quote__source">
      <li><cite>Article 706-54</cite></li>
      <li>Version consolidée au 1er janvier 2026</li>
    </ul>
  </figcaption>
</figure>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le premier `.dsfr-quote-source` est automatiquement encadré dans `<cite>` ; les suivants sont en texte brut.
- Le contenu des éléments est désencapsulé si MediaWiki les a entourés de `<p>`, `<pre>`, `<code>` ou `<span>`.
