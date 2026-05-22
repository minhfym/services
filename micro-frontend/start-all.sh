#!/bin/bash
# Government Services Portal — start all micro-frontends
#
# Usage:
#   bash start-all.sh           # development (hot reload, single portal at :4200)
#   bash start-all.sh --prod    # build all then serve production bundle at :4200

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [[ "$1" == "--prod" ]]; then
  echo "Building all MFEs and shell for production..."
  npm run build
  echo ""
  echo "Starting unified portal server at http://localhost:4200 ..."
  npm run serve
  exit 0
fi

echo ""
echo "  Government Services Portal — Micro Frontend Architecture"
echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Single portal URL:  http://localhost:4200  (navigate here only)"
echo ""
echo "  Each MFE runs on its own port but is proxied transparently:"
echo "  /mfe/taxes         → :4201   Tax Collection"
echo "  /mfe/permits       → :4202   E-Permits"
echo "  /mfe/lands         → :4203   Land Administration"
echo "  /mfe/grants        → :4204   Grants"
echo "  /mfe/cases         → :4205   Law Cases"
echo "  /mfe/registrations → :4206   Registrations"
echo ""
echo "  Credentials: admin@gov.portal | officer@gov.portal | citizen@gov.portal"
echo "  Password: password"
echo ""
echo "  Starting all services (this may take ~30 seconds)..."
echo ""

# Use concurrently from root workspace
npx concurrently \
  --kill-others-on-fail \
  --names "SHELL,TAXES,PERMITS,LANDS,GRANTS,CASES,REGS" \
  --prefix-colors "blue.bold,cyan,green,yellow,magenta,red,white" \
  "cd shell         && npm start -- --port=4200 --disable-host-check" \
  "cd mfe-taxes     && npm start -- --port=4201 --disable-host-check" \
  "cd mfe-permits   && npm start -- --port=4202 --disable-host-check" \
  "cd mfe-lands     && npm start -- --port=4203 --disable-host-check" \
  "cd mfe-grants    && npm start -- --port=4204 --disable-host-check" \
  "cd mfe-cases     && npm start -- --port=4205 --disable-host-check" \
  "cd mfe-registrations && npm start -- --port=4206 --disable-host-check"
