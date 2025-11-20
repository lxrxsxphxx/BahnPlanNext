import models
from database import create_db_and_tables

def main():
    create_db_and_tables()
    print("Tabellen erstellt.")

if __name__ == "__main__":
    main()
