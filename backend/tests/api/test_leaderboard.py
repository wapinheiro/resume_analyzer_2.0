def test_get_leaderboard(client):
    response = client.get("/api/v1/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert "leaderboard" in data
    assert "major_filter" in data
    assert data["major_filter"] == "ALL"
    assert len(data["leaderboard"]) > 0

    # Test filtering by major
    response_cs = client.get("/api/v1/leaderboard?major=CS")
    assert response_cs.status_code == 200
    data_cs = response_cs.json()
    assert data_cs["major_filter"] == "CS"
    assert len(data_cs["leaderboard"]) > 0
