const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();

md.renderer.rules.hr = () =>
  '<div class="ornament"><i class="fa-solid fa-diamond ornament-icon"></i></div>\n';

module.exports = () => md.render(
  fs.readFileSync(path.join(__dirname, 'intro.md'), 'utf8')
);
