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
      ├── seed/
      │   ├── seed_locomotives.py
      │   ├── locomotives.json
      ├── enums/
      │   ├── roles.py
      │   ├── vehicle.py
      │   └── workshop.py
      ├── router/
      │   ├── shopRouter.py
      │   └── userRouter.py
      ├── services/
      │   ├── shopService.py
      │   └── userService.py
      ├── schemas/
      │   ├── shopSchema.py
      │   └── userSchema.py
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

Im Backend-Verzeichnis (`src/Backend`) die Datei `.env` anpassen.

5. Datenbanktabellen initialisieren

``` bash
python -m app.init_db
```

6. Lokomotiven/Triebfahrzeuge einfügen und "compatible_with" setzen

``` bash
python -m app.seed.seed_locomotives
```

7. Backend starten
Im Backend-Verzeichnis:

```bash
fastapi dev app/main.py
```

Wenn alles läuft:

API: http://127.0.0.1:8000

Docs (Swagger-UI): http://127.0.0.1:8000/docs
