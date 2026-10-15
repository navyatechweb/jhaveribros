import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  root: 'site',
  server: {
    port: 5173,
    host: true,
  },
  plugins: [
    {
      name: 'root-seo-files',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const cleanUrl = req.url.split('?')[0];
          if (cleanUrl === '/sitemap.xml') {
            const file = resolve(import.meta.dirname, 'sitemap.xml');
            if (fs.existsSync(file)) {
              res.setHeader('Content-Type', 'application/xml');
              return res.end(fs.readFileSync(file));
            }
          }
          if (cleanUrl === '/robots.txt') {
            const file = resolve(import.meta.dirname, 'robots.txt');
            if (fs.existsSync(file)) {
              res.setHeader('Content-Type', 'text/plain');
              return res.end(fs.readFileSync(file));
            }
          }
          next();
        });
      },
      closeBundle() {
        const distDir = resolve(import.meta.dirname, 'site/dist');
        const rootSitemap = resolve(import.meta.dirname, 'sitemap.xml');
        const rootRobots = resolve(import.meta.dirname, 'robots.txt');
        if (fs.existsSync(distDir)) {
          if (fs.existsSync(rootSitemap)) {
            fs.copyFileSync(rootSitemap, resolve(distDir, 'sitemap.xml'));
          }
          if (fs.existsSync(rootRobots)) {
            fs.copyFileSync(rootRobots, resolve(distDir, 'robots.txt'));
          }
        }
      }
    },
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const cleanUrl = req.url.split('?')[0];
          if (!cleanUrl.includes('.')) {
            // Check direct .html
            const directHtml = resolve(import.meta.dirname, 'site', cleanUrl.replace(/^\//, '') + '.html');
            if (fs.existsSync(directHtml)) {
              req.url = cleanUrl + '.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
              return next();
            }
            // Check directory index.html
            const indexHtml = resolve(import.meta.dirname, 'site', cleanUrl.replace(/^\//, ''), 'index.html');
            if (fs.existsSync(indexHtml)) {
              req.url = cleanUrl.replace(/\/$/, '') + '/index.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
              return next();
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'site/index.html'),
        aboutUs: resolve(import.meta.dirname, 'site/about-us.html'),
        products: resolve(import.meta.dirname, 'site/products/index.html'),
        productsDirect: resolve(import.meta.dirname, 'site/products.html'),
        corporateGifts: resolve(import.meta.dirname, 'site/products/corporate-gifts.html'),
        cupsMedalsShields: resolve(import.meta.dirname, 'site/products/cups-medals-shields.html'),
        plaques: resolve(import.meta.dirname, 'site/products/plaques.html'),
        salvers: resolve(import.meta.dirname, 'site/products/salvers.html'),
        silver: resolve(import.meta.dirname, 'site/products/silver.html'),
        trophies: resolve(import.meta.dirname, 'site/products/trophies.html'),
        services: resolve(import.meta.dirname, 'site/services.html'),
        clientele: resolve(import.meta.dirname, 'site/clientele.html'),
        enquiry: resolve(import.meta.dirname, 'site/enquiry.html'),
        contact: resolve(import.meta.dirname, 'site/contact.html'),
        privacyPolicy: resolve(import.meta.dirname, 'site/privacy-policy.html'),
        termsConditions: resolve(import.meta.dirname, 'site/terms-and-conditions.html'),
        disclaimer: resolve(import.meta.dirname, 'site/disclaimer.html'),
        notFound: resolve(import.meta.dirname, 'site/404.html'),
      },
    },
  },
});
