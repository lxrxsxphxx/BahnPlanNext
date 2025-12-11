from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

from .database import get_db

from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
import os
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError

from .schemas.userSchema import UserSchema
from . import database, crud, auth, sendmail, models

app = FastAPI()
FRONTEND_URL = os.getenv("FRONTEND_URL")
if not FRONTEND_URL:
    raise ValueError("FRONTEND_URL not set")

@app.on_event("startup")
def startup_event():
    database.create_db_and_tables()

@app.on_event("shutdown")
def shutdown_event():
    database.shutdown()


@app.get("/users/", response_model=list[models.User])
def list_users(db: Session = Depends(get_db)):
    return db.exec(select(models.User)).all()


@app.post("/register")
def register_user(user: UserSchema, db: Session = Depends(database.get_db)):
  if not user.password or user.password.strip() == "":
    raise HTTPException(status_code=400, detail="Password must not be empty.")
  try:
    user.password.encode("ascii")
  except UnicodeEncodeError:
    raise HTTPException(status_code=400, detail="Password must contain only ASCII characters.")


  # Prüfen, ob E-Mail bereits existiert
  existing_email_user = db.exec(
      select(models.User).where(models.User.email == user.email)
  ).first()
  if existing_email_user:
      raise HTTPException(
          status_code=400,
          detail="Ein Benutzer mit dieser E-Mail-Adresse existiert bereits."
      )

  # Prüfen, ob Benutzername bereits existiert
  existing_username_user = db.exec(
      select(models.User).where(models.User.username == user.username)
  ).first()
  if existing_username_user:
      raise HTTPException(
          status_code=400,
          detail="Ein Benutzer mit diesem Benutzernamen existiert bereits."
      )
  db_user = crud.create_User(db=db, user=user)
  token = auth.create_access_token(db_user, minutes=60*24)
  sendmail.send_mail(to=user.email, token=token, username=user.username)
  return {
      "message": "User erfolgreich registriert. Bitte E-Mail zur Aktivierung prüfen.",
      "user_id": db_user.id
  }

@app.post("/login")
def login(db: Session = Depends(database.get_db), form_data: OAuth2PasswordRequestForm = Depends()):
  db_user = crud.get_user_by_username(db=db, username=form_data.username)
  if not db_user:
    raise HTTPException(status_code=401, detail="Anmeldedaten nicht korrekt")

  if not db_user.is_active:
    raise HTTPException(
      status_code=401,
      detail="Bitte bestätige zuerst deine Registrierung über den Link in der E-Mail.",
      headers={"WWW-Authenticate": "Bearer"},
    )

  if auth.verify_password(form_data.password, db_user.hashed_password):
    token = auth.create_access_token(db_user, minutes=60*24*30)
    return {"access_token": token, "token_type": "Bearer"}
  raise HTTPException(status_code=401, detail="Anmeldedaten nicht korrekt")



@app.get("/verify/{token}", response_class=HTMLResponse)
def verify_user(token: str, db: Session = Depends(database.get_db)):
    # Token prüfen
    try:
        claims = auth.decode_token(token)
    except JWTError:
        return RedirectResponse(
                url=f"{FRONTEND_URL}/login?verify=invalid_token",
                status_code=302,   
            )

    # Nutzer aus Token holen
    username = claims.get("sub")
    if not username:
        return RedirectResponse(
                url=f"{FRONTEND_URL}/login?verify=missing_username",
                status_code=302,   
            )

    # Nutzer in der DB suchen
    db_user = crud.get_user_by_username(db, username)
    if not db_user:
        return RedirectResponse(
                url=f"{FRONTEND_URL}/login?verify=user_not_found",
                status_code=302,   
            )

    # Nutzer aktivieren
    db_user.is_active = True
    db.commit()
    db.refresh(db_user)

    # Erfolgsseite
    return RedirectResponse(
                url=f"{FRONTEND_URL}/login?verify=success&user={username}",
                status_code=302,   
            )


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

