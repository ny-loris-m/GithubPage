// Lädt Produktdaten und rendert Listen
async function fetchProducts(){
  try{
    const res = await fetch('data/products.json');
    if(!res.ok) throw new Error('Fetch fehlgeschlagen');
    return await res.json();
  }catch(err){
    console.error('fetchProducts failed:', err);
    // Fallback: versuche synchrones XHR (hilfreich beim lokalen Test via file://)
    try{
      const xhr = new XMLHttpRequest();
      xhr.open('GET','data/products.json', false);
      xhr.send(null);
      if(xhr.status === 200 || xhr.responseText){
        return JSON.parse(xhr.responseText);
      }
    }catch(e){ console.error('XHR fallback failed', e); }
    return [];
  }
}

function shortHtml(text){
  return text && text.length>120? text.slice(0,117)+'...': (text||'');
}

async function renderFeatured(){
  const products = await fetchProducts();
  const featured = products.slice(0,4);
  const container = document.getElementById('featured') || document.getElementById('products');
  if(!container) return;
  if(featured.length===0){ container.innerHTML = '<p class="muted">Keine Produkte verfügbar.</p>'; return; }
  container.innerHTML = featured.map(p=>`<article class="card"><a href="product.html?id=${p.id}">${p.image ? `<img src="${p.image}" alt="${p.title}">` : `<div class="no-image">${p.title}</div>`}<h4>${p.title}</h4><p class="price">€${p.price.toFixed(2)}</p></a></article>`).join('');
}

// Fügt auf Startseite und anderen Seiten eine Kategorie-Übersicht ein
async function renderCategories(){
  console.log('renderCategories: start');
  const products = await fetchProducts();
  console.log('renderCategories: products count=', products.length);
  const container = document.getElementById('categories-list');
  if(!container){ console.warn('renderCategories: container not found'); return; }
  const cats = Array.from(new Set(products.map(p=>p.category))).filter(Boolean);
  console.log('renderCategories: cats=', cats);
  if(cats.length===0){ container.innerHTML = '<p class="muted">Kategorien konnten nicht geladen werden.</p>'; return; }
  container.innerHTML = cats.map(c=>`<button class="chip" data-cat="${c}">${c}</button>`).join('');
  container.querySelectorAll('button.chip').forEach(b=>{
    b.addEventListener('click', ()=>{
      // Auf Produkte-Seite mit Kategorie-Query weiterleiten
      location.href = `products.html?category=${encodeURIComponent(b.dataset.cat)}`;
    });
  });
  console.log('renderCategories: rendered');
}

async function renderProductsList(){
  const products = await fetchProducts();
  const container = document.getElementById('products');
  if(!container) return;
  const select = document.getElementById('category-select');

  // Kategorien füllen
  const cats = Array.from(new Set(products.map(p=>p.category))).filter(Boolean);
  // Entferne vorherige Options (außer 'all')
  if(select){
    // Behalte erste Option (value=all) falls vorhanden
    while(select.options.length>1) select.remove(1);
    cats.forEach(c=>{
      const opt = document.createElement('option'); opt.value=c; opt.textContent=c; select.appendChild(opt);
    });
  }

  function show(filter){
    const list = (filter==='all')? products : products.filter(p=>p.category===filter);
    if(list.length===0){ container.innerHTML = '<p class="muted">Keine Produkte in dieser Kategorie.</p>'; return; }
    container.innerHTML = list.map(p=>`<article class="card"><a href="product.html?id=${p.id}">${p.image ? `<img src="${p.image}" alt="${p.title}">` : `<div class="no-image">${p.title}</div>`}<h4>${p.title}</h4><p class="price">€${p.price.toFixed(2)}</p></a><button class="add" data-id="${p.id}">In den Warenkorb</button></article>`).join('');
    document.querySelectorAll('button.add').forEach(b=> b.addEventListener('click', e=>{ addToCart(e.target.dataset.id); }));
  }

  // Wenn URL eine category-Query enthält, vorwählen
  const urlCat = new URLSearchParams(location.search).get('category');
  if(urlCat && cats.includes(urlCat) && select){
    select.value = urlCat;
    show(urlCat);
  } else {
    // Startanzeige: wähle query oder 'all'
    show(select ? (select.value || 'all') : 'all');
  }

  if(select) select.addEventListener('change', ()=> show(select.value));
}

async function renderProductDetail(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return;
  const products = await fetchProducts();
  const p = products.find(x=> x.id===id);
  if(!p) return;
  const el = document.getElementById('product');
  el.innerHTML = `
    <h2>${p.title}</h2>
    <div class="detail-grid">
      <div class="media-text">${p.image ? `<img src="${p.image}" alt="${p.title}">` : `Bild: ${p.title}`}</div>
      <div class="meta">
        <p class="price">€${p.price.toFixed(2)}</p>
        <p>${p.description}</p>
        <form id="order-form">
          <label for="qty">Menge</label>
          <input id="qty" name="qty" type="number" value="1" min="1" />
          <button type="submit">Jetzt bestellen</button>
        </form>
      </div>
    </div>
  `;
  document.getElementById('order-form').addEventListener('submit', function(e){
    e.preventDefault();
    const qty = parseInt(document.getElementById('qty').value,10)||1;
    addToCart(p.id, qty);
    alert('Produkt zum Warenkorb hinzugefügt');
  });
}

// Hooks: Auf passenden Seiten starten
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('featured')) renderFeatured();
  if(document.getElementById('categories-list')) renderCategories();
  if(document.getElementById('products')) renderProductsList();
  if(document.getElementById('product')) renderProductDetail();
});
