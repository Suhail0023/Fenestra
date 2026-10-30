#!/bin/sh
# Starts Fenestra Site. Hosting platforms (Northflank, Fly.io) mount the data volume owned by root:
# when started as root, give the volume to the app user and drop to that user; otherwise just start.
set -e
DATA="${DATA_DIR:-/data}"
mkdir -p "$DATA" 2>/dev/null || true
if [ "$(id -u)" = "0" ]; then
  chown -R app:app "$DATA" 2>/dev/null || true
  exec setpriv --reuid=app --regid=app --init-groups python server.py
fi
exec python server.py
