FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 DATA_DIR=/data PORT=8080 TRUST_PROXY=1 SEED_DEMO_USERS=0 TZ=Asia/Dubai
WORKDIR /app
# Database is SQLite (stdlib). openpyxl/pypdf/reportlab power the letter/form generator (Word is built with stdlib); openpyxl also imports legacy AZAL_*_Project_DB.xlsx files once.
RUN pip install --no-cache-dir openpyxl pypdf reportlab && useradd -m -u 10001 app && mkdir -p /data && chown app /data
COPY server.py docs.py watch.py lib.py xer_detail.py index.html shell.html sw.js manifest.webmanifest icon-192.png icon-512.png seed_state.json Fenestra_User_Manual.pdf LICENSE.txt COPYRIGHT.txt THIRD_PARTY_NOTICES.txt /app/
COPY legal/release_history.json /app/legal/release_history.json
COPY site /app/site
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request;urllib.request.urlopen('http://127.0.0.1:8080/healthz')" || exit 1
CMD ["python", "server.py"]
