#!/bin/bash

set -e

cd /app/backend
export DJANGO_SETTINGS_MODULE='backend.prod_settings'
if [ -n "$1" ]; then
  export SET_PASS="$1"
fi
uv run python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" > /data/secret_key.txt
uv run manage.py migrate
uv run manage.py fake_data

chown -R www-data:www-data /data
chmod -R 775 /data

