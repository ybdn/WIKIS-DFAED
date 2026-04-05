# Composant : Contrôle segmenté (Segmented)

**Fichier source :** `shared/dsfr/components/Segmented.js`
**Page production :** `MediaWiki:Dsfr/components/Segmented.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Contrôle segmenté](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/controle-segmente)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Groupe de boutons radio présentés sous forme de contrôle segmenté (similar à des onglets visuels). Permet une sélection exclusive parmi 2 à 5 options, souvent utilisé pour basculer entre des modes d'affichage ou des filtres. Techniquement basé sur des `<input type="radio">`.

---

## Syntaxe Wikitext

```html
<div class="dsfr-segmented" data-legend="Mode d'affichage" data-name="mode">
  <div class="dsfr-segment" data-label="Liste" data-value="list" data-active="true"></div>
  <div class="dsfr-segment" data-label="Grille" data-value="grid"></div>
</div>
```

### Tableau des attributs — `.dsfr-segmented`

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-name` | Oui | Attribut `name` commun à tous les segments | ID auto-généré |
| `data-legend` | Non | Légende du groupe | valeur de `data-name` |
| `data-no-legend` | Non | `"true"` → masque visuellement la légende | — |
| `data-size` | Non | `"sm"` → taille réduite | — |

### Tableau des attributs — `.dsfr-segment`

| Attribut | Obligatoire | Description | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `data-label` | Oui | Texte du segment | `Option N` |
| `data-value` | Non | Valeur radio | index numérique |
| `data-icon` | Non | Classe icône DSFR (ex: `fr-icon-list-unordered`) | — |
| `data-active` | Non | `"true"` → segment sélectionné par défaut | — |
| `data-disabled` | Non | `"true"` → segment désactivé | — |

---

## Exemples

### Sélection du type de visualisation

```html
<div class="dsfr-segmented" data-legend="Affichage des résultats" data-name="affichage">
  <div class="dsfr-segment" data-label="Tableau"
       data-value="tableau"
       data-icon="fr-icon-table-line"
       data-active="true"></div>
  <div class="dsfr-segment" data-label="Fiche"
       data-value="fiche"
       data-icon="fr-icon-article-line"></div>
</div>
```

### Filtre de statut, légende masquée, taille réduite

```html
<div class="dsfr-segmented"
     data-legend="Statut"
     data-name="statut"
     data-no-legend="true"
     data-size="sm">
  <div class="dsfr-segment" data-label="Tous" data-value="all" data-active="true"></div>
  <div class="dsfr-segment" data-label="En cours" data-value="en_cours"></div>
  <div class="dsfr-segment" data-label="Clôturés" data-value="clotures"></div>
</div>
```

---

## Structure HTML générée

```html
<fieldset class="fr-segmented">
  <legend class="fr-segmented__legend">Mode d'affichage</legend>
  <div class="fr-segmented__elements">
    <div class="fr-segmented__element">
      <input type="radio" id="segmented-dsfr-1-0" name="mode" value="list" checked>
      <label class="fr-label fr-icon-list-unordered" for="segmented-dsfr-1-0">Liste</label>
    </div>
    <div class="fr-segmented__element">
      <input type="radio" id="segmented-dsfr-1-1" name="mode" value="grid">
      <label class="fr-label fr-icon-layout-grid-line" for="segmented-dsfr-1-1">Grille</label>
    </div>
  </div>
</fieldset>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le composant est purement déclaratif : il ne gère pas de logique d'affichage conditionnel. Pour réagir aux changements, écouter les événements `change` sur les `<input type="radio">` générés.
- Recommandé entre 2 et 5 segments.
