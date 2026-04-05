# Composant : Onglets (Tab)

**Fichier source :** `wiki-DocDFAED/staging_area/dsfr/components/Tab.js`
**Page production :** `MediaWiki:Dsfr/components/Tab.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Onglet](https://www.systeme-de-design.gouv.fr/composants/onglet)
**Wiki cible :** DocDFAED uniquement

---

## Description

Les onglets permettent d'organiser le contenu d'une page en plusieurs panneaux accessibles via une barre de navigation horizontale. Ils sont utiles pour structurer des pages longues ou multi-thématiques (ex : procédure ASQ avec les phases Saisie / Validation / Archivage).

---

## Syntaxe Wikitext

```html
<div class="dsfr-tabs">
  <div class="dsfr-tab" data-title="Saisie">Contenu de l'onglet Saisie</div>
  <div class="dsfr-tab" data-title="Validation">Contenu de l'onglet Validation</div>
  <div class="dsfr-tab" data-title="Archivage">Contenu de l'onglet Archivage</div>
</div>
```

Le contenu de chaque `.dsfr-tab` accepte du HTML complet : textes, listes, tableaux, autres composants DSFR, etc.

### Tableau des attributs

**Sur le conteneur `.dsfr-tabs` :**

| Attribut      | Obligatoire | Description                                           | Valeur par défaut  |
|---------------|-------------|-------------------------------------------------------|--------------------|
| `data-label`  | Non         | `aria-label` de la liste d'onglets (accessibilité)    | `"Onglets"`        |
| `data-active` | Non         | Index (1-basé) de l'onglet ouvert par défaut          | `1` (premier)      |

**Sur chaque `.dsfr-tab` :**

| Attribut      | Obligatoire | Description                                           | Valeur par défaut    |
|---------------|-------------|-------------------------------------------------------|----------------------|
| `data-title`  | Oui         | Titre affiché dans l'onglet                           | `"Onglet N"`         |
| `data-icon`   | Non         | Classe d'icône DSFR (ex: `"fr-icon-file-line"`)       | *(absent)*           |

---

## Exemples

### Onglets simples

```html
<div class="dsfr-tabs" data-label="Phases de la procédure ASQ">
  <div class="dsfr-tab" data-title="Saisie">
    === Saisie des données ===
    Instructions pour la saisie...
  </div>
  <div class="dsfr-tab" data-title="Validation">
    === Validation ===
    Instructions pour la validation...
  </div>
</div>
```

### Onglets avec icônes

```html
<div class="dsfr-tabs">
  <div class="dsfr-tab" data-title="Documents" data-icon="fr-icon-file-line">...</div>
  <div class="dsfr-tab" data-title="Contacts"  data-icon="fr-icon-user-line">...</div>
</div>
```

### Deuxième onglet ouvert par défaut

```html
<div class="dsfr-tabs" data-active="2">
  <div class="dsfr-tab" data-title="Onglet 1">...</div>
  <div class="dsfr-tab" data-title="Onglet 2">Cet onglet est ouvert.</div>
</div>
```

**Rendu HTML généré (extrait) :**

```html
<div class="fr-tabs" data-dsfr-transformed="true">
  <ul class="fr-tabs__list" role="tablist" aria-label="Onglets">
    <li role="presentation">
      <button class="fr-tabs__tab" id="tab-1-0" tabindex="0"
              role="tab" aria-selected="true" aria-controls="tab-panel-1-0">
        Saisie
      </button>
    </li>
    ...
  </ul>
  <div class="fr-tabs__panel fr-tabs__panel--selected" id="tab-panel-1-0"
       role="tabpanel" tabindex="0" aria-labelledby="tab-1-0">
    Contenu de l'onglet Saisie
  </div>
  ...
</div>
```

---

## Comportement du composant

- Un clic sur un onglet affiche son panneau et masque les autres.
- La navigation clavier est supportée : `←` / `→` pour passer d'un onglet à l'autre.
- Les attributs ARIA (`aria-selected`, `aria-controls`, `aria-labelledby`) sont synchronisés.
- Le JS DSFR officiel n'est pas chargé sur ce wiki — le comportement est entièrement géré par ce composant.

---

## Insertion depuis l'éditeur de page

Dans le bouton **"Composants DSFR"** :

| Entrée de menu         | Insère                                     |
|------------------------|--------------------------------------------|
| Onglets (2 onglets)    | Structure de base avec 2 onglets           |
| Onglets (3 onglets)    | Structure de base avec 3 onglets           |

---

## Déploiement en production

| Fichier local                                    | Page MediaWiki de production               |
|--------------------------------------------------|--------------------------------------------|
| `staging_area/dsfr/components/Tab.js`            | `MediaWiki:Dsfr/components/Tab.js`         |

---

## Contraintes techniques

- Code ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Composant disponible sur **DocDFAED uniquement**.
