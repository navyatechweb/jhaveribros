const fs = require('fs');
const path = require('path');

const htmlFiles = [
  ...fs.readdirSync('site').filter(f => f.endsWith('.html')).map(f => path.join('site', f)),
  ...fs.readdirSync('site/products').filter(f => f.endsWith('.html')).map(f => path.join('site/products', f))
];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Check for fixed min-width > 300px
  const minWidthMatches = content.match(/min-width:\s*[3-9]\d{2,}px/gi);
  if (minWidthMatches) {
    console.log(`${file} min-width matches:`, minWidthMatches);
  }
});
