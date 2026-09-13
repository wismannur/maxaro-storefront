// scripts/scrape-catalog.mjs
import https from 'https';
import fs from 'fs';
import path from 'path';

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

function parseDimensions(name, category) {
  const match = name.match(/(\d+)[xX](\d+)(?:[xX](\d+))?\s*(?:cm|mm)?/);
  if (match) {
    const l = parseInt(match[1], 10);
    const w = parseInt(match[2], 10);
    const h = match[3] ? parseInt(match[3], 10) : undefined;
    if (category === 'vloertegels') {
      return { lengthCm: l, widthCm: w, thicknessMm: 10 };
    }
    return { lengthCm: l, widthCm: w, ...(h ? { heightCm: h } : {}) };
  }
  const single = name.match(/(\d+)\s*cm/);
  if (single) {
    const d = parseInt(single[1], 10);
    if (category === 'inloopdouches') {
      return { lengthCm: d, widthCm: 1, heightCm: 200 };
    }
    if (category === 'badkamermeubels') {
      return { lengthCm: d, widthCm: 48, heightCm: 55 };
    }
    return { lengthCm: d, widthCm: d };
  }
  if (category === 'vrijstaande-baden') return { lengthCm: 175, widthCm: 80, heightCm: 58 };
  if (category === 'inloopdouches') return { lengthCm: 100, widthCm: 1, heightCm: 200 };
  if (category === 'badkamermeubels') return { lengthCm: 100, widthCm: 48, heightCm: 55 };
  if (category === 'kranen') return { lengthCm: 25, widthCm: 20, heightCm: 110 };
  if (category === 'vloertegels') return { lengthCm: 60, widthCm: 60, thicknessMm: 10 };
  return { lengthCm: 100, widthCm: 100 };
}

function detectFinish(name, category) {
  const n = name.toLowerCase();
  if (n.includes('mat zwart') || n.includes('zwart')) return 'Mat Zwart';
  if (n.includes('glans wit') || n.includes('glanzend wit')) return 'Glans Wit';
  if (n.includes('mat wit') || n.includes('solid surface') || n.includes('wit uni') || n.includes('wit')) return 'Mat Wit';
  if (n.includes('chroom')) return 'Chroom';
  if (n.includes('gunmetal') || n.includes('rvs') || n.includes('beton') || n.includes('grijs') || n.includes('grey') || n.includes('koper') || n.includes('lichtgoud')) return 'Brushed Gunmetal';
  if (n.includes('eiken') || n.includes('houtlook') || n.includes('naturel') || n.includes('bruin') || n.includes('beige') || n.includes('sand')) return 'Eiken Natuur';
  
  if (category === 'vrijstaande-baden') return 'Mat Wit';
  if (category === 'inloopdouches') return 'Chroom';
  if (category === 'badkamermeubels') return 'Eiken Natuur';
  if (category === 'kranen') return 'Chroom';
  if (category === 'vloertegels') return 'Eiken Natuur';
  return 'Mat Wit';
}

const configs = [
  {
    category: 'vrijstaande-baden',
    categoryLabelNl: 'Vrijstaande baden',
    url: 'https://www.maxaro.nl/baden/vrijstaande-baden/',
    idPrefix: 'prod-bad',
    warranty: 10
  },
  {
    category: 'inloopdouches',
    categoryLabelNl: 'Inloopdouches',
    url: 'https://www.maxaro.nl/douches/inloopdouches/',
    idPrefix: 'prod-douch',
    warranty: 5
  },
  {
    category: 'badkamermeubels',
    categoryLabelNl: 'Badkamermeubels',
    url: 'https://www.maxaro.nl/badkamermeubels/',
    idPrefix: 'prod-meub',
    warranty: 5
  },
  {
    category: 'kranen',
    categoryLabelNl: 'Kranen',
    url: 'https://www.maxaro.nl/kranen/',
    idPrefix: 'prod-kraan',
    warranty: 5
  },
  {
    category: 'vloertegels',
    categoryLabelNl: 'Vloertegels',
    url: 'https://www.maxaro.nl/tegels/vloertegels/',
    idPrefix: 'prod-tgl',
    warranty: 10
  }
];

async function run() {
  console.log('Starting scraper for Maxaro.nl...');
  const globalSeenImages = new Set();
  const allProducts = [];

  for (const cfg of configs) {
    console.log(`\nScraping category: ${cfg.categoryLabelNl} (${cfg.url})...`);
    const html = await fetchUrl(cfg.url);
    const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
    let items = [];
    for (const s of scripts) {
      try {
        const json = JSON.parse(s[1]);
        const graph = json['@graph'] || [];
        for (const node of graph) {
          if (node.mainEntity && node.mainEntity.itemListElement) {
            items = node.mainEntity.itemListElement.map(x => ({
              ...x.item,
              itemUrl: x.url || x.item?.url
            }));
          }
        }
      } catch (e) {}
    }

    // Extract product-tiles for USPs and SKUs
    const tileMatches = [...html.matchAll(/<div class=\"product-tile\"([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g)];
    const tileMap = new Map();
    for (const t of tileMatches) {
      const block = t[0];
      const titleM = block.match(/<div class=\"product-tile__title\"><a[^>]*>([^<]+)<\/a><\/div>/);
      const skuM = block.match(/<div class=\"product-tile__articlenumber\"><span>([^<]+)<\/span><\/div>/);
      const usps = [...block.matchAll(/<p class=\"product-tile__usp\">([^<]+)<\/p>/g)].map(m => m[1]);
      if (titleM) {
        tileMap.set(titleM[1].trim(), {
          sku: skuM ? skuM[1].trim() : null,
          usps: usps.join('. ')
        });
      }
    }

    const catProducts = [];
    for (let i = 0; i < items.length; i++) {
      if (catProducts.length >= 8) break;
      const it = items[i];
      if (!it.image) continue;

      let img = it.image.replace(/Width\d+/, 'Width800');
      if (globalSeenImages.has(img)) {
        console.log(`Skipping duplicate image: ${img}`);
        continue;
      }
      globalSeenImages.add(img);

      const rawTitle = it.name.trim();
      const cleanTitle = rawTitle.replace(/\s*\|\s*/g, ' ').replace(/\s{2,}/g, ' ');
      const tileData = tileMap.get(rawTitle) || {};
      const numPrice = parseFloat(it.offers?.price) || 299;
      const sku = tileData.sku || `MAX-${cfg.idPrefix.toUpperCase()}-${catProducts.length + 101}`;
      const specs = tileData.usps
        ? `${tileData.usps}. Hoogwaardige Maxaro kwaliteit met modern design.`
        : `${cleanTitle}. Hoogwaardig afgewerkt voor dagelijks comfort en duurzaamheid.`;
      
      const dims = parseDimensions(cleanTitle, cfg.category);
      const finish = detectFinish(cleanTitle, cfg.category);
      const origPrice = Math.round(numPrice * 1.15);

      const id = `${cfg.idPrefix}-${String(catProducts.length + 1).padStart(2, '0')}`;
      const slug = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if we can fetch secondary image from product page
      let secondaryImg = null;
      if (it.itemUrl) {
        try {
          const detailHtml = await fetchUrl(it.itemUrl);
          const detailImages = [...detailHtml.matchAll(/https:\/\/media\.maxaro\.nl\/product\/[^\"]+/g)]
            .map(m => m[0].replace(/Width\d+/, 'Width800'));
          for (const dImg of detailImages) {
            if (dImg !== img && !globalSeenImages.has(dImg)) {
              secondaryImg = dImg;
              break;
            }
          }
        } catch (e) {
          // ignore detail fetch error
        }
      }

      const gallery = secondaryImg ? [img, secondaryImg] : [img];

      const ratings = [4.9, 4.8, 5.0, 4.7, 4.9, 4.8, 4.9, 4.8];
      const reviewsCounts = [94, 62, 118, 45, 87, 53, 76, 41];

      const prod = {
        id,
        sku,
        name: cleanTitle.startsWith('Maxaro') ? cleanTitle : `Maxaro ${cleanTitle}`,
        slug,
        category: cfg.category,
        categoryLabelNl: cfg.categoryLabelNl,
        finish,
        price: numPrice,
        originalPrice: origPrice,
        inStock: true,
        deliveryEstimateNl: 'Morgen in huis',
        rating: ratings[catProducts.length % ratings.length],
        reviewsCount: reviewsCounts[catProducts.length % reviewsCounts.length],
        dimensions: dims,
        specsSummary: specs,
        imageThumbnail: img,
        imageGallery: gallery,
        showroomAvailableRoosendaal: true,
        warrantyYears: cfg.warranty,
        ...(cfg.category === 'vloertegels' ? {
          packageCoverageM2: dims.lengthCm === 60 ? 1.44 : (dims.lengthCm === 15 ? 1.08 : 1.44),
          pieceCountPerPackage: dims.lengthCm === 60 ? 4 : (dims.lengthCm === 15 ? 8 : 4)
        } : {})
      };

      catProducts.push(prod);
      console.log(`  + [${id}] ${prod.name.slice(0, 50)}... (€${prod.price})`);
    }

    allProducts.push(...catProducts);
  }

  console.log(`\n✓ Total products collected: ${allProducts.length}`);
  console.log(`✓ Total unique images: ${globalSeenImages.size}`);

  // Generate output file
  const tsContent = `// server/api/catalog/index.get.ts
import type { Product } from '~~/shared/types';

export const mockProducts: Product[] = ${JSON.stringify(allProducts, null, 2)};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Optional category filter at API level if requested
  if (query.category) {
    return mockProducts.filter((p) => p.category === query.category);
  }

  return mockProducts;
});
`;

  const targetFile = path.resolve('./server/api/catalog/index.get.ts');
  fs.writeFileSync(targetFile, tsContent, 'utf8');
  console.log(`\n✓ Successfully wrote ${allProducts.length} products to ${targetFile}`);
}

run().catch(console.error);
