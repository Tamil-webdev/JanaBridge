import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_get_states():
    res = client.get("/api/v1/states/")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_get_schemes():
    res = client.get("/api/v1/schemes/")
    assert res.status_code == 200
    assert "items" in res.json()

    # Check that it clearly indicates DEV STUB
    items = res.json()["items"]
    assert len(items) > 0
    assert "[DEV STUB]" in items[0]["title"]

def test_get_services():
    res = client.get("/api/v1/services/")
    assert res.status_code == 200
    assert "items" in res.json()
    items = res.json()["items"]
    assert len(items) > 0
    assert "[DEV STUB]" in items[0]["name"]
