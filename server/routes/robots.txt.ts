// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || 'https://maxaro-storefront.vercel.app';

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  setHeader(event, 'Cache-Control', 'max-age=86400, s-maxage=86400');

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /checkout',
    'Disallow: /_nuxt/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `Host: ${siteUrl.replace(/^https?:\/\//, '')}`,
  ].join('\n');
});
