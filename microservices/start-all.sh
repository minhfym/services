#!/bin/bash

# Government Services Portal - Start All Microservices
# All background services are started first; gateway runs in the foreground
# so the terminal stays open. Ctrl+C kills everything cleanly.

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Track background PIDs for cleanup
PIDS=()

cleanup() {
    echo ""
    echo "Stopping all microservices..."
    for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null
    done
    wait 2>/dev/null
    echo "All services stopped."
    exit 0
}
trap cleanup SIGINT SIGTERM

# Kill any existing instances on these ports
for port in 8000 8001 8002 8003 8004 8005 8006 8007; do
    pid=$(lsof -ti:"$port" 2>/dev/null)
    [ -n "$pid" ] && kill "$pid" 2>/dev/null
done
sleep 1

echo ""
echo "  Government Services Portal — Microservices Backend"
echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start background services (auth through registration)
declare -A SERVICES=(
    [auth-service]=8001
    [tax-service]=8002
    [permit-service]=8003
    [land-service]=8004
    [grant-service]=8005
    [case-service]=8006
    [registration-service]=8007
)

for svc in auth-service tax-service permit-service land-service grant-service case-service registration-service; do
    port="${SERVICES[$svc]}"
    log="/tmp/${svc}.log"
    echo "  Starting ${svc} on :${port}..."
    (cd "$BASE_DIR/$svc" && php artisan serve --port="$port" >> "$log" 2>&1) &
    PIDS+=($!)
done

echo ""
echo "  Waiting for services to be ready..."
sleep 3

echo ""
echo "  Endpoints:"
echo "    Gateway (all-in-one):   http://localhost:8000/api"
echo "    Auth:                   http://localhost:8001/api/auth/login"
echo "    Taxes:                  http://localhost:8002/api/taxes"
echo "    Permits:                http://localhost:8003/api/permits"
echo "    Lands:                  http://localhost:8004/api/lands"
echo "    Grants:                 http://localhost:8005/api/grants"
echo "    Cases:                  http://localhost:8006/api/cases"
echo "    Registrations:          http://localhost:8007/api/registrations"
echo ""
echo "  Logs: /tmp/<service-name>.log"
echo ""
echo "  Starting gateway on :8000 (Ctrl+C to stop everything)..."
echo ""

# Run the gateway in the FOREGROUND — keeps the terminal open
cd "$BASE_DIR/gateway" && php artisan serve --port=8000
