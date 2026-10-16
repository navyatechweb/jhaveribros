const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', 'dist', '.git'].includes(f)) continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) results = results.concat(getHtmlFiles(p));
    else if (f.endsWith('.html') && f !== 'privacy.html' && f !== 'terms.html') results.push(p);
  }
  return results;
}

const files = getHtmlFiles('site');
console.log(`Auditing and updating headers and footers across ${files.length} HTML files...`);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Clickable logo in mobile drawer header if it's currently a div
  const drawerHeaderRegex = /<div class="mobile-drawer-header">[\s\S]*?<div style="display:flex; align-items:center; gap:0.5rem;">([\s\S]*?)<\/div>([\s\S]*?<button class="mobile-drawer-close"[^>]*>)/i;
  if (drawerHeaderRegex.test(content)) {
    content = content.replace(drawerHeaderRegex, (match, inner, closeBtn) => {
      changed = true;
      return `<div class="mobile-drawer-header">\n          <a href="/" aria-label="Jhaveri Bros. homepage" style="display:flex; align-items:center; gap:0.5rem; text-decoration:none;">${inner}</a>${closeBtn}`;
    });
  }

  // 2. Clickable logo in footer if not wrapped
  // Look for <div class="footer-brand">\s*<img src="/assets/img/brand/jb-logo-white.svg"
  const footerLogoUnwrapped = /<div class="footer-brand">\s*<img src="\/assets\/img\/brand\/jb-logo-white\.svg"([^>]*)style="([^"]*)"([^>]*)>/gi;
  if (footerLogoUnwrapped.test(content)) {
    content = content.replace(footerLogoUnwrapped, (match, p1, style, p2) => {
      changed = true;
      return `<div class="footer-brand">\n          <a href="/" aria-label="Jhaveri Bros. homepage" style="display:inline-block; text-decoration:none;">\n            <img src="/assets/img/brand/jb-logo-white.svg"${p1}style="${style}"${p2}>\n          </a>`;
    });
  }

  // 3. Make phone numbers clickable in footer SHOWROOM contact block
  // Pattern: Tel: +91 22 2207 1818 / 2201 4380 or similar
  const telPlainPattern = /Tel:\s*\+91 22 2207 1818 \/ 2201 4380/gi;
  if (telPlainPattern.test(content)) {
    changed = true;
    content = content.replace(telPlainPattern, `Tel: <a href="tel:+912222071818" style="color:var(--color-gold-light); font-weight:600;">+91 22 2207 1818</a> / <a href="tel:+912222014380" style="color:var(--color-gold-light); font-weight:600;">+91 22 2201 4380</a>`);
  }

  // Also check if mobile numbers can be added if not present in footer
  // e.g. if footer has Tel: ... and Email: ... but no Mobile:
  const footerContactBlock = /Tel: <a href="tel:\+912222071818"[^>]*>\+91 22 2207 1818<\/a> \/ <a href="tel:\+912222014380"[^>]*>\+91 22 2201 4380<\/a><br>\s*(?:Mobile: [^<]+<br>\s*)?Email:/gi;
  if (footerContactBlock.test(content)) {
    changed = true;
    content = content.replace(footerContactBlock, `Tel: <a href="tel:+912222071818" style="color:var(--color-gold-light); font-weight:600;">+91 22 2207 1818</a> / <a href="tel:+912222014380" style="color:var(--color-gold-light); font-weight:600;">+91 22 2201 4380</a><br>\n            Mobile: <a href="tel:+919833635014" style="color:var(--color-gold-light); font-weight:600;">+91 98336 35014</a> &bull; <a href="tel:+919833131091" style="color:var(--color-gold-light); font-weight:600;">+91 98331 31091</a><br>\n            Email:`);
  }

  // 4. In 404 page, ensure links to Homepage, Products, Enquiry, Contact are all present
  if (file.endsWith('404.html')) {
    changed = true;
    // Replace heading and text as requested
    content = content.replace(/<h1 class="heading-section"[^>]*>[\s\S]*?<\/h1>/i, `<h1 class="heading-section" style="font-size:2rem; margin-bottom:1rem;">This page could not be found.</h1>`);
    content = content.replace(/<p style="font-family:var\(--font-serif\)[^>]*>[\s\S]*?<\/p>/i, `<p style="font-family:var(--font-serif); font-size:1.2rem; color:var(--color-text-muted); line-height:1.6; margin-bottom:2.5rem;">The page you are looking for may have moved or is no longer available. Explore our collections or return to the homepage.</p>`);
    
    // Add all 4 links: Homepage, Products, Enquiry, Contact
    const fourBtnGroup = `<div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
        <a href="/" class="btn btn-gold">RETURN HOME</a>
        <a href="/products" class="btn btn-outline-gold">EXPLORE PRODUCTS</a>
        <a href="/enquiry" class="btn btn-secondary">ENQUIRY FORM</a>
        <a href="/contact" class="btn btn-primary">CONTACT SHOWROOM</a>
      </div>`;
    content = content.replace(/<div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">[\s\S]*?<\/div>/i, fourBtnGroup);
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated header/footer/links in: ${file}`);
  }
}

console.log('Update complete.');
