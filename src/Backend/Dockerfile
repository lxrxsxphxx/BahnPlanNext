# Basis-Image
FROM python:3.10-slim

# Arbeitsverzeichnis setzen
WORKDIR /app

# System-Dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python Dependencies kopieren und installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Applikationscode kopieren
COPY . .

# Port exposieren
EXPOSE 8000

# Health Check (optional, aber empfohlen)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/docs')" || exit 1

# Start-Befehl
CMD ["fastapi", "dev", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
