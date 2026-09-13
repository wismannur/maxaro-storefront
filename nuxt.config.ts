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
    },
  },

  image: {
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
      title: 'Maxaro — Sub-Second Storefront Prototype',
      meta: [
        { name: 'description', content: 'Modern sub-second Nuxt 4 mobile storefront prototype for Maxaro B.V.' },
        { name: 'theme-color', content: '#0F2A4A' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
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
