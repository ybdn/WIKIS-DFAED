# Composant : Tableau (Table)

**Fichier source :** `wiki-DocDFAED/staging_area/dsfr/components/Table.js`
**Page production :** `MediaWiki:Dsfr/components/Table.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Tableau](https://www.systeme-de-design.gouv.fr/composants/tableau)
**Wiki cible :** DocDFAED uniquement

---

## Description

Le composant Table applique le style DSFR aux tableaux de la page. Il fonctionne en deux modes :

- **Mode automatique** : les tableaux créés avec la syntaxe wiki standard (`{| class="wikitable"`) sont automatiquement habillés avec `fr-table`.
- **Mode explicite** : un wrapper `dsfr-table` permet de contrôler la légende et le mode de défilement.

---

## Mode automatique

Aucun markup supplémentaire n'est nécessaire. Tout tableau créé avec la syntaxe wiki standard sera automatiquement stylisé :

```wikitext
{| class="wikitable"
|+ Titre du tableau
! Colonne 1 !! Colonne 2 !! Colonne 3
|-
| Valeur A  || Valeur B  || Valeur C
|}
```

---

## Mode explicite (markup wikitext)

Pour contrôler la légende ou activer le défilement horizontal :

```html
<div class="dsfr-table" data-caption="Titre du tableau">
{| class="wikitable"
! Colonne 1 !! Colonne 2
|-
| Valeur A  || Valeur B
|}
</div>
```

### Tableau avec défilement horizontal

Utile pour les tableaux larges sur mobile ou petits écrans :

```html
<div class="dsfr-table" data-caption="Référentiel des procédures" data-scrollable>
{| class="wikitable"
...
|}
</div>
```

### Tableau sans légende visuelle

```html
<div class="dsfr-table" data-no-caption>
{| class="wikitable"
...
|}
</div>
```

### Tableau des attributs

| Attribut         | Obligatoire | Description                                                          | Valeur par défaut |
|------------------|-------------|----------------------------------------------------------------------|-------------------|
| `data-caption`   | Non         | Texte de la légende (`<caption>`) injectée dans le tableau           | *(absent)*        |
| `data-scrollable`| Non         | Active le défilement horizontal (`fr-table--scroll`)                 | *(absent)*        |
| `data-no-caption`| Non         | Masque visuellement la légende (`fr-table--no-caption`)              | *(absent)*        |

---

## Comportement du composant

- En mode automatique, tous les `.wikitable` de `.mw-parser-output` sont wrappés dans `<div class="fr-table">`.
- En mode explicite, le `div.dsfr-table` lui-même devient le conteneur `fr-table`.
- La transformation est **idempotente** (pas de double traitement).
- Le composant est **CSS-driven** : aucun comportement JS actif après la transformation.

---

## Insertion depuis l'éditeur de page

Dans le bouton **"Composants DSFR"** :

| Entrée de menu              | Insère                                              |
|-----------------------------|-----------------------------------------------------|
| Tableau DSFR (simple)       | Wrapper `dsfr-table` avec table wikitexte préremplie |
| Tableau DSFR (défilant)     | Idem avec `data-scrollable`                          |

---

## Déploiement en production

| Fichier local                                       | Page MediaWiki de production                    |
|-----------------------------------------------------|-------------------------------------------------|
| `staging_area/dsfr/components/Table.js`             | `MediaWiki:Dsfr/components/Table.js`            |

---

## Contraintes techniques

- Code ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel (`fr-table`) nécessite le CSS DSFR v1.12.1+.
- Composant disponible sur **DocDFAED uniquement**.
