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
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/i);
  if (!footerMatch) {
    console.log(`${f}: NO FOOTER!`);
  } else {
    const footer = footerMatch[0];
    const hasTel = footer.includes('href="tel:');
    const hasMailto = footer.includes('href="mailto:');
    const hasPrivacy = footer.includes('privacy-policy') || footer.includes('privacy');
    const hasTerms = footer.includes('terms-and-conditions') || footer.includes('terms');
    const hasDisclaimer = footer.includes('disclaimer');
    const hasNav = footer.includes('navyatech.co.in');
    console.log(`${f}: footer len=${footer.length}, tel=${hasTel}, mailto=${hasMailto}, priv=${hasPrivacy}, terms=${hasTerms}, disc=${hasDisclaimer}, credit=${hasNav}`);
  }
});
