from app import models

# Zum Postgres-Start folgenden Befehl unter PostgreSQL/18/bin ausführen:
# pg_ctl.exe start -D "<YOUR-PATH-TO-POSTGRES>\PostgreSQL\18\data"

from app.database import create_db_and_tables

def main():
    create_db_and_tables()
    print("Tabellen erstellt.")

if __name__ == "__main__":
    main()
