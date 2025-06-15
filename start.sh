#!/bin/bash

echo "🚀 AI Tutorials - Starting Application"
echo "======================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Missing .env file!"
    echo "📋 Copy .env.example to .env and configure your keys:"
    echo "   cp .env.example .env"
    echo "   nano .env  # Edit with your GitHub OAuth and OpenAI keys"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "🐳 Start Docker Desktop and run this script again"
    exit 1
fi

echo "✅ Configuration OK"
echo "🏗️  Building and starting containers..."

# Build and start containers
docker-compose up -d --build

echo "⏳ Waiting for services to start..."
sleep 15

# Check if services are responding
echo "🔍 Checking services..."

if curl -s http://localhost:8000/api/auth/status/ > /dev/null; then
    echo "✅ Backend OK (http://localhost:8000)"
else
    echo "❌ Backend not responding"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend OK (http://localhost:3000)"
else
    echo "❌ Frontend not responding"
fi

echo ""
echo "🎉 Application started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo ""
echo "📋 Useful commands:"
echo "   docker-compose logs -f     # View logs"
echo "   docker-compose down        # Stop services"
echo "   ./reset-db.sh              # Complete database reset" 