from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlmodel import Session
from . import database, models_and_schemas, crud, auth, sendmail
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError

app = FastAPI()

@app.on_event("startup")
def startup_event():
    database.create_db_and_tables()

@app.on_event("shutdown")
def shutdown_event():
    database.shutdown()


@app.post("/register")
def register_user(user: models_and_schemas.UserSchema, db: Session = Depends(database.get_db)):
    db_user = crud.create_User(db=db, user=user)
    token = auth.create_access_token(db_user)
    sendmail.send_mail(to=user.email, token=token, username=user.username)
    return db_user

@app.post("/login")
def login(db: Session = Depends(database.get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    db_user = crud.get_user_by_username(db=db, username=form_data.username)
    if not db_user:
        raise HTTPException(status_code=401, detail="Anmeldedaten nicht korrekt")
    if auth.verify_password(form_data.password, db_user.hashed_password):
        token = auth.create_access_token(db_user)
        return{"access_token": token, "token_type": "Bearer"}
    raise HTTPException(status_code=401, detail="Anmeldedaten nicht korrekt")


@app.get("/verify/{token}", response_class=HTMLResponse)
def verify_user(token: str, db: Session = Depends(database.get_db)):
    # Token prüfen
    try:
        claims = auth.decode_token(token)
    except JWTError:
        return HTMLResponse(
            content="""
            <html>
                <head><title>Ungültiger Token</title></head>
                <body>
                    <h2 style="color:red;">Der Bestätigungslink ist ungültig oder abgelaufen.</h2>
                    <p>Bitte fordere einen neuen Link an.</p>
                    <a href="https://google.com">Zurück</a>
                </body>
            </html>
            """,
            status_code=400
        )

    # Nutzer aus Token holen
    username = claims.get("sub")
    if not username:
        return HTMLResponse(
            content="""
            <html>
                <head><title>Fehler</title></head>
                <body>
                    <h2 style="color:red;">Ungültiger Token: Benutzername fehlt.</h2>
                    <a href="https://google.com">Zurück</a>
                </body>
            </html>
            """,
            status_code=400
        )

    # Nutzer in der DB suchen
    db_user = crud.get_user_by_username(db, username)
    if not db_user:
        return HTMLResponse(
            content=f"""
            <html>
                <head><title>Fehler</title></head>
                <body>
                    <h2 style="color:red;">Der Benutzer '{username}' wurde nicht gefunden.</h2>
                    <a href="https://google.com">Zurück</a>
                </body>
            </html>
            """,
            status_code=404
        )

    # Nutzer aktivieren
    db_user.is_active = True
    db.commit()
    db.refresh(db_user)

    # Erfolgsseite
    return f"""
    <html>
        <head>
            <title>Bestätigung der Registrierung</title>
        </head>
        <body>
            <h2>Aktivierung von <b>{username}</b> erfolgreich!</h2>
            <a href="https://google.com">Zurück</a>
        </body>
    </html>
    """


@app.get("/users")
def get_all_users(db: Session = Depends(database.get_db)):
        users = crud.get_users(db=db)
        return users

@app.get("/secured", dependencies=[Depends(auth.check_active)])
def get_all_users(db: Session = Depends(database.get_db)):
        users = crud.get_users(db=db)
        return users

@app.get("/adminsonly", dependencies=[Depends(auth.check_admin)])
def get_all_users(db: Session = Depends(database.get_db), active: bool = Depends(auth.check_admin)):
    users = crud.get_users(db=db)
    return users

