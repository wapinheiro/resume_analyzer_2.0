def test_sync_user(client):
    payload = {
        "email": "test@example.com",
        "name": "Test User",
        "avatar_url": "http://example.com/avatar.png"
    }
    response = client.post("/api/v1/users/sync", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data
    assert "role" in data
    assert data["role"] == "student"

    # Test updating user on second sync
    payload2 = {
        "email": "test@example.com",
        "name": "Updated Name",
    }
    response2 = client.post("/api/v1/users/sync", json=payload2)
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["id"] == data["id"]
    assert data2["name"] == "Updated Name"
