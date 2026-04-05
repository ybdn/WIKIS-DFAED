# Composant : Interrupteur (Toggle)

**Fichier source :** `shared/dsfr/components/Toggle.js`
**Page production :** `MediaWiki:Dsfr/components/Toggle.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Interrupteur](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/interrupteur)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Interrupteur à bascule (on/off) basé sur un `<input type="checkbox">`. Utilisé pour activer ou désactiver une option dans un formulaire ou un panneau de configuration. Le texte de l'état (activé/désactivé) se met à jour automatiquement sans rechargement. Le JS DSFR officiel n'étant pas chargé, la mise à jour du hint est gérée par polyfill.

---

## Syntaxe Wikitext

```html
<div class="dsfr-toggle" data-label="Activer les notifications"></div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Oui | Label principal de l'interrupteur | texte interne de l'élément ou `Interrupteur` |
| `data-checked` | Non | Présence de l'attribut → activé par défaut | — |
| `data-disabled` | Non | Présence de l'attribut → désactivé | — |
| `data-label-on` | Non | Texte affiché quand l'interrupteur est activé | — |
| `data-label-off` | Non | Texte affiché quand l'interrupteur est désactivé | — |

---

## Exemples

### Interrupteur simple

```html
<div class="dsfr-toggle" data-label="Activer le mode étendu"></div>
```

### Interrupteur activé par défaut avec libellés d'état

```html
<div class="dsfr-toggle"
     data-label="Afficher les dossiers archivés"
     data-checked
     data-label-on="Affiché"
     data-label-off="Masqué">
</div>
```

### Interrupteur désactivé

```html
<div class="dsfr-toggle"
     data-label="Accès administrateur"
     data-disabled>
</div>
```

### Plusieurs interrupteurs

```html
<div class="dsfr-toggle"
     data-label="Notifications par mail"
     data-label-on="Activées"
     data-label-off="Désactivées">
</div>
<div class="dsfr-toggle"
     data-label="Rappels hebdomadaires"
     data-checked
     data-label-on="Activés"
     data-label-off="Désactivés">
</div>
```

---

## Structure HTML générée

```html
<div class="fr-toggle">
  <input type="checkbox" class="fr-toggle__input" id="dsfr-toggle-1"
         aria-describedby="dsfr-toggle-1-hint">
  <label class="fr-toggle__label" for="dsfr-toggle-1"
         data-fr-checked-label="Affiché"
         data-fr-unchecked-label="Masqué">
    Afficher les dossiers archivés
  </label>
  <p class="fr-hint-text" id="dsfr-toggle-1-hint">Masqué</p>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le JS DSFR officiel n'est pas chargé : la mise à jour du hint au changement d'état est gérée par un écouteur `change` sur `.fr-toggle__input`.
- Sans `data-label-on`/`data-label-off`, le hint reste vide.
- Pour réagir au changement d'état depuis d'autres scripts, écouter l'événement `change` sur l'`<input type="checkbox">` généré (identifiable par son ID `dsfr-toggle-N`).
