const fs = require('fs');

const lines = fs.readFileSync('site/assets/css/style.css', 'utf8').split('\n');
console.log('Total lines in style.css:', lines.length);

lines.forEach((line, idx) => {
  if (line.includes('@media')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
