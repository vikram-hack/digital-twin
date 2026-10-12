import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.engine import Base, get_db
from main import app
from app.database.seed import seed_database

# Use in-memory SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Mocking the seed logic but calling it explicitly 
    # instead of doing it from app start
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(setup_database):
    db = TestingSessionLocal()
    # Call the actual seed logic from seed.py
    # to populate test data
    from app.database.seed import seed_database
    # patch the SessionLocal inside seed_database to use our TestingSessionLocal? 
    # Actually just simple mocking here
    yield db
    db.rollback()
    db.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
