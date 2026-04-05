# Composant : Étiquette (Tag)

**Fichier source :** `wiki-DocDFAED/staging_area/dsfr/components/Tag.js`
**Page production :** `MediaWiki:Dsfr/components/Tag.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Tag](https://www.systeme-de-design.gouv.fr/composants/tag)
**Wiki cible :** DocDFAED uniquement

---

## Description

Le Tag est une étiquette de catégorisation ou de statut. Il est à distinguer du **Badge** (indicateur numérique de notification) : le Tag classifie du contenu, le Badge quantifie.

Cas d'usage typiques : indiquer le statut d'un document, catégoriser une procédure, marquer le niveau d'une formation.

---

## Syntaxe Wikitext

### Tag simple

```html
<span data-dsfr-tag>Étiquette</span>
```

### Tag avec icône

```html
<span data-dsfr-tag data-icon="fr-icon-check-line">Validé</span>
```

### Tag de petite taille

```html
<span data-dsfr-tag data-size="sm">Brouillon</span>
```

### Groupe de tags

```html
<span class="dsfr-tags-group">
  <span data-dsfr-tag data-icon="fr-icon-file-line">Procédure</span>
  <span data-dsfr-tag data-icon="fr-icon-calendar-line">2025</span>
  <span data-dsfr-tag data-size="sm">ASQ</span>
</span>
```

### Tableau des attributs

| Attribut        | Obligatoire | Description                                                      | Valeur par défaut |
|-----------------|-------------|------------------------------------------------------------------|-------------------|
| `data-dsfr-tag` | Oui (présence seule) | Déclare l'élément comme un tag DSFR                | —                 |
| `data-icon`     | Non         | Classe d'icône DSFR affichée à gauche (ex: `fr-icon-check-line`) | *(absent)*        |
| `data-size`     | Non         | `"sm"` pour la variante petite taille (`fr-tag--sm`)             | *(taille normale)*|

---

## Exemples

### Statut d'une procédure

```html
<span data-dsfr-tag data-icon="fr-icon-check-line">En vigueur</span>
<span data-dsfr-tag data-icon="fr-icon-time-line">En révision</span>
<span data-dsfr-tag data-icon="fr-icon-archive-line">Archivé</span>
```

**Rendu HTML généré :**

```html
<p class="fr-tag fr-tag--icon-left fr-icon-check-line">En vigueur</p>
```

### Groupe de catégorisation d'un document

```html
<span class="dsfr-tags-group">
  <span data-dsfr-tag>Procédure</span>
  <span data-dsfr-tag>OCE</span>
  <span data-dsfr-tag data-size="sm">Mise à jour 2025</span>
</span>
```

**Rendu HTML généré :**

```html
<ul class="fr-tags-group">
  <li><p class="fr-tag">Procédure</p></li>
  <li><p class="fr-tag">OCE</p></li>
  <li><p class="fr-tag fr-tag--sm">Mise à jour 2025</p></li>
</ul>
```

---

## Icônes disponibles (exemples utiles)

| Classe DSFR                    | Usage                      |
|--------------------------------|----------------------------|
| `fr-icon-check-line`           | Validé, En vigueur         |
| `fr-icon-time-line`            | En cours, En révision      |
| `fr-icon-archive-line`         | Archivé                    |
| `fr-icon-file-line`            | Document, Procédure        |
| `fr-icon-calendar-line`        | Date, Période              |
| `fr-icon-user-line`            | Auteur, Responsable        |
| `fr-icon-alert-fill`           | Urgent, Attention          |
| `fr-icon-information-line`     | Information                |

---

## Comportement du composant

- Les groupes (`.dsfr-tags-group`) sont traités en premier, puis les tags isolés.
- Un `[data-dsfr-tag]` enfant d'un groupe n'est pas traité individuellement.
- Le composant est **CSS-driven** après la transformation.

---

## Insertion depuis l'éditeur de page

Dans le bouton **"Composants DSFR"** :

| Entrée de menu         | Insère                                  |
|------------------------|-----------------------------------------|
| Tag (simple)           | Tag sans icône                          |
| Tag (avec icône)       | Tag avec icône `fr-icon-check-line`     |
| Groupe de tags         | `dsfr-tags-group` avec 2 tags           |

---

## Déploiement en production

| Fichier local                                    | Page MediaWiki de production              |
|--------------------------------------------------|-------------------------------------------|
| `staging_area/dsfr/components/Tag.js`            | `MediaWiki:Dsfr/components/Tag.js`        |

---

## Contraintes techniques

- Code ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Composant disponible sur **DocDFAED uniquement**.
