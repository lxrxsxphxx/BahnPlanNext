from dotenv import find_dotenv, load_dotenv
load_dotenv(find_dotenv())

import os
from app.seeding import seed_demo_data
from contextlib import asynccontextmanager
from app.router import userRouter, routeRouter, vehicleRouter, shopRouter, companyRouter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    database.create_db_and_tables()
    print("DB initialized")

    # Generating test data
    if os.getenv("SEED_DEMO_DATA", "false").lower() == "true":
        seed_demo_data(database.engine)  # engine aus database.py

    yield

    # Shutdown
    print("Server stopping...")

app = FastAPI(lifespan=lifespan)

# Configure CORS to allow credentials from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://frontend:3000",  # Docker service
        "http://localhost:8000",  # For dev requests from browser
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(userRouter.router)
app.include_router(shopRouter.router)
app.include_router(vehicleRouter.router)
app.include_router(routeRouter.router)
app.include_router(companyRouter.router)
