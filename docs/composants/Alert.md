# Composant : Alerte (Alert)

**Fichier source :** `shared/dsfr/components/Alert.js`
**Page production :** `MediaWiki:Dsfr/components/Alert.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Alerte](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/alerte)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Affiche un message contextuel destiné à attirer l'attention de l'utilisateur : information, succès, avertissement ou erreur. Utilisé pour signaler des mises à jour de procédures, des avertissements opérationnels ou des confirmations d'actions.

---

## Syntaxe Wikitext

```html
<div class="dsfr-alert" data-type="info" data-title="Titre de l'alerte">
  Contenu du message d'alerte.
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-type` | Non | Type sémantique : `info`, `success`, `warning`, `error` | `info` |
| `data-title` | Non | Titre affiché en gras au-dessus du message | — |
| `data-closable` | Non | `"true"` → affiche un bouton de fermeture | — |

---

## Exemples

### Alerte informationnelle

```html
<div class="dsfr-alert" data-type="info" data-title="Maintenance planifiée">
  Le système FAED sera indisponible le samedi 22 mars de 22h à 6h du matin.
</div>
```

### Avertissement opérationnel

```html
<div class="dsfr-alert" data-type="warning" data-title="Attention" data-closable="true">
  La procédure de levée de doute a été mise à jour. Vérifier la version en vigueur avant toute soumission.
</div>
```

### Succès

```html
<div class="dsfr-alert" data-type="success" data-title="Dossier validé">
  L'identification a été confirmée et enregistrée dans la base FAED.
</div>
```

### Erreur

```html
<div class="dsfr-alert" data-type="error" data-title="Erreur de saisie">
  Le numéro de dossier renseigné ne correspond à aucune entrée dans le système.
</div>
```

---

## Structure HTML générée

```html
<div class="fr-alert fr-alert--info">
  <h3 class="fr-alert__title">Titre de l'alerte</h3>
  <p>Contenu du message d'alerte.</p>
  <!-- Si data-closable="true" : -->
  <button class="fr-btn--close fr-btn" title="Masquer le message">Masquer le message</button>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le bouton de fermeture supprime l'élément du DOM (pas de persistance côté serveur).
- Sans `data-title`, aucun `<h3>` n'est généré.
