const fs = require('fs');

const lines = fs.readFileSync('site/assets/css/style.css', 'utf8').split('\n');
lines.forEach((line, idx) => {
  const m = line.match(/(min-width|width):\s*([3-9]\d{2,}|\d{4,})px/i);
  if (m) {
    console.log(`style.css:${idx + 1} -> ${line.trim()}`);
  }
});
