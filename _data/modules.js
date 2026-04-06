const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const md = require('markdown-it')();

const ORDER = [
  'ua2025-the-psion',
  'UA2025-ArcaneSubclasses',
  'UA2025-RealmsSubclasses',
  'UA2025-ApocalypticSubclasses',
  'UA2025-HorrorSubclasses',
  'UA2025-SubclassUpdates',
	'UA2026-MysticSubclasses',
	'UA2026-VillainousOptions',
];

module.exports = function () {
  return ORDER.map(id => {
    const filePath = path.join(__dirname, 'modules', `${id}.md`);
    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    return { ...data, descriptionHtml: content.trim() ? md.render(content) : '' };
  });
};
