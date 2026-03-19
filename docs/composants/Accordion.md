# Composant : Accordéon (Accordion)

**Fichier source :** `shared/dsfr/components/Accordion.js`
**Page production :** `MediaWiki:Dsfr/components/Accordion.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Accordéon](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/accordeon)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Permet d'afficher du contenu dans des sections repliables/dépliables. Utile pour structurer des procédures longues, des FAQ, ou des guides par étapes sans surcharger la page. MediaWiki supprimant les balises `<button>` et attributs `aria-*` en Wikitext, le composant génère la structure DSFR complète à partir d'un balisage simplifié.

---

## Syntaxe Wikitext

```html
<div class="dsfr-accordion-item">
  <div class="dsfr-accordion-title">Titre de la section</div>
  <div class="dsfr-accordion-content">Contenu de la section...</div>
</div>
```

### Tableau des attributs

| Élément | Obligatoire | Description |
|---------|-------------|-------------|
| `.dsfr-accordion-item` | Oui | Conteneur de l'accordéon |
| `.dsfr-accordion-title` | Oui | Titre affiché dans le bouton de l'accordéon |
| `.dsfr-accordion-content` | Oui | Contenu révélé lors du dépliage |

Aucun attribut `data-*` n'est requis. La transformation est automatique.

---

## Exemples

### Procédure en étapes

```html
<div class="dsfr-accordion-item">
  <div class="dsfr-accordion-title">Étape 1 — Vérification de l'identité</div>
  <div class="dsfr-accordion-content">
    Vérifier la concordance des empreintes digitales avec la fiche individuelle.
    Consulter la base FAED avant toute validation.
  </div>
</div>
<div class="dsfr-accordion-item">
  <div class="dsfr-accordion-title">Étape 2 — Saisie dans le système</div>
  <div class="dsfr-accordion-content">
    Renseigner le numéro de dossier et les références de l'enquête dans le formulaire dédié.
  </div>
</div>
```

### Question fréquente

```html
<div class="dsfr-accordion-item">
  <div class="dsfr-accordion-title">Que faire en cas de doublon d'empreintes ?</div>
  <div class="dsfr-accordion-content">
    Contacter le référent DFAED de votre unité. Ne pas supprimer d'entrée sans validation.
  </div>
</div>
```

---

## Structure HTML générée

```html
<section class="fr-accordion">
  <h3 class="fr-accordion__title">
    <button class="fr-accordion__btn" aria-expanded="false" aria-controls="accordion-[id]">
      Titre de la section
    </button>
  </h3>
  <div class="fr-collapse" id="accordion-[id]">
    Contenu de la section...
  </div>
</section>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Les IDs sont générés automatiquement via `Date.now()` + index pour garantir l'unicité.
- Le titre est automatiquement désencapsulé si MediaWiki l'a entouré d'un `<p>`, `<pre>` ou `<code>`.
- Plusieurs accordéons peuvent coexister sur la même page de façon indépendante.
