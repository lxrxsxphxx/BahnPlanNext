from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
        seed_demo_data(database.engine)  # engine aus database.py

    yield

    # Shutdown
    print("Server stopping...")

app = FastAPI(lifespan=lifespan)

app.include_router(userRouter.router)
app.include_router(shopRouter.router)
app.include_router(vehicleRouter.router)
app.include_router(routeRouter.router)
app.include_router(companyRouter.router)
app.include_router(tenderRouter.router)
