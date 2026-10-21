#!/usr/bin/env bash
# Pushes the values in .env to Fly as secrets. Run after `fly launch --no-deploy`. Nothing is printed or stored elsewhere.
set -e
[ -f .env ] || { echo "Create .env from .env.example first"; exit 1; }
grep -E '^[A-Z_]+=.+' .env | fly secrets import
echo "Secrets set. Run: fly deploy"
