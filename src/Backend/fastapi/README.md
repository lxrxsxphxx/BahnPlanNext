# 🚄 BahnPlanNext – Backend Setup (FastAPI)

Dieses Dokument beschreibt, wie das FastAPI-Backend von BahnPlanNext **lokal installiert, gestartet und getestet** wird.  
Der aktuelle Stand beinhaltet:

- Benutzerregistrierung (`POST /register`)
- Login mit JWT-Token (`POST /login`)
- E-Mail-Verifizierung (`GET /verify/{token}`)
- Rollen & Berechtigungen (`user`, `admin`)
- Geschützte Routen (`/secured`, `/adminsonly`)
- SQLite-Datenbank
- Automatisches Laden der `.env`-Datei

---

## Projektstruktur (Backend)

````
src/
└── Backend/
└── fastapi/
├── app/
│ ├── auth.py
│ ├── crud.py
│ ├── database.py
│ ├── main.py
│ ├── models_and_schemas.py
│ └── sendmail.py
├── requirements.txt
├── .env.example (falls vorhanden)
└── README.md
````

---

# 1. Voraussetzungen

- Python **3.10+*
- pip

---

# 2. Projekt installieren

### In das Backend-Verzeichnis wechseln:
```bash
cd src/Backend/fastapi
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

4. .env Datei anlegen

```bash
src/Backend/fastapi/.env
```

Mit folgendem Inhalt:

(Je nach mail muss ein APP_Passwort bei Google generiert werden unter "https://myaccount.google.com/apppasswords"... Das dann einfach als Passwort verwenden)
```
email=DEIN_GMAIL_LOGIN
password=DEIN_GMAIL_APPPASSWORT
```

# Optional(NOCH NÖTIG):
```
JWT_SECRET=imsersecretkey
ALGORITHM=HS256
DATABASE_URL=sqlite:///./sql_app.db
```

5. Backend starten
Im Backend-Verzeichnis:

```bash
uvicorn app.main:app --reload
```

Wenn alles läuft:

API: http://127.0.0.1:8000

Docs (Swagger-UI): http://127.0.0.1:8000/docs


