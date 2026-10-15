import fs from 'fs';
import path from 'path';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'dist' && file !== 'node_modules' && file !== '.git') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getHtmlFiles('site');
console.log(`Processing ${files.length} HTML files...`);

const newBrandLink = `<a href="/" class="brand-link" aria-label="Jhaveri Bros. &amp; Co. Home">
          <img src="/favicon.ico" alt="Jhaveri Bros. &amp; Co." class="brand-logo-img" width="40" height="40">
          <span class="brand-title">Jhaveri Bros. &amp; Co.</span>
        </a>`;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Match and replace .brand-link
  const brandLinkRegex = /<a href="\/" class="brand-link"[\s\S]*?<\/a>/i;
  if (brandLinkRegex.test(content)) {
    content = content.replace(brandLinkRegex, newBrandLink);
  }

  // Update mobile drawer header if present
  const mobileHeaderRegex = /<div class="mobile-drawer-header">[\s\S]*?<button class="mobile-drawer-close"/i;
  if (mobileHeaderRegex.test(content)) {
    content = content.replace(mobileHeaderRegex, `<div class="mobile-drawer-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <img src="/favicon.ico" alt="Jhaveri Bros. &amp; Co." width="28" height="28" style="object-fit:contain;">
            <span style="font-family:var(--font-display); font-weight:700; color:var(--color-primary); font-size:1.1rem;">Jhaveri Bros. &amp; Co.</span>
          </div>
          <button class="mobile-drawer-close"`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated brand in: ${filePath}`);
}

console.log('Finished updating navbar brand.');
