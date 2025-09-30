#!/usr/bin/env bash
set -euo pipefail

python -c "import os; print('Starting OELP backend with settings:', os.getenv('DJANGO_SETTINGS_MODULE'))"

python /app/oelp_backend/manage.py migrate --noinput
python /app/oelp_backend/manage.py collectstatic --noinput

exec gunicorn oelp_backend.wsgi:application \
  --workers 3 \
  --bind 0.0.0.0:${PORT:-8000} \
  --access-logfile - \
  --error-logfile -

