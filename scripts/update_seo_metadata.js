const fs = require('fs');
const path = require('path');

const metadataMap = {
  'site/index.html': {
    title: 'Trophies, Awards & Corporate Gifts in Mumbai | Jhaveri Bros.',
    desc: 'Explore bespoke trophies, awards, mementoes and corporate gifts from Jhaveri Bros., a heritage business serving institutions since 1914 in Mumbai, India.'
  },
  'site/about-us.html': {
    title: 'About Jhaveri Bros. | Since 1914',
    desc: 'Discover the history of Jhaveri Bros., founded in 1914 by Shri Shyamdas Jhaveri, and our longstanding expertise in bespoke trophies, awards and gifting.'
  },
  'site/products.html': {
    title: 'Trophies, Awards & Corporate Gifts | Jhaveri Bros.',
    desc: 'Explore the six signature award collections from Jhaveri Bros. in Mumbai, including corporate gifts, trophies, cups, medals, commemorative plaques & salvers.'
  },
  'site/products/index.html': {
    title: 'Trophies, Awards & Corporate Gifts | Jhaveri Bros.',
    desc: 'Explore the six signature award collections from Jhaveri Bros. in Mumbai, including corporate gifts, trophies, cups, medals, commemorative plaques & salvers.'
  },
  'site/products/corporate-gifts.html': {
    title: 'Corporate Gifts & Executive Mementoes | Jhaveri Bros.',
    desc: 'Executive corporate gifts, desk timepieces and commemorative mementoes crafted for milestones and board appreciation by Jhaveri Bros. at Metro House, Mumbai.'
  },
  'site/products/cups-medals-shields.html': {
    title: 'Cups, Medals & Shields | Jhaveri Bros.',
    desc: 'Presentation cups, athletic medallions, and hardwood shields custom engraved for tournaments and academic ceremonies by Jhaveri Bros. in Mumbai, India.'
  },
  'site/products/plaques.html': {
    title: 'Commemorative Plaques & Citations | Jhaveri Bros.',
    desc: 'Commemorative wooden plaques and etched metal citation plates tailored for distinguished honors, retirements, and corporate awards by Jhaveri Bros., Mumbai.'
  },
  'site/products/salvers.html': {
    title: 'Presentation Salvers & Silver Trays | Jhaveri Bros.',
    desc: 'Chased silver-plated presentation salvers, trays, and ceremonial dishes for lifetime honors and corporate galas, crafted since 1914 by Jhaveri Bros.'
  },
  'site/products/silver.html': {
    title: 'Silver Gifts & Hallmarked Keepsakes | Jhaveri Bros.',
    desc: 'Hallmarked 999 pure silver coins, presentation medals, and ceremonial gifts handcrafted for corporate milestones and festivities by Jhaveri Bros., Mumbai.'
  },
  'site/products/trophies.html': {
    title: 'Trophies & Awards Collection | Jhaveri Bros.',
    desc: 'Prestige trophies in crystal, cast brass, acrylic, and marble for corporate awards and national sporting tournaments, crafted by Jhaveri Bros., Mumbai.'
  },
  'site/services.html': {
    title: 'Customization & Engraving Services | Jhaveri Bros.',
    desc: 'Nine specialized customization & engraving services: laser engraving, pantograph, etching, embossing, screen printing, sand blasting, 3D engraving & foiling.'
  },
  'site/clientele.html': {
    title: 'Our Clientele & Testimonials | Jhaveri Bros.',
    desc: 'Trusted across corporate, government, education, and sports organizations. Explore authentic client marks and verified testimonials from Jhaveri Bros.'
  },
  'site/enquiry.html': {
    title: 'Enquire About Trophies & Corporate Gifts | Jhaveri Bros.',
    desc: 'Submit your requirement for bespoke trophies, commemorative awards, and corporate gifts for a direct itemized quotation from Jhaveri Bros. at Metro House.'
  },
  'site/contact.html': {
    title: 'Contact Jhaveri Bros. | Metro House, Mumbai',
    desc: 'Contact Jhaveri Bros. at 5 Metro House, Dhobi Talao, Mumbai. Call +91 22 2207 1818 or email info@jhaveribros.com for awards, trophies, and corporate gifting.'
  },
  'site/privacy-policy.html': {
    title: 'Privacy Policy | Jhaveri Bros.',
    desc: 'Read the privacy policy of Jhaveri Bros. & Co. Pvt. Ltd. Details on how enquiries, artwork submissions, and contact information are protected and managed.'
  },
  'site/terms-and-conditions.html': {
    title: 'Terms & Conditions | Jhaveri Bros.',
    desc: 'Commercial terms and conditions governing custom orders, proofs, quotation requests, and artisanal manufacturing with Jhaveri Bros. & Co. Pvt. Ltd., Mumbai.'
  },
  'site/disclaimer.html': {
    title: 'Website Disclaimer | Jhaveri Bros.',
    desc: 'Website disclaimer regarding catalogue representations, product availability, and enquiry submissions for Jhaveri Bros. & Co. Pvt. Ltd. in Mumbai.'
  },
  'site/404.html': {
    title: 'This Page Could Not Be Found | Jhaveri Bros.',
    desc: 'The page you are looking for may have moved or is no longer available. Explore our collections or return to the homepage of Jhaveri Bros., Mumbai.'
  }
};

let updatedCount = 0;

for (const [file, meta] of Object.entries(metadataMap)) {
  if (!fs.existsSync(file)) {
    console.warn(`File not found: ${file}`);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');

  // Replace <title>
  content = content.replace(/<title>[^<]*<\/title>/i, `<title>${meta.title}</title>`);

  // Replace <meta name="description" ...>
  if (/<meta[^>]*name=["']description["'][^>]*>/i.test(content)) {
    content = content.replace(/<meta[^>]*name=["']description["'][^>]*content=["'][^"']*["'][^>]*>/i, `<meta name="description" content="${meta.desc}">`);
  } else if (/<meta[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*>/i.test(content)) {
    content = content.replace(/<meta[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*>/i, `<meta name="description" content="${meta.desc}">`);
  }

  // Also update og:title and og:description if present
  content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${meta.title}"`);
  content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${meta.desc}"`);

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated SEO metadata in ${file} [desc: ${meta.desc.length} chars]`);
  updatedCount++;
}

console.log(`\nUpdated ${updatedCount} files successfully.`);
