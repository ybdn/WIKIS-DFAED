#!/usr/bin/env python3
"""
Génère les notes de release Markdown pour le workflow CI/CD WIKIS-DFAED.

Usage : generate_notes.py <COMPARE_REF> <NEW_TAG>
  COMPARE_REF : tag ou hash du dernier point de comparaison (ex: v1.2.3 ou abc1234)
  NEW_TAG     : nouveau tag de la release (ex: v1.3.0)

Écrit le résultat dans /tmp/release_notes.md
"""

import os
import re
import subprocess
import sys


# ---------------------------------------------------------------------------
# Mapping fichiers locaux → pages de production MediaWiki
# Chaque règle : (regex, wikis_cibles, fn_page)
#   wikis_cibles : 'both' | 'ng' | 'doc'
#   fn_page      : callable(match) → str (page MediaWiki)
# ---------------------------------------------------------------------------
MAPPING_RULES = [
    # shared/Common.css → les deux wikis
    (
        re.compile(r'^shared/Common\.css$'),
        'both',
        lambda m: 'MediaWiki:Common.css',
    ),
    # shared/dsfr/<fichier>.js (racine seulement, pas les sous-dossiers)
    (
        re.compile(r'^shared/dsfr/([^/]+\.js)$'),
        'both',
        lambda m: 'MediaWiki:Dsfr/' + m.group(1),
    ),
    # shared/dsfr/<fichier>.css (racine seulement)
    (
        re.compile(r'^shared/dsfr/([^/]+\.css)$'),
        'both',
        lambda m: 'MediaWiki:Dsfr/' + m.group(1),
    ),
    # shared/dsfr/components/<fichier>.js
    (
        re.compile(r'^shared/dsfr/components/([^/]+\.js)$'),
        'both',
        lambda m: 'MediaWiki:Dsfr/components/' + m.group(1),
    ),
    # wiki-DFAED-NG/staging_area/Common.js ou Common.css
    (
        re.compile(r'^wiki-DFAED-NG/staging_area/(Common\.(js|css))$'),
        'ng',
        lambda m: 'MediaWiki:' + m.group(1),
    ),
    # wiki-DFAED-NG/staging_area/dsfr/<fichier>.js ou .css (racine seulement)
    (
        re.compile(r'^wiki-DFAED-NG/staging_area/dsfr/([^/]+\.(js|css))$'),
        'ng',
        lambda m: 'MediaWiki:Dsfr/' + m.group(1),
    ),
    # wiki-DocDFAED/staging_area/Common.js ou Common.css
    (
        re.compile(r'^wiki-DocDFAED/staging_area/(Common\.(js|css))$'),
        'doc',
        lambda m: 'MediaWiki:' + m.group(1),
    ),
    # wiki-DocDFAED/staging_area/dsfr/oce/Oce.css → renommé Style.css
    (
        re.compile(r'^wiki-DocDFAED/staging_area/dsfr/oce/Oce\.css$'),
        'doc',
        lambda m: 'MediaWiki:Dsfr/oce/Style.css',
    ),
    # wiki-DocDFAED/staging_area/dsfr/oce/<fichier>.js
    (
        re.compile(r'^wiki-DocDFAED/staging_area/dsfr/oce/([^/]+\.js)$'),
        'doc',
        lambda m: 'MediaWiki:Dsfr/oce/' + m.group(1),
    ),
    # wiki-DocDFAED/staging_area/dsfr/planning/Planning.css → renommé Style.css
    (
        re.compile(r'^wiki-DocDFAED/staging_area/dsfr/planning/Planning\.css$'),
        'doc',
        lambda m: 'MediaWiki:Dsfr/planning/Style.css',
    ),
    # wiki-DocDFAED/staging_area/dsfr/planning/<fichier>.js
    (
        re.compile(r'^wiki-DocDFAED/staging_area/dsfr/planning/([^/]+\.js)$'),
        'doc',
        lambda m: 'MediaWiki:Dsfr/planning/' + m.group(1),
    ),
    # wiki-DocDFAED/staging_area/dsfr/<fichier>.js ou .css (racine seulement)
    (
        re.compile(r'^wiki-DocDFAED/staging_area/dsfr/([^/]+\.(js|css))$'),
        'doc',
        lambda m: 'MediaWiki:Dsfr/' + m.group(1),
    ),
]


def run_git(args):
    """Exécute une commande git et retourne la sortie (str)."""
    result = subprocess.run(
        ['git'] + args,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.strip()


def get_changed_files(compare_ref):
    """
    Retourne la liste des fichiers ajoutés, copiés, modifiés ou renommés
    (destination) depuis compare_ref. Les fichiers supprimés sont exclus :
    il n'y a rien à copier-coller en production pour un fichier qui n'existe plus.
    """
    try:
        output = run_git([
            'diff', '--name-only', '--diff-filter=ACMR',
            compare_ref + '..HEAD',
        ])
    except subprocess.CalledProcessError:
        # Fallback premier run : tous les fichiers actuellement trackés
        output = run_git(['ls-files'])
    if not output:
        return []
    return [f for f in output.splitlines() if f.strip()]


def get_commits(compare_ref):
    """Retourne la liste des commits depuis compare_ref."""
    try:
        output = run_git([
            'log', compare_ref + '..HEAD',
            '--pretty=format:%s — %h',
            '--no-merges',
        ])
    except subprocess.CalledProcessError:
        output = run_git(['log', '--pretty=format:%s — %h', '--no-merges'])
    if not output:
        return []
    return [c for c in output.splitlines() if c.strip()]


def classify_files(changed_files):
    """
    Applique le mapping et retourne deux listes (sans doublons) :
      ng_files  : [(src, dest), ...] pour DFAED-NG
      doc_files : [(src, dest), ...] pour DocDFAED
    """
    ng_set = {}   # dest → src (pour dédoublonner)
    doc_set = {}

    for f in changed_files:
        # Ignorer les fichiers macOS (._xxx)
        if os.path.basename(f).startswith('._'):
            continue

        for pattern, target, page_fn in MAPPING_RULES:
            m = pattern.match(f)
            if m:
                page = page_fn(m)
                if target in ('both', 'ng'):
                    ng_set[page] = f
                if target in ('both', 'doc'):
                    doc_set[page] = f
                break  # première règle correspondante gagne

    ng_files  = [(src, dest) for dest, src in sorted(ng_set.items())]
    doc_files = [(src, dest) for dest, src in sorted(doc_set.items())]
    return ng_files, doc_files


def build_table(rows):
    """Retourne un tableau Markdown à partir d'une liste (src, dest)."""
    lines = [
        '| Fichier source | Page production MediaWiki |',
        '|----------------|--------------------------|',
    ]
    for src, dest in rows:
        lines.append('| `{}` | `{}` |'.format(src, dest))
    return '\n'.join(lines)


def build_notes(commits, ng_files, doc_files, new_tag):
    """Construit le Markdown complet des notes de release."""
    sections = []

    # --- Résumé des commits ---
    sections.append('## Résumé des commits\n')
    if commits:
        for c in commits:
            sections.append('- `{}`'.format(c))
    else:
        sections.append('_Aucun commit conventionnel détecté._')

    sections.append('\n---\n')

    # --- Fichiers à mettre à jour ---
    sections.append('## Fichiers à mettre à jour en production\n')

    has_deployable = bool(ng_files or doc_files)

    if not has_deployable:
        sections.append(
            '_Aucun fichier déployable modifié dans cette release._\n'
            '_Seuls des fichiers de configuration ou de documentation ont été mis à jour._'
        )
    else:
        if ng_files:
            sections.append('### Wiki DFAED-NG\n')
            sections.append(build_table(ng_files))
            sections.append('')

        if doc_files:
            sections.append('### Wiki DocDFAED\n')
            sections.append(build_table(doc_files))
            sections.append('')

        # Identifier les fichiers shared présents dans les deux wikis
        shared_in_both = [
            src for src, dest in ng_files
            if any(src2 == src for src2, dest2 in doc_files)
        ]
        if shared_in_both:
            sections.append(
                '> Les fichiers `shared/` ci-dessus apparaissent dans les deux wikis '
                'et doivent être mis à jour dans **les deux** productions.'
            )

    sections.append('\n---\n')
    sections.append(
        '*Release générée automatiquement — '
        '[voir le workflow](.github/workflows/release.yml)*'
    )

    return '\n'.join(sections)


def main():
    if len(sys.argv) != 3:
        print('Usage : generate_notes.py <COMPARE_REF> <NEW_TAG>', file=sys.stderr)
        sys.exit(1)

    compare_ref = sys.argv[1]
    new_tag     = sys.argv[2]

    print('Comparaison depuis : {}'.format(compare_ref))
    print('Nouveau tag        : {}'.format(new_tag))

    commits       = get_commits(compare_ref)
    changed_files = get_changed_files(compare_ref)
    ng_files, doc_files = classify_files(changed_files)

    print('Commits trouvés   : {}'.format(len(commits)))
    print('Fichiers modifiés : {}'.format(len(changed_files)))
    print('  → DFAED-NG      : {}'.format(len(ng_files)))
    print('  → DocDFAED      : {}'.format(len(doc_files)))

    notes = build_notes(commits, ng_files, doc_files, new_tag)

    output_path = '/tmp/release_notes.md'
    with open(output_path, 'w', encoding='utf-8') as fh:
        fh.write(notes)

    print('Notes écrites dans : {}'.format(output_path))


if __name__ == '__main__':
    main()
