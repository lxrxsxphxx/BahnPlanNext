# 🚄 BahnPlanNext – Backend Setup (FastAPI)

Dieses Dokument beschreibt, wie das FastAPI-Backend von BahnPlanNext **lokal installiert, gestartet und getestet** wird.  
Der aktuelle Stand beinhaltet:

Der aktuelle Stand beinhaltet:
- Benutzerregistrierung (`POST /register`)
- Login mit JWT-Token (`POST /login`)
- E-Mail-Verifizierung (`GET /verify/{token}`)
- Rollen & Berechtigungen (`user`, `admin`)
- Geschützte Routen (`/secured`, `/adminsonly`)
- PostgreSQL-Datenbank (konfigurierbar über `.env`)
- Automatisches Laden der `.env`-Datei
---

## Projektstruktur (Backend)

````
src/
└── Backend/
  ├─ requirements.txt
  ├─ README.md
  └──app/
      ├── enums/
      │   ├── roles.py
      │   ├── vehicle.py
      │   └── workshop.py
      ├── models/
      │   ├── __init__.py
      │   ├── company.py
      │   ├── contract.py
      │   ├── loan.py
      │   ├── route.py
      │   ├── station.py
      │   ├── tender.py
      │   ├── user.py
      │   ├── vehicle.py
      │   └── workshop.py
      ├── schemas/
      │   └── userSchema.py
      ├── auth.py
      ├── crud.py
      ├── database.py
      ├── init_db.py
      ├── main.py
      └── sendmail.py
````

---

# 1. Voraussetzungen

- Python **3.10+*
- pip

---

# 2. Projekt installieren

### In das Backend-Verzeichnis wechseln:
```bash
cd src/Backend
```

Virtuelle Umgebung erstellen:
```bash
python -m venv .venv
```

### venv aktivieren:

- Linux/macOS (bash/zsh):

```bash
source .venv/bin/activate
```

- fish:
```bash
source .venv/bin/activate.fish
```

- Windows PowerShell:
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

.\.venv\Scripts\Activate.ps1
```

3. Abhängigkeiten installieren
bash
```bash
pip install -r requirements.txt
```

4. `.env` anlegen

Im Backend-Verzeichnis (`src/Backend`) eine Datei `.env` erstellen:

```env
# Mail-Konfiguration (für Registrierung)
email=MAIL_LOGIN
password=MAIL_APPPASSWORT

# JWT & Datenbank – nur lokal, echte Secrets NICHT committen
JWT_SECRET=<ein_langes_random_secret>
ALGORITHM=HS256
DATABASE_URL=postgresql+psycopg2://<user>:<pass>@<host>:<port>/<dbname>
```

5. Datenbanktabellen initialisieren

```
python -m app.init_db
```

5. Backend starten
Im Backend-Verzeichnis:

```bash
fastapi dev app/main.py
```

Wenn alles läuft:

API: http://127.0.0.1:8000

Docs (Swagger-UI): http://127.0.0.1:8000/docs
