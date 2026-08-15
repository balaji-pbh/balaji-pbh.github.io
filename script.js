/* =========================================================
   CUSTOMER-SIDE JAVASCRIPT
   ========================================================= */
(() => {
  const $ = s => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");
  const shopName = () => (typeof SHOP !== "undefined" ? SHOP.name : "YOUR SHOP");
  const baseUrl = () => {
    if (typeof SHOP !== "undefined" && SHOP.websiteUrl && !SHOP.websiteUrl.includes("YOUR-USERNAME")) {
      return SHOP.websiteUrl.replace(/\/?$/, "/");
    }
    return location.href.split(/index\.html|product-list\.html|product-page\.html/)[0];
  };
  const productUrl = p => baseUrl() + "products/" + ((p.seo && p.seo.slug) || p.id.toLowerCase()) + ".html";
  const staticCategoryUrl = c => baseUrl() + "categories/" + ((c.seo && c.seo.slug) || c.id) + ".html";

  document.querySelectorAll("#shopName").forEach(e => e.textContent = shopName());
  if ($("#footName")) $("#footName").textContent = shopName();
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
  if ($("#logo") && typeof SHOP !== "undefined" && SHOP.headerLogo) $("#logo").src = SHOP.headerLogo;
  if ($("#banner") && typeof SHOP !== "undefined" && SHOP.bannerImage) $("#banner").src = SHOP.bannerImage;

  function categoryById(id){ return (typeof CATEGORIES !== "undefined" ? CATEGORIES : []).find(c => c.id === id); }
  function productById(id){ return (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).find(p => p.id === id); }

  // Homepage
  if ($("#categories")) {
    const list = CATEGORIES || [];
    $("#catCount").textContent = list.length + " categories";
    $("#categories").innerHTML = list.map(c => `
      <a class="category" href="${staticCategoryUrl(c)}">
        <img loading="lazy" src="${c.image}" alt="${escapeHtml(c.name)}">
        <div class="categoryBody"><div class="categoryName">${escapeHtml(c.name)}</div><div class="categoryMeta">View products →</div></div>
      </a>`).join("");
  }

  // Category/product list
  if ($("#products")) {
    const cid = params.get("category");
    const cat = categoryById(cid) || CATEGORIES[0];
    if (!cat) return;
    $("#catName").textContent = cat.name;
    $("#catDesc").textContent = (cat.seo && cat.seo.description) || "Browse products in this category.";
    document.title = (cat.seo && cat.seo.title) || `${cat.name} | ${shopName()}`;
    $("#metaDesc").content = (cat.seo && cat.seo.description) || "";
    const products = PRODUCTS.filter(p => p.category === cat.id);
    $("#products").innerHTML = products.length ? products.map(p => `
      <a class="card" href="${productUrl(p)}">
        <button class="share" data-share="${encodeURIComponent(p.id)}" type="button">↗</button>
        <img class="pic" loading="lazy" src="${p.images?.[0] || ""}" alt="${escapeHtml(p.name)}">
        <div class="body"><div class="name">${escapeHtml(p.name)}</div><div class="price">${money(p.price)} <span class="old">${p.oldPrice ? money(p.oldPrice) : ""}</span>${p.discount ? `<span class="off">${p.discount}% OFF</span>` : ""}</div><div class="rating">★ ${Number(p.rating || 0).toFixed(1)} (${p.ratingCount || 0})</div></div>
      </a>`).join("") : `<div class="empty">No products in this category yet.</div>`;
    document.querySelectorAll("[data-share]").forEach(btn => btn.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation(); shareProduct(productById(decodeURIComponent(btn.dataset.share)));
    }));
  }

  // Product page
  if ($("#mainImg")) {
    const p = productById(params.get("id")) || PRODUCTS[0];
    if (!p) return;
    let index = 0;
    const images = p.images || [];
    $("#name").textContent = p.name;
    $("#pid").textContent = "Product ID: " + p.id;
    $("#price").textContent = money(p.price);
    $("#old").textContent = p.oldPrice ? money(p.oldPrice) : "";
    $("#off").textContent = p.discount ? p.discount + "% OFF" : "";
    $("#description").textContent = p.description || "No description added.";
    $("#details").innerHTML = Object.entries(p.details || {}).map(([k,v]) => `<div class="detail"><span>${escapeHtml(k)}</span><b>${escapeHtml(String(v))}</b></div>`).join("");
    document.title = (p.seo && p.seo.title) || `${p.name} | ${shopName()}`;
    const desc = (p.seo && p.seo.description) || p.description || "";
    $("#metaDesc").content = desc.slice(0, 160);
    $("#canonical").href = productUrl(p);
    $("#ogTitle").content = document.title; $("#ogDesc").content = desc; $("#ogImage").content = images[0] || ""; $("#ogUrl").content = productUrl(p);
    function render(){
      $("#mainImg").src = images[index] || "";
      $("#mainImg").alt = p.name;
      $("#dots").innerHTML = images.map((_,i)=>`<span class="dot ${i===index?"active":""}"></span>`).join("");
      $("#thumbs").innerHTML = images.map((src,i)=>`<img class="thumb ${i===index?"active":""}" src="${src}" data-i="${i}" alt="">`).join("");
      document.querySelectorAll(".thumb").forEach(t => t.onclick = () => { index=+t.dataset.i; render(); });
    }
    render();
    $("#mainImg").onclick = () => { $("#lightbox").classList.add("show"); $("#lightImg").src=images[index]||""; };
    const closeLb=()=>$("#lightbox").classList.remove("show");
    $("#closeLb").onclick=closeLb; $("#prevLb").onclick=()=>{index=(index-1+images.length)%images.length;render();$("#lightImg").src=images[index]||""};
    $("#nextLb").onclick=()=>{index=(index+1)%images.length;render();$("#lightImg").src=images[index]||""};
    let sx=0; $("#lightbox").addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
    $("#lightbox").addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50){if(dx<0)$("#nextLb").click();else $("#prevLb").click()}},{passive:true});
    const stars=$("#stars"); stars.innerHTML=[1,2,3,4,5].map(n=>`<button class="star" data-rate="${n}" aria-label="${n} stars">★</button>`).join("");
    document.querySelectorAll(".star").forEach(s=>s.onclick=()=>{document.querySelectorAll(".star").forEach(x=>x.classList.toggle("on",+x.dataset.rate<=+s.dataset.rate));$("#thanks").textContent="Thanks! Your rating has been recorded for this visit.";});
    $("#shareBtn").onclick=()=>shareProduct(p);
    $("#waBtn").onclick=()=>messageOwner(p);
  }

  function shareProduct(p){
    if(!p)return;
    const url=productUrl(p), text=`${p.name} — ${money(p.price)}\nProduct ID: ${p.id}\n${url}`;
    if(navigator.share){ navigator.share({title:p.name,text,url}).catch(()=>{}); }
    else navigator.clipboard?.writeText(text).then(()=>alert("Product link copied."));
  }
  function messageOwner(p){
    if(!p)return;
    const number=(SHOP.ownerWhatsApp||"").replace(/\D/g,"");
    if(!number || number.includes("XXXXXXXX")) return alert("Owner WhatsApp number is not configured in data.js.");
    const text=`Hello, I am interested in this product.\n\nProduct: ${p.name}\nProduct ID: ${p.id}\nPrice: ${money(p.price)}\nLink: ${productUrl(p)}\nImage: ${productUrl(p)}#product-image`;
    location.href=`https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }
  function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
})();