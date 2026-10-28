#!/bin/sh
# Daily backup of all project data (SQLite snapshot, users, company, photos). Run from cron, e.g. 0 2 * * * /path/backup.sh
D="${DATA_DIR:-$(dirname "$0")}"; OUT="${BACKUP_DIR:-$D/backups}"; mkdir -p "$OUT"; DAY=$(date +%Y%m%d)
# consistent snapshot of the live database (safe while the server is running)
python3 -c "import sqlite3,sys;s=sqlite3.connect(sys.argv[1]);d=sqlite3.connect(sys.argv[2]);s.backup(d);d.close()" "$D/fenestra.db" "$OUT/fenestra-$DAY.db" && \
tar czf "$OUT/fenestra-$DAY.tar.gz" -C "$D" --exclude=backups --exclude='fenestra.db*' . -C "$OUT" "fenestra-$DAY.db" && rm -f "$OUT/fenestra-$DAY.db"
find "$OUT" -name 'fenestra-*.tar.gz' -mtime +30 -delete
