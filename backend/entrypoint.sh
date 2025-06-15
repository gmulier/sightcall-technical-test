#!/bin/bash

# Attendre que la base de données soit prête
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready!"

# Exécuter les migrations automatiquement
echo "Running migrations..."
python manage.py migrate --noinput

# Démarrer le serveur
echo "Starting server..."
exec "$@" 