const fs = require('fs');

const file = 'site/services.html';
let content = fs.readFileSync(file, 'utf8');

const ids = ['laser', 'pantograph', 'etching', 'embossing', 'screen', 'sandblast', '3d', 'sticker', 'foil'];

ids.forEach(id => {
  const pattern = new RegExp(`<div id="${id}" style="display:grid; grid-template-columns:1fr 1\\.25fr;([^"]*)"`, 'g');
  content = content.replace(pattern, `<div id="${id}" class="service-process-row" style="$1"`);
});

fs.writeFileSync(file, content, 'utf8');
console.log('Updated services.html with class="service-process-row"');
