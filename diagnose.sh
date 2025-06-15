#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_error() { echo -e "${RED}[ERROR] $1${NC}"; }
print_success() { echo -e "${GREEN}[OK] $1${NC}"; }
print_warning() { echo -e "${YELLOW}[WARN] $1${NC}"; }
print_info() { echo -e "${BLUE}[INFO] $1${NC}"; }
print_header() { echo -e "${BLUE}$1${NC}"; }

echo -e "${BLUE}AI Tutorials - System Diagnosis${NC}"
echo "=================================="

# Check Docker
print_header "\nDocker Status"
if command -v docker >/dev/null 2>&1; then
    print_success "Docker is installed"
    if docker info >/dev/null 2>&1; then
        print_success "Docker is running"
        echo "Docker version: $(docker --version)"
    else
        print_error "Docker is not running"
    fi
else
    print_error "Docker is not installed"
fi

# Check Docker Compose
print_header "\nDocker Compose Status"
if command -v docker-compose >/dev/null 2>&1; then
    print_success "docker-compose is available"
    echo "Version: $(docker-compose --version)"
elif docker compose version >/dev/null 2>&1; then
    print_success "docker compose (v2) is available"
    echo "Version: $(docker compose version)"
else
    print_error "Docker Compose is not available"
fi

# Check .env file
print_header "\nEnvironment Configuration"
if [ -f .env ]; then
    print_success ".env file exists"
    
    # Check for placeholder values
    issues=()
    if grep -q "your-github-oauth-client-id" .env; then
        issues+=("GitHub OAuth Client ID not configured")
    fi
    if grep -q "your-github-oauth-client-secret" .env; then
        issues+=("GitHub OAuth Client Secret not configured")
    fi
    if grep -q "your-openai-api-key" .env; then
        issues+=("OpenAI API Key not configured")
    fi
    if grep -q "your-secret-key-here" .env; then
        issues+=("Django Secret Key not configured")
    fi
    
    if [ ${#issues[@]} -eq 0 ]; then
        print_success "All environment variables appear to be configured"
    else
        print_warning "Configuration issues found:"
        for issue in "${issues[@]}"; do
            echo "  - $issue"
        done
    fi
else
    print_error ".env file is missing"
    if [ -f .env.example ]; then
        print_info "Template available: .env.example"
    fi
fi

# Check ports
print_header "\nPort Availability"
ports=(3000 8000 5432)
for port in "${ports[@]}"; do
    if lsof -i ":$port" >/dev/null 2>&1; then
        print_warning "Port $port is in use:"
        lsof -i ":$port" | head -2 | tail -1
    else
        print_success "Port $port is available"
    fi
done

# Check containers status
print_header "\nContainer Status"
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    containers=$(docker ps -a --filter "name=sightcall-technical-test" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}")
    if [ -n "$containers" ]; then
        echo "$containers"
    else
        print_info "No containers found for this project"
    fi
else
    print_warning "Cannot check containers (Docker not available)"
fi

# Check services health
print_header "\nService Health"
if curl -s --max-time 5 http://localhost:8000/api/auth/status/ >/dev/null 2>&1; then
    print_success "Backend is responding (http://localhost:8000)"
else
    print_error "Backend is not responding"
fi

if curl -s --max-time 5 http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend is responding (http://localhost:3000)"
else
    print_error "Frontend is not responding"
fi

# Check logs for errors
print_header "\nRecent Logs (Last 5 lines)"
if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
fi

if [ -n "$COMPOSE_CMD" ]; then
    echo "Backend logs:"
    $COMPOSE_CMD logs --tail=5 backend 2>/dev/null || print_info "No backend logs available"
    
    echo -e "\nFrontend logs:"
    $COMPOSE_CMD logs --tail=5 frontend 2>/dev/null || print_info "No frontend logs available"
else
    print_warning "Cannot check logs (Docker Compose not available)"
fi

# Recommendations
print_header "\nRecommendations"
if [ ! -f .env ]; then
    print_info "1. Create .env file from .env.example template"
fi

if ! command -v docker >/dev/null 2>&1; then
    print_info "2. Install Docker Desktop"
fi

if command -v docker >/dev/null 2>&1 && ! docker info >/dev/null 2>&1; then
    print_info "3. Start Docker Desktop"
fi

print_info "4. Run './start.sh' to start the application"
print_info "5. Run './reset-db.sh' if you have database issues"

echo -e "\n${BLUE}Diagnosis complete${NC}" 