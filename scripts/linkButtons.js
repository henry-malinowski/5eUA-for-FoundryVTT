export function closeAllDropdowns() {
  document.querySelectorAll('.modal-dropdown-menu').forEach(function (menu) {
    menu.hidden = true;
  });
  document.querySelectorAll('[aria-expanded]').forEach(function (button) {
    button.setAttribute('aria-expanded', 'false');
  });
}

export function makeDndGroup(dndLinks, pdfLinks) {
  const allLinks = dndLinks.concat(pdfLinks);
  if (allLinks.length === 1) {
    const link = document.createElement('a');
    link.href = allLinks[0].url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'modal-icon-btn modal-icon-btn--dnd';
    link.title = allLinks[0].label;
    link.innerHTML = '<i class="fa-brands fa-d-and-d"></i>';
    return link;
  }

  const wrap = document.createElement('div');
  wrap.className = 'modal-icon-dropdown';

  const btn = document.createElement('button');
  btn.className = 'modal-icon-btn modal-icon-btn--dnd';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<i class="fa-brands fa-d-and-d"></i>';

  const menu = document.createElement('div');
  menu.className = 'modal-dropdown-menu';
  menu.hidden = true;

  const hasBoth = dndLinks.length > 0 && pdfLinks.length > 0;
  function addSection(links, heading, iconClass) {
    if (hasBoth) {
      const h = document.createElement('div');
      h.className = 'modal-dropdown-heading';
      h.innerHTML = '<i class="' + iconClass + '"></i> ' + heading;
      menu.appendChild(h);
    }

    links.forEach(function (linkData) {
      const link = document.createElement('a');
      link.href = linkData.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = linkData.label;
      menu.appendChild(link);
    });
  }

  addSection(dndLinks, 'Articles', 'fa-solid fa-newspaper');
  addSection(pdfLinks, 'PDFs', 'fa-solid fa-file-pdf');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const wasOpen = !menu.hidden;
    closeAllDropdowns();
    if (!wasOpen) {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  wrap.appendChild(btn);
  wrap.appendChild(menu);
  return wrap;
}

export function makeYtGroup(ytLinks) {
  if (!ytLinks || !ytLinks.length) return null;

  if (ytLinks.length === 1) {
    const link = document.createElement('a');
    link.href = ytLinks[0].url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'modal-icon-btn modal-icon-btn--youtube';
    link.title = ytLinks[0].label;
    link.innerHTML = '<i class="fa-brands fa-youtube"></i>';
    return link;
  }

  const wrap = document.createElement('div');
  wrap.className = 'modal-icon-dropdown';

  const btn = document.createElement('button');
  btn.className = 'modal-icon-btn modal-icon-btn--youtube';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<i class="fa-brands fa-youtube"></i>';

  const menu = document.createElement('div');
  menu.className = 'modal-dropdown-menu';
  menu.hidden = true;

  ytLinks.forEach(function (linkData) {
    const link = document.createElement('a');
    link.href = linkData.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = linkData.label;
    menu.appendChild(link);
  });

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const wasOpen = !menu.hidden;
    closeAllDropdowns();
    if (!wasOpen) {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  wrap.appendChild(btn);
  wrap.appendChild(menu);
  return wrap;
}
