// scripts/add-baths.mjs
import fs from 'fs';

const content = fs.readFileSync('./server/api/catalog/index.get.ts', 'utf8');
const jsonMatch = content.match(/export const mockProducts: Product\[\] = (\[[\s\S]*?\]);/);
const existingProducts = JSON.parse(jsonMatch[1]);

const newProducts = [
  {
    id: 'prod-bad-09',
    sku: 'VSA67',
    name: 'Maxaro Olivento Vrijstaand bad 170x82cm Acryl Glans Wit',
    slug: 'maxaro-olivento-vrijstaand-bad-170x82cm-acryl-glans-wit',
    category: 'vrijstaande-baden',
    categoryLabelNl: 'Vrijstaande baden',
    finish: 'Glans Wit',
    price: 1255,
    originalPrice: 1445,
    inStock: true,
    deliveryEstimateNl: 'Morgen in huis',
    rating: 4.8,
    reviewsCount: 67,
    dimensions: {
      lengthCm: 170,
      widthCm: 82,
      heightCm: 58
    },
    specsSummary: 'Glanzend witte afvoercover. Lasercut overloop. Comfortabele diepte van 41,8 cm. Hoogwaardige Maxaro kwaliteit met modern design.',
    imageThumbnail: 'https://media.maxaro.nl/product/Width800/8479/olivento-vrijstaand-bad-170x82cm-acryl-glans-wit-vsa67.webp',
    imageGallery: [
      'https://media.maxaro.nl/product/Width800/8479/olivento-vrijstaand-bad-170x82cm-acryl-glans-wit-vsa67.webp'
    ],
    showroomAvailableRoosendaal: true,
    warrantyYears: 10
  },
  {
    id: 'prod-bad-10',
    sku: 'VSA100',
    name: 'Maxaro Vrijstaand Bad Pratico 170x75cm Acryl Glans Wit',
    slug: 'maxaro-vrijstaand-bad-pratico-170x75cm-acryl-glans-wit',
    category: 'vrijstaande-baden',
    categoryLabelNl: 'Vrijstaande baden',
    finish: 'Glans Wit',
    price: 945,
    originalPrice: 1085,
    inStock: true,
    deliveryEstimateNl: 'Morgen in huis',
    rating: 4.9,
    reviewsCount: 88,
    dimensions: {
      lengthCm: 170,
      widthCm: 75,
      heightCm: 58
    },
    specsSummary: 'Glanzend witte afvoercover. Lasercut overloop. Comfortabele diepte van 44 cm. Hoogwaardige Maxaro kwaliteit met modern design.',
    imageThumbnail: 'https://media.maxaro.nl/product/Width800/131038/vrijstaand-bad-pratico-170x75cm-acryl-glans-wit-vsa100.webp',
    imageGallery: [
      'https://media.maxaro.nl/product/Width800/131038/vrijstaand-bad-pratico-170x75cm-acryl-glans-wit-vsa100.webp'
    ],
    showroomAvailableRoosendaal: true,
    warrantyYears: 10
  }
];

// Check if already present
const alreadyAdded = existingProducts.some(p => p.id === 'prod-bad-09' || p.id === 'prod-bad-10');
if (!alreadyAdded) {
  const bad08Index = existingProducts.findIndex(p => p.id === 'prod-bad-08');
  if (bad08Index !== -1) {
    existingProducts.splice(bad08Index + 1, 0, ...newProducts);
  } else {
    existingProducts.push(...newProducts);
  }

  const updatedContent = `// server/api/catalog/index.get.ts
import type { Product } from '~~/shared/types';

export const mockProducts: Product[] = ${JSON.stringify(existingProducts, null, 2)};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Optional category filter at API level if requested
  if (query.category) {
    return mockProducts.filter((p) => p.category === query.category);
  }

  return mockProducts;
});
`;

  fs.writeFileSync('./server/api/catalog/index.get.ts', updatedContent, 'utf8');
  console.log('Added 2 products successfully!');
} else {
  console.log('Products already exist.');
}

const finalBaths = existingProducts.filter(p => p.category === 'vrijstaande-baden');
console.log('Total products:', existingProducts.length);
console.log('Baths count:', finalBaths.length);

const allImages = new Set(existingProducts.map(p => p.imageThumbnail));
console.log('Unique thumbnail images:', allImages.size, 'out of', existingProducts.length);
