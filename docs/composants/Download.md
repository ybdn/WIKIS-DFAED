# Composant : Téléchargement de fichier (Download)

**Fichier source :** `wiki-DocDFAED/staging_area/dsfr/components/Download.js`
**Page production :** `MediaWiki:Dsfr/components/Download.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Téléchargement de fichier](https://www.systeme-de-design.gouv.fr/composants/telechargement-de-fichier)
**Wiki cible :** DocDFAED uniquement

---

## Description

Le composant Download génère un lien de téléchargement stylisé DSFR avec un nom de document et des informations secondaires (format, taille, date). Il prend en charge les fichiers hébergés sur le wiki (via la résolution automatique des pages `Fichier:`) ainsi que les URLs absolues.

---

## Syntaxe Wikitext

```html
<span class="dsfr-download"
      data-href="Fichier:Procedure-ASQ-2025.pdf"
      data-label="Procédure de traitement ASQ"
      data-detail="PDF — 1,2 Mo"></span>
```

### Tableau des attributs

| Attribut        | Obligatoire | Description                                                                   | Valeur par défaut |
|-----------------|-------------|-------------------------------------------------------------------------------|-------------------|
| `data-href`     | Oui         | URL du fichier. Si commence par `Fichier:` ou `File:`, l'URL wiki est résolue | —                 |
| `data-label`    | Oui         | Nom du document affiché comme texte du lien                                   | —                 |
| `data-detail`   | Non         | Informations secondaires : format, taille, date de mise à jour                | *(absent)*        |
| `data-download` | Non         | Présence seule force le téléchargement (attribut HTML `download`)              | *(ouverture onglet)* |

---

## Exemples

### Fichier hébergé sur le wiki

```html
<span class="dsfr-download"
      data-href="Fichier:Note-service-2025.pdf"
      data-label="Note de service — janvier 2025"
      data-detail="PDF — 340 Ko"></span>
```

### URL externe

```html
<span class="dsfr-download"
      data-href="https://intranet.gendarmerie.fr/docs/formulaire.docx"
      data-label="Formulaire de demande de consultation"
      data-detail="DOCX — Mis à jour le 01/03/2025"
      data-download></span>
```

### Sans informations secondaires

```html
<span class="dsfr-download"
      data-href="Fichier:Guide-utilisateur.pdf"
      data-label="Guide utilisateur FAED"></span>
```

**Rendu HTML généré :**

```html
<div class="fr-download">
  <p>
    <a href="/index.php?title=Fichier:Guide-utilisateur.pdf" class="fr-download__link">
      Guide utilisateur FAED
    </a>
  </p>
</div>
```

**Avec informations secondaires :**

```html
<div class="fr-download">
  <p>
    <a href="/index.php?title=Fichier:Procedure-ASQ-2025.pdf" class="fr-download__link">
      Procédure de traitement ASQ
      <span class="fr-download__detail">PDF — 1,2 Mo</span>
    </a>
  </p>
</div>
```

---

## Comportement du composant

- Les URL commençant par `Fichier:` ou `File:` sont automatiquement résolues via `mw.util.getUrl()`.
- L'attribut `data-download` déclenche le téléchargement direct (sans ouverture dans un onglet).
- Le composant est **CSS-driven** après la transformation.

---

## Insertion depuis l'éditeur de page

Dans le bouton **"Composants DSFR"** :

| Entrée de menu               | Insère                                         |
|------------------------------|------------------------------------------------|
| Téléchargement de fichier    | Lien Download avec fichier wiki prérempli      |

---

## Déploiement en production

| Fichier local                                         | Page MediaWiki de production                      |
|-------------------------------------------------------|---------------------------------------------------|
| `staging_area/dsfr/components/Download.js`            | `MediaWiki:Dsfr/components/Download.js`           |

---

## Contraintes techniques

- Code ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- `mw.util.getUrl()` est requis pour la résolution des fichiers wiki — disponible sur toutes les pages MediaWiki.
- Composant disponible sur **DocDFAED uniquement**.
