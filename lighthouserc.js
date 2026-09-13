// lighthouserc.js
export default {
  ci: {
    collect: {
      url: [
        'http://localhost:9000/',
        'http://localhost:9000/categorie/vrijstaande-baden',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'mobile',
        emulatedFormFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 900 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }],
      },
    },
  },
};
