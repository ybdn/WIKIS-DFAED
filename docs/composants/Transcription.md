# Composant : Transcription (Transcription)

**Fichier source :** `shared/dsfr/components/Transcription.js`
**Page production :** `MediaWiki:Dsfr/components/Transcription.js`
**Référence DSFR :** [systeme-de-design.gouv.fr — Transcription](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/transcription)
**Wikis cibles :** DFAED-NG et DocDFAED

---

## Description

Bloc pliable destiné à afficher la transcription textuelle d'un contenu audio ou vidéo pour l'accessibilité. Le contenu est masqué par défaut et révélé par un bouton. Utilisé pour accompagner des vidéos de formation ou des enregistrements audio de procédures.

---

## Syntaxe Wikitext

```html
<div class="dsfr-transcription">
  <div class="dsfr-transcription-title">Transcription</div>
  <div class="dsfr-transcription-content">
    Texte de la transcription...
  </div>
</div>
```

### Tableau des attributs

| Élément / Attribut | Obligatoire | Description | Valeur par défaut |
|--------------------|-------------|-------------|-------------------|
| `.dsfr-transcription-title` | Non | Texte du bouton d'ouverture | valeur de `data-title` ou `Transcription` |
| `.dsfr-transcription-content` | Oui | Contenu de la transcription (révélé au clic) | — |
| `data-title` | Non | Titre alternatif si `.dsfr-transcription-title` absent | `Transcription` |

---

## Exemples

### Transcription d'une vidéo de formation

```html
<div class="dsfr-transcription">
  <div class="dsfr-transcription-title">Transcription de la vidéo — Prise d'empreintes</div>
  <div class="dsfr-transcription-content">
    <p>Dans cette vidéo, le formateur présente les étapes de la prise d'empreintes digitales.</p>
    <p><strong>00:00</strong> — Introduction et présentation du matériel nécessaire.</p>
    <p><strong>01:30</strong> — Préparation de la surface et des doigts.</p>
    <p><strong>03:00</strong> — Technique de roulement et enregistrement.</p>
    <p><strong>05:15</strong> — Vérification de la qualité et validation dans le système.</p>
  </div>
</div>
```

### Transcription avec titre via attribut

```html
<div class="dsfr-transcription" data-title="Lire la transcription audio">
  <div class="dsfr-transcription-content">
    Enregistrement de la conférence du 15 mars 2026 : présentation des nouvelles
    fonctionnalités du système FAED version 4.2...
  </div>
</div>
```

---

## Structure HTML générée

```html
<div class="fr-transcription" id="transcription-1">
  <button class="fr-transcription__btn"
          aria-expanded="false"
          aria-controls="transcription-collapse-1">
    Transcription de la vidéo
  </button>
  <div class="fr-collapse" id="transcription-collapse-1">
    <div class="fr-transcription__footer">
      <div class="fr-transcription__actions-group"></div>
    </div>
    <div class="fr-transcription__content">
      <p>Dans cette vidéo, le formateur présente...</p>
    </div>
  </div>
</div>
```

---

## Notes techniques

- ES5 strict — compatibilité minifier MediaWiki 1.31.
- Le style visuel nécessite le CSS DSFR v1.12.1+.
- Le contenu est masqué par défaut (`aria-expanded="false"`) et révélé au clic sur le bouton.
- `.fr-transcription__footer` et `.fr-transcription__actions-group` sont générés vides : ils peuvent accueillir des boutons de téléchargement ou d'impression ajoutés manuellement.
- Plusieurs transcriptions peuvent coexister sur la même page avec des IDs auto-incrémentés.
