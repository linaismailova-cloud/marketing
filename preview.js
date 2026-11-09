const navigation = [...document.querySelectorAll('.pg-header button[aria-controls], .pg-mobile-menu button[aria-controls]')];

function toggleNavigation(button, open) {
  const target = document.getElementById(button.getAttribute('aria-controls'));
  const group = button.closest('.pg-nav-group') ?? target;
  button.setAttribute('aria-expanded', String(open));
  group.classList.toggle('is-open', open);
  if (button.classList.contains('pg-menu-toggle')) {
    button.classList.toggle('is-open', open);
    button.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
}

for (const button of navigation) {
  button.addEventListener('click', () => toggleNavigation(button, button.getAttribute('aria-expanded') !== 'true'));
}
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const open = navigation.filter(button => button.getAttribute('aria-expanded') === 'true');
  for (const button of open) toggleNavigation(button, false);
  open[0]?.focus();
});
document.addEventListener('click', event => {
  if (event.target.closest('.pg-header, .pg-mobile-menu')) return;
  for (const button of navigation) toggleNavigation(button, false);
});

const lightbox = document.querySelector('.pg-preview-lightbox');
const fullImage = lightbox.querySelector('img');
function showImage(url, label) {
  fullImage.src = url;
  fullImage.alt = label;
  lightbox.showModal();
}
lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

for (const gallery of document.querySelectorAll('[data-gallery]')) {
  const slides = JSON.parse(gallery.querySelector('[data-slides]').textContent);
  const image = gallery.querySelector('.pm-gallery-image');
  const cases = gallery.hasAttribute('data-managed-cases');
  const canZoom = cases || gallery.hasAttribute('data-zoomable');
  const label = image.getAttribute('aria-label') ?? 'Материалы Promo Group';
  let index = 0;

  function renderSlide() {
    image.style.backgroundImage = `url("${slides[index]}")`;
    image.setAttribute('aria-label', `${cases ? 'Кейсы Promo Group' : label}. Слайд ${index + 1} из ${slides.length}`);
  }

  for (const control of gallery.querySelectorAll('[data-step]')) {
    control.addEventListener('click', () => {
      index = (index + Number(control.dataset.step) + slides.length) % slides.length;
      renderSlide();
    });
  }
  if (canZoom) {
    const showSlide = () => showImage(slides[index], image.getAttribute('aria-label'));
    image.setAttribute('role', 'button');
    image.tabIndex = 0;
    image.addEventListener('click', showSlide);
    image.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      showSlide();
    });
  }
  renderSlide();
}

for (const link of document.querySelectorAll('[data-preview-document]')) {
  link.addEventListener('click', event => {
    event.preventDefault();
    showImage(link.href, link.querySelector('img')?.alt ?? 'Документ Promo Group');
  });
}

for (const gallery of document.querySelectorAll('[data-review-carousel]')) {
  const track = gallery.querySelector('.pm-review-track');
  const cards = [...track.querySelectorAll('.pm-review-document')];
  const visible = Number(gallery.dataset.reviewCarousel);
  const prev = gallery.querySelector('[data-step="-1"]');
  const next = gallery.querySelector('[data-step="1"]');
  const status = gallery.querySelector('[role="status"], [aria-live]');
  let index = 0;

  function renderLetters() {
    const offset = cards[index].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    track.style.transform = `translateX(${-offset}px)`;
    prev.disabled = index === 0;
    next.disabled = index + visible >= cards.length;
    if (status) status.textContent = `Письмо ${index + 1} из ${cards.length}`;
    for (const [position, card] of cards.entries()) {
      const onScreen = position >= index && position < index + visible;
      card.tabIndex = onScreen ? 0 : -1;
      card.setAttribute('aria-hidden', String(!onScreen));
    }
  }

  prev.addEventListener('click', () => { index -= 1; renderLetters(); });
  next.addEventListener('click', () => { index += 1; renderLetters(); });
  for (const card of cards) {
    card.addEventListener('click', () => showImage(card.dataset.zoomImage, card.querySelector('img').alt));
  }
  new ResizeObserver(renderLetters).observe(track);
  renderLetters();
}


// Decorative loops run only while their section is visible, with a static CSS fallback.
const ambientSections = [...document.querySelectorAll('[data-ambient-motion]')];
const ambientVisibility = new Map();
function syncAmbientMotion() {
  for (const section of ambientSections) {
    section.classList.toggle('is-in-view', Boolean(ambientVisibility.get(section)) && !document.hidden);
  }
}
const ambientObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    ambientVisibility.set(entry.target, entry.isIntersecting);
    if (entry.isIntersecting) entry.target.classList.add('has-entered');
  }
  syncAmbientMotion();
}, { threshold: 0.15 });
for (const section of ambientSections) ambientObserver.observe(section);
document.addEventListener('visibilitychange', syncAmbientMotion);

for (const button of document.querySelectorAll('.pg-motion-toggle')) {
  button.addEventListener('click', () => {
    const paused = button.closest('.pg-statement').classList.toggle('is-motion-paused');
    button.setAttribute('aria-pressed', String(paused));
    const label = paused ? 'Включить анимацию подсветки' : 'Остановить анимацию подсветки';
    button.setAttribute('aria-label', label);
    button.title = label;
  });
}
