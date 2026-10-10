import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.storage.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_conversations.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module", autouse=True)
def setup_db_and_config():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    try:
        if os.path.exists("./test_conversations.db"):
            os.remove("./test_conversations.db")
    except OSError:
        pass

client = TestClient(app)

def test_create_and_list_conversations():
    response = client.post("/api/v1/conversations/", json={"title": "Test Conv"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Conv"
    conv_id = data["id"]

    res_list = client.get("/api/v1/conversations/")
    assert res_list.status_code == 200
    assert len(res_list.json()["items"]) >= 1

def test_get_conversation_missing():
    res = client.get("/api/v1/conversations/nonexistent")
    assert res.status_code == 404

def test_message_flow():
    conv_res = client.post("/api/v1/conversations/", json={"title": "Flow Conv"})
    conv_id = conv_res.json()["id"]

    # Add message
    msg_res = client.post(
        f"/api/v1/conversations/{conv_id}/messages",
        json={"message": "Hello?"}
    )
    assert msg_res.status_code == 201
    msg_data = msg_res.json()
    assert msg_data["role"] == "assistant"
    assert "DEVELOPMENT STUB" in msg_data["content"]

    # Retrieve conversation history
    hist_res = client.get(f"/api/v1/conversations/{conv_id}")
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    # Expect 2 messages: user and assistant
    assert len(hist_data["messages"]) == 2
    assert hist_data["messages"][0]["role"] == "user"
    assert hist_data["messages"][1]["role"] == "assistant"

    user_msg_id = hist_data["messages"][0]["id"]

    # Edit user message
    edit_res = client.patch(f"/api/v1/messages/{user_msg_id}", json={"content": "Hello changed"})
    assert edit_res.status_code == 200
    assert edit_res.json()["content"] == "Hello changed"
    assert edit_res.json()["revision"] == 2

    # Regenerate assistant response
    regen_res = client.post(f"/api/v1/messages/{user_msg_id}/regenerate", json={"message": "Regenerate query"})
    assert regen_res.status_code == 200
    assert regen_res.json()["role"] == "assistant"

def test_empty_message():
    conv_res = client.post("/api/v1/conversations/", json={"title": "Empty Msg"})
    conv_id = conv_res.json()["id"]

    msg_res = client.post(
        f"/api/v1/conversations/{conv_id}/messages",
        json={"message": "   "}
    )
    assert msg_res.status_code == 400
