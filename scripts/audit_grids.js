const fs = require('fs');

const css = fs.readFileSync('site/assets/css/style.css', 'utf8');
const lines = css.split('\n');

console.log('--- GRIDS IN style.css ---');
lines.forEach((line, idx) => {
  if (line.includes('grid-template-columns')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
