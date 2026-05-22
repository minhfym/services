#!/bin/bash
echo "Starting all Government Portal MFE services..."
echo ""

echo "Starting Shell (port 4200)..."
cd /home/user/services/micro-frontend/shell && npm start -- --port=4200 &
SHELL_PID=$!

echo "Starting Tax MFE (port 4201)..."
cd /home/user/services/micro-frontend/mfe-taxes && npm start -- --port=4201 &
TAXES_PID=$!

echo "Starting Permits MFE (port 4202)..."
cd /home/user/services/micro-frontend/mfe-permits && npm start -- --port=4202 &
PERMITS_PID=$!

echo "Starting Lands MFE (port 4203)..."
cd /home/user/services/micro-frontend/mfe-lands && npm start -- --port=4203 &
LANDS_PID=$!

echo "Starting Grants MFE (port 4204)..."
cd /home/user/services/micro-frontend/mfe-grants && npm start -- --port=4204 &
GRANTS_PID=$!

echo "Starting Cases MFE (port 4205)..."
cd /home/user/services/micro-frontend/mfe-cases && npm start -- --port=4205 &
CASES_PID=$!

echo "Starting Registrations MFE (port 4206)..."
cd /home/user/services/micro-frontend/mfe-registrations && npm start -- --port=4206 &
REGISTRATIONS_PID=$!

echo ""
echo "All services starting:"
echo "  Shell:         http://localhost:4200"
echo "  Taxes MFE:     http://localhost:4201"
echo "  Permits MFE:   http://localhost:4202"
echo "  Lands MFE:     http://localhost:4203"
echo "  Grants MFE:    http://localhost:4204"
echo "  Cases MFE:     http://localhost:4205"
echo "  Registrations: http://localhost:4206"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $SHELL_PID $TAXES_PID $PERMITS_PID $LANDS_PID $GRANTS_PID $CASES_PID $REGISTRATIONS_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
