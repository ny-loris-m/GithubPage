// Minimal site helpers: order form handling and newsletter feedback
function orderProduct(id, title, form){
  try{
    const qty = encodeURIComponent(form.qty ? form.qty.value : '1');
    const name = encodeURIComponent(form.name ? form.name.value : '');
    const email = encodeURIComponent(form.email ? form.email.value : '');
    const subject = encodeURIComponent(`Bestellung: ${title}`);
    const body = encodeURIComponent(`Produkt: ${title}\nID: ${id}\nMenge: ${qty}\nName: ${name}\nE-Mail: ${email}`);
    // Open mail client with prefilled order — graceful fallback if mail client not configured
    window.location.href = `mailto:orders@example.com?subject=${subject}&body=${body}`;
  }catch(e){
    alert('Fehler beim Erstellen der Bestellung: '+e.message);
  }
}

// Newsletter feedback (no backend)
function subscribeNewsletter(form){
  const email = form.email ? form.email.value : '';
  const msgEl = document.querySelector('.newsletter .muted');
  if(!email){ if(msgEl) msgEl.textContent = 'Bitte E-Mail-Adresse eingeben.'; return; }
  if(msgEl) msgEl.textContent = 'Danke — Sie wurden (simuliert) für den Newsletter angemeldet.';
  // optionally store in localStorage for demo
  try{ const subs = JSON.parse(localStorage.getItem('mshop_news'))||[]; subs.push({email, date: new Date().toISOString()}); localStorage.setItem('mshop_news', JSON.stringify(subs)); }catch(e){}
  return false;
}

// Attach newsletter handler if present
document.addEventListener('DOMContentLoaded', ()=>{
  const nf = document.querySelector('.newsletter form');
  if(nf){ nf.addEventListener('submit', function(e){ e.preventDefault(); subscribeNewsletter(this); }); }
});
