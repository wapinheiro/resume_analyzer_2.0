import os
import sys
import uuid
import random
from datetime import datetime, timedelta

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis

def seed_database():
    db = SessionLocal()
    
    majors = ["Computer Science", "Information Systems", "Cybersecurity", "Accounting", "Finance"]
    grad_years = [2024, 2025, 2026, 2027]
    skills = ["Python", "JavaScript", "React", "SQL", "Docker", "AWS", "Communication", "Leadership"]
    
    print("Cleaning existing mock data...")
    # Delete Analyses linked to mock resumes
    db.query(Analysis).filter(Analysis.resume_id.in_(
        db.query(Resume.id).filter(Resume.user_id.in_(
            db.query(User.id).filter(User.email.like("mockstudent%"))
        ))
    )).delete(synchronize_session=False)
    
    # Delete Resumes linked to mock students
    db.query(Resume).filter(Resume.user_id.in_(
        db.query(User.id).filter(User.email.like("mockstudent%"))
    )).delete(synchronize_session=False)

    # Delete Users
    db.query(User).filter(User.email.like("mockstudent%")).delete(synchronize_session=False)
    db.commit()

    print("Creating mock students...")
    # Create 15 mock students
    students = []
    for i in range(15):
        student = User(
            id=uuid.uuid4(),
            email=f"mockstudent{i}@example.com",
            name=f"Mock Student {i}",
            role="student",
        )
        db.add(student)
        students.append(student)
        
    db.commit()
    
    print("Creating mock resumes and analyses...")
    # Create 1-3 resumes per student
    for student in students:
        num_resumes = random.randint(1, 3)
        for i in range(num_resumes):
            # dates from last 3 months
            days_ago = random.randint(1, 90)
            upload_date = datetime.utcnow() - timedelta(days=days_ago)
            
            # Create Resume
            resume = Resume(
                id=uuid.uuid4(),
                user_id=student.id,
                uploaded_at=upload_date,
                client_info={
                    "browser": "Chrome",
                    "os": "Mac OS",
                    "major": random.choice(majors),
                    "grad_year": str(random.choice(grad_years))
                }
            )
            db.add(resume)
            db.commit()
            
            # create an analysis for this resume
            score = random.randint(55, 98)
            missing_skills = random.sample(skills, random.randint(1, 4))
            
            analysis = Analysis(
                id=uuid.uuid4(),
                resume_id=resume.id,
                rms_score=score,
                cpi="Strong" if score > 80 else "Developing",
                predicted_grad_date=f"Spring {random.choice(grad_years)}",
                skills_detected=["Communication", "Teamwork"] + random.sample(skills, 2),
                top_risks=[
                    {"type": "Missing Skill", "issue": skill} for skill in missing_skills
                ],
                raw_json={"mock": "data"},
                created_at=upload_date + timedelta(minutes=5)
            )
            db.add(analysis)
            
    db.commit()
    print("Database seeded successfully with mock data!")

if __name__ == "__main__":
    seed_database()
