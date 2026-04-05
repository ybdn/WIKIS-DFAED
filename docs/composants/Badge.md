# Composant : Badge (Badge)

**Fichier source :** `shared/dsfr/components/Badge.js`
**Page production :** `MediaWiki:Dsfr/components/Badge.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Badge](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/badge)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Étiquette courte affichant un statut ou une information contextuelle (état d'un dossier, niveau de priorité, catégorie). Distinct du composant Tag : le badge est sémantique et peut porter une icône. À utiliser pour qualifier des éléments de liste, des entrées de tableau ou des titres de section.

---

## Syntaxe Wikitext

```html
<span data-dsfr-badge="success">Identifié</span>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-dsfr-badge` | Oui | Type sémantique : `success`, `error`, `info`, `warning`, `new` — ou nom de couleur DSFR (`green-menthe`, etc.) | — |
| `data-dsfr-sm` | Non | Présence de l'attribut → taille réduite | — |
| `data-dsfr-no-icon` | Non | Présence de l'attribut → icône masquée | — |

---

## Exemples

### Statuts de dossier

```html
<span data-dsfr-badge="success">Identifié</span>
<span data-dsfr-badge="error">Rejeté</span>
<span data-dsfr-badge="warning">En attente</span>
<span data-dsfr-badge="info">En cours</span>
<span data-dsfr-badge="new">Nouveau</span>
```

### Badge petit format

```html
<span data-dsfr-badge="info" data-dsfr-sm>Mise à jour</span>
```

### Badge sans icône

```html
<span data-dsfr-badge="success" data-dsfr-no-icon>Validé</span>
```

### Badge couleur personnalisée

```html
<span data-dsfr-badge="green-menthe">Priorité basse</span>
```

---

## Structure HTML générée

```html
<p class="fr-badge fr-badge--success">Identifié</p>
<!-- Avec taille réduite : -->
<p class="fr-badge fr-badge--info fr-badge--sm">Mise à jour</p>
<!-- Sans icône : -->
<p class="fr-badge fr-badge--success fr-badge--no-icon">Validé</p>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Les types sémantiques (`success`, `error`, `info`, `warning`, `new`) affichent automatiquement une icône DSFR.
- Le composant expose aussi `window.DsfrBadge.render(options)` pour un usage programmatique depuis d'autres scripts.
