from dotenv import find_dotenv, load_dotenv
load_dotenv(find_dotenv())

import os
from app.seeding import seed_demo_data
from contextlib import asynccontextmanager
from app.router import userRouter, routeRouter, vehicleRouter, shopRouter, companyRouter, wagonRouter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app import database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    database.create_db_and_tables()
    print("DB initialized")

    # Generating test data
    if os.getenv("SEED_DEMO_DATA", "false").lower() == "true":
        seed_demo_data(database.get_db())  # pass session generator

    # continue to application
    yield

    # Shutdown
    print("Server stopping...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://172.18.0.4:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(userRouter.router)
app.include_router(shopRouter.router)
app.include_router(vehicleRouter.router)
app.include_router(routeRouter.router)
app.include_router(companyRouter.router)
app.include_router(wagonRouter.router)
