const caseCarousel = document.querySelector('[data-case-carousel]');
if (caseCarousel) {
  const slides = [...caseCarousel.querySelectorAll('.pg-case-slide')];
  const controls = [...caseCarousel.querySelectorAll('[data-case-step]')];
  const counters = [...caseCarousel.querySelectorAll('[data-case-counter]')];
  const live = caseCarousel.querySelector('[data-case-live]');
  let current = 0;

  function renderCase(next, announce = true) {
    current = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.hidden = index !== current;
      slide.setAttribute('aria-hidden', String(index !== current));
    });
    counters.forEach(counter => { counter.textContent = `${current + 1} / ${slides.length}`; });
    // Warm the next image only; the original 12 slide images are never loaded at once.
    for (const index of [current, (current + 1) % slides.length]) {
      const image = slides[index].querySelector('img');
      image.loading = 'eager';
    }
    if (announce) live.textContent = `Кейс ${current + 1} из ${slides.length}: ${slides[current].dataset.caseName}`;
  }

  controls.forEach(control => {
    control.addEventListener('click', () => {
      renderCase(current + Number(control.dataset.caseStep));
      if (control.closest('.pg-case-controls--bottom')) {
        caseCarousel.scrollIntoView({ block: 'start', behavior: 'instant' });
        caseCarousel.querySelector('.pg-case-studies__head [data-case-step="' + control.dataset.caseStep + '"]').focus({ preventScroll: true });
      }
    });
  });
  caseCarousel.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    if (event.target.closest('a, input, select, textarea')) return;
    event.preventDefault();
    if (event.key === 'Home') renderCase(0);
    else if (event.key === 'End') renderCase(slides.length - 1);
    else renderCase(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  let touchStart = null;
  const viewport = caseCarousel.querySelector('.pg-case-viewport');
  viewport.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('a,button')) return;
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  viewport.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) renderCase(current + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  viewport.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  renderCase(0, false);
}
