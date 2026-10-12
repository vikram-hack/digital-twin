from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database.engine import engine, Base
from app.database.seed import seed_database
from app.api import assets, topology, simulation, security_controls, mitre, ai, scenarios, whatif, reports, dashboard

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    # Seed database with synthetic data if empty
    seed_database()
    yield

app = FastAPI(
    title="CyberTwin AI - Cyber Attack Simulation",
    description="SIMULATION ENVIRONMENT — NO REAL INFRASTRUCTURE AFFECTED",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assets.router, prefix="/api")
app.include_router(topology.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(security_controls.router, prefix="/api")
app.include_router(mitre.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(scenarios.router, prefix="/api")
app.include_router(whatif.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
