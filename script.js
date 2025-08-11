// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const section = document.querySelector(href);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth' });
        // replay animations shortly after navigation
        setTimeout(() => replaySection(section), 450);
      }
    }
  });
});

// Make each .screen fill viewport minus fixed header height
function setScreenHeights(){
  const topBar = document.getElementById('topBar');
  const nav = document.getElementById('mainNav');
  const headerHeight = (topBar?.offsetHeight || 0) + (nav?.offsetHeight || 0);
  document.querySelectorAll('.screen').forEach((el)=>{
    el.style.minHeight = `calc(100vh - ${headerHeight}px)`;
    el.style.scrollMarginTop = `${headerHeight + 8}px`;
  });
}
window.addEventListener('load', setScreenHeights);
window.addEventListener('resize', setScreenHeights);

// IntersectionObserver reveal animations
function setupReveals(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  },{threshold:0.15, rootMargin:'0px 0px -10% 0px'});

  document.querySelectorAll('.reveal').forEach((el)=> observer.observe(el));
}

function replaySection(section){
  const els = section.querySelectorAll('.reveal');
  els.forEach((el)=>{
    el.classList.remove('visible');
  });
  // Force reflow
  // eslint-disable-next-line no-unused-expressions
  document.body.offsetHeight;
  els.forEach((el, idx)=>{
    const delay = el.style.getPropertyValue('--reveal-delay') || `${idx*60}ms`;
    el.style.setProperty('--reveal-delay', delay);
    setTimeout(()=> el.classList.add('visible'), 20);
  });
}

function autoApplyReveals(){
  // Hero texts
  document.querySelectorAll('.hero-section h1, .hero-section p, .hero-section .btn').forEach((el, idx)=>{
    el.classList.add('reveal');
    el.dataset.reveal = 'up';
    el.style.setProperty('--reveal-delay', `${idx*80}ms`);
  });

  // Tiles
  document.querySelectorAll('#categories .tile').forEach((el, idx)=>{
    el.classList.add('reveal');
    el.dataset.reveal = idx % 2 === 0 ? 'left' : 'right';
    el.style.setProperty('--reveal-delay', `${idx*60}ms`);
  });

  // Product cards
  document.querySelectorAll('#new .product-card').forEach((el, idx)=>{
    el.classList.add('reveal');
    el.dataset.reveal = 'up';
    el.style.setProperty('--reveal-delay', `${idx*50}ms`);
  });

  // Banners
  document.querySelectorAll('#collections .banner').forEach((el, idx)=>{
    el.classList.add('reveal');
    el.dataset.reveal = 'zoom';
    el.style.setProperty('--reveal-delay', `${idx*120}ms`);
  });

  // CTA + footer sections
  document.querySelectorAll('.cta-section h2, .cta-section .btn, footer .row > div').forEach((el, idx)=>{
    el.classList.add('reveal');
    el.dataset.reveal = 'up';
    el.style.setProperty('--reveal-delay', `${idx*80}ms`);
  });
}

window.addEventListener('DOMContentLoaded', ()=>{
  autoApplyReveals();
  setupReveals();
  // replay on section click (except on interactive elements)
  document.querySelectorAll('.screen').forEach((section)=>{
    section.addEventListener('click', (ev)=>{
      if (ev.target.closest('a,button,input,textarea,select,label')) return;
      replaySection(section);
    });
  });
});

// Fake cart behavior for demo
const cartCountEl = document.getElementById('cartCount');
let cartCount = 0;

document.querySelectorAll('.add-to-cart').forEach((btn) => {
  btn.addEventListener('click', () => {
    cartCount += 1;
    if (cartCountEl) cartCountEl.textContent = String(cartCount);
    const name = btn.getAttribute('data-name') || 'Product';
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '1080';
    toast.innerHTML = `
      <div class="toast align-items-center text-bg-dark border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">Added to cart: ${name}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  });
});

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
