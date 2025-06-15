#!/bin/bash

# Source common functions
SCRIPT_DIR="$(dirname "$0")"
source "$SCRIPT_DIR/common.sh"

stop_services() {
    print_info "Stopping all services..."
    local COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD down
    print_success "Services stopped"
}

stop_services 