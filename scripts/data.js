export function getModules() {
  const el = document.getElementById('modules-data');
  if (!el) return [];

  try {
    return JSON.parse(el.textContent || '[]');
  } catch {
    return [];
  }
}
