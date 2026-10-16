const fs = require('fs');

const standardFooter = `  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-top-grid">
        <!-- Brand Info -->
        <div class="footer-brand">
          <a href="/" aria-label="Jhaveri Bros. homepage" style="display:inline-block; text-decoration:none;">
            <img src="/assets/img/brand/jb-logo-white.svg" alt="Jhaveri Bros. &amp; Co. Pvt. Ltd." width="320" height="48" style="margin-bottom:1rem;">
          </a>
          <p>
            Celebrating over a century of fine craftsmanship, commercial integrity, and excellence in trophies, awards, and corporate gifts. Established on 27 July 1914 in Mumbai, India.
          </p>
          <div style="font-size:0.75rem; color:var(--color-gold-light); font-weight:600; margin-top:0.5rem;">
            DIRECTOR: SEYJHAL D. JHAVERI
          </div>
        </div>

        <!-- Navigation Links -->
        <div>
          <div class="footer-col-title">NAVIGATION</div>
          <ul class="footer-nav-list">
            <li><a href="/">Home</a></li>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/products">Product Overview</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/clientele">Clientele</a></li>
            <li><a href="/enquiry">Enquiry Form</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <!-- Product Categories -->
        <div>
          <div class="footer-col-title">GALLERIES</div>
          <ul class="footer-nav-list">
            <li><a href="/products/corporate-gifts">Corporate Gifts</a></li>
            <li><a href="/products/cups-medals-shields">Cups, Medals &amp; Shields</a></li>
            <li><a href="/products/plaques">Plaques</a></li>
            <li><a href="/products/salvers">Salvers</a></li>
            <li><a href="/products/silver">Silver Gifts</a></li>
            <li><a href="/products/trophies">Trophies</a></li>
          </ul>
        </div>

        <!-- Customization Services -->
        <div>
          <div class="footer-col-title">SERVICES</div>
          <ul class="footer-nav-list">
            <li><a href="/services#laser">Laser Engraving</a></li>
            <li><a href="/services#pantograph">Pantograph Engraving</a></li>
            <li><a href="/services#etching">Etching</a></li>
            <li><a href="/services#embossing">Embossing</a></li>
            <li><a href="/services#screen">Screen Printing</a></li>
            <li><a href="/services#sandblast">Sand Blasting</a></li>
            <li><a href="/services#3d">3D Engraving</a></li>
            <li><a href="/services#foil">Foil Engraving</a></li>
          </ul>
        </div>

        <!-- Showroom Contact -->
        <div>
          <div class="footer-col-title">METRO SHOWROOM</div>
          <p style="font-size:0.825rem; line-height:1.6; color:#B8B0A3; margin-bottom:1rem;">
            5, Metro House, next to Metro Cinemas<br>
            Dhobi Talao, Mumbai – 400 020, India<br>
            Tel: <a href="tel:+912222071818" style="color:var(--color-gold-light); font-weight:600;">+91 22 2207 1818</a> / <a href="tel:+912222014380" style="color:var(--color-gold-light); font-weight:600;">+91 22 2201 4380</a><br>
            Mobile: <a href="tel:+919833635014" style="color:var(--color-gold-light); font-weight:600;">+91 98336 35014</a> &bull; <a href="tel:+919833131091" style="color:var(--color-gold-light); font-weight:600;">+91 98331 31091</a><br>
            Email: <a href="mailto:info@jhaveribros.com" style="color:var(--color-gold-light);">info@jhaveribros.com</a>
          </p>
          <a href="/enquiry" class="btn btn-gold btn-sm" style="width:100%; text-align:center;">REQUEST QUOTATION</a>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom-bar">
        <div>
          &copy; 1914&ndash;2026 Jhaveri Bros. &amp; Co. Pvt. Ltd. All rights reserved.
        </div>
        <div class="footer-legal-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <span>&bull;</span>
          <a href="/terms-and-conditions">Terms &amp; Conditions</a>
          <span>&bull;</span>
          <a href="/disclaimer">Disclaimer</a>
        </div>
      </div>
      <div class="footer-managed-by">
        Managed by <a href="https://navyatech.co.in" target="_blank" rel="noopener noreferrer">Navya Tech Industry</a>
      </div>
    </div>
  </footer>`;

const targetFiles = [
  'site/404.html',
  'site/about-us.html',
  'site/clientele.html',
  'site/contact.html',
  'site/disclaimer.html',
  'site/enquiry.html',
  'site/index.html',
  'site/privacy-policy.html',
  'site/products.html',
  'site/products/index.html',
  'site/products/corporate-gifts.html',
  'site/products/cups-medals-shields.html',
  'site/products/plaques.html',
  'site/products/salvers.html',
  'site/products/silver.html',
  'site/products/trophies.html',
  'site/services.html',
  'site/terms-and-conditions.html'
];

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<footer[\s\S]*?<\/footer>/i, standardFooter);
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Synchronized standard rich footer to: ${file}`);
});
