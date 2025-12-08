import os

from dotenv import load_dotenv, find_dotenv
from sqlmodel import Session, SQLModel, create_engine
from pathlib import Path

load_dotenv(find_dotenv())

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL not set. Please configure it in your .env"
    )

print(">>> EFFECTIVE DATABASE_URL:", repr(DATABASE_URL))  # Debug

engine = create_engine(
    DATABASE_URL,
    echo=True, # debug only
    future=True,
)


def get_db():
    """gibt session zurück"""
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    """Erstellt Tabellen welche in SQLModel-Klassen definiert"""
    SQLModel.metadata.create_all(engine)


def shutdown():
    """Engine-Pool schließen"""
    engine.dispose()
