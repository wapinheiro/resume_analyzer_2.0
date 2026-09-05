import requests
import json
import time

# Use the production backend URL
API_URL = "https://resume-analyzer-backend-87294979859.us-central1.run.app/api/v1/analyze"

def trigger_test_scan():
    print(f"Triggering test scan to: {API_URL}")
    with open("test.pdf", "rb") as f:
        files = {"file": ("test.pdf", f, "application/pdf")}
        response = requests.post(API_URL, files=files, stream=True)
        
        if response.status_code != 200:
            print(f"Error: {response.status_code}")
            print(response.text)
            return

        print("Receiving stream...")
        for line in response.iter_lines():
            if line:
                data = json.loads(line)
                if data["type"] == "log":
                    print(f"  [AI] {data['message']}")
                elif data["type"] == "result":
                    print(f"\nSUCCESS! Top Gaps identified: {data['data'].get('skills_gaps', [])[:3]}")

if __name__ == "__main__":
    trigger_test_scan()
