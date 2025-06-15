#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_error() { echo -e "${RED}[ERROR] $1${NC}"; }
print_success() { echo -e "${GREEN}[OK] $1${NC}"; }
print_warning() { echo -e "${YELLOW}[WARN] $1${NC}"; }
print_info() { echo -e "${BLUE}[INFO] $1${NC}"; }

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

get_compose_cmd() {
    if command -v docker-compose >/dev/null 2>&1; then
        echo "docker-compose"
    elif docker compose version >/dev/null 2>&1; then
        echo "docker compose"
    else
        print_error "Docker Compose not available!"
        exit 1
    fi
}

check_port() {
    local host=$1
    local port=$2
    
    # Try multiple methods for maximum compatibility
    if command -v nc >/dev/null 2>&1; then
        nc -z "$host" "$port" 2>/dev/null
    elif command -v telnet >/dev/null 2>&1; then
        timeout 1 telnet "$host" "$port" </dev/null >/dev/null 2>&1
    elif command -v python3 >/dev/null 2>&1; then
        python3 -c "import socket; s=socket.socket(); s.settimeout(1); s.connect(('$host', $port)); s.close()" 2>/dev/null
    else
        # Fallback to curl if available
        if command -v curl >/dev/null 2>&1; then
            curl -s --max-time 1 --connect-timeout 1 "http://$host:$port" >/dev/null 2>&1
        else
            return 1
        fi
    fi
}

wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local max_attempts=60
    local attempt=1
    
    print_info "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if check_port "$host" "$port"; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within 5 minutes"
    return 1
} 