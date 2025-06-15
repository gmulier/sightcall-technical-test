#!/bin/bash

# Source common functions
SCRIPT_DIR="$(dirname "$0")"
source "$SCRIPT_DIR/common.sh"

reset_database() {
    print_info "Resetting database..."
    print_warning "This will delete all data!"
    
    local COMPOSE_CMD=$(get_compose_cmd)
    
    echo "Stopping containers..."
    $COMPOSE_CMD down
    
    echo "Removing database volume..."
    docker volume rm sightcall-technical-test_db-data 2>/dev/null || true
    
    print_success "Database reset complete!"
    print_info "Run './run start' to restart with a fresh database"
}

reset_database 