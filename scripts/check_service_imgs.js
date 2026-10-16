const fs = require('fs');

['site/index.html', 'site/services.html', 'site/dist/index.html', 'site/dist/services.html'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log('--- Checking:', filePath);
  const html = fs.readFileSync(filePath, 'utf8');
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const src = match[1];
    if (src.includes('service') || fullTag.includes('slide') || fullTag.includes('laser') || fullTag.includes('pantograph') || fullTag.includes('etching') || fullTag.includes('Embossing') || fullTag.includes('screen') || fullTag.includes('sand') || fullTag.includes('3d') || fullTag.includes('sticker') || fullTag.includes('foil')) {
      // Check if file exists
      const baseDir = filePath.includes('dist') ? 'site/dist' : 'site';
      let targetPath = baseDir + (src.startsWith('/') ? src : '/' + src);
      let exists = fs.existsSync(targetPath);
      if (!exists && !filePath.includes('dist')) {
        // also check site/public
        targetPath = 'site/public' + (src.startsWith('/') ? src : '/' + src);
        exists = fs.existsSync(targetPath);
      }
      console.log(`  src: ${src} | Exists: ${exists} | class: ${fullTag.match(/class=["']([^"']+)["']/)?.[1] || 'none'}`);
    }
  }
});
