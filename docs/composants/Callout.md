# Composant : Mise en avant (Callout)

**Fichier source :** `shared/dsfr/components/Callout.js`
**Page production :** `MediaWiki:Dsfr/components/Callout.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Mise en avant](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/mise-en-avant)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Bloc éditorial destiné à mettre en avant une information importante avec un titre, un texte descriptif et un bouton d'action optionnel. Différent de l'alerte : le callout n'est pas lié à un état système mais sert à valoriser un contenu clé (procédure prioritaire, note importante, ressource à consulter).

---

## Syntaxe Wikitext

```html
<div class="dsfr-callout">
  <div class="dsfr-callout-title">Titre</div>
  <div class="dsfr-callout-text">Texte descriptif...</div>
  <div class="dsfr-callout-link"><a href="url">Bouton action</a></div>
</div>
```

### Tableau des attributs

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `.dsfr-callout-title` | Non | Titre affiché en `<h3>` | — |
| `.dsfr-callout-text` | Non | Texte du corps du callout | — |
| `.dsfr-callout-link` | Non | Lien transformé en bouton DSFR primaire | — |
| `data-color` | Non | Couleur DSFR (ex: `green-menthe`, `blue-ecume`) | — |
| `data-icon` | Non | Classe icône DSFR supplémentaire | — |

---

## Exemples

### Mise en avant d'une procédure prioritaire

```html
<div class="dsfr-callout">
  <div class="dsfr-callout-title">Procédure mise à jour</div>
  <div class="dsfr-callout-text">
    La procédure de traitement des empreintes latentes a été révisée en janvier 2026.
    Tous les enquêteurs doivent en prendre connaissance avant toute soumission.
  </div>
  <div class="dsfr-callout-link"><a href="/Procédure_empreintes_latentes">Consulter la procédure</a></div>
</div>
```

### Callout coloré avec icône

```html
<div class="dsfr-callout" data-color="green-menthe" data-icon="fr-icon-information-line">
  <div class="dsfr-callout-title">Bon à savoir</div>
  <div class="dsfr-callout-text">
    Le délai de traitement standard est de 72 heures ouvrées pour les demandes urgentes.
  </div>
</div>
```

---

## Structure HTML générée

```html
<div class="fr-callout">
  <h3 class="fr-callout__title">Procédure mise à jour</h3>
  <p class="fr-callout__text">
    La procédure de traitement des empreintes latentes a été révisée...
  </p>
  <ul class="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-sm">
    <li>
      <a class="fr-btn" href="/Procédure_empreintes_latentes">Consulter la procédure</a>
    </li>
  </ul>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le titre est désencapsulé automatiquement si MediaWiki l'a entouré d'un `<p>`, `<pre>` ou `<code>`.
- Seul le premier `<a>` dans `.dsfr-callout-link` est utilisé comme bouton d'action.
