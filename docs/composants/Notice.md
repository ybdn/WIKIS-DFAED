# Composant : Bandeau d'information (Notice)

**Fichier source :** `shared/dsfr/components/Notice.js`
**Page production :** `MediaWiki:Dsfr/components/Notice.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Bandeau d'information importante](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/bandeau-d-information-importante)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Bandeau pleine largeur destiné à afficher un message d'information important visible immédiatement par l'utilisateur. Similaire à l'alerte mais présenté sous forme de ruban horizontal. Utilisé pour les annonces de maintenance, les nouvelles procédures en vigueur ou les mises en garde générales.

---

## Syntaxe Wikitext

```html
<div class="dsfr-notice" data-type="info" data-title="Titre important">
  Message du bandeau d'information.
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-type` | Non | Type : `info`, `warning`, `alert` | `info` |
| `data-title` | Non | Titre affiché en gras avant le message | — |
| `data-closable` | Non | `"true"` → affiche un bouton de fermeture | — |

---

## Exemples

### Annonce de maintenance

```html
<div class="dsfr-notice" data-type="warning" data-title="Maintenance" data-closable="true">
  La base FAED sera en maintenance le vendredi 28 mars de 20h à minuit.
</div>
```

### Information générale

```html
<div class="dsfr-notice" data-type="info" data-title="Nouvelle procédure">
  La procédure de traitement des empreintes palmaires a été mise à jour. Version 3.2 en vigueur depuis le 1er mars 2026.
</div>
```

### Alerte urgente

```html
<div class="dsfr-notice" data-type="alert">
  Incident en cours sur le système de reconnaissance automatique. Contacter le support technique.
</div>
```

---

## Structure HTML générée

```html
<div class="fr-notice fr-notice--warning">
  <div class="fr-container">
    <div class="fr-notice__body">
      <p>
        <span class="fr-notice__title">Maintenance : </span>
        <span>La base FAED sera en maintenance le vendredi 28 mars...</span>
      </p>
      <!-- Si data-closable="true" : -->
      <button class="fr-btn--close fr-btn" title="Masquer le message">Masquer le message</button>
    </div>
  </div>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le bouton de fermeture supprime l'élément du DOM (sans persistance).
- Contrairement à l'Alert, le Notice est conçu pour s'afficher en pleine largeur, idéalement en haut de page ou de section.
- Le titre est suivi automatiquement de ` : ` si présent.
