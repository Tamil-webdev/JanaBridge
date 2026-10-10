import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.storage.database import get_db, Base

# Set up an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module", autouse=True)
def setup_teardown():
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    try:
        if os.path.exists("./test.db"):
            os.remove("./test.db")
    except OSError:
        pass

client = TestClient(app)

def test_health_check_ok():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "degraded"]
    assert data["app_name"] == "JanaBridge"
    assert "components" in data
    assert data["components"]["database"] == "ok"
    # Ollama might be unreachable, which is fine
    assert data["components"]["ollama"] in ["ok", "unreachable", "error_404"]

def test_database_connectivity_failure(monkeypatch):
    def broken_get_db():
        # Yield a mock that raises an exception when executing a query
        class BrokenSession:
            def execute(self, *args, **kwargs):
                raise Exception("DB Down")
            def close(self):
                pass
        yield BrokenSession()

    app.dependency_overrides[get_db] = broken_get_db
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "degraded"
    assert data["components"]["database"] == "unreachable"
    app.dependency_overrides[get_db] = override_get_db
