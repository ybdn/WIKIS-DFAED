# Composant : Partage (Share)

**Fichier source :** `shared/dsfr/components/Share.js`
**Page production :** `MediaWiki:Dsfr/components/Share.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Partage](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/partage)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Bloc de partage adapté au contexte intranet : les réseaux sociaux sont remplacés par des options internes (envoi par mail, copie du lien, impression). L'URL et le titre de la page courante sont récupérés automatiquement via `window.location.href` et `document.title`.

---

## Syntaxe Wikitext

```html
<div class="dsfr-share" data-email data-copy data-print></div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-title` | Non | Titre affiché au-dessus des boutons | `Partager la page` |
| `data-email` | Non | Présence de l'attribut → affiche le bouton "Envoyer par mail" | — |
| `data-copy` | Non | Présence de l'attribut → affiche le bouton "Copier le lien" | — |
| `data-print` | Non | Présence de l'attribut → affiche le bouton "Imprimer" | — |

---

## Exemples

### Partage complet

```html
<div class="dsfr-share"
     data-title="Partager cette procédure"
     data-email
     data-copy
     data-print>
</div>
```

### Copie du lien seulement

```html
<div class="dsfr-share" data-copy></div>
```

### Mail et impression, titre personnalisé

```html
<div class="dsfr-share"
     data-title="Diffuser ce guide"
     data-email
     data-print>
</div>
```

---

## Structure HTML générée

```html
<div class="fr-share">
  <p class="fr-share__title">Partager cette procédure</p>
  <ul class="fr-btns-group">
    <li>
      <a class="fr-btn fr-btn--tertiary-no-outline fr-icon-mail-line fr-btn--icon-left"
         href="mailto:?subject=Titre%20de%20la%20page&body=https%3A%2F%2F...">
        Envoyer par mail
      </a>
    </li>
    <li>
      <button class="fr-btn fr-btn--tertiary-no-outline fr-icon-links-fill fr-btn--icon-left"
              data-dsfr-copy-url="https://...">
        Copier le lien
      </button>
    </li>
    <li>
      <button class="fr-btn fr-btn--tertiary-no-outline fr-icon-printer-line fr-btn--icon-left"
              data-dsfr-print="true">
        Imprimer
      </button>
    </li>
  </ul>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le bouton "Copier le lien" utilise `navigator.clipboard.writeText()` avec fallback `execCommand('copy')` pour les navigateurs sans support de l'API Clipboard.
- Après copie, le libellé du bouton change temporairement en "Lien copié !" pendant 2 secondes.
- Le lien mailto encode automatiquement le titre et l'URL de la page.
- Sans aucun attribut `data-email`, `data-copy`, `data-print`, le bloc est généré vide.
