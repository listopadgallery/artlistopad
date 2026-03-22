const I18N = {
  en: {
    works: "Selected Works",
    about: "About",
    exhibitions: "Exhibitions",
    estate: "Estate",
    acquire: "Acquire",
    collections: "Collections",
    requestCatalogue: "Request Catalogue",
    privateViewing: "Private Viewing",
    pricesRequest: "Prices available upon request",
    all: "All",
    high: "High Value",
    mid: "Mid Tier",
    fast: "Fast Sale",
    viewWork: "View Work",
    year: "Year",
    medium: "Medium",
    dimensions: "Dimensions",
    signature: "Signature",
    status: "Status",
    price: "Price",
    requestDetails: "Request Details",
    backToWorks: "Back to Works",
    highLabel: "High Value",
    midLabel: "Mid Tier",
    fastLabel: "Fast Sale"
  },
  fr: {
    works: "Œuvres choisies",
    about: "À propos",
    exhibitions: "Expositions",
    estate: "Succession",
    acquire: "Acquérir",
    collections: "Collections",
    requestCatalogue: "Demander le catalogue",
    privateViewing: "Visite privée",
    pricesRequest: "Prix sur demande",
    all: "Toutes",
    high: "Valeur haute",
    mid: "Niveau moyen",
    fast: "Vente rapide",
    viewWork: "Voir l’œuvre",
    year: "Année",
    medium: "Technique",
    dimensions: "Dimensions",
    signature: "Signature",
    status: "Statut",
    price: "Prix",
    requestDetails: "Demander des détails",
    backToWorks: "Retour aux œuvres",
    highLabel: "Valeur haute",
    midLabel: "Niveau moyen",
    fastLabel: "Vente rapide"
  },
  es: {
    works: "Obras seleccionadas",
    about: "Sobre la obra",
    exhibitions: "Exposiciones",
    estate: "Estate",
    acquire: "Adquirir",
    collections: "Colecciones",
    requestCatalogue: "Solicitar catálogo",
    privateViewing: "Visita privada",
    pricesRequest: "Precios bajo solicitud",
    all: "Todas",
    high: "Valor alto",
    mid: "Nivel medio",
    fast: "Venta rápida",
    viewWork: "Ver obra",
    year: "Año",
    medium: "Técnica",
    dimensions: "Dimensiones",
    signature: "Firma",
    status: "Estado",
    price: "Precio",
    requestDetails: "Solicitar detalles",
    backToWorks: "Volver a obras",
    highLabel: "Valor alto",
    midLabel: "Nivel medio",
    fastLabel: "Venta rápida"
  },
  de: {
    works: "Ausgewählte Werke",
    about: "Über das Werk",
    exhibitions: "Ausstellungen",
    estate: "Nachlass",
    acquire: "Erwerb",
    collections: "Sammlungen",
    requestCatalogue: "Katalog anfragen",
    privateViewing: "Private Ansicht",
    pricesRequest: "Preise auf Anfrage",
    all: "Alle",
    high: "Hoher Wert",
    mid: "Mittel",
    fast: "Schneller Verkauf",
    viewWork: "Werk ansehen",
    year: "Jahr",
    medium: "Technik",
    dimensions: "Maße",
    signature: "Signatur",
    status: "Status",
    price: "Preis",
    requestDetails: "Details anfragen",
    backToWorks: "Zurück zu Werken",
    highLabel: "Hoher Wert",
    midLabel: "Mittel",
    fastLabel: "Schneller Verkauf"
  }
};

function getLang(){
  const params = new URLSearchParams(location.search);
  const q = params.get('lang');
  if(q && I18N[q]) return q;
  const htmlLang = document.documentElement.lang || 'en';
  return I18N[htmlLang] ? htmlLang : 'en';
}
function t(key){
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}
function esc(str=''){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}
async function loadWorks(){
  const res = await fetch('works.json', {cache:'no-store'});
  if(!res.ok) throw new Error('Unable to load works.json');
  const data = await res.json();
  return (data.works || []).slice().sort((a,b)=>(a.sortOrder||999)-(b.sortOrder||999));
}
function tierLabel(tier){
  return {high:t('highLabel'), mid:t('midLabel'), fast:t('fastLabel')}[tier] || t('works');
}
function withLang(url){
  const lang = getLang();
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}lang=${encodeURIComponent(lang)}`;
}
function buildCard(work){
  return `
    <article class="work" data-tier="${esc(work.tier)}">
      <a href="${withLang(`artwork.html?id=${encodeURIComponent(work.id)}`)}" aria-label="${esc(work.title)}">
        <img loading="lazy" src="${esc(work.image)}" alt="${esc(work.alt || work.title)}">
      </a>
      <div class="badge">${esc(tierLabel(work.tier))}</div>
      <h3><a href="${withLang(`artwork.html?id=${encodeURIComponent(work.id)}`)}">${esc(work.title)}</a></h3>
      <div class="meta">
        ${esc(work.medium)}<br>
        ${esc(work.year)}<br>
        ${esc(work.dimensions)}<br>
        ${esc(work.priceLabel || t('pricesRequest'))}
      </div>
      <div style="margin-top:14px"><a class="text-cta" href="${withLang(`artwork.html?id=${encodeURIComponent(work.id)}`)}">${esc(t('viewWork'))}</a></div>
    </article>
  `;
}
function initCatalogFilters(){
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-catalog-grid] .work'));
  if(!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.tier === filter) ? '' : 'none';
      });
    });
  });
}
async function renderGallery(){
  const grid = document.querySelector('[data-catalog-grid]');
  if(!grid) return;
  try{
    const works = await loadWorks();
    grid.innerHTML = works.map(buildCard).join('');
    initCatalogFilters();
  }catch(err){
    grid.innerHTML = `<div class="empty">Catalog could not be loaded. Please check works.json.</div>`;
  }
}
async function renderArtwork(){
  const detail = document.querySelector('[data-artwork-detail]');
  if(!detail) return;
  try{
    const works = await loadWorks();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const work = works.find(w => w.id === id) || works[0];
    if(!work){
      detail.innerHTML = `<div class="empty">No works found.</div>`;
      return;
    }
    document.title = `${work.title} — Alexey Listopad Estate`;
    detail.innerHTML = `
      <div class="detail-grid">
        <div class="detail-image">
          <img src="${esc(work.image)}" alt="${esc(work.alt || work.title)}">
        </div>
        <div>
          <div class="eyebrow">${esc(tierLabel(work.tier))}</div>
          <div class="detail-title">${esc(work.title)}</div>
          <div class="copy">${esc(work.description || '')}</div>
          <div class="kv detail-meta">
            <div class="k">${esc(t('year'))}</div><div>${esc(work.year || '—')}</div>
            <div class="k">${esc(t('medium'))}</div><div>${esc(work.medium || '—')}</div>
            <div class="k">${esc(t('dimensions'))}</div><div>${esc(work.dimensions || '—')}</div>
            <div class="k">${esc(t('signature'))}</div><div>${esc(work.signature || '—')}</div>
            <div class="k">${esc(t('status'))}</div><div>${esc(work.status || 'available')}</div>
            <div class="k">${esc(t('price'))}</div><div>${esc(work.priceLabel || t('pricesRequest'))}</div>
          </div>
          <div class="cta-row">
            <a class="text-cta" href="mailto:listopad.gallery@yahoo.com?subject=${encodeURIComponent(t('requestDetails') + ' — ' + work.title)}">${esc(t('requestDetails'))}</a>
            <a class="text-cta" href="mailto:listopad.gallery@yahoo.com?subject=${encodeURIComponent(t('requestCatalogue'))}">${esc(t('requestCatalogue'))}</a>
            <a class="text-cta" href="${withLang('gallery.html')}">${esc(t('backToWorks'))}</a>
          </div>
          <div class="quote">Available works from the estate are released selectively. Additional images, provenance notes, and condition details may be shared through private inquiry.</div>
        </div>
      </div>
    `;
  }catch(err){
    detail.innerHTML = `<div class="empty">Artwork page could not be loaded. Please check works.json.</div>`;
  }
}

// ambient music
let players = [];
let currentTrack = 1;
let isPlaying = false;

function setupAudio(){
  const a1 = document.getElementById('music1');
  const a2 = document.getElementById('music2');
  players = [a1, a2].filter(Boolean);
  players.forEach(a => {
    a.volume = 0.18;
    a.loop = true;
  });
  updateMusicState();
}
function updateMusicState(){
  const state = document.querySelector('[data-music-state]');
  if(state) state.textContent = isPlaying ? `On ${currentTrack}` : 'Off';
}
function chooseTrack(trackNum){
  currentTrack = trackNum;
  players.forEach((a, idx) => {
    if(idx !== trackNum-1){
      a.pause();
      a.currentTime = 0;
    }
  });
  if(isPlaying && players[trackNum-1]){
    players[trackNum-1].play().catch(()=>{});
  }
  updateMusicState();
}
function toggleMusic(){
  if(!players.length) return;
  const active = players[currentTrack-1];
  if(isPlaying){
    players.forEach(a => a.pause());
    isPlaying = false;
  }else{
    active.play().catch(()=>{});
    isPlaying = true;
  }
  updateMusicState();
}
window.chooseTrack = chooseTrack;
window.toggleMusic = toggleMusic;

document.addEventListener('DOMContentLoaded', async () => {
  const yearNode = document.querySelector('[data-year]');
  if(yearNode) yearNode.textContent = new Date().getFullYear();
  setupAudio();
  await renderGallery();
  await renderArtwork();
});
