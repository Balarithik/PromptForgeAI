#!/bin/sh
set -e

echo "==> Running migrations..."
python manage.py makemigrations api --noinput
python manage.py migrate --noinput

echo "==> Seeding templates..."
python manage.py seed_templates

echo "==> Starting Gunicorn on 0.0.0.0:${PORT:-8000}..."
exec gunicorn promptforge.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers "${GUNICORN_WORKERS:-2}" \
    --timeout "${GUNICORN_TIMEOUT:-120}"
