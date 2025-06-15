#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"
source "$SCRIPT_DIR/common.sh"

echo "AI Tutorial Generator - System Diagnosis"
echo "================================"

# Check Docker
if ! command_exists docker; then
    print_error "Docker not installed"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    print_error "Docker not running"
    exit 1
fi

print_success "Docker OK"

# Check .env
if [ ! -f .env ]; then
    print_error ".env file missing"
    print_info "Copy .env.example to .env"
    exit 1
fi

print_success ".env file exists"

# Check services
COMPOSE_CMD=$(get_compose_cmd)
if check_port "localhost" "8000"; then
    print_success "Backend responding"
else
    print_error "Backend not responding"
fi

if check_port "localhost" "3000"; then
    print_success "Frontend responding"
else
    print_error "Frontend not responding"
fi

echo "Diagnosis complete" 