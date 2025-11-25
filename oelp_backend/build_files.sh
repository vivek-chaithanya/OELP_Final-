#!/bin/bash

# Exit on error
set -e

echo "🔧 Installing dependencies..."
if [ -f ../requirements.txt ]; then
    pip install -r ../requirements.txt
elif [ -f requirements.txt ]; then
    pip install -r requirements.txt
else
    echo "❌ Error: requirements.txt not found"
    exit 1
fi

# Don't run migrations during build - run them manually
# echo "🗄️ Running migrations..."
# python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput --clear || {
    echo "⚠️ Static collection failed, but continuing..."
}

echo "✅ Build completed successfully!"
