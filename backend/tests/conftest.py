import sys
from unittest.mock import MagicMock
import tempfile

# Create a mock chromadb module
mock_chromadb = MagicMock()

# Mock the PersistentClient class
class MockClient:
    def __init__(self, path=None):
        self.path = path
        self._collections = {}

    def get_or_create_collection(self, name, metadata=None):
        if name not in self._collections:
            self._collections[name] = MockCollection(name)
        return self._collections[name]

    def delete_collection(self, name):
        if name in self._collections:
            del self._collections[name]

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.items = {}
        
    def upsert(self, ids, embeddings, metadatas, documents):
        for i in range(len(ids)):
            self.items[ids[i]] = {
                "embedding": embeddings[i],
                "metadata": metadatas[i],
                "document": documents[i]
            }
            
    def count(self):
        return len(self.items)
        
    def query(self, query_embeddings, n_results, include=None):
        ids = list(self.items.keys())[:n_results]
        metadatas = [self.items[i]["metadata"] for i in ids]
        documents = [self.items[i]["document"] for i in ids]
        distances = [0.1 * i for i in range(len(ids))]
        
        return {
            "ids": [ids],
            "metadatas": [metadatas],
            "documents": [documents],
            "distances": [distances]
        }

mock_chromadb.PersistentClient = MockClient

# Inject it into sys.modules
sys.modules['chromadb'] = mock_chromadb

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.storage.database import Base, get_db
from app.main import app
from fastapi.testclient import TestClient
from app.core.config import settings

@pytest.fixture(scope="session")
def engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    return engine

@pytest.fixture()
def db_session(engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture()
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
