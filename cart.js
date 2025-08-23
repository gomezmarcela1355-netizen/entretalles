// cart.js (sin <script> en el archivo)
(()=> {
  const KEY = 'entretalles_cart_v1';

  const read = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const write = (data) => localStorage.setItem(KEY, JSON.stringify(data));
  const currency = (n) => {
    const v = isNaN(n)? 0 : Number(n);
    return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(v);
  };

  const cart = {
    all: () => read(),
    count: () => read().reduce((s,i)=>s+i.qty,0),
    total: () => read().reduce((s,i)=>s+(Number(i.precio)||0)*i.qty,0),
    add: (item) => {
      const id = item.id || `${(item.categoria||'').toLowerCase()}|${(item.nombre||'').toLowerCase()}`;
      const precio = Number(String(item.precio).replace(/[^\d.]/g,'')) || 0;
      const obj = { id, nombre:item.nombre, precio, imagen:item.imagen||'', categoria:item.categoria||'', qty: Number(item.qty||1) };
      const data = read(); const idx = data.findIndex(x=>x.id===id);
      if(idx>-1){ data[idx].qty += obj.qty; } else { data.push(obj); }
      write(data);
      cart.updateBadge();
      return obj;
    },
    remove: (id) => { write(read().filter(x=>x.id!==id)); cart.updateBadge(); },
    setQty: (id, qty) => {
      const q = Math.max(1, Number(qty)||1);
      const data = read(); const it = data.find(x=>x.id===id);
      if(it){ it.qty = q; write(data); cart.updateBadge(); }
    },
    clear: ()=>{ write([]); cart.updateBadge(); },
    updateBadge: ()=>{
      const el = document.getElementById('cart-count');
      if(el){
        const c = cart.count();
        el.textContent = c;
        el.style.display = c>0 ? 'inline-block':'none';
      }
    },
    format: currency,
    whatsappText: ()=>{
      const items = read(); if(!items.length) return 'Carrito vacío';
      let lines = ['Pedido ENTRETALLES:',''];
      items.forEach(i=>lines.push(`• ${i.categoria.toUpperCase()} - ${i.nombre} x${i.qty} = ${currency(i.precio*i.qty)}`));
      lines.push('',`TOTAL: ${currency(cart.total())}`);
      return encodeURIComponent(lines.join('\n'));
    }
  };

  window.EntretallesCart = cart;
  document.addEventListener('DOMContentLoaded', cart.updateBadge);
})();
