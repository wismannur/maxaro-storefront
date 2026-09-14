// nuxt.config.ts
export default defineNuxtConfig({
  // Nuxt 4 directory convention & future flags
  future: {
    compatibilityVersion: 4,
  },

  devServer: {
    host: '127.0.0.1',
    port: 9000,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'vercel',
    routeRules: {
      // Global security headers for all routes
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      },

      // Static showroom homepage cached at edge for 1 hour with SWR
      '/': { isr: 3600, swr: true },

      // Category listing pages cached for 10 minutes with instant stale delivery
      '/categorie/**': { isr: 600, swr: true },

      // Product pages cached with instant edge revalidation
      '/product/**': { isr: 300, swr: true },

      // Dynamic API routes bypass cache for live inventory & cart sync
      '/api/**': {
        cors: true,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
      },

      // SEO Crawling Endpoints
      '/robots.txt': {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'max-age=86400, s-maxage=86400',
        },
      },
      '/sitemap.xml': {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'max-age=3600, s-maxage=86400',
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://maxaro-storefront.vercel.app',
      siteName: 'Maxaro',
      umami: {
        id: process.env.NUXT_PUBLIC_UMAMI_ID || process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID || '',
        hostUrl: process.env.NUXT_PUBLIC_UMAMI_HOST || process.env.NUXT_PUBLIC_UMAMI_HOST_URL || 'https://cloud.umami.is',
        autoTrack: process.env.NUXT_PUBLIC_UMAMI_AUTO_TRACK !== 'false',
        domains: process.env.NUXT_PUBLIC_UMAMI_DOMAINS || '',
        tag: process.env.NUXT_PUBLIC_UMAMI_TAG || '',
      },
    },
  },

  image: {
    provider: 'none',
    format: ['avif', 'webp'],
    quality: 82,
    densities: [1, 2],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    presets: {
      heroProduct: {
        modifiers: {
          format: 'avif',
          width: 800,
          height: 600,
          fit: 'cover',
        },
      },
      catalogThumb: {
        modifiers: {
          format: 'webp',
          width: 400,
          height: 300,
          fit: 'cover',
        },
      },
    },
    domains: ['images.unsplash.com', 'media.maxaro.nl'],
  },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'nl' },
      title: 'Maxaro — Maximaal Geslaagd in Sanitair & Tegels',
      meta: [
        {
          name: 'description',
          content:
            'Ontdek het complete assortiment hoogwaardig sanitair en tegels bij Maxaro. Vrijstaande baden, inloopdouches, badkamermeubels en tegels. Bezoek onze 5.000 m² showroom in Roosendaal.',
        },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'theme-color', content: '#0F2A4A' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
        // Open Graph Base
        { property: 'og:site_name', content: 'Maxaro' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'nl_NL' },
        { property: 'og:locale:alternate', content: 'de_DE' },
        { property: 'og:locale:alternate', content: 'fr_FR' },
        { property: 'og:locale:alternate', content: 'en_US' },
        // Twitter Base
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@MaxaroNL' },
      ],
      link: [
        // Favicons & Web Manifest (Scraped from Maxaro.nl)
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/icon_x152.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon_x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icon_x512.png' },
        { rel: 'manifest', href: '/manifest.json' },

        { rel: 'preconnect', href: 'https://media.maxaro.nl' },
        { rel: 'preconnect', href: 'https://images.unsplash.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
      ],
    },
  },
});
