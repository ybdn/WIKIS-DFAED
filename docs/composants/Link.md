# Composant : Lien (Link)

**Fichier source :** `shared/dsfr/components/Link.js`
**Page production :** `MediaWiki:Dsfr/components/Link.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Lien](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/lien)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Lien stylisé DSFR avec icône automatique selon le type : lien externe (nouvelle fenêtre), lien de téléchargement ou lien de retour. L'icône et les attributs d'accessibilité (`target`, `rel`) sont appliqués automatiquement selon le type déclaré.

---

## Syntaxe Wikitext

```html
<span class="dsfr-link" data-type="external" data-href="https://...">Texte du lien</span>
```

Peut aussi être utilisé directement sur un `<a>` existant :

```html
<a class="dsfr-link" data-type="download" href="/Fichier:Guide.pdf">Télécharger le guide</a>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-type` | Oui | Type de lien : `external`, `download`, `back` | `external` |
| `data-href` | Non (si déjà `href` sur `<a>`) | URL cible | — |
| `data-size` | Non | Taille : `sm`, `lg` | — |

### Comportements par type

| Type | Icône | Position | `target` | `rel` |
|------|-------|----------|----------|-------|
| `external` | `fr-icon-external-link-line` | droite | `_blank` | `noopener noreferrer` |
| `download` | `fr-icon-download-line` | droite | — | — |
| `back` | `fr-icon-arrow-left-line` | gauche | — | — |

---

## Exemples

### Lien externe vers une ressource nationale

```html
<span class="dsfr-link" data-type="external" data-href="https://www.service-public.fr">
  Consulter Service-Public.fr
</span>
```

### Lien de téléchargement d'un document

```html
<span class="dsfr-link" data-type="download" data-href="/Fichier:Procédure_FAED_2026.pdf">
  Télécharger la procédure (PDF)
</span>
```

### Lien de retour

```html
<span class="dsfr-link" data-type="back" data-href="/Procédures_identification">
  Retour aux procédures d'identification
</span>
```

### Lien petit format

```html
<span class="dsfr-link" data-type="external" data-href="https://..." data-size="sm">
  Voir la source
</span>
```

---

## Structure HTML générée

```html
<!-- Lien externe -->
<a class="fr-link fr-icon-external-link-line fr-link--icon-right"
   href="https://www.service-public.fr"
   target="_blank" rel="noopener noreferrer">
  Consulter Service-Public.fr
</a>

<!-- Lien de téléchargement -->
<a class="fr-link fr-icon-download-line fr-link--icon-right"
   href="/Fichier:Procédure_FAED_2026.pdf">
  Télécharger la procédure (PDF)
</a>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Pour un lien de téléchargement vers un fichier MediaWiki, utiliser `mw.util.getUrl('Fichier:NomDuFichier')` dans un script si l'URL doit être dynamique.
- Si l'élément est déjà un `<a>`, son `href` est utilisé en priorité sur `data-href`.
