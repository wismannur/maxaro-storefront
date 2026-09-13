// server/routes/sitemap.xml.ts
import { productsData } from '../data/products.data';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || 'https://maxaro-storefront.vercel.app';
  const nowIso = new Date().toISOString().split('T')[0];

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setHeader(event, 'Cache-Control', 'max-age=3600, s-maxage=86400');

  // Discover distinct categories
  const categories = Array.from(new Set(productsData.map((p) => p.category)));

  // Generate XML structure
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="nl" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="de" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>

  <!-- Category Landing Pages (PLP) -->
${categories
  .map(
    (cat) => `  <url>
    <loc>${siteUrl}/categorie/${cat}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="nl" href="${siteUrl}/categorie/${cat}" />
    <xhtml:link rel="alternate" hreflang="de" href="${siteUrl}/categorie/${cat}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/categorie/${cat}" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/categorie/${cat}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/categorie/${cat}" />
  </url>`
  )
  .join('\n')}

  <!-- Product Detail Pages (PDP) -->
${productsData
  .map(
    (prod) => `  <url>
    <loc>${siteUrl}/product/${prod.slug}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${prod.imageThumbnail}</image:loc>
      <image:title><![CDATA[${prod.name}]]></image:title>
      <image:caption><![CDATA[${prod.specsSummary}]]></image:caption>
    </image:image>
    <xhtml:link rel="alternate" hreflang="nl" href="${siteUrl}/product/${prod.slug}" />
    <xhtml:link rel="alternate" hreflang="de" href="${siteUrl}/product/${prod.slug}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/product/${prod.slug}" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/product/${prod.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/product/${prod.slug}" />
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
});
