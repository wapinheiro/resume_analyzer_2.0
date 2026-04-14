import sys
import os
from pathlib import Path

# Add the backend directory to sys.path so we can import app
backend_path = Path(__file__).parent.parent
sys.path.append(str(backend_path))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db import base # Ensures all models are registered
from app.models.market_skill import MarketSkill

def seed_skills():
    db: Session = SessionLocal()
    
    # Draft Skills Dataset
    skills_data = [
        # AI/ML
        {"name": "RAG (Retrieval-Augmented Generation)", "category": "AI/ML", "major": "Computer Science", "importance": 5},
        {"name": "Vector Databases (Pinecone/Weaviate)", "category": "AI/ML", "major": "Computer Science", "importance": 5},
        {"name": "Large Language Models (LLMs)", "category": "AI/ML", "major": "Computer Science", "importance": 5},
        {"name": "PyTorch / TensorFlow", "category": "AI/ML", "major": "Computer Science", "importance": 4},
        
        # DevOps / Infrastructure
        {"name": "Kubernetes (K8s)", "category": "DevOps", "major": None, "importance": 4},
        {"name": "CI/CD Pipelines", "category": "DevOps", "major": None, "importance": 5},
        {"name": "Docker / Containerization", "category": "DevOps", "major": None, "importance": 4},
        
        # Architecture / Backend
        {"name": "System Design / Scalability", "category": "Architecture", "major": "Computer Science", "importance": 5},
        {"name": "Cloud Native Architecture", "category": "Cloud", "major": None, "importance": 4},
        {"name": "PostgreSQL / SQL Optimization", "category": "Database", "major": None, "importance": 5},
        {"name": "Go (Golang)", "category": "Backend", "major": "Computer Science", "importance": 3},
        
        # Frontend / Modern Web
        {"name": "Next.js / Modern React", "category": "Frontend", "major": "Computer Science", "importance": 4},
        {"name": "TypeScript", "category": "Frontend", "major": "Computer Science", "importance": 4},
        
        # Data
        {"name": "Data Engineering (Spark/Airflow)", "category": "Data", "major": "Information Systems", "importance": 4},
        
        # Security
        {"name": "OWASP / Threat Modeling", "category": "Security", "major": "Cybersecurity", "importance": 5},
        {"name": "Identity & Access Management (IAM)", "category": "Security", "major": None, "importance": 4},
    ]

    print(f"Seeding {len(skills_data)} market skills...")
    
    try:
        for skill in skills_data:
            # Check if skill already exists
            existing = db.query(MarketSkill).filter(MarketSkill.name == skill["name"]).first()
            if not existing:
                db_skill = MarketSkill(**skill)
                db.add(db_skill)
        
        db.commit()
        print("Seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_skills()
