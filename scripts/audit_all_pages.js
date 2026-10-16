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
console.log('=== PAGES AUDIT ===');
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const titleM = c.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descM = c.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                c.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
  
  const rel = f.replace(/\\/g, '/');
  console.log(`\nFILE: ${rel}`);
  console.log(`  Title: ${titleM ? titleM[1] : 'MISSING'}`);
  console.log(`  Desc: [${descM ? descM[1].length : 0} chars] ${descM ? descM[1] : 'MISSING'}`);
});
