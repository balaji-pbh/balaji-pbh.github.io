/* ============================================================
   MAIN SCRIPT - BALAJI GARMENTS
   STORIES WORLD MECHANISM
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  
  // ===== HELPERS =====
  const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");
  const esc = v => String(v ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m] || m));
  
  const shopName = () => (typeof SHOP !== "undefined" ? SHOP.name : "YOUR SHOP");
  const baseUrl = () => {
    if (typeof SHOP !== "undefined" && SHOP.websiteUrl && !SHOP.websiteUrl.includes("YOUR-USERNAME")) {
      return SHOP.websiteUrl.replace(/\/?$/, "/");
    }
    return location.href.split(/index\.html|product-list\.html|product-page\.html/)[0];
  };
  
  const productUrl = (p) => baseUrl() + "product-page.html?id=" + p.id;
  const categoryUrl = (c) => baseUrl() + "product-list.html?category=" + c.id;
  
  // ===== SHOP NAME & HEADER =====
  document.querySelectorAll("#shopName").forEach(e => e.textContent = shopName());
  if ($("#footName")) $("#footName").textContent = shopName();
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
  if ($("#logo") && typeof SHOP !== "undefined" && SHOP.headerLogo) $("#logo").src = SHOP.headerLogo;
  if ($("#banner") && typeof SHOP !== "undefined" && SHOP.bannerImage) $("#banner").src = SHOP.bannerImage;
  
  // ===== CATEGORY FUNCTIONS =====
  function categoryById(id) { return (typeof CATEGORIES !== "undefined" ? CATEGORIES : []).find(c => c.id === id); }
  function productById(id) { return (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).find(p => p.id === id); }
  function productsByCategory(catId) { return (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).filter(p => p.category === catId); }
  
  // ============================================================
  // 1. HOMEPAGE - CATEGORIES + SEARCH + TOP PRODUCTS
  // ============================================================
  
  if ($("#categories")) {
    const list = CATEGORIES || [];
    $("#catCount").textContent = list.length + " categories";
    $("#categories").innerHTML = list.map(c => `
      <a class="category" href="${categoryUrl(c)}">
        <img loading="lazy" src="${c.image}" alt="${esc(c.name)}">
        <div class="categoryBody">
          <div class="categoryName">${esc(c.name)}</div>
          <div class="categoryMeta">${productsByCategory(c.id).length} products →</div>
        </div>
      </a>
    `).join("");
  }
  
  // ===== TOP PRODUCTS =====
// ===== TOP PRODUCTS =====
if ($("#topProducts")) {
  const topProducts = PRODUCTS.slice(0, 4);

  $("#topProducts").innerHTML = topProducts.map(p => `
    <a class="card" href="${productUrl(p)}">

      <button
        class="share"
        data-share="${esc(p.id)}"
        type="button"
        aria-label="Share product"
      >↗</button>

      <img
        class="pic"
        loading="lazy"
        src="${p.images?.[0] || ''}"
        alt="${esc(p.name)}"
      >

      <div class="body">

        <div class="name">
          ${esc(p.name)}
        </div>

        <div class="price">
          ${money(p.price)}
          ${p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span>` : ''}
          ${p.discount ? `<span class="off">${p.discount}% OFF</span>` : ''}
        </div>

        <div class="rating">
          ★ ${Number(p.rating || 0).toFixed(1)}
          (${p.ratingCount || 0})
        </div>

      </div>

    </a>
  `).join("");
}
  
  // ===== HOMEPAGE SEARCH =====
  if ($("#searchInput")) {
    $("#searchInput").addEventListener("input", function() {
      const value = this.value.toLowerCase().trim();
      const results = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(value) || 
        p.category.toLowerCase().includes(value) ||
        p.description.toLowerCase().includes(value)
      );
      
      const container = $("#categories");
      if (value === "") {
        const list = CATEGORIES || [];
        container.innerHTML = list.map(c => `
          <a class="category" href="${categoryUrl(c)}">
            <img loading="lazy" src="${c.image}" alt="${esc(c.name)}">
            <div class="categoryBody">
              <div class="categoryName">${esc(c.name)}</div>
              <div class="categoryMeta">${productsByCategory(c.id).length} products →</div>
            </div>
          </a>
        `).join("");
        return;
      }
      
      if (results.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--muted);">No products found.</div>`;
        return;
      }
      
      container.innerHTML = results.map(p => `
        <a class="category" href="${productUrl(p)}" style="text-decoration:none;color:inherit;">
          <img loading="lazy" src="${p.images?.[0] || ''}" alt="${esc(p.name)}">
          <div class="categoryBody">
            <div class="categoryName">${esc(p.name)}</div>
            <div class="categoryMeta">${money(p.price)} • ${esc(p.category)}</div>
          </div>
        </a>
      `).join("");
    });
  }
  
  // ============================================================
  // 2. PRODUCT LIST PAGE
  // ============================================================
  
  if ($("#products")) {
    const catId = params.get("category");
    const cat = categoryById(catId);
    
    if (!cat) {
      $("#catName").textContent = "Category not found";
      $("#products").innerHTML = `<div class="empty">Category not found.</div>`;
      return;
    }
    
    $("#catName").textContent = cat.name;
    $("#catDesc").textContent = "Browse products in " + cat.name + " category.";
    document.title = cat.name + " | " + shopName();
    
    const products = productsByCategory(cat.id);
    document.querySelector(".count").textContent = products.length + " items";
    
    function renderProducts(data) {
      if (data.length === 0) {
        $("#products").innerHTML = `<div class="empty">No products in this category yet.</div>`;
        return;
      }
      
      $("#products").innerHTML = data.map(p => `
        <a class="card" href="${productUrl(p)}">
          <button class="share" data-share="${esc(p.id)}" type="button">↗</button>
          <img class="pic" loading="lazy" src="${p.images?.[0] || ''}" alt="${esc(p.name)}">
          <div class="body">
            <div class="name">${esc(p.name)}</div>
            <div class="price">${money(p.price)} ${p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span>` : ''}${p.discount ? `<span class="off">${p.discount}% OFF</span>` : ''}</div>
            <div class="rating">★ ${Number(p.rating || 0).toFixed(1)} (${p.ratingCount || 0})</div>
          </div>
        </a>
      `).join("");
    }
    
    renderProducts(products);
    
    // ===== LIST PAGE SEARCH =====
    if ($("#searchInput")) {
      $("#searchInput").addEventListener("input", function() {
        const value = this.value.toLowerCase().trim();
        const filtered = products.filter(p => 
          p.name.toLowerCase().includes(value) || 
          p.description.toLowerCase().includes(value)
        );
        renderProducts(filtered);
        document.querySelector(".count").textContent = filtered.length + " items";
      });
    }
  }
  
  // ============================================================
  // 3. PRODUCT PAGE
  // ============================================================
  
  if ($("#mainImg")) {
    const p = productById(params.get("id"));
    
    if (!p) {
      document.querySelector(".info").innerHTML = `<h1 class="name">Product not found</h1>`;
      return;
    }
    
    let index = 0;
    const images = p.images || [];
    
    // Set product details
    $("#name").textContent = p.name;
    $("#pid").textContent = "Product ID: " + p.id;
    $("#price").textContent = money(p.price);
    $("#old").textContent = p.oldPrice ? money(p.oldPrice) : "";
    $("#off").textContent = p.discount ? p.discount + "% OFF" : "";
    $("#description").textContent = p.description || "No description added.";
    
    // Details
    $("#details").innerHTML = Object.entries(p.details || {}).map(([k, v]) => `
      <div class="detail">
        <span>${esc(k)}</span>
        <b>${esc(String(v))}</b>
      </div>
    `).join("");
    
    // SEO
    document.title = p.name + " | " + shopName();
    const desc = p.description || "";
    if ($("#metaDesc")) $("#metaDesc").content = desc.slice(0, 160);
    if ($("#ogTitle")) $("#ogTitle").content = document.title;
    if ($("#ogDesc")) $("#ogDesc").content = desc;
    if ($("#ogImage")) $("#ogImage").content = images[0] || "";
    if ($("#ogUrl")) $("#ogUrl").content = productUrl(p);
    if ($("#canonical")) $("#canonical").href = productUrl(p);
    
    // Gallery
    function renderGallery() {
      $("#mainImg").src = images[index] || "";
      $("#mainImg").alt = p.name;
      
      $("#dots").innerHTML = images.map((_, i) => `
        <span class="dot ${i === index ? 'active' : ''}"></span>
      `).join("");
      
      $("#thumbs").innerHTML = images.map((src, i) => `
        <img class="thumb ${i === index ? 'active' : ''}" src="${src}" data-i="${i}" alt="">
      `).join("");
      
      $$(".thumb").forEach(t => t.onclick = () => { index = +t.dataset.i; renderGallery(); });
    }
    renderGallery();
    
    // Lightbox
    $("#mainImg").onclick = () => {
      $("#lightbox").classList.add("show");
      $("#lightImg").src = images[index] || "";
    };
    
    const closeLb = () => $("#lightbox").classList.remove("show");
    $("#closeLb").onclick = closeLb;
    
    $("#prevLb").onclick = () => {
      index = (index - 1 + images.length) % images.length;
      renderGallery();
      $("#lightImg").src = images[index] || "";
    };
    
    $("#nextLb").onclick = () => {
      index = (index + 1) % images.length;
      renderGallery();
      $("#lightImg").src = images[index] || "";
    };
    
    // Swipe
    let sx = 0;
    $("#lightbox").addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
    $("#lightbox").addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) {
        if (dx < 0) $("#nextLb").click();
        else $("#prevLb").click();
      }
    }, { passive: true });
    
    // ===== RATING =====
    const savedRating = localStorage.getItem("rating_" + p.id);
    if (savedRating) {
      const stars = document.querySelectorAll(".star");
      stars.forEach(s => s.classList.toggle("on", +s.dataset.rate <= +savedRating));
      if ($("#thanks")) $("#thanks").textContent = "You rated this " + savedRating + " stars. Thanks!";
    }
    
    document.querySelectorAll(".star").forEach(s => s.onclick = () => {
      const rate = +s.dataset.rate;
      document.querySelectorAll(".star").forEach(x => x.classList.toggle("on", +x.dataset.rate <= rate));
      localStorage.setItem("rating_" + p.id, rate);
      if ($("#thanks")) $("#thanks").textContent = "Thanks! You rated " + rate + " stars.";
    });
    
    // ===== RECENTLY VIEWED =====
    localStorage.setItem("recently_viewed", p.id);
    
    // ===== SHARE =====
    if ($("#shareBtn")) {
      $("#shareBtn").onclick = () => {
        const url = productUrl(p);
        const text = `${p.name} — ${money(p.price)}\nProduct ID: ${p.id}\n${url}`;
        if (navigator.share) {
          navigator.share({ title: p.name, text, url }).catch(() => {});
        } else {
          navigator.clipboard?.writeText(text).then(() => alert("Product link copied."));
        }
      };
    }
    
    // ===== WHATSAPP =====
    if ($("#waBtn")) {
      $("#waBtn").onclick = () => {
        const number = (SHOP.ownerWhatsApp || "").replace(/\D/g, "");
        if (!number || number.includes("XXXXXXXX")) {
          alert("Owner WhatsApp number is not configured in data.js.");
          return;
        }
        const url = productUrl(p);
        const text = `Hello, I am interested in this product.\n\nProduct: ${p.name}\nProduct ID: ${p.id}\nPrice: ${money(p.price)}\nLink: ${url}`;
        location.href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
      };
    }
  }
  
  // ===== SHARE BUTTON ON PRODUCT LIST =====
  $$("[data-share]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const p = productById(btn.dataset.share);
      if (!p) return;
      const url = productUrl(p);
      const text = `${p.name} — ${money(p.price)}\n${url}`;
      if (navigator.share) {
        navigator.share({ title: p.name, text, url }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(text).then(() => alert("Product link copied."));
      }
    });
  });
  
})();
