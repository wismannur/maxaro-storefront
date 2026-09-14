// app/plugins/umami.ts
import type { UmamiRuntimeConfig } from '~~/app/types/umami';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const umamiConfig = (config.public.umami || {}) as UmamiRuntimeConfig;

  // Inject Umami tracking script into head if website ID is configured
  if (umamiConfig.id) {
    const host = (umamiConfig.hostUrl || 'https://cloud.umami.is').replace(/\/$/, '');

    useHead({
      script: [
        {
          src: `${host}/script.js`,
          'data-website-id': umamiConfig.id,
          'data-auto-track': umamiConfig.autoTrack !== false ? 'true' : 'false',
          ...(umamiConfig.domains ? { 'data-domains': umamiConfig.domains } : {}),
          ...(umamiConfig.tag ? { 'data-tag': umamiConfig.tag } : {}),
          defer: true,
        },
      ],
    });
  }

  const umami = useUmami();

  // Pageview lifecycle & route change handling across all pages
  if (import.meta.client) {
    const router = useRouter();
    router.afterEach((to, from) => {
      if (from.fullPath && to.fullPath !== from.fullPath) {
        if (umamiConfig.autoTrack === false) {
          // If native autoTrack is disabled, track pageview on route change
          nextTick(() => {
            umami.trackPageView(
              to.fullPath,
              from.fullPath,
              typeof document !== 'undefined' ? document.title : undefined
            );
          });
        } else if (import.meta.dev) {
          console.info(`[Umami Analytics] 🧭 Navigation: ${from.fullPath} ➜ ${to.fullPath}`);
        }
      }
    });
  }

  return {
    provide: {
      umami,
    },
  };
});
