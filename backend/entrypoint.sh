#!/bin/bash

set -e

echo "Making alembic migrations..."
alembic upgrade head

echo "Running app..."

exec "$@"