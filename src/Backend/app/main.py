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

# Configure CORS to allow credentials from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(userRouter.router)
app.include_router(shopRouter.router)