# Composant : Tuile (Tile)

**Fichier source :** `shared/dsfr/components/Tile.js`
**Page production :** `MediaWiki:Dsfr/components/Tile.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Tuile](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/tuile)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Carte de navigation cliquable présentant un lien avec titre, description et image optionnelle. Utilisée pour créer des grilles de liens thématiques (accès rapide aux procédures, rubriques principales, ressources clés). Peut être utilisée isolément ou regroupée en grille.

---

## Syntaxe Wikitext

### Tuile isolée

```html
<div class="dsfr-tile-item">
  <div class="dsfr-tile-title"><a href="/Procédure_identification">Identification</a></div>
  <div class="dsfr-tile-desc">Procédures de traitement des demandes d'identification.</div>
</div>
```

### Grille de tuiles

```html
<div class="dsfr-tiles" data-cols="3">
  <div class="dsfr-tile-item">
    <div class="dsfr-tile-title"><a href="/Identification">Identification</a></div>
    <div class="dsfr-tile-desc">Procédures d'identification dactyloscopique.</div>
  </div>
  <div class="dsfr-tile-item">
    <div class="dsfr-tile-title"><a href="/Saisie">Saisie</a></div>
    <div class="dsfr-tile-desc">Protocoles de saisie des empreintes.</div>
  </div>
</div>
```

### Tableau des attributs — `.dsfr-tiles` (grille)

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-cols` | Non | Nombre de colonnes : `2`, `3`, `4` | `3` |

### Tableau des attributs — `.dsfr-tile-item`

| Attribut | Obligatoire | Description |
|----------|-------------|-------------|
| `data-horizontal` | Non | Présence de l'attribut → tuile horizontale |
| `data-no-enlarge` | Non | Présence de l'attribut → retire l'effet d'agrandissement au survol |
| `data-color` | Non | Couleur DSFR (ex: `grey`) |

### Éléments internes

| Élément | Obligatoire | Description |
|---------|-------------|-------------|
| `.dsfr-tile-title` | Oui | Titre de la tuile ; contient un `<a>` pour le lien |
| `.dsfr-tile-desc` | Non | Description courte |
| `.dsfr-tile-detail` | Non | Texte secondaire (catégorie, date) |
| `.dsfr-tile-img` | Non | Image : URL en texte ou `data-src` + `data-alt` optionnel |

---

## Exemples

### Grille d'accès rapide à 4 colonnes

```html
<div class="dsfr-tiles" data-cols="4">
  <div class="dsfr-tile-item">
    <div class="dsfr-tile-title"><a href="/Procédures_FAED">Procédures</a></div>
    <div class="dsfr-tile-desc">Toutes les procédures opérationnelles.</div>
  </div>
  <div class="dsfr-tile-item">
    <div class="dsfr-tile-title"><a href="/Formulaires">Formulaires</a></div>
    <div class="dsfr-tile-desc">Formulaires de saisie et de demande.</div>
  </div>
  <div class="dsfr-tile-item">
    <div class="dsfr-tile-title"><a href="/Guides">Guides</a></div>
    <div class="dsfr-tile-desc">Guides pratiques et manuels utilisateur.</div>
  </div>
  <div class="dsfr-tile-item">
    <div class="dsfr-tile-title"><a href="/Contacts">Contacts</a></div>
    <div class="dsfr-tile-desc">Référents et contacts du département.</div>
  </div>
</div>
```

### Tuile avec image et détail

```html
<div class="dsfr-tile-item">
  <div class="dsfr-tile-title"><a href="/Base_FAED">Base FAED</a></div>
  <div class="dsfr-tile-desc">Fichier Automatisé des Empreintes Digitales.</div>
  <div class="dsfr-tile-detail">Mise à jour : mars 2026</div>
  <div class="dsfr-tile-img" data-src="/images/faed_logo.png" data-alt="Logo FAED"></div>
</div>
```

### Tuile horizontale grise sans agrandissement

```html
<div class="dsfr-tile-item" data-horizontal data-no-enlarge data-color="grey">
  <div class="dsfr-tile-title"><a href="/Archive">Archives</a></div>
  <div class="dsfr-tile-desc">Dossiers archivés antérieurs à 2020.</div>
</div>
```

---

## Structure HTML générée

```html
<!-- Grille 3 colonnes -->
<div class="fr-grid-row fr-grid-row--gutters">
  <div class="fr-col-12 fr-col-md-4">
    <div class="fr-tile fr-enlarge-link" id="dsfr-tile-0">
      <div class="fr-tile__body">
        <div class="fr-tile__content">
          <h3 class="fr-tile__title">
            <a href="/Identification">Identification</a>
          </h3>
          <p class="fr-tile__desc">Procédures d'identification dactyloscopique.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- La classe `fr-enlarge-link` rend toute la tuile cliquable via CSS ; retirée si `data-no-enlarge` est présent.
- Pour l'image, l'URL peut être placée directement comme texte dans `.dsfr-tile-img` ou via l'attribut `data-src`.
- Les colonnes s'adaptent : 2 cols → `fr-col-md-6`, 3 cols → `fr-col-md-4`, 4 cols → `fr-col-md-3`.
