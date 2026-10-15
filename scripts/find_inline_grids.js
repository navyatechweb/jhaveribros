const fs = require('fs');
const path = require('path');

const htmlFiles = [
  ...fs.readdirSync('site').filter(f => f.endsWith('.html')).map(f => path.join('site', f)),
  ...fs.readdirSync('site/products').filter(f => f.endsWith('.html')).map(f => path.join('site/products', f))
];

htmlFiles.forEach(file => {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('grid-template-columns')) {
      console.log(`${file}:${idx + 1} -> ${line.trim()}`);
    }
  });
});
