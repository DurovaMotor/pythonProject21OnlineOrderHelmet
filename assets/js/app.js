(function () {
  "use strict";

  var CART_KEY = "hightac-helmet-cart-v1";
  var SUBMISSION_KEY = "hightac-helmet-last-submission-v1";
  var LANG_KEY = "hightac-helmet-language-v1";
  var DEFAULT_LANG = "fr";

  var LOCALES = {
    fr: {
      dir: "ltr",
      home_title: "Casques HIGHTAC",
      category_title: "{category}",
      success_title: "Message prêt",
      shop: "BOUTIQUE HIGHTAC",
      whatsapp: "WhatsApp",
      back_home: "Catégories",
      send_whatsapp: "Envoyer sur WhatsApp",
      open_whatsapp: "Ouvrir WhatsApp",
      search_label: "Recherche",
      search_placeholder: "Rechercher un code, modèle, couleur",
      notice: "Catalogue casque basé sur les données du fichier Excel ; le devis final fait foi.",
      hero_copy: "Choisissez une catégorie de casque et ajoutez les modèles au panier.",
      items_count: "{count} modèle(s)",
      no_items: "Aucun casque trouvé.",
      loading: "Chargement...",
      code: "Code",
      category: "Catégorie",
      mold: "Moule",
      description: "Description",
      logo: "Logo",
      carton_pcs: "CTN/PCS",
      carton_spec: "Carton",
      sizes: "Taille",
      weight: "Poids",
      volume: "Volume",
      remark: "Remarque",
      qty: "Qté",
      cart: "Panier",
      cart_empty: "Le panier est vide.",
      cart_lines: "{count} modèle(s)",
      cart_total: "Qté {count}",
      close: "Fermer",
      success_ready: "Votre message WhatsApp est prêt.",
      success_missing: "Aucun message trouvé.",
      toast_empty: "Le panier est vide.",
      image_unavailable: "Image indisponible",
      language_en: "English",
      language_fr: "Français",
      language_ar: "العربية"
    },
    en: {
      dir: "ltr",
      home_title: "HIGHTAC Helmets",
      category_title: "{category}",
      success_title: "Message ready",
      shop: "HIGHTAC SHOP",
      whatsapp: "WhatsApp",
      back_home: "Categories",
      send_whatsapp: "Send to WhatsApp",
      open_whatsapp: "Open WhatsApp",
      search_label: "Search",
      search_placeholder: "Search code, model, color",
      notice: "Helmet catalogue is based on the Excel data; final quotation applies.",
      hero_copy: "Choose a helmet category and add models to the shared cart.",
      items_count: "{count} model(s)",
      no_items: "No helmets found.",
      loading: "Loading...",
      code: "Code",
      category: "Category",
      mold: "Mold",
      description: "Description",
      logo: "Logo",
      carton_pcs: "CTN/PCS",
      carton_spec: "Carton",
      sizes: "Size",
      weight: "Weight",
      volume: "Volume",
      remark: "Remark",
      qty: "Qty",
      cart: "Cart",
      cart_empty: "Cart is empty.",
      cart_lines: "{count} model(s)",
      cart_total: "Qty {count}",
      close: "Close",
      success_ready: "Your WhatsApp message is ready.",
      success_missing: "No message found.",
      toast_empty: "Cart is empty.",
      image_unavailable: "Image unavailable",
      language_en: "English",
      language_fr: "French",
      language_ar: "Arabic"
    },
    ar: {
      dir: "rtl",
      home_title: "خوذات HIGHTAC",
      category_title: "{category}",
      success_title: "الرسالة جاهزة",
      shop: "متجر HIGHTAC",
      whatsapp: "واتساب",
      back_home: "الفئات",
      send_whatsapp: "إرسال إلى واتساب",
      open_whatsapp: "افتح واتساب",
      search_label: "بحث",
      search_placeholder: "ابحث بالرمز أو الموديل أو اللون",
      notice: "كتالوج الخوذات مبني على بيانات ملف Excel؛ ويُعتمد عرض السعر النهائي.",
      hero_copy: "اختر فئة الخوذة وأضف الموديلات إلى السلة المشتركة.",
      items_count: "{count} موديل",
      no_items: "لا توجد خوذات.",
      loading: "جارٍ التحميل...",
      code: "الرمز",
      category: "الفئة",
      mold: "القالب",
      description: "الوصف",
      logo: "الشعار",
      carton_pcs: "CTN/PCS",
      carton_spec: "الكرتون",
      sizes: "المقاس",
      weight: "الوزن",
      volume: "الحجم",
      remark: "ملاحظة",
      qty: "الكمية",
      cart: "السلة",
      cart_empty: "السلة فارغة.",
      cart_lines: "{count} موديل",
      cart_total: "الكمية {count}",
      close: "إغلاق",
      success_ready: "رسالة واتساب جاهزة.",
      success_missing: "لا توجد رسالة.",
      toast_empty: "السلة فارغة.",
      image_unavailable: "لا توجد صورة",
      language_en: "English",
      language_fr: "Français",
      language_ar: "العربية"
    }
  };

  var state = {
    lang: readStorage(LANG_KEY, DEFAULT_LANG),
    catalog: null,
    productIndex: {},
    categoryIndex: {},
    currentCategory: ""
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    state.catalog = window.HIGHTAC_HELMET_DATA || { categories: [], products: [], whatsapp: "8613602489689" };
    buildIndexes();
    state.currentCategory = document.body.getAttribute("data-category") || "";
    initLanguageSwitchers();
    initImageProtection();
    initCartShell();
    initPage();
    applyLanguage();
  }

  function buildIndexes() {
    state.productIndex = {};
    state.categoryIndex = {};
    (state.catalog.categories || []).forEach(function (category) {
      state.categoryIndex[category.slug] = category;
    });
    (state.catalog.products || []).forEach(function (product) {
      state.productIndex[product.id] = product;
    });
  }

  function initPage() {
    var page = document.body.getAttribute("data-page");
    if (page === "home") {
      renderHome();
    } else if (page === "category") {
      renderCategoryPage();
    } else if (page === "success") {
      renderSuccessPage();
    }

    var submit = document.querySelector("[data-submit-cart]");
    if (submit) {
      submit.addEventListener("click", submitCart);
    }
  }

  function initLanguageSwitchers() {
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.lang = button.getAttribute("data-lang") || DEFAULT_LANG;
        writeStorage(LANG_KEY, state.lang);
        applyLanguage();
        refreshVisiblePage();
      });
    });
  }

  function refreshVisiblePage() {
    var page = document.body.getAttribute("data-page");
    if (page === "home") {
      renderHome();
    } else if (page === "category") {
      renderCategoryPage();
    } else if (page === "success") {
      renderSuccessPage();
    }
    updateCart();
  }

  function applyLanguage() {
    var locale = LOCALES[state.lang] || LOCALES[DEFAULT_LANG];
    document.documentElement.lang = state.lang;
    document.documentElement.dir = locale.dir;
    document.body.classList.toggle("is-rtl", locale.dir === "rtl");

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      node.setAttribute("placeholder", t(node.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      var lang = button.getAttribute("data-lang");
      button.classList.toggle("is-active", lang === state.lang);
      button.textContent = t("language_" + lang);
    });

    updateTitle();
    updateCart();
  }

  function updateTitle() {
    var page = document.body.getAttribute("data-page");
    if (page === "category") {
      document.title = categoryTitle(state.categoryIndex[state.currentCategory]) + " | HIGHTAC";
    } else if (page === "success") {
      document.title = t("success_title");
    } else {
      document.title = t("home_title");
    }
  }

  function renderHome() {
    var grid = document.querySelector("[data-category-grid]");
    if (!grid) {
      return;
    }
    grid.innerHTML = (state.catalog.categories || []).map(function (category) {
      return '<a class="category-card" href="./' + escapeAttr(category.page) + '">' +
        '<div class="category-card__image">' +
          (category.coverImage
            ? '<img src="./' + escapeAttr(category.coverImage) + '" alt="' + escapeAttr(categoryTitle(category)) + '" loading="lazy" draggable="false" data-protected-image>'
            : '<span>' + escapeHtml(t("image_unavailable")) + '</span>') +
        '</div>' +
        '<div class="category-card__body">' +
          '<div class="category-card__name">' + escapeHtml(categoryTitle(category)) + '</div>' +
          '<div class="category-card__meta">' + escapeHtml(t("items_count", { count: category.count || 0 })) + '</div>' +
        '</div>' +
      '</a>';
    }).join("");
  }

  function renderCategoryPage() {
    var category = state.categoryIndex[state.currentCategory];
    var title = document.querySelector("[data-category-title]");
    var count = document.querySelector("[data-category-count]");
    var search = document.querySelector("[data-search]");
    var list = document.querySelector("[data-products]");
    var empty = document.querySelector("[data-empty]");
    if (!category || !list) {
      return;
    }

    if (title) {
      title.textContent = categoryTitle(category);
    }
    if (count) {
      count.textContent = t("items_count", { count: category.count || 0 });
    }

    function render() {
      var query = cleanText(search ? search.value : "").toLowerCase();
      var products = getCategoryProducts(category.slug).filter(function (product) {
        return !query || (product.searchText || "").indexOf(query) !== -1;
      });
      list.innerHTML = products.map(renderProductCard).join("");
      if (empty) {
        empty.hidden = products.length > 0;
      }
      attachProductEvents(list);
    }

    if (search && !search.getAttribute("data-ready")) {
      search.setAttribute("data-ready", "1");
      search.addEventListener("input", render);
    }
    render();
  }

  function getCategoryProducts(slug) {
    return (state.catalog.products || []).filter(function (product) {
      return product.category === slug;
    });
  }

  function renderProductCard(product) {
    var quantity = getQuantity(product.id);
    return '<article class="helmet-card" data-product-id="' + escapeAttr(product.id) + '">' +
      '<div class="helmet-card__media-strip" aria-label="' + escapeAttr(product.code) + '">' + renderProductImages(product) + '</div>' +
      '<div class="helmet-card__body">' +
        '<div class="helmet-card__topline">' +
          '<span class="helmet-card__code">' + escapeHtml(product.code) + '</span>' +
          '<span class="helmet-card__category">' + escapeHtml(productCategoryTitle(product)) + '</span>' +
        '</div>' +
        '<h2 class="helmet-card__name">' + escapeHtml(product.displayName || product.description || product.moldNo || product.code) + '</h2>' +
        (product.moldNo ? '<div class="helmet-card__mold">' + escapeHtml(product.moldNo) + '</div>' : '') +
        '<div class="meta-grid">' + renderMeta(product) + '</div>' +
        renderQtyControls(product.id, quantity, false) +
      '</div>' +
    '</article>';
  }

  function renderProductImages(product) {
    var images = product.images || [];
    if (!images.length) {
      return '<div class="helmet-card__image-frame"><span class="helmet-card__empty-image">' + escapeHtml(t("image_unavailable")) + '</span></div>';
    }
    return images.map(function (image, index) {
      return '<div class="helmet-card__image-frame">' +
        '<img src="./' + escapeAttr(image.src) + '" alt="' + escapeAttr(product.code + " image " + (index + 1)) + '" loading="lazy" draggable="false" data-protected-image>' +
      '</div>';
    }).join("");
  }

  function renderMeta(product) {
    var fields = [
      ["mold", product.moldNo],
      ["description", product.description],
      ["logo", product.logoAvailable],
      ["carton_pcs", product.cartonPcs],
      ["carton_spec", product.cartonSpec],
      ["sizes", product.sizes],
      ["weight", product.weight],
      ["volume", product.volume],
      ["remark", product.remark]
    ];
    return fields.filter(function (field) {
      return cleanText(field[1]);
    }).map(function (field) {
      return '<div class="meta-pill"><strong>' + escapeHtml(t(field[0])) + '</strong>' + escapeHtml(field[1]) + '</div>';
    }).join("");
  }

  function renderQtyControls(id, quantity, isCart) {
    var inputAttr = isCart ? "data-cart-qty-input" : "data-qty-input";
    var actionAttr = isCart ? "data-cart-action" : "data-action";
    return '<div class="qty-controls">' +
      '<button class="qty-button" type="button" ' + actionAttr + '="minus10" data-id="' + escapeAttr(id) + '">-10</button>' +
      '<div class="qty-box">' +
        '<span>' + escapeHtml(t("qty")) + '</span>' +
        '<input type="number" min="0" step="1" inputmode="numeric" value="' + escapeAttr(String(quantity)) + '" ' + inputAttr + ' data-id="' + escapeAttr(id) + '" aria-label="' + escapeAttr(t("qty")) + '">' +
      '</div>' +
      '<button class="qty-button qty-button--plus" type="button" ' + actionAttr + '="plus10" data-id="' + escapeAttr(id) + '">+10</button>' +
      '<button class="qty-button qty-button--plus" type="button" ' + actionAttr + '="plus100" data-id="' + escapeAttr(id) + '">+100</button>' +
    '</div>';
  }

  function attachProductEvents(root) {
    root.querySelectorAll("[data-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var product = state.productIndex[button.getAttribute("data-id")];
        if (!product) {
          return;
        }
        var action = button.getAttribute("data-action");
        var current = getQuantity(product.id);
        if (action === "minus10") {
          setQuantity(product, current - 10);
        } else if (action === "plus10") {
          setQuantity(product, current + 10);
        } else if (action === "plus100") {
          setQuantity(product, current + 100);
        }
      });
    });

    root.querySelectorAll("[data-qty-input]").forEach(function (input) {
      input.addEventListener("change", function () {
        commitInput(input);
      });
      input.addEventListener("blur", function () {
        commitInput(input);
      });
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          input.blur();
        }
      });
    });
  }

  function commitInput(input) {
    var product = state.productIndex[input.getAttribute("data-id")];
    if (!product) {
      return;
    }
    setQuantity(product, parseQuantity(input.value));
  }

  function initCartShell() {
    if (document.querySelector("[data-cart-toggle]")) {
      updateCart();
      return;
    }
    var shell = document.createElement("div");
    shell.innerHTML =
      '<button class="cart-fab" type="button" data-cart-toggle>' +
        '<span class="cart-fab__label"></span>' +
        '<span class="cart-fab__count" data-cart-count>0</span>' +
      '</button>' +
      '<div class="cart-mask" data-cart-mask hidden></div>' +
      '<aside class="cart-drawer" data-cart-drawer aria-hidden="true">' +
        '<div class="cart-drawer__header">' +
          '<strong data-cart-title></strong>' +
          '<button class="cart-drawer__close" type="button" data-cart-close>&times;</button>' +
        '</div>' +
        '<div class="cart-drawer__summary">' +
          '<span data-cart-lines></span>' +
          '<span data-cart-total></span>' +
        '</div>' +
        '<div class="cart-drawer__body" data-cart-items></div>' +
        '<div class="cart-drawer__footer">' +
          '<button class="cart-drawer__send" type="button" data-cart-submit></button>' +
        '</div>' +
      '</aside>' +
      '<div class="toast-root" data-toast-root></div>';
    document.body.appendChild(shell);

    document.querySelector("[data-cart-toggle]").addEventListener("click", openCart);
    document.querySelector("[data-cart-mask]").addEventListener("click", closeCart);
    document.querySelector("[data-cart-close]").addEventListener("click", closeCart);
    document.querySelector("[data-cart-submit]").addEventListener("click", submitCart);
    document.querySelector("[data-cart-items]").addEventListener("click", handleCartClick);
    document.querySelector("[data-cart-items]").addEventListener("change", handleCartInput);
    document.querySelector("[data-cart-items]").addEventListener("blur", handleCartInput, true);
    document.querySelector("[data-cart-items]").addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target && event.target.matches("[data-cart-qty-input]")) {
        event.target.blur();
      }
    });
    updateCart();
  }

  function openCart() {
    var drawer = document.querySelector("[data-cart-drawer]");
    var mask = document.querySelector("[data-cart-mask]");
    if (drawer && mask) {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      mask.hidden = false;
      updateCart();
    }
  }

  function closeCart() {
    var drawer = document.querySelector("[data-cart-drawer]");
    var mask = document.querySelector("[data-cart-mask]");
    if (drawer && mask) {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      mask.hidden = true;
    }
  }

  function handleCartClick(event) {
    var button = event.target.closest("[data-cart-action]");
    if (!button) {
      return;
    }
    var product = state.productIndex[button.getAttribute("data-id")];
    if (!product) {
      return;
    }
    var current = getQuantity(product.id);
    var action = button.getAttribute("data-cart-action");
    if (action === "minus10") {
      setQuantity(product, current - 10);
    } else if (action === "plus10") {
      setQuantity(product, current + 10);
    } else if (action === "plus100") {
      setQuantity(product, current + 100);
    }
  }

  function handleCartInput(event) {
    var input = event.target.closest("[data-cart-qty-input]");
    if (!input) {
      return;
    }
    var product = state.productIndex[input.getAttribute("data-id")];
    if (product) {
      setQuantity(product, parseQuantity(input.value));
    }
  }

  function updateCart() {
    var summary = getCartSummary();
    var toggle = document.querySelector("[data-cart-toggle]");
    var label = document.querySelector(".cart-fab__label");
    var count = document.querySelector("[data-cart-count]");
    var title = document.querySelector("[data-cart-title]");
    var lines = document.querySelector("[data-cart-lines]");
    var total = document.querySelector("[data-cart-total]");
    var itemsHost = document.querySelector("[data-cart-items]");
    var submit = document.querySelector("[data-cart-submit]");
    var close = document.querySelector("[data-cart-close]");
    if (label) label.textContent = t("cart");
    if (count) count.textContent = String(summary.totalQuantity);
    if (toggle) toggle.setAttribute("aria-label", t("cart"));
    if (title) title.textContent = t("cart");
    if (lines) lines.textContent = t("cart_lines", { count: summary.lineCount });
    if (total) total.textContent = t("cart_total", { count: summary.totalQuantity });
    if (submit) {
      submit.textContent = t("send_whatsapp");
      submit.disabled = summary.lineCount === 0;
    }
    if (close) close.setAttribute("aria-label", t("close"));
    if (!itemsHost) {
      return;
    }
    if (!summary.items.length) {
      itemsHost.innerHTML = '<div class="empty-state">' + escapeHtml(t("cart_empty")) + '</div>';
      return;
    }
    itemsHost.innerHTML = summary.items.map(renderCartItem).join("");
  }

  function renderCartItem(item) {
    var image = item.images && item.images[0] ? item.images[0].src : "";
    return '<article class="cart-item" data-cart-product-id="' + escapeAttr(item.id) + '">' +
      '<div class="cart-item__image">' +
        (image
          ? '<img src="./' + escapeAttr(image) + '" alt="' + escapeAttr(item.code) + '" loading="lazy" draggable="false" data-protected-image>'
          : '<span>' + escapeHtml(t("image_unavailable")) + '</span>') +
      '</div>' +
      '<div class="cart-item__body">' +
        '<div class="cart-item__name">' + escapeHtml(item.displayName || item.description || item.code) + '</div>' +
        '<div class="cart-item__meta">' + escapeHtml(productCategoryTitle(item)) + ' | ' + escapeHtml(t("code")) + ': ' + escapeHtml(item.code) + '</div>' +
        renderQtyControls(item.id, item.quantity, true) +
      '</div>' +
    '</article>';
  }

  function buildCartItem(product, quantity) {
    return {
      id: product.id,
      code: product.code,
      category: product.category,
      categoryTitleEn: product.categoryTitleEn,
      categoryTitleFr: product.categoryTitleFr,
      categoryTitleAr: product.categoryTitleAr,
      displayName: product.displayName,
      moldNo: product.moldNo,
      description: product.description,
      logoAvailable: product.logoAvailable,
      cartonPcs: product.cartonPcs,
      cartonSpec: product.cartonSpec,
      sizes: product.sizes,
      remark: product.remark,
      images: product.images || [],
      quantity: Math.max(0, Math.floor(Number(quantity) || 0))
    };
  }

  function loadCart() {
    var raw = readStorage(CART_KEY, "{}");
    try {
      var parsed = JSON.parse(raw || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function saveCart(cart) {
    writeStorage(CART_KEY, JSON.stringify(cart));
    updateCart();
  }

  function getQuantity(id) {
    var cart = loadCart();
    return cart[id] ? cart[id].quantity : 0;
  }

  function setQuantity(product, quantity) {
    var next = Math.max(0, Math.floor(Number(quantity) || 0));
    var cart = loadCart();
    if (next <= 0) {
      delete cart[product.id];
    } else {
      cart[product.id] = buildCartItem(product, next);
    }
    saveCart(cart);
    updateProductInput(product.id, next);
  }

  function updateProductInput(id, quantity) {
    document.querySelectorAll('[data-id="' + cssEscape(id) + '"][data-qty-input], [data-id="' + cssEscape(id) + '"][data-cart-qty-input]').forEach(function (input) {
      if (document.activeElement !== input) {
        input.value = String(quantity);
      }
    });
  }

  function getCartSummary() {
    var cart = loadCart();
    var items = Object.keys(cart).map(function (key) {
      var product = state.productIndex[key];
      return product ? buildCartItem(product, cart[key].quantity) : cart[key];
    }).filter(function (item) {
      return item && item.quantity > 0;
    }).sort(function (a, b) {
      return productCategoryTitle(a).localeCompare(productCategoryTitle(b)) || String(a.code).localeCompare(String(b.code));
    });
    return {
      items: items,
      lineCount: items.length,
      totalQuantity: items.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0)
    };
  }

  function submitCart() {
    var summary = getCartSummary();
    if (!summary.items.length) {
      showToast(t("toast_empty"));
      return;
    }
    var payload = {
      createdAt: new Date().toISOString(),
      items: summary.items,
      message: buildWhatsAppMessage(summary.items),
      url: buildWhatsAppUrl(summary.items)
    };
    writeStorage(SUBMISSION_KEY, JSON.stringify(payload));
    window.location.href = "./success.html";
  }

  function buildWhatsAppUrl(items) {
    var phone = state.catalog.whatsapp || "8613602489689";
    return "https://wa.me/" + encodeURIComponent(phone) + "?text=" + encodeURIComponent(buildWhatsAppMessage(items));
  }

  function buildWhatsAppMessage(items) {
    var lines = [
      "Helmet Order",
      "Catalogue: HIGHTAC Helmets",
      "Items:"
    ];
    items.forEach(function (item, index) {
      var details = [
        (index + 1) + ". [" + productCategoryTitleEn(item) + "]",
        item.code,
        item.displayName || item.description || "",
        item.moldNo ? "Mold: " + item.moldNo : "",
        item.sizes ? "Size: " + item.sizes : "",
        item.cartonPcs ? "CTN/PCS: " + item.cartonPcs : "",
        item.cartonSpec ? "Carton: " + item.cartonSpec : "",
        item.remark ? "Remark: " + item.remark : "",
        "Qty: " + item.quantity
      ].filter(Boolean);
      lines.push(details.join(" | "));
    });
    lines.push("");
    lines.push("Please send me the final quotation and delivery time.");
    return lines.join("\n");
  }

  function renderSuccessPage() {
    var panel = document.querySelector("[data-success-panel]");
    if (!panel) {
      return;
    }
    var raw = readStorage(SUBMISSION_KEY, "");
    var submission = null;
    try {
      submission = JSON.parse(raw || "null");
    } catch (error) {
      submission = null;
    }
    if (!submission || !submission.items || !submission.items.length) {
      panel.innerHTML = '<h1>' + escapeHtml(t("success_title")) + '</h1>' +
        '<p>' + escapeHtml(t("success_missing")) + '</p>' +
        '<a class="success-button" href="./index.html">' + escapeHtml(t("back_home")) + '</a>';
      return;
    }
    panel.innerHTML = '<h1>' + escapeHtml(t("success_title")) + '</h1>' +
      '<p>' + escapeHtml(t("success_ready")) + '</p>' +
      '<div class="summary-list">' + submission.items.map(function (item) {
        return '<div class="summary-item"><strong>' + escapeHtml(item.code) + '</strong> | ' +
          escapeHtml(productCategoryTitle(item)) + ' | ' +
          escapeHtml(item.displayName || item.description || "") + ' | ' +
          escapeHtml(t("qty")) + ' ' + escapeHtml(item.quantity) + '</div>';
      }).join("") + '</div>' +
      '<a class="success-button" href="' + escapeAttr(submission.url || buildWhatsAppUrl(submission.items)) + '" target="_blank" rel="noopener">' + escapeHtml(t("open_whatsapp")) + '</a>';
  }

  function initImageProtection() {
    var selector = "img, [data-protected-image], .helmet-card__image-frame, .category-card__image, .cart-item__image";
    document.addEventListener("contextmenu", function (event) {
      if (event.target.closest(selector)) {
        event.preventDefault();
      }
    });
    document.addEventListener("dragstart", function (event) {
      if (event.target.closest(selector)) {
        event.preventDefault();
      }
    });
    var timer = null;
    document.addEventListener("touchstart", function (event) {
      if (!event.target.closest(selector)) {
        return;
      }
      timer = window.setTimeout(function () {
        try {
          event.preventDefault();
        } catch (error) {
          // Some browsers keep touch events passive; CSS still disables callout.
        }
      }, 420);
    }, { passive: false });
    ["touchend", "touchmove", "touchcancel"].forEach(function (name) {
      document.addEventListener(name, function () {
        if (timer) {
          window.clearTimeout(timer);
          timer = null;
        }
      }, { passive: true });
    });
  }

  function showToast(message) {
    var root = document.querySelector("[data-toast-root]");
    if (!root) {
      return;
    }
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    root.appendChild(toast);
    window.setTimeout(function () {
      toast.remove();
    }, 2200);
  }

  function categoryTitle(category) {
    if (!category) {
      return "";
    }
    if (state.lang === "ar") return category.titleAr || category.titleEn || "";
    if (state.lang === "fr") return category.titleFr || category.titleEn || "";
    return category.titleEn || "";
  }

  function productCategoryTitle(product) {
    if (!product) {
      return "";
    }
    if (state.lang === "ar") return product.categoryTitleAr || product.categoryTitleEn || "";
    if (state.lang === "fr") return product.categoryTitleFr || product.categoryTitleEn || "";
    return product.categoryTitleEn || "";
  }

  function productCategoryTitleEn(product) {
    return (product && product.categoryTitleEn) || "";
  }

  function parseQuantity(value) {
    return Math.max(0, Math.floor(Number(value) || 0));
  }

  function t(key, vars) {
    var locale = LOCALES[state.lang] || LOCALES[DEFAULT_LANG];
    var text = locale[key] || LOCALES.en[key] || key;
    Object.keys(vars || {}).forEach(function (name) {
      text = text.replace("{" + name + "}", vars[name]);
    });
    return text;
  }

  function cleanText(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return String(value).replace(/["\\]/g, "\\$&");
  }

  function readStorage(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Continue without persistence when storage is unavailable.
    }
  }
})();
