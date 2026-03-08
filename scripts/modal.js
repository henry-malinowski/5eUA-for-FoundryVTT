export function createModalController(options) {
  const {
    modules,
    packIcon,
    makeImgEl,
    makeDndGroup,
    makeYtGroup,
    closeAllDropdowns,
    lightbox,
  } = options;

  const backdrop = document.getElementById('modal-backdrop');
  const modalEl = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalHero = document.getElementById('modal-hero');
  const modalPacks = document.getElementById('modal-packs');
  const modalNote = document.getElementById('modal-note');
  const modalDesc = document.getElementById('modal-description');
  const modalJson = document.getElementById('modal-json');
  const copyBtn = document.getElementById('copy-btn');
  const linkBtns = document.getElementById('modal-link-btns');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalNavPrevBtn = document.getElementById('modal-nav-prev');
  const modalNavNextBtn = document.getElementById('modal-nav-next');

  let currentModalIndex = 0;
  let prefetchedModalIdx = -1;

  function openModal(index) {
    currentModalIndex = index;
    prefetchedModalIdx = -1;
    const mod = modules[index];

    modalTitle.textContent = mod.fullTitle;

    modalHero.innerHTML = '';
    if (mod.image) {
      modalHero.appendChild(makeImgEl(mod.image, mod.name, 'modal-hero-fallback'));
    } else {
      const fallback = document.createElement('div');
      fallback.className = 'modal-hero-fallback';
      fallback.innerHTML = '<i class="fa-solid fa-image"></i>';
      modalHero.appendChild(fallback);
    }

    if (mod.imageCredit) {
      const credit = document.createElement('div');
      credit.className = 'modal-hero-credit';
      const imageCredit = mod.imageCredit;
      const parts = [];
      if (imageCredit.title) parts.push('\u201c' + imageCredit.title + '\u201d');
      if (imageCredit.artist) parts.push(imageCredit.artist);
      credit.textContent = parts.join(' \u00b7 ');
      modalHero.appendChild(credit);
    }

    if (mod.screenshots && mod.screenshots.length) {
      (new Image()).src = mod.screenshots[0].path;
      const previewBtn = document.createElement('button');
      previewBtn.className = 'hero-preview-btn';
      previewBtn.title = 'View screenshots';
      previewBtn.innerHTML = '<i class="fa-solid fa-images"></i>';
      previewBtn.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        lightbox.open(mod.screenshots, 0);
      });
      modalHero.appendChild(previewBtn);
    }

    if (mod.descriptionHtml) {
      modalDesc.innerHTML = mod.descriptionHtml;
      modalDesc.hidden = false;
    } else {
      modalDesc.innerHTML = '';
      modalDesc.hidden = true;
    }

    modalPacks.innerHTML = mod.packs
      .map(function (pack) {
        const icon = packIcon(pack.type, pack.subtype);
        const iconHtml = icon.svgClass
          ? '<span class="pack-icon pack-icon--svg ' + icon.svgClass + '" aria-hidden="true"></span>'
          : '<i class="' + icon.fa + ' pack-icon"></i>';
        return (
          '<div class="pack-item">' +
          iconHtml +
          '<div class="pack-text">' +
          '<div class="pack-label">' +
          pack.label +
          '</div>' +
          '</div></div>'
        );
      })
      .join('');

    modalNote.innerHTML = mod.note
      ? '<div class="module-note"><i class="fa-solid fa-circle-info"></i> ' + mod.note + '</div>'
      : '';

    linkBtns.innerHTML = '';
    closeAllDropdowns();
    linkBtns.appendChild(makeDndGroup(mod.dndBeyondLinks, mod.pdfLinks));
    const ytGroup = makeYtGroup(mod.ytLinks);
    if (ytGroup) linkBtns.appendChild(ytGroup);
    const ghLink = document.createElement('a');
    ghLink.href = mod.githubUrl;
    ghLink.target = '_blank';
    ghLink.rel = 'noopener';
    ghLink.className = 'modal-icon-btn modal-icon-btn--github';
    ghLink.title = 'GitHub Repository';
    ghLink.innerHTML = '<i class="fa-brands fa-github"></i>';
    linkBtns.appendChild(ghLink);

    modalJson.value = mod.manifestUrl;
    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i><span>Copy</span>';
    copyBtn.classList.remove('copied');

    history.replaceState(null, '', '#' + mod.id);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalEl.querySelector('.modal-scroll').scrollTop = 0;
  }

  function closeModal() {
    history.replaceState(null, '', location.pathname + location.search);
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function stepModal(delta) {
    openModal((currentModalIndex + delta + modules.length) % modules.length);
  }

  function isOpen() {
    return backdrop.classList.contains('open');
  }

  function getModalIndexByHash(hash) {
    const normalizedHash = hash.toLowerCase();
    return modules.findIndex(function (mod) {
      return mod.id.toLowerCase() === normalizedHash;
    });
  }

  function prefetchCardImage(index) {
    const mod = modules[index];
    if (mod && mod.image) (new Image()).src = mod.image;
  }

  function initCopyButton() {
    copyBtn.addEventListener('click', function () {
      const text = modalJson.value;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      function onCopied() {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied!</span>';
        copyBtn.classList.add('copied');
        setTimeout(function () {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i><span>Copy</span>';
          copyBtn.classList.remove('copied');
        }, 2200);
      }

      function fallbackCopy() {
        modalJson.select();
        try {
          document.execCommand('copy');
          onCopied();
        } catch {
          // No-op fallback failure.
        }
      }
    });
  }

  function prefetchNearNavButtons(mouseEvent) {
    if (!isOpen() || window.innerWidth <= 900) return;

    function nearBtn(btn) {
      const rect = btn.getBoundingClientRect();
      return (
        Math.abs(mouseEvent.clientX - (rect.left + rect.right) / 2) < 400 &&
        Math.abs(mouseEvent.clientY - (rect.top + rect.bottom) / 2) < 400
      );
    }

    let targetIdx = null;
    if (nearBtn(modalNavPrevBtn)) {
      targetIdx = (currentModalIndex - 1 + modules.length) % modules.length;
    } else if (nearBtn(modalNavNextBtn)) {
      targetIdx = (currentModalIndex + 1) % modules.length;
    }

    if (targetIdx !== null && targetIdx !== prefetchedModalIdx) {
      const src = modules[targetIdx].image;
      if (src) (new Image()).src = src;
      prefetchedModalIdx = targetIdx;
    }
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalNavPrevBtn.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    stepModal(-1);
  });
  modalNavNextBtn.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    stepModal(1);
  });
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });
  backdrop.addEventListener('mousemove', prefetchNearNavButtons);
  initCopyButton();

  return {
    backdrop,
    openModal,
    closeModal,
    stepModal,
    isOpen,
    getModalIndexByHash,
    prefetchCardImage,
  };
}
