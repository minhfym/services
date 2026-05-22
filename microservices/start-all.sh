#!/bin/bash

# Government Services Portal - Start All Microservices
echo "Starting all microservices..."

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Kill any existing instances on these ports
for port in 8000 8001 8002 8003 8004 8005 8006 8007; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        echo "Stopping existing process on port $port (PID: $pid)"
        kill $pid 2>/dev/null
    fi
done

sleep 1

# Start all services in background
echo "Starting auth-service on port 8001..."
cd "$BASE_DIR/auth-service" && php artisan serve --port=8001 > /tmp/auth-service.log 2>&1 &

echo "Starting tax-service on port 8002..."
cd "$BASE_DIR/tax-service" && php artisan serve --port=8002 > /tmp/tax-service.log 2>&1 &

echo "Starting permit-service on port 8003..."
cd "$BASE_DIR/permit-service" && php artisan serve --port=8003 > /tmp/permit-service.log 2>&1 &

echo "Starting land-service on port 8004..."
cd "$BASE_DIR/land-service" && php artisan serve --port=8004 > /tmp/land-service.log 2>&1 &

echo "Starting grant-service on port 8005..."
cd "$BASE_DIR/grant-service" && php artisan serve --port=8005 > /tmp/grant-service.log 2>&1 &

echo "Starting case-service on port 8006..."
cd "$BASE_DIR/case-service" && php artisan serve --port=8006 > /tmp/case-service.log 2>&1 &

echo "Starting registration-service on port 8007..."
cd "$BASE_DIR/registration-service" && php artisan serve --port=8007 > /tmp/registration-service.log 2>&1 &

echo "Starting gateway on port 8000..."
cd "$BASE_DIR/gateway" && php artisan serve --port=8000 > /tmp/gateway.log 2>&1 &

echo ""
echo "All services started!"
echo ""
echo "Service endpoints:"
echo "  Gateway:              http://localhost:8000/api"
echo "  Auth Service:         http://localhost:8001/api"
echo "  Tax Service:          http://localhost:8002/api"
echo "  Permit Service:       http://localhost:8003/api"
echo "  Land Service:         http://localhost:8004/api"
echo "  Grant Service:        http://localhost:8005/api"
echo "  Case Service:         http://localhost:8006/api"
echo "  Registration Service: http://localhost:8007/api"
echo ""
echo "Gateway dashboard: http://localhost:8000/api/dashboard/stats"
echo "Gateway health:    http://localhost:8000/api/health"
echo ""
echo "Test login:"
echo "  curl -X POST http://localhost:8000/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@gov.portal\",\"password\":\"password\"}'"
echo ""
echo "Log files in /tmp/*.log"

wait
