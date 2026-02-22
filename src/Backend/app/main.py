from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

import os
from contextlib import asynccontextmanager
<<<<<<< feature/#73-wagon-list
from app.router import userRouter, routeRouter, vehicleRouter, shopRouter, companyRouter, wagonRouter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
=======

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

>>>>>>> dev
from app import database
from app.router import (
    companyRouter,
    routeRouter,
    shopRouter,
    tenderRouter,
    userRouter,
    vehicleRouter,
)
from app.seeding import seed_demo_data


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

app.mount("/static", StaticFiles(directory="static"), name="static")
# Cors Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(userRouter.router)
app.include_router(shopRouter.router)
app.include_router(vehicleRouter.router)
app.include_router(routeRouter.router)
app.include_router(companyRouter.router)
app.include_router(wagonRouter.router)
app.include_router(tenderRouter.router)

