# Lab lokal baca-saja; tag bergerak, catat digest aktual untuk rilis yang diulang.
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PYTHONPATH=/app/src
WORKDIR /app
COPY src/ ./src/
USER 10001:10001
EXPOSE 8000
CMD ["python", "-m", "praktik_layanan.cli", "serve", "--db", "/data/laporan.sqlite", "--host", "0.0.0.0", "--port", "8000"]
