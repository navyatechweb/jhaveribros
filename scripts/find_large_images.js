const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'dist'].includes(item)) continue;
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) files = files.concat(walk(p));
    else if (/\.(png|jpg|jpeg|webp|svg|gif|ico|avif)$/i.test(item)) files.push(p);
  }
  return files;
}

const images = walk('site').map(f => ({
  file: f.replace(/\\/g, '/'),
  size: fs.statSync(f).size
})).sort((a, b) => b.size - a.size);

console.log('Top 20 largest images:');
images.slice(0, 20).forEach((img, i) => {
  console.log(`${i + 1}. ${(img.size / 1024).toFixed(1)} KB - ${img.file}`);
});
