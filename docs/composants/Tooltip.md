# Composant : Infobulle (Tooltip)

**Fichier source :** `wiki-DocDFAED/staging_area/dsfr/components/Tooltip.js`
**Page production :** `MediaWiki:Dsfr/components/Tooltip.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Infobulle](https://www.systeme-de-design.gouv.fr/composants/infobulle)
**Wiki cible :** DocDFAED uniquement

---

## Description

L'infobulle affiche une aide contextuelle courte au survol ou au clic sur un élément déclencheur. Elle est utile pour expliciter un terme technique, un sigle, ou fournir une information complémentaire sans alourdir la mise en page.

Deux variantes sont disponibles :
- **Bouton** (`fr-btn--tooltip`) : l'infobulle apparaît au clic sur un bouton icône.
- **Lien** (`fr-link`) : l'infobulle apparaît au survol ou au focus sur un lien textuel.

---

## Syntaxe Wikitext

Le composant se déclare avec un `<span>` portant la classe `dsfr-tooltip` et des attributs `data-*` :

```html
<span class="dsfr-tooltip"
      data-content="Texte de l'infobulle"
      data-trigger="button"></span>
```

### Tableau des attributs

| Attribut        | Obligatoire | Description                                                                 | Valeur par défaut              |
|-----------------|-------------|-----------------------------------------------------------------------------|--------------------------------|
| `data-content`  | Oui         | Texte affiché dans l'infobulle                                              | —                              |
| `data-trigger`  | Non         | Type de déclencheur : `"button"` (icône info) ou `"link"` (lien texte)     | `"button"`                     |
| `data-label`    | Non         | Texte accessible du bouton (lu par les lecteurs d'écran), ou texte du lien  | `"Informations complémentaires"` (bouton) / `"En savoir plus"` (lien) |
| `data-position` | Non         | Position de l'infobulle : `"top"`, `"bottom"`, `"left"`, `"right"`         | `"top"`                        |
| `data-id`       | Non         | Identifiant HTML unique (généré automatiquement si absent)                  | *(généré)*                     |

---

## Exemples

### Bouton icône (défaut)

```html
<span class="dsfr-tooltip"
      data-content="Le FAED est le Fichier Automatisé des Empreintes Digitales."
      data-trigger="button"></span>
```

**Rendu HTML généré :**

```html
<span class="fr-tooltip-group">
  <button class="fr-btn fr-btn--tooltip" type="button" aria-describedby="fr-tooltip-1">
    <span class="fr-sr-only">Informations complémentaires</span>
  </button>
  <span class="fr-tooltip fr-placement" id="fr-tooltip-1" role="tooltip" aria-hidden="true">
    Le FAED est le Fichier Automatisé des Empreintes Digitales.
  </span>
</span>
```

---

### Bouton icône avec label personnalisé

```html
<span class="dsfr-tooltip"
      data-content="Consulter la documentation ASQ pour les procédures détaillées."
      data-trigger="button"
      data-label="Aide sur l'ASQ"></span>
```

---

### Lien texte (survol et focus)

```html
<span class="dsfr-tooltip"
      data-content="L'OCE désigne l'Officier de la Chaîne d'Expertise."
      data-trigger="link"
      data-label="OCE"></span>
```

**Rendu HTML généré :**

```html
<span class="fr-tooltip-group">
  <a class="fr-link" href="#" aria-describedby="fr-tooltip-2">OCE</a>
  <span class="fr-tooltip fr-placement" id="fr-tooltip-2" role="tooltip" aria-hidden="true">
    L'OCE désigne l'Officier de la Chaîne d'Expertise.
  </span>
</span>
```

---

### Infobulle positionnée en bas

```html
<span class="dsfr-tooltip"
      data-content="Ce champ est obligatoire pour le traitement de la demande."
      data-trigger="button"
      data-position="bottom"></span>
```

---

## Comportement du composant

- **Bouton** : un clic ouvre ou ferme l'infobulle (toggle). Un second clic ou un clic en dehors la referme. La touche `Escape` ferme toutes les infobulles ouvertes.
- **Lien** : l'infobulle s'ouvre au survol (`mouseenter`/`mouseleave`) et au focus clavier (`focus`/`blur`).
- Une seule infobulle peut être visible à la fois (les autres se ferment automatiquement à l'ouverture d'une nouvelle).
- L'affichage visuel (`fr-tooltip--shown`) et l'attribut `aria-hidden` sont synchronisés pour l'accessibilité.
- La transformation est **idempotente** : un élément déjà transformé ne l'est pas une seconde fois.

> **Note :** Le JavaScript DSFR officiel n'est pas chargé sur ce wiki (seul le CSS CDN est utilisé). Le comportement d'affichage est donc entièrement géré par ce composant.

---

## Insertion depuis l'éditeur de page

Dans l'éditeur DSFR, le bouton **"Composants DSFR"** propose deux raccourcis :

| Entrée de menu           | Insère                                         |
|--------------------------|------------------------------------------------|
| Infobulle (bouton icône) | `<span class="dsfr-tooltip" ...>` — variante bouton |
| Infobulle (lien texte)   | `<span class="dsfr-tooltip" ...>` — variante lien   |

Modifiez ensuite `data-content` et les autres attributs selon vos besoins.

---

## Déploiement en production

| Fichier local                                            | Page MediaWiki de production                          |
|----------------------------------------------------------|-------------------------------------------------------|
| `staging_area/dsfr/components/Tooltip.js`               | `MediaWiki:Dsfr/components/Tooltip.js`               |

Pensez aussi à mettre à jour `MediaWiki:Common.js` pour inclure `'components/Tooltip'` dans le tableau `dsfrModules` si ce n'est pas encore fait.

---

## Contraintes techniques

- Code ES5 strict (pas de `const`/`let`/`=>`/backticks) — compatibilité minifier MediaWiki 1.31.
- Le style visuel de l'infobulle (apparence, positionnement) nécessite que le CSS DSFR v1.12.1+ soit chargé.
- Composant disponible sur **DocDFAED uniquement** (non implémenté sur DFAED-NG).
