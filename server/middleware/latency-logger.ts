// server/middleware/latency-logger.ts

/**
 * Edge Telemetry & Latency Profiling Middleware
 * Attaches edge node routing headers and Server-Timing telemetry specs
 * for real-time Chrome DevTools observability during client presentations.
 */
export default defineEventHandler((event) => {
  const start = performance.now();

  // Edge Node Identifier (Amsterdam primary edge node)
  setHeader(event, 'X-Edge-Node', 'ams-amsterdam-nl');
  setHeader(event, 'X-Powered-By', 'Maxaro-UltraEdge/4.5');

  event.node.res.on('finish', () => {
    const duration = Number((performance.now() - start).toFixed(2));
    const url = getRequestURL(event).pathname;

    // Set Server-Timing metric for browser DevTools visibility
    try {
      event.node.res.setHeader('Server-Timing', `edge;desc="Amsterdam Edge Processing";dur=${duration}`);
    } catch {
      // Ignore if headers already sent
    }

    // Telemetry output in server stdout
    if (url.startsWith('/api') || url.startsWith('/categorie') || url === '/') {
      console.log(`[Edge ams] ${event.node.req.method} ${url} - ${duration}ms`);
    }
  });
});
