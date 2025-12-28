from dotenv import find_dotenv, load_dotenv
load_dotenv(find_dotenv())

from contextlib import asynccontextmanager
from app.router import userRouter
from app.router import shopRouter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    database.create_db_and_tables()
    print("DB initialized")
    yield

    # Shutdown
    print("Server stopping...")

app = FastAPI(lifespan=lifespan)

app.include_router(userRouter.router)
app.include_router(shopRouter.router)