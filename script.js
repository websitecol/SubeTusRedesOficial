// Datos exactos por red y categoría (orden: Seguidores, Me gusta, Vistas)
const DATA = {
  tiktok: {
    title: 'TikTok',
    columns: [
      {
        name: 'Seguidores',
        items: [
          { label: '500', price: '$20.000' },
          { label: '1000', price: '$40.000' },
          { label: '2000', price: '$70.000' },
          { label: '3000', price: '$100.000' }
        ]
      },
      {
        name: 'Me gusta',
        items: [
          { label: '1000', price: '$10.000' },
          { label: '2000', price: '$15.000' },
          { label: '3000', price: '$20.000' },
          { label: '5000', price: '$35.000' },
          { label: '10.000', price: '$60.000' }
        ]
      },
      {
        name: 'Vistas',
        items: [
          { label: '10 MIL', price: '$6.000' },
          { label: '20 MIL', price: '$10.000' },
          { label: '50 MIL', price: '$20.000' },
          { label: '100 MIL', price: '$35.000' },
          { label: '200 MIL', price: '$60.000' }
        ]
      }
    ]
  },
  facebook: {
    title: 'Facebook',
    columns: [
      {
        name: 'Seguidores',
        items: [
          { label: '1000', price: '$18.000' },
          { label: '2000', price: '$30.000' },
          { label: '3000', price: '$40.000' },
          { label: '5000', price: '$70.000' },
          { label: '10.000', price: '$130.000' }
        ]
      },
      {
        name: 'Me gusta',
        items: [
          { label: '1000', price: '$10.000' },
          { label: '2000', price: '$18.000' },
          { label: '3000', price: '$25.000' },
          { label: '5000', price: '$45.000' },
          { label: '10.000', price: '$75.000' }
        ]
      }
      // No hay Vistas para Facebook en la data
    ]
  },
  youtube: {
    title: 'YouTube',
    columns: [
      // No hay Seguidores para YouTube en la data
      {
        name: 'Me gusta',
        items: [
          { label: '1.000', price: '$10.000' },
          { label: '2.000', price: '$20.000' },
          { label: '3.000', price: '$30.000' },
          { label: '4.000', price: '$40.000' },
          { label: '5.000', price: '$50.000' },
          { label: '6.000', price: '$60.000' }
        ]
      },
      {
        name: 'Vistas',
        items: [
          { label: '1000', price: '$18.000' },
          { label: '2000', price: '$36.000' },
          { label: '3000', price: '$54.000' },
          { label: '5000', price: '$92.000' },
          { label: '10000', price: '$186.000' }
        ]
      }
    ]
  },
  instagram: {
    title: 'Instagram',
    columns: [
      {
        name: 'Seguidores',
        items: [
          { label: '1,000', price: '$40.000' },
          { label: '2,000', price: '$70.000' },
          { label: '3,000', price: '$100.000' },
          { label: '5,000', price: '$160.000' },
          { label: '10,000', price: '$300.000' }
        ]
      },
      {
        name: 'Me gusta',
        items: [
          { label: '1000', price: '$10.000' },
          { label: '2000', price: '$15.000' },
          { label: '3000', price: '$25.000' },
          { label: '5000', price: '$35.000' },
          { label: '10.000', price: '$50.000' }
        ]
      },
      {
        name: 'Vistas',
        items: [
          { label: '10.000', price: '$7.000' },
          { label: '20.000', price: '$13.000' },
          { label: '50.000', price: '$30.000' },
          { label: '100.000', price: '$50.000' },
          { label: '200.000', price: '$70.000' }
        ]
      }
    ]
  }
};

const columnsContainer = document.getElementById('priceColumns');
const titleEl = document.getElementById('currentNetwork');

function renderNetwork(networkKey){
  const data = DATA[networkKey];
  if(!data) return;
  titleEl.textContent = data.title;
  columnsContainer.classList.toggle('columns--two', data.columns.length === 2);
  columnsContainer.innerHTML = data.columns.map(col => columnHTML(col)).join('');
}

function columnHTML(column){
  return `
    <section class="card">
      <h3>${column.name}</h3>
      <div class="list">
        ${column.items.map(item => rowHTML(item, column.name)).join('')}
      </div>
    </section>
  `;
}

function rowHTML(item, columnName){
  const suffix = columnName === 'Seguidores' ? 'seguidores'
                : columnName === 'Me gusta' ? 'me gusta'
                : 'vistas';
  const label = `${item.label} ${suffix}`;
  return `
    <div class="row">
      <span class="label">${label}</span>
      <span class="badge">${item.price}</span>
    </div>
  `;
}

// Tabs
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const key = btn.getAttribute('data-network');
    renderNetwork(key);
  });
});

// Render inicial
renderNetwork('tiktok');

// Pantallazo
document.getElementById('btnShot').addEventListener('click', async () => {
  const target = document.getElementById('captureArea');
  // Aplica temporalmente el mismo gradiente de fondo para que html2canvas lo capture
  target.classList.add('capture-bg');
  const canvas = await html2canvas(target, {backgroundColor: null, scale: 2});

  const canUseClipboardImage = !!(window.ClipboardItem && navigator.clipboard && location.protocol.startsWith('http'));

  if (canUseClipboardImage) {
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast('Imagen copiada al portapapeles');
      target.classList.remove('capture-bg');
      return;
    } catch (err) {
      // continúa al respaldo de descarga
    }
  }

  // Respaldo universal: descarga
  const name = `precios-${titleEl.textContent.toLowerCase()}.png`;
  const dataUrl = canvas.toDataURL('image/png');

  // Intento 2: método legacy usando execCommand('copy') sobre un elemento editable
  try {
    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    editable.style.position = 'fixed';
    editable.style.left = '-9999px';
    editable.innerHTML = `<img src="${dataUrl}">`;
    document.body.appendChild(editable);
    const range = document.createRange();
    range.selectNodeContents(editable);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    const ok = document.execCommand('copy');
    sel.removeAllRanges();
    editable.remove();
    if (ok) { toast('Imagen copiada al portapapeles'); return; }
  } catch(_) { /* continúa */ }

  // Intento 3: abrir en nueva pestaña para copiar manualmente y descargar
  try { window.open(dataUrl, '_blank'); } catch(_) {}
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  toast('No se pudo copiar automáticamente. Abrí y descargué la imagen.');
  target.classList.remove('capture-bg');
});

function toast(message){
  const el = document.createElement('div');
  el.textContent = message;
  el.style.position = 'fixed';
  el.style.bottom = '20px';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.background = 'rgba(0,0,0,.7)';
  el.style.color = '#fff';
  el.style.padding = '10px 14px';
  el.style.borderRadius = '10px';
  el.style.zIndex = '9999';
  document.body.appendChild(el);
  setTimeout(()=>{ el.remove(); }, 1800);
}



