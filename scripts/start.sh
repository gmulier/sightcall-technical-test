#!/bin/bash

# Source common functions
SCRIPT_DIR="$(dirname "$0")"
source "$SCRIPT_DIR/common.sh"

start_services() {
    print_info "Starting AI Tutorials application..."
    
    local COMPOSE_CMD=$(get_compose_cmd)
    
    # Basic checks
    if ! command_exists docker; then
        print_error "Docker is not installed!"
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running!"
        exit 1
    fi
    
    if [ ! -f .env ]; then
        print_error "Missing .env file!"
        print_info "Copy .env.example to .env and configure your keys"
        exit 1
    fi
    
    print_success "Pre-flight checks passed!"
    
    # Start containers
    print_info "Building and starting containers..."
    if ! $COMPOSE_CMD up -d --build; then
        print_error "Failed to start containers"
        exit 1
    fi
    
    # Wait for services
    BACKEND_READY=false
    FRONTEND_READY=false
    
    if wait_for_service "localhost" "8000" "Backend"; then
        BACKEND_READY=true
    fi
    
    if wait_for_service "localhost" "3000" "Frontend"; then
        FRONTEND_READY=true
    fi
    
    # Final status
    echo ""
    if [ "$BACKEND_READY" = true ] && [ "$FRONTEND_READY" = true ]; then
        print_success "Application is ready!"
        print_info "Frontend: http://localhost:3000"
        print_info "Backend: http://localhost:8000"
    else
        print_error "Some services failed to start"
        print_info "Check logs with: ./run logs"
        exit 1
    fi
}

start_services 