FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 DATA_DIR=/data PORT=8080 TRUST_PROXY=1 SEED_DEMO_USERS=0 TZ=Asia/Dubai
WORKDIR /app
RUN pip install --no-cache-dir openpyxl && useradd -m -u 10001 app && mkdir -p /data && chown app /data
COPY server.py xer_detail.py index.html sw.js manifest.webmanifest icon-192.png icon-512.png seed_state.json /app/
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request;urllib.request.urlopen('http://127.0.0.1:8080/healthz')" || exit 1
CMD ["python", "server.py"]
