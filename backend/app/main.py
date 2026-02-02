from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Resume Analyzer 2.0 - CI/Cd test"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
