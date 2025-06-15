#!/bin/bash
echo "Waiting for PostgreSQL database to be ready..."
    
# Try to connect to database using Django's database check
while ! python manage.py check --database default >/dev/null 2>&1; do
    echo "Database is not ready yet. Waiting 2 seconds..."
    sleep 2
done

echo "Database is ready!"

# Auto-migrate the database
python manage.py migrate --noinput

# Start the server
exec "$@" 