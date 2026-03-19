/* SOURCE FILE FOR: [[MediaWiki:Dsfr/Header.js]] */
(function () {
  // SECURITY: Wait aggressively for mw.util and jQuery without relying solely on mw.loader
  var attempts = 0;
  var maxAttempts = 300; // 300 * 50ms = 15 seconds

  function tryMountHeader() {
    if (!window.jQuery || !window.mw || !window.mw.util) {
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryMountHeader, 50);
      } else {
        console.error("[DSFR] Failed to load Header dependencies in time.");
        if (window.DsfrHideLoader) window.DsfrHideLoader();
      }
      return;
    }

    $(function () {
      if (document.getElementById("dsfr-header-loaded")) {
        if (window.DsfrHideLoader) window.DsfrHideLoader();
        return;
      }

      var config = window.DsfrConfig || {
        service: {
          title: "Wiki",
          tagline: "Documentation",
          logoText: ["République", "Française"],
        },
      };

      var userName = mw.config.get("wgUserName");
      var isAnon = userName === null;

      // -------------------------------------------------------------
      // EXTRACT NATIVE WIKI ACTIONS
      // -------------------------------------------------------------
      var wikiActions = [];
      var seenLinks = {}; 

      $("#p-views ul li a, #p-cactions ul li a, #ca-watch a, #ca-unwatch a").each(function () {
        var $a = $(this);
        var href = $a.attr("href");
        var text = $a.text().trim() || $a.attr("title");

        if ($a.parent().attr("id") === "ca-watch") text = "Suivre cette page";
        if ($a.parent().attr("id") === "ca-unwatch") text = "Ne plus suivre";

        if (href && !seenLinks[href]) {
          seenLinks[href] = true;
          var $li = $a.closest("li");
          wikiActions.push({
            label: text,
            href: href,
            title: $a.attr("title"),
            class: $li.attr("class") || "",
          });
        }
      });

      var wikiActionsHtml = wikiActions
        .map(function (action) {
          var isActive = action.class.indexOf("selected") !== -1 ? 'aria-current="true"' : "";
          // Use Generic Link styling for Dropdown
          return '' +
            '<li>' +
            '  <a class="fr-link" href="' + action.href + '" target="_self" ' + isActive + ' title="' + (action.title || '') + '" style="display:block; padding:0.75rem 1rem; width:100%; text-align:left; text-decoration:none; color:var(--text-default-grey);">' +
                 action.label +
            '  </a>' +
            '</li>';
        })
        .join("");

      // -------------------------------------------------------------
      // BUILD NAVIGATION
      // -------------------------------------------------------------
      function buildNavigationHtml(navItems) {
          if (!navItems || !navItems.length) {
              return '<li class="fr-nav__item"><a class="fr-nav__link" href="' + mw.util.getUrl('Accueil') + '">Accueil</a></li>';
          }
          var html = '';
          for (var i = 0; i < navItems.length; i++) {
              var item = navItems[i];
              if (item.type === 'link') {
                  html += '<li class="fr-nav__item"><a class="fr-nav__link" href="' + mw.util.getUrl(item.page) + '" target="_self">' + item.label + '</a></li>';
              } else if (item.type === 'menu' && item.items && item.items.length) {
                  var menuId = item.id || 'menu-' + i;
                  html += '<li class="fr-nav__item">' +
                          '<button class="fr-nav__btn" aria-expanded="false" aria-controls="' + menuId + '">' + item.label + '</button>' +
                          '<div class="fr-collapse fr-menu" id="' + menuId + '">' +
                          '<ul class="fr-menu__list">';
                  for (var j = 0; j < item.items.length; j++) {
                      var subItem = item.items[j];
                      html += '<li><a class="fr-nav__link" href="' + mw.util.getUrl(subItem.page) + '" target="_self">' + subItem.label + '</a></li>';
                  }
                  html += '</ul></div></li>';
              }
          }
          return html;
      }

      // -------------------------------------------------------------
      // BUILD HEADER TOOLS (User & Page)
      // -------------------------------------------------------------
      var currentPage = mw.config.get("wgPageName");
      var scriptPath = mw.config.get("wgScript");
      var homepageUrl = mw.util.getUrl("Accueil");
      var navParams = { returnto: currentPage };
      var loginUrl = mw.util.getUrl("Special:UserLogin", navParams);
      var logoutUrl = mw.util.getUrl("Special:UserLogout", navParams);
      var createAccountUrl = mw.util.getUrl("Special:CreateAccount", navParams);
      var preferencesUrl = mw.util.getUrl("Special:Preferences");
      var logoHtml = config.service.logoText.join("<br>");

      // New Page Tools Dropdown (Inserted as first item in tools)
      var pageToolsMenu = '' +
          '<li style="position: relative; margin-right:1rem;">' +
             '<button class="fr-btn fr-btn--tertiary-no-outline fr-icon-settings-5-line" id="dsfr-page-tools-btn" aria-expanded="false" title="Outils de la page">Outils</button>' +
             '<div class="fr-menu" id="dsfr-page-tools-menu" style="display:none; position:absolute; top:100%; right:0; z-index:2000; background:white; border:1px solid #ddd; padding:0; min-width:250px; text-align:left; box-shadow:0 4px 10px rgba(0,0,0,0.1);">' +
                 '<ul class="fr-menu__list" style="margin:0; padding:0; list-style:none;">' +
                     wikiActionsHtml + 
                 '</ul>' +
             '</div>' +
          '</li>';

      var userToolsHtml = isAnon
        ? pageToolsMenu +
            '<li><a class="fr-btn fr-icon-add-circle-line" href="' + createAccountUrl + '">Créer un compte</a></li>' +
            '<li><a class="fr-btn fr-icon-lock-line" href="' + loginUrl + '">Se connecter</a></li>'
        : pageToolsMenu + 
            '<li><a class="fr-btn fr-icon-account-circle-line" href="' + preferencesUrl + '">Mon compte (' + userName + ')</a></li>' +
            '<li><a class="fr-btn fr-icon-logout-box-r-line" href="' + logoutUrl + '">Se déconnecter</a></li>';

      // -------------------------------------------------------------
      // TEMPLATE
      // -------------------------------------------------------------
      var dsfrHeader = '' +
            '<header role="banner" class="fr-header" id="dsfr-header-loaded">' +
            '    <div class="fr-header__body">' +
            '        <div class="fr-container">' +
            '            <div class="fr-header__body-row">' +
            '                <div class="fr-header__brand fr-enlarge-link">' +
            '                    <div class="fr-header__brand-top">' +
            '                        <div class="fr-header__logo"><p class="fr-logo">' + logoHtml + '</p></div>' +
            '                        <div class="fr-header__navbar">' +
            '                            <button class="fr-btn--menu fr-btn" data-fr-opened="false" aria-controls="modal-main-menu" aria-haspopup="menu" id="btn-main-menu" title="Menu">Menu</button>' +
            '                        </div>' +
            '                    </div>' +
            '                    <div class="fr-header__service">' +
            '                        <a href="' + homepageUrl + '" title="Accueil - ' + config.service.title + '"><p class="fr-header__service-title">' + config.service.title + '</p></a>' +
            '                        <p class="fr-header__service-tagline">' + config.service.tagline + '</p>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="fr-header__tools">' +
            '                    <div class="fr-header__tools-links">' +
            '                        <ul class="fr-btns-group">' +
                                         userToolsHtml +
            '                        </ul>' +
            '                    </div>' +
            '                    <div class="fr-header__search fr-modal" id="modal-search">' +
            '                        <div class="fr-container fr-container-fluid fr-container-md">' +
            '                            <div class="fr-grid-row fr-grid-row--center">' +
            '                                <div class="fr-col-12 fr-col-md-6 fr-col-lg-8">' +
            '                                    <form action="' + scriptPath + '" method="get" role="search">' +
            '                                        <input type="hidden" name="title" value="Special:Search">' +
            '                                        <div class="fr-search-bar" id="header-search-input">' +
            '                                            <label class="fr-label" for="search-input">Recherche</label>' +
            '                                            <input class="fr-input" placeholder="Rechercher sur le wiki" type="search" id="search-input" name="search">' +
            '                                            <button class="fr-btn" type="submit" title="Rechercher">Rechercher</button>' +
            '                                        </div>' +
            '                                    </form>' +
            '                                </div>' +
            '                            </div>' +
            '                        </div>' +
            '                    </div>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '    <div class="fr-header__menu fr-modal" id="modal-main-menu" aria-labelledby="btn-main-menu">' +
            '        <div class="fr-container">' +
            '            <button class="fr-btn--close fr-btn" aria-controls="modal-main-menu" title="Fermer">Fermer</button>' +
            '            <div class="fr-header__menu-links"></div>' +
            '            <nav class="fr-nav" id="navigation-main" role="navigation" aria-label="Menu principal">' +
            '                <ul class="fr-nav__list">' +
                                 buildNavigationHtml(config.navigation) +
            '                </ul>' +
            '            </nav>' +
            '        </div>' +
            '    </div>' +
            '</header>';

      // Insert Header
      $("body").prepend(dsfrHeader);

      // JS for Page Tools Dropdown
      var $ptBtn = $('#dsfr-page-tools-btn');
      var $ptMenu = $('#dsfr-page-tools-menu');

      $ptBtn.click(function(e) {
          e.stopPropagation();
          if($ptMenu.is(':visible')){ $ptMenu.hide(); $(this).attr('aria-expanded','false'); }
          else { $ptMenu.show(); $(this).attr('aria-expanded','true'); }
      });
      $(document).click(function() { $ptMenu.hide(); $ptBtn.attr('aria-expanded','false'); });
      $ptMenu.click(function(e){ e.stopPropagation(); });

      console.log("[DSFR] Header injected (Tool Icon Mode)");
      if (window.DsfrHideLoader) window.DsfrHideLoader();
    });
  }

  tryMountHeader();
})();
