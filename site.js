async function loadWorks(){
  const res = await fetch('works.json', {cache:'no-store'});
  if(!res.ok) throw new Error('Unable to load works.json');
  const data = await res.json();
  return (data.works || []).slice().sort((a,b)=>(a.sortOrder||999)-(b.sortOrder||999));
}
function tierLabel(tier){
  return {high:'High Value', mid:'Mid Tier', fast:'Fast Sale'}[tier] || 'Estate Work';
}
function esc(str=''){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}
function cardTemplate(work){
  return `
    <article class="card" data-tier="${esc(work.tier)}">
      <a href="artwork.html?id=${encodeURIComponent(work.id)}" aria-label="${esc(work.title)}">
        <img loading="lazy" src="${esc(work.image)}" alt="${esc(work.alt || work.title)}">
      </a>
      <div class="badge">${esc(tierLabel(work.tier))}</div>
      <h3><a href="artwork.html?id=${encodeURIComponent(work.id)}">${esc(work.title)}</a></h3>
      <div class="meta">
        ${esc(work.medium)}<br>
        ${esc(work.year)}<br>
        ${esc(work.dimensions)}<br>
        ${esc(work.priceLabel || 'Price upon request')}
      </div>
      <a class="text-cta" href="artwork.html?id=${encodeURIComponent(work.id)}">View Work</a>
    </article>
  `;
}
document.addEventListener('DOMContentLoaded', async () => {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  const grid = document.querySelector('[data-catalog-grid]');
  if(grid){
    try{
      const works = await loadWorks();
      grid.innerHTML = works.map(cardTemplate).join('');
      initFilters();
    }catch(err){
      grid.innerHTML = '<div class="empty">Catalog could not be loaded. Please check works.json.</div>';
    }
  }

  const detailNode = document.querySelector('[data-artwork-detail]');
  if(detailNode){
    try{
      const works = await loadWorks();
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      const work = works.find(w => w.id === id) || works[0];
      if(!work){
        detailNode.innerHTML = '<div class="empty">No works found.</div>';
        return;
      }
      document.title = `${work.title} — Alexey Listopad Estate`;
      detailNode.innerHTML = `
        <div class="detail-grid">
          <div class="detail-image">
            <img src="${esc(work.image)}" alt="${esc(work.alt || work.title)}">
          </div>
          <div class="detail-copy">
            <div class="eyebrow">${esc(tierLabel(work.tier))}</div>
            <h1>${esc(work.title)}</h1>
            <div class="copy"><p>${esc(work.description || '')}</p></div>
            <div class="kv">
              <div class="k">Year</div><div>${esc(work.year || '—')}</div>
              <div class="k">Medium</div><div>${esc(work.medium || '—')}</div>
              <div class="k">Dimensions</div><div>${esc(work.dimensions || '—')}</div>
              <div class="k">Signature</div><div>${esc(work.signature || '—')}</div>
              <div class="k">Status</div><div>${esc(work.status || 'available')}</div>
              <div class="k">Price</div><div>${esc(work.priceLabel || 'Price upon request')}</div>
            </div>
            <div class="ctas">
              <a class="text-cta" href="mailto:listopad.gallery@yahoo.com?subject=${encodeURIComponent('Request details — ' + work.title)}">Request Details</a>
              <a class="text-cta" href="mailto:listopad.gallery@yahoo.com?subject=${encodeURIComponent('Request catalogue')}">Request Catalogue</a>
              <a class="text-cta" href="gallery.html">Back to Works</a>
            </div>
            <p class="note">Available works from the estate are released selectively. Additional images, provenance notes, and condition details may be shared through private inquiry.</p>
          </div>
        </div>
      `;
    }catch(err){
      detailNode.innerHTML = '<div class="empty">Artwork page could not be loaded. Please check works.json.</div>';
    }
  }
});
function initFilters(){
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-catalog-grid] .card'));
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.tier === filter) ? '' : 'none';
      });
    });
  });
}
