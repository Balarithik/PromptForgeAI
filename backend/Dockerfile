FROM python:3.11-slim

WORKDIR /app

# ── Python runtime settings ──────────────────────────────────────────
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ── Application defaults (override at runtime with -e / --env-file) ──
# Django
ENV DEBUG=True
ENV SECRET_KEY=
ENV ALLOWED_HOSTS="*"

# Database – defaults to local SQLite; set DATABASE_URL for Postgres
# Example: DATABASE_URL=postgresql://user:pass@host:5432/dbname
ENV DATABASE_URL=

# Gemini AI
ENV GEMINI_API_KEY=

# Gunicorn
ENV PORT=8000
ENV GUNICORN_WORKERS=2
ENV GUNICORN_TIMEOUT=120

# ── System dependencies ──────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ── Python dependencies ─────────────────────────────────────────────
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# ── Application code ────────────────────────────────────────────────
COPY . /app/
RUN chmod +x /app/entrypoint.sh

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
