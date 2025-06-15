#!/bin/bash

# Auto-migrate the database
python manage.py migrate --noinput

# Start the server
exec "$@" 