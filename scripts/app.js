import { getModules } from './data.js';
import { makeImgEl, packIcon } from './helpers.js';
import { closeAllDropdowns, makeDndGroup, makeYtGroup } from './linkButtons.js';
import { createLightboxController } from './lightbox.js';
import { createModalController } from './modal.js';

const modules = getModules();
const lightbox = createLightboxController();
const modal = createModalController({
  modules,
  packIcon,
  makeImgEl,
  makeDndGroup,
  makeYtGroup,
  closeAllDropdowns,
  lightbox,
});

document.querySelectorAll('.module-card').forEach(function (card) {
  card.addEventListener('mouseenter', function () {
    if (modal.isOpen()) return;
    modal.prefetchCardImage(parseInt(card.dataset.index, 10));
  });

  card.addEventListener('mousedown', function () {
    modal.openModal(parseInt(card.dataset.index, 10));
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (lightbox.isOpen()) {
      lightbox.close();
      return;
    }
    modal.closeModal();
  }

  if (lightbox.isOpen()) {
    if (e.key === 'ArrowLeft') lightbox.step(-1);
    if (e.key === 'ArrowRight') lightbox.step(1);
  }

  if (modal.isOpen() && !lightbox.isOpen()) {
    if (e.key === 'ArrowLeft') modal.stepModal(-1);
    if (e.key === 'ArrowRight') modal.stepModal(1);
  }
});

window.addEventListener('hashchange', function () {
  const hash = location.hash.slice(1).toLowerCase();
  if (!hash) {
    modal.closeModal();
    return;
  }
  const index = modal.getModalIndexByHash(hash);
  if (index !== -1) modal.openModal(index);
});

(function initFromHash() {
  const hash = location.hash.slice(1).toLowerCase();
  if (!hash) return;
  const index = modal.getModalIndexByHash(hash);
  if (index !== -1) modal.openModal(index);
})();

document.addEventListener('click', closeAllDropdowns);
