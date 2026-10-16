const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'dist'].includes(item)) continue;
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) files = files.concat(walk(p));
    else if (/\.(html|js|css|json)$/i.test(item)) files.push(p);
  }
  return files;
}

const files = walk('site');
const terms = ['lorem ipsum', 'TODO', 'FIXME', 'undefined', 'null', 'NaN', 'coming soon', 'href="#"', 'href=""'];

console.log('Searching for placeholder terms...');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  terms.forEach(term => {
    let count = 0;
    let pos = 0;
    while ((pos = content.toLowerCase().indexOf(term.toLowerCase(), pos)) !== -1) {
      count++;
      pos += term.length;
    }
    if (count > 0) {
      console.log(`[${f}] has ${count} occurrence(s) of "${term}"`);
    }
  });
});
console.log('Search complete.');
