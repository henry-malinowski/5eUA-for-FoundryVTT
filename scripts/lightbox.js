export function createLightboxController() {
  const lightboxEl = document.getElementById('lightbox');
  const lightboxScroll = document.getElementById('lightbox-scroll');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxHeading = document.getElementById('lightbox-heading');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxInner = document.getElementById('lightbox-inner');

  let shots = [];
  let index = 0;
  let zoomed = false;

  function exitZoom() {
    zoomed = false;
    lightboxEl.classList.remove('lightbox--zoomed');
  }

  function enterZoom() {
    zoomed = true;
    lightboxEl.classList.add('lightbox--zoomed');
  }

  function render() {
    exitZoom();
    const shot = shots[index];
    if (!shot) return;
    lightboxImg.src = shot.path;
    lightboxImg.alt = shot.heading || '';
    lightboxHeading.textContent = shot.heading || '';
    lightboxDesc.textContent = shot.description || '';
    lightboxCaption.hidden = !(shot.heading || shot.description);
    const single = shots.length === 1;
    lightboxPrev.hidden = single;
    lightboxNext.hidden = single;
  }

  function open(nextShots, nextIndex) {
    shots = nextShots;
    index = nextIndex;
    render();
    lightboxEl.hidden = false;
  }

  function close() {
    exitZoom();
    lightboxEl.hidden = true;
    lightboxImg.src = '';
  }

  function step(delta) {
    index = (index + delta + shots.length) % shots.length;
    render();
  }

  function isOpen() {
    return !lightboxEl.hidden;
  }

  function preloadStep(delta) {
    if (shots.length <= 1) return;
    const next = shots[(index + delta + shots.length) % shots.length];
    if (next && next.path) (new Image()).src = next.path;
  }

  lightboxImg.addEventListener('click', function (e) {
    e.stopPropagation();
    zoomed ? exitZoom() : enterZoom();
  });
  lightboxScroll.addEventListener('click', function (e) {
    if (zoomed) {
      exitZoom();
      e.stopPropagation();
    }
  });
  lightboxClose.addEventListener('click', function (e) {
    e.stopPropagation();
    close();
  });
  lightboxPrev.addEventListener('mouseenter', function () {
    preloadStep(-1);
  });
  lightboxPrev.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    step(-1);
  });
  lightboxPrev.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  lightboxNext.addEventListener('mouseenter', function () {
    preloadStep(1);
  });
  lightboxNext.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    step(1);
  });
  lightboxNext.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  lightboxEl.addEventListener('click', function () {
    zoomed ? exitZoom() : close();
  });
  lightboxInner.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  return {
    open,
    close,
    step,
    isOpen,
  };
}
