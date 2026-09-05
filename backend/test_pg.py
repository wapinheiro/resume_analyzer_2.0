import os, sys
sys.path.append(os.getcwd())
from dotenv import load_dotenv
load_dotenv(".env")

from app.db.session import SessionLocal
from app.models.user import User
from app.models.analysis import Analysis
from app.models.resume import Resume

def main():
    db = SessionLocal()
    print("Users:", db.query(User).count())
    print("Resumes:", db.query(Resume).count())
    print("Analyses:", db.query(Analysis).count())
    db.close()

if __name__ == "__main__":
    main()
