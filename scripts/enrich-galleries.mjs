// scripts/enrich-galleries.mjs
import fs from 'fs';
import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function enrich() {
  console.log('Fetching category pages to map product URLs...');
  const catUrls = [
    'https://www.maxaro.nl/baden/vrijstaande-baden/',
    'https://www.maxaro.nl/douches/inloopdouches/',
    'https://www.maxaro.nl/badkamermeubels/',
    'https://www.maxaro.nl/kranen/',
    'https://www.maxaro.nl/tegels/vloertegels/'
  ];

  const productUrlMap = new Map();

  for (const cu of catUrls) {
    const html = await fetchUrl(cu);
    const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
    for (const s of scripts) {
      try {
        const json = JSON.parse(s[1]);
        const graph = json['@graph'] || [];
        for (const node of graph) {
          if (node.mainEntity && node.mainEntity.itemListElement) {
            for (const el of node.mainEntity.itemListElement) {
              const name = el.item?.name?.trim();
              const url = el.url || el.item?.url;
              if (name && url) {
                productUrlMap.set(name.toLowerCase(), url);
                // Also map with Maxaro prefix stripped or normalized
                const normalized = name.replace(/\s*\|\s*/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase();
                productUrlMap.set(normalized, url);
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  console.log(`Mapped ${productUrlMap.size} product URLs.`);

  const catalogPath = './server/api/catalog/index.get.ts';
  const content = fs.readFileSync(catalogPath, 'utf8');
  const jsonMatch = content.match(/export const mockProducts: Product\[\] = (\[[\s\S]*?\]);/);
  const products = JSON.parse(jsonMatch[1]);

  console.log(`Enriching galleries for ${products.length} products...`);

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const thumb = p.imageThumbnail;
    const cleanName = p.name.replace(/^Maxaro\s+/i, '').trim().toLowerCase();
    
    // Find URL match
    let targetUrl = productUrlMap.get(cleanName);
    if (!targetUrl) {
      for (const [key, url] of productUrlMap.entries()) {
        if (key.includes(cleanName.slice(0, 20)) || cleanName.includes(key.slice(0, 20))) {
          targetUrl = url;
          break;
        }
      }
    }

    const gallery = [thumb];

    if (targetUrl) {
      try {
        const detailHtml = await fetchUrl(targetUrl);
        const imgMatches = [...detailHtml.matchAll(/https:\/\/media\.maxaro\.nl\/product\/[^\"]+/g)]
          .map(m => m[0].replace(/Width\d+/, 'Width1200'));

        const seenInProduct = new Set([thumb.replace(/Width\d+/, 'Width1200')]);
        for (const img of imgMatches) {
          if (!seenInProduct.has(img) && !img.includes('/icon/') && !img.includes('/swatch/')) {
            seenInProduct.add(img);
            gallery.push(img.replace('Width1200', 'Width800'));
            if (gallery.length >= 5) break; // Keep 4-5 high quality angles
          }
        }
      } catch (e) {
        console.error(`Failed to fetch detail for ${p.id}:`, e.message);
      }
    }

    p.imageGallery = gallery;
    console.log(`[${i + 1}/${products.length}] ${p.id}: ${gallery.length} gallery images`);
  }

  const newContent = `// server/api/catalog/index.get.ts
import type { Product } from '~~/shared/types';

export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Optional category filter at API level if requested
  if (query.category) {
    return mockProducts.filter((p) => p.category === query.category);
  }

  return mockProducts;
});
`;

  fs.writeFileSync(catalogPath, newContent, 'utf8');
  console.log('Enrichment complete!');
}

enrich().catch(console.error);
