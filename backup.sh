#!/bin/sh
# Daily backup of all project data (Excel files, users, company, photos). Run from cron, e.g. 0 2 * * * /path/backup.sh
D="${DATA_DIR:-$(dirname "$0")}"; OUT="${BACKUP_DIR:-$D/backups}"; mkdir -p "$OUT"
tar czf "$OUT/fenestra-$(date +%Y%m%d).tar.gz" -C "$D" --exclude=backups . && find "$OUT" -name 'fenestra-*.tar.gz' -mtime +30 -delete
