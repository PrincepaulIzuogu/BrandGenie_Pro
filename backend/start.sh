#!/bin/sh
echo "Starting BrandGenie Backend..."
exec uvicorn app.main:app --host 0.0.0.0 --port 5000
