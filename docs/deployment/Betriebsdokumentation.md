# Betriebsdokumentation

## Einleitung

Diese Dokumentation beschreibt den Betrieb und die Wartung der Webapplikation Bahnplan. 

**Ziel der Anwendung:**  
Bahnplan ist eine browserbasierte Simulation, bei der User ihre eigene Eisenbahngesellschaft führen. 
Die MVP-Version fokussiert auf Fahrzeugleasing, Verwaltung von Loks und Wagen sowie grundlegende Benutzerverwaltung.

## Systemübersicht

**Architektur:**  
- **Frontend:** React mit React Router  
- **Backend:** FastAPI, REST-Endpunkte  
- **Datenbank:** PostgreSQL  
- **Containerisierung:** Docker & Docker Compose  

**Docker-Container:**
| Containername         | Aufgabe                        | Port         |
|-----------------------|--------------------------------|--------------|
| `bahnplan-frontend`   | React App                      | 3000         |
| `bahnplan-backend`    | FastAPI REST-API               | 8000         |
| `bahnplan-db`         | PostgreSQL-Datenbank           | 5432         |

## Voraussetzungen

**Software:** 

* Docker ≥ 24.x  
* Docker Compose ≥ 2.x  
* Node.js ≥ 22.20.0 (Frontend lokal, falls nötig)  
* Python ≥ 3.10+ (Backend lokal, falls nötig)  

**Netzwerk / Ports:**  

* 3000: Frontend  
* 8000: Backend API  
* 5432: PostgreSQL  

## Installation

1. Repository klonen:

```bash
git clone https://github.com/lxrxsxphxx/BahnPlanNext.git
cd bahnplan/src
```

2. `.env` Datei erstellen in src/Backend (Beispiel siehe unten):

```env
# Backend
POSTGRES_USER=bahnplan
POSTGRES_PASSWORD=bahnplanpass
POSTGRES_DB=bahnplan_db
BACKEND_PORT=8000

# Frontend
FRONTEND_PORT=3000
```

3. Docker-Container bauen: (alles im src/docker-setup)

```bash
docker-compose build
```

## Start / Stop / Restart

**Start aller Container:**

```bash
docker compose up
```

**Stoppen aller Container:**

```bash
docker-compose down
```

**Logs ansehen:**

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## SetUp Guides

* src/docker-setup/README.md
* src/Backend/README.md
* frontend/README.md
* docs/deployment/Frontend-Setup.md