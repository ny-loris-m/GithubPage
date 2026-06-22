// Einfacher Warenkorb in localStorage
const CART_KEY = 'mshop_cart_v1';

function readCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] } catch(e){ return [] }
}

function writeCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }

function updateCartCount(){
  const count = readCart().reduce((s,i)=> s + (i.qty||1), 0);
  document.querySelectorAll('#cart-count').forEach(el=> el.textContent = count);
}

function addToCart(id, qty=1){
  const cart = readCart();
  const item = cart.find(i=> i.id===id);
  if(item) item.qty = (item.qty||1) + qty; else cart.push({id, qty});
  writeCart(cart);
}

function removeFromCart(id){
  let cart = readCart(); cart = cart.filter(i=> i.id!==id); writeCart(cart);
}

async function renderCartItems(){
  const cart = readCart();
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if(!container) return;
  const products = await (await fetch('data/products.json')).json();
  if(cart.length===0){ container.innerHTML='<p>Der Warenkorb ist leer.</p>'; summary.innerHTML=''; return; }
  container.innerHTML = cart.map(ci=>{
    const p = products.find(x=> x.id===ci.id);
    return `<div class="cart-row"><div class="no-image small">${p.title}</div><div><h4>${p.title}</h4><p>€${p.price.toFixed(2)} x ${ci.qty}</p><button class="remove" data-id="${ci.id}">Entfernen</button></div></div>`;
  }).join('');
  document.querySelectorAll('button.remove').forEach(b=> b.addEventListener('click', e=>{ removeFromCart(e.target.dataset.id); renderCartItems(); }));

  const total = cart.reduce((s,ci)=>{
    const p = products.find(x=> x.id===ci.id); return s + p.price * ci.qty;
  },0);
  summary.innerHTML = `<p>Gesamt: €${total.toFixed(2)}</p>`;
}

// Checkout form handling
if(document.getElementById('checkout-form')){
  document.getElementById('checkout-form').addEventListener('submit', function(e){
    e.preventDefault();
    // Hier: in real world, send data an Server. Simulieren
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    document.getElementById('checkout-msg').textContent = 'Vielen Dank — Ihre Bestellung wurde (simuliert) entgegengenommen.';
    document.getElementById('cart-items').innerHTML = '';
    document.getElementById('cart-summary').innerHTML = '';
    this.reset();
  });
}

// Initialisierung
document.addEventListener('DOMContentLoaded', ()=>{ updateCartCount(); if(document.getElementById('cart-items')) renderCartItems(); });
