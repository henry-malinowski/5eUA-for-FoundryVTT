const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();

let ornamentIndex = 0;
let listItemIndex = 0;

md.renderer.rules.hr = () => {
  const order = ornamentIndex === 0 ? 0 : 2;
  ornamentIndex += 1;
  return `<div class="ornament" style="--intro-order: ${order}"><i class="fa-solid fa-diamond ornament-icon"></i></div>\n`;
};

md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('style', '--intro-order: 1');
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.list_item_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('style', `--intro-order: ${listItemIndex + 3}`);
  listItemIndex += 1;
  return self.renderToken(tokens, idx, options);
};

module.exports = () => {
  ornamentIndex = 0;
  listItemIndex = 0;
  return md.render(
    fs.readFileSync(path.join(__dirname, 'intro.md'), 'utf8')
  );
};
