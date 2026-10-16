const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', 'dist', '.git'].includes(f)) continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) results = results.concat(getHtmlFiles(p));
    else if (f.endsWith('.html')) results.push(p);
  }
  return results;
}

const files = getHtmlFiles('site');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Find METRO SHOWROOM in footer
  const idx = content.indexOf('METRO SHOWROOM');
  if (idx !== -1) {
    const snippet = content.slice(idx, idx + 400);
    const hasTelLink = snippet.includes('href="tel:');
    console.log(`${f}: has tel link in footer? ${hasTelLink}`);
  }
});
