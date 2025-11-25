#!/bin/bash

# Get the DATABASE_URL from Vercel
cd /Users/vivekchaithayamekarthi/Desktop/OELP_Final/agri-spark-ui/oelp_backend

# Pull environment variables from Vercel
vercel env pull .env.production

# Run migrations using production database
export $(cat .env.production | xargs)
python manage.py migrate
python manage.py createsuperuser --noinput || true

echo "✅ Migrations completed!"
