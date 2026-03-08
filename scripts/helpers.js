export function packIcon(type, subtype) {
  const s = (subtype || '').toLowerCase();
  if (type === 'JournalEntry') return { fa: 'fa-solid fa-book-open' };
  if (type === 'Actor') return { svgClass: 'pack-icon--npc' };
  if (type === 'RollTable') return { fa: 'fa-solid fa-table-list' };
  if (type === 'Macro') return { fa: 'fa-solid fa-code' };
  if (type === 'Item') {
    if (s === 'feats') return { fa: 'fa-solid fa-star' };
    if (s === 'spells') return { fa: 'fa-solid fa-book' };
    if (s === 'origins') return { svgClass: 'pack-icon--background' };
    if (s === 'classes' || s === 'subclasses') return { svgClass: 'pack-icon--subclass' };
    return { fa: 'fa-solid fa-box-archive' };
  }
  return { fa: 'fa-solid fa-box-archive' };
}

export function makeImgEl(src, alt, fallbackClass) {
  const img = document.createElement('img');
  img.alt = alt;
  img.loading = 'lazy';
  img.src = src;
  img.addEventListener('error', function () {
    const fb = document.createElement('div');
    fb.className = fallbackClass;
    fb.innerHTML = '<i class="fa-solid fa-image"></i>';
    this.replaceWith(fb);
  });
  return img;
}
