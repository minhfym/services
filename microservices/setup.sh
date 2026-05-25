#!/bin/bash
# Run once after cloning to build the shared vendor folder.
# All 8 microservices share this single vendor — no per-service composer install needed.

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ -d "shared-vendor" ]; then
    echo "shared-vendor/ already exists. To reinstall, delete it first and re-run."
    exit 0
fi

echo "Installing shared vendor (one-time setup)..."
composer install --no-interaction
echo ""
echo "Done. shared-vendor/ is ready."
echo "Start all services with: bash start-all.sh"
