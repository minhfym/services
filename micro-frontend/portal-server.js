/**
 * Government Services Portal - Unified Production Server
 *
 * Serves all micro-frontend builds from a single origin on port 4200.
 *
 * URL layout:
 *   /                  → shell (host app)
 *   /mfe/taxes/        → mfe-taxes built assets
 *   /mfe/permits/      → mfe-permits built assets
 *   /mfe/lands/        → mfe-lands built assets
 *   /mfe/grants/       → mfe-grants built assets
 *   /mfe/cases/        → mfe-cases built assets
 *   /mfe/registrations/→ mfe-registrations built assets
 *
 * Run: node portal-server.js
 * Build first: npm run build (from this directory)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4200;

const DIST_BASE = path.join(__dirname);

const mfeMap = [
  { route: '/mfe/taxes',         dist: 'mfe-taxes/dist/mfe-taxes/browser'         },
  { route: '/mfe/permits',       dist: 'mfe-permits/dist/mfe-permits/browser'      },
  { route: '/mfe/lands',         dist: 'mfe-lands/dist/mfe-lands/browser'          },
  { route: '/mfe/grants',        dist: 'mfe-grants/dist/mfe-grants/browser'        },
  { route: '/mfe/cases',         dist: 'mfe-cases/dist/mfe-cases/browser'          },
  { route: '/mfe/registrations', dist: 'mfe-registrations/dist/mfe-registrations/browser' },
];

// Serve each MFE's static assets
for (const { route, dist } of mfeMap) {
  const absPath = path.join(DIST_BASE, dist);
  if (fs.existsSync(absPath)) {
    app.use(route, express.static(absPath));
    // Serve index.html for SPA deep-links under this MFE path
    app.get(`${route}/*`, (req, res) => {
      res.sendFile(path.join(absPath, 'index.html'));
    });
    console.log(`Serving ${route} → ${dist}`);
  } else {
    console.warn(`WARNING: dist not found for ${route} at ${absPath} — run 'npm run build' first`);
  }
}

// Shell (host app) — serves everything else
const shellDist = path.join(DIST_BASE, 'shell/dist/shell/browser');
const shellDistAlt = path.join(DIST_BASE, 'shell/dist/browser');

const shellPath = fs.existsSync(shellDist) ? shellDist
  : fs.existsSync(shellDistAlt) ? shellDistAlt
  : null;

if (shellPath) {
  app.use(express.static(shellPath));
  // Angular SPA fallback: all unmatched routes → shell index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(shellPath, 'index.html'));
  });
  console.log(`Serving shell → ${shellPath}`);
} else {
  console.warn('WARNING: shell dist not found — run "npm run build:shell" first');
}

app.listen(PORT, () => {
  console.log(`\n🏛️  Government Services Portal running at http://localhost:${PORT}`);
  console.log(`   Login: admin@gov.portal / officer@gov.portal / citizen@gov.portal (password: password)`);
  console.log(`   Backend: run 'bash ../microservices/start-all.sh' for API services\n`);
});
