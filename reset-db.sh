#!/bin/bash

echo "🗑️  Stopping containers..."
docker-compose down

echo "🧹 Removing database volume..."
docker volume rm sightcall-technical-test_db-data 2>/dev/null || true

echo "🚀 Starting fresh containers..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "✅ Database reset complete!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000" 