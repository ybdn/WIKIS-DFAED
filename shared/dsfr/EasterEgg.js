/* SOURCE FILE FOR: [[MediaWiki:Dsfr/EasterEgg.js]] */
(function() {
    // Séquence : ↑ ↓ ↑ ↓ ← → ← → Y B D N
    var SEQUENCE = [38, 40, 38, 40, 37, 39, 37, 39, 89, 66, 68, 78];
    var pos = 0;
    var overlay = null;

    function buildOverlay() {
        var el = document.createElement('div');
        el.id = 'dsfr-easter-egg-overlay';
        el.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'background:rgba(0,0,18,.75);z-index:9999;display:none;' +
            'align-items:center;justify-content:center;';

        el.innerHTML =
            '<div style="max-width:440px;width:90%;position:relative;' +
                    'background:#fff;border-radius:8px;padding:2rem 2rem 1.5rem;' +
                    'box-shadow:0 16px 48px rgba(0,0,145,.18),0 2px 8px rgba(0,0,0,.12);' +
                    'border-top:4px solid #000091;font-family:Marianne,arial,sans-serif;">' +

                // Bouton fermeture
                '<button id="dsfr-easter-egg-close"' +
                    ' style="position:absolute;top:.75rem;right:.75rem;background:none;border:none;' +
                        'cursor:pointer;font-size:1.25rem;color:#666;line-height:1;" title="Fermer">&#x2715;</button>' +

                // En-tête avec avatar initiales
                '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;">' +
                    '<div style="width:56px;height:56px;border-radius:50%;background:#000091;' +
                            'display:flex;align-items:center;justify-content:center;' +
                            'font-size:1.1rem;font-weight:700;color:#fff;flex-shrink:0;">YB</div>' +
                    '<div>' +
                        '<div style="font-size:1.1rem;font-weight:700;color:#161616;line-height:1.2;">' +
                            'GND Yoann BAUDRIN</div>' +
                        '<div style="font-size:.85rem;color:#3a3a3a;margin-top:.2rem;">' +
                            'Militaire modeste</div>' +
                    '</div>' +
                '</div>' +

                // Citation humoristique
                '<div style="background:#f5f5fe;border-left:3px solid #000091;' +
                        'padding:.6rem .85rem;margin-bottom:1.25rem;border-radius:0 4px 4px 0;">' +
                    '<p style="margin:0;font-size:.85rem;color:#3a3a3a;font-style:italic;">' +
                        '&#x201C;&nbsp;J\u2019ai transform\u00e9 des wiki obsolètes en des chefs-d\u2019\u0153uvres DSFR. Certains diront que c\'est une tuerie, d\'autres que c\'est du gâchis. Moi je pense que c\'est du génie.&#x201C;&nbsp;' +
                    '</p>' +
                '</div>' +

                // Tags
                '<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.25rem;">' +
                    '<span style="background:#e8edff;color:#000091;font-size:.75rem;' +
                            'font-weight:600;padding:.25rem .65rem;border-radius:2px;">DocDFAED</span>' +
                    '<span style="background:#e8edff;color:#000091;font-size:.75rem;' +
                            'font-weight:600;padding:.25rem .65rem;border-radius:2px;">DFAED-NG</span>' +
                    '<span style="background:#eef4e8;color:#18753c;font-size:.75rem;' +
                            'font-weight:600;padding:.25rem .65rem;border-radius:2px;">T41 Assistant</span>' +
                '</div>' +

                // Remerciements
                '<p style="margin:0 0 1rem;font-size:.78rem;color:#999;text-align:center;font-style:italic;">' +
                    'Personnes qui nous ont aidé, soutenu, conseillé :' +
                    '<br><strong style="color:#bbb;"-(néant)</strong>' +
                '</p>' +

                // Pied : date + lien
                '<div style="display:flex;justify-content:space-between;align-items:center;' +
                        'border-top:1px solid #e5e5e5;padding-top:.85rem;margin-top:.25rem;">' +
                    '<span style="font-size:.8rem;color:#777;">Depuis 2026 \u2013</span>' +
                    '<a href="https://github.com/ybdn/" target="_blank" rel="noopener noreferrer"' +
                        ' style="font-size:.85rem;color:#000091;text-decoration:none;' +
                                'display:flex;align-items:center;gap:.3rem;font-weight:500;">' +
                        '&#x1F4BB; github.com/ybdn' +
                    '</a>' +
                '</div>' +

            '</div>';

        return el;
    }

    function showOverlay() {
        if (!overlay) {
            overlay = buildOverlay();
            document.body.appendChild(overlay);

            document.getElementById('dsfr-easter-egg-close').addEventListener('click', function() {
                hideOverlay();
            });

            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    hideOverlay();
                }
            });
        }
        overlay.style.display = 'flex';
    }

    function hideOverlay() {
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    document.addEventListener('keydown', function(e) {
        var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
        var editable = e.target && e.target.getAttribute ? e.target.getAttribute('contenteditable') : null;
        if (tag === 'input' || tag === 'textarea' || editable !== null) {
            pos = 0;
            return;
        }

        if (e.keyCode === 27) {
            hideOverlay();
            return;
        }

        if (e.keyCode === SEQUENCE[pos]) {
            pos++;
            if (pos === SEQUENCE.length) {
                showOverlay();
                pos = 0;
            }
        } else {
            pos = (e.keyCode === SEQUENCE[0]) ? 1 : 0;
        }
    });
})();
