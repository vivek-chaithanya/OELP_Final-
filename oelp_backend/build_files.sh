#!/bin/bash

# Exit on error
set -e

echo "Installing dependencies..."
# Try parent directory first, then current directory
if [ -f ../requirements.txt ]; then
    pip install -r ../requirements.txt
elif [ -f requirements.txt ]; then
    pip install -r requirements.txt
else
    echo "Error: requirements.txt not found"
    exit 1
fi

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Build completed successfully!"
