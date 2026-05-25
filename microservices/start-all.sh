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

start_service() {
    local name=$1
    local dir=$2
    local port=$3
    local log="/tmp/${name}.log"
    echo "Starting ${name} on port ${port}..."
    (cd "$dir" && php artisan serve --port="$port") > "$log" 2>&1 &
    echo $!
}

start_service "auth-service"         "$BASE_DIR/auth-service"         8001
start_service "tax-service"          "$BASE_DIR/tax-service"          8002
start_service "permit-service"       "$BASE_DIR/permit-service"       8003
start_service "land-service"         "$BASE_DIR/land-service"         8004
start_service "grant-service"        "$BASE_DIR/grant-service"        8005
start_service "case-service"         "$BASE_DIR/case-service"         8006
start_service "registration-service" "$BASE_DIR/registration-service" 8007
start_service "gateway"              "$BASE_DIR/gateway"              8000

echo ""
echo "All services started! Waiting for them to be ready..."
sleep 3
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
echo "Test: curl -s http://localhost:8000/api/health"
echo "Logs: /tmp/<service-name>.log"
echo ""
echo "Press Ctrl+C to stop all services."

wait
