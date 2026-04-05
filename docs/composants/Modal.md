# Composant : Modale (Modal)

**Fichier source :** `shared/dsfr/components/Modal.js`
**Page production :** `MediaWiki:Dsfr/components/Modal.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Modale](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/modale)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Fenêtre de dialogue modale superposée à la page, bloquant l'interaction avec le reste du contenu jusqu'à sa fermeture. Utilisée pour afficher des confirmations, des détails complémentaires ou des formulaires sans quitter la page courante. Le JS DSFR officiel n'étant pas chargé, le comportement est géré par un polyfill.

---

## Syntaxe Wikitext

La modale nécessite deux éléments distincts : un déclencheur et la boîte de dialogue.

### Déclencheur

```html
<span class="dsfr-modal-trigger" data-target="mon-modal">Ouvrir la modale</span>
```

### Boîte de dialogue

```html
<div class="dsfr-modal-dialog" id="mon-modal">
  <div class="dsfr-modal-title">Titre de la modale</div>
  <div class="dsfr-modal-content">Contenu de la modale...</div>
</div>
```

### Tableau des attributs — déclencheur

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-target` | Oui | ID de la `.dsfr-modal-dialog` à ouvrir | — |
| `data-variant` | Non | Variante du bouton : `primary`, `secondary`, `tertiary` | `primary` |

### Tableau des attributs — boîte de dialogue

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `id` | Oui | Identifiant unique ciblé par le déclencheur | — |
| `.dsfr-modal-title` | Non | Titre affiché en `<h1>` dans la modale | — |
| `.dsfr-modal-content` | Non | Contenu de la modale | — |
| `data-size` | Non | `"lg"` → modale plus large (10 colonnes au lieu de 6) | `6 colonnes` |

---

## Exemples

### Confirmation avant action

```html
<span class="dsfr-modal-trigger" data-target="modal-confirmation">
  Soumettre l'identification
</span>

<div class="dsfr-modal-dialog" id="modal-confirmation">
  <div class="dsfr-modal-title">Confirmer la soumission</div>
  <div class="dsfr-modal-content">
    Vous allez soumettre ce dossier d'identification à la base FAED.
    Cette action est irréversible. Confirmez-vous la soumission ?
  </div>
</div>
```

### Modale large avec détails

```html
<span class="dsfr-modal-trigger" data-target="modal-detail" data-variant="secondary">
  Voir les détails techniques
</span>

<div class="dsfr-modal-dialog" id="modal-detail" data-size="lg">
  <div class="dsfr-modal-title">Détails de l'empreinte</div>
  <div class="dsfr-modal-content">
    <!-- Contenu étendu : tableau, images, etc. -->
  </div>
</div>
```

---

## Structure HTML générée

```html
<button class="fr-btn" data-dsfr-modal-open="mon-modal" aria-haspopup="dialog">
  Ouvrir la modale
</button>

<dialog id="mon-modal" aria-labelledby="mon-modal-title" role="dialog" class="fr-modal">
  <div class="fr-container fr-container--fluid fr-container-md">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
        <div class="fr-modal__body">
          <div class="fr-modal__header">
            <button class="fr-link--close fr-link" title="Fermer la fenêtre modale"
                    data-dsfr-modal-close="mon-modal">Fermer</button>
          </div>
          <div class="fr-modal__content">
            <h1 id="mon-modal-title" class="fr-modal__title">Titre de la modale</h1>
            Contenu de la modale...
          </div>
        </div>
      </div>
    </div>
  </div>
</dialog>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le JS DSFR officiel n'est pas chargé : l'ouverture/fermeture est gérée par polyfill via les classes `fr-modal--opened` et `fr-no-scroll`.
- Fermeture possible par : bouton "Fermer", clic sur le fond de la modale, ou touche Échap.
- Focus automatique sur le premier élément focusable à l'ouverture.
- L'`id` sur `.dsfr-modal-dialog` doit être unique sur la page.
