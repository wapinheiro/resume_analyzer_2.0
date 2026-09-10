# Resume Analyzer 2.0

> **Intelligent resume analysis and career guidance for Computer Science students**

Resume Analyzer 2.0 transforms student resumes from "high-risk generalist" narratives into market-ready, evidence-backed applications using a proprietary **5-Layer Analysis Framework** and quantitative **Risk-Mitigation Score (RMS)**.

![TypeScript](https://img.shields.io/badge/TypeScript-73.1%-blue?logo=typescript)
![Python](https://img.shields.io/badge/Python-24.5%-brightgreen?logo=python)
![Status](https://img.shields.io/badge/Status-Planning_Phase-yellow)
![Version](https://img.shields.io/badge/Version-2.0-informational)

---

## The Problem

Modern hiring is **risk management**, not talent hunting:

- **Recruiting Risks**: Recruiters fear competence gaps, cultural mismatch, and talent flight
- **The 6-Second Filter**: Recruiters spend 6 seconds scanning a resume—unfocused narratives lose immediately
- **ATS Barrier**: 75% of resumes never reach human eyes due to Applicant Tracking System failures
- **Student Disconnect**: CS students often present as "generalists" with weak quantification and outdated skills

**Result**: Talented CS students get filtered out by ATS systems or rejected in 6 seconds, despite strong technical abilities.

---

## The Solution

Resume Analyzer 2.0 provides a comprehensive **7-step analysis pipeline**:

1. **Layered Analysis** – Analyze using the proprietary 5-Layer Framework
2. **Detailed Audit** – Comprehensive findings per analysis layer  
3. **Quantitative Scoring** – Risk-Mitigation Score (RMS) from 0-100
4. **Optimization Feedback** – Specific, actionable recommendations
5. **Resume Rewriting** – AI-optimized version for comparison
6. **Career Profile Identification** – Assess specialist market identity
7. **Job Matching** – Find aligned opportunities

---

## The Framework: 5-Layer Analysis

Resume Analyzer evaluates resumes through 5 sequential layers, each addressing a specific hiring fear:

### Layer 1: The Foundation (ATS & Structural Integrity) — 20%
**Survive the machine gatekeeper and the 6-second scan**
- Single-column, reverse-chronological format
- ATS-compatible fonts and spacing
- Clickable links to GitHub and LinkedIn
- Clean, professional formatting

### Layer 2: The Core Spec (Technical Readiness) — 15%
**Prove "shelf-ready" skills for the 2026 market**
- Modern tech stack (Python, TypeScript, React, AWS, Docker, etc.)
- Skills organized by category (Languages, Frameworks, Cloud/DevOps, Databases)
- No legacy noise (outdated C++, PHP, MS Office)
- High-signal markers (AI/ML, Cloud Native, Testing frameworks)

### Layer 3: The Impact Layer (Tone & Quantification) — 25%
**Move from "student" duties to "engineer" outcomes**
- Challenge-Action-Result (CAR) format for every bullet
- Power verbs (Engineered, Optimized, Automated, not "Responsible for")
- Quantified metrics (%, $, time, volume, scale)
- Credibility amplifiers demonstrating business impact

### Layer 4: The Storyline (Narrative Signal) — 25%
**Establish clear specialist identity, lower hiring risk**
- Instant 6-second label (e.g., "Backend Engineer")
- Red thread—consistent narrative across projects, skills, education
- Signal vs. noise—eliminate unrelated projects
- Clear professional identity, not the "tourist" generalist

### Layer 5: The X-Factor (Agency & Growth) — 15%
**Prove critical thinking and judgment beyond coursework**
- Evidence of independent, unassigned projects
- Architectural reasoning ("Why" behind technical choices)
- Teaching/mentorship, explaining complex concepts
- Multiplier effects and translation skills

---

## The Risk-Mitigation Score (RMS)

**Purpose**: Objective "Hireability Index" based on the 5-Layer Framework

**Formula**:
```
RMS = (L1 × 0.20) + (L2 × 0.15) + (L3 × 0.25) + (L4 × 0.25) + (L5 × 0.15)
Final Score = RMS × 10  (scaled to 0-100)
```

**Benchmarks**:
- **90-100 (Market Ready)** – Low risk, instant hire potential
- **75-89 (The Tourist)** – Moderate risk, needs more quantification and focus
- **Below 75 (The Student)** – High risk, needs structural overhaul

---

## Career Profile Identity (CPI)

Automatically detect specialist market positioning:

| Stack + Focus | CPI Label | Target Roles |
|---|---|---|
| Java/Go + Microservices, AWS | **Backend Specialist** | Backend Engineer, Platform Engineer |
| JavaScript/TypeScript + React, Node.js | **Product Engineer** | Full Stack Developer, Frontend Engineer |
| Python + PyTorch, Pandas, ETL | **Data/AI Engineer** | ML Engineer, Data Scientist |
| C++/Rust + Linux, Embedded | **Systems Engineer** | Embedded Software Engineer |
| Terraform + Kubernetes, CI/CD | **Cloud/DevOps Engineer** | DevOps Engineer, SRE, Cloud Architect |

---

## Key Features

### For Students
- Resume upload (PDF, DOCX, TXT)  
- Real-time 5-layer analysis  
- Quantitative RMS scoring  
- Detailed audit reports with specific findings  
- Actionable optimization recommendations  
- AI-powered resume rewriting  
- Career profile assessment  
- Job matching and search  
- PDF export of reports  
- Analysis history  

### For Advisors (v2.5)
- Advisor dashboard with student list  
- Drill-down into individual analyses  
- Aggregate analytics across students  
- Scheduler integration for follow-ups  
- Search and filtering capabilities  

---

## Tech Stack

### Backend
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Database**: PostgreSQL 13+
- **ORM**: SQLAlchemy
- **Testing**: Pytest
- **AI/LLM**: Google Gemini API

### Frontend  
- **Framework**: Next.js 14+ (TypeScript)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Google/GitHub OAuth)
- **State Management**: React Context / Zustand
- **Testing**: Jest, React Testing Library
- **Export**: PDF generation

### Infrastructure
- **Hosting**: Google Cloud Platform (GCP) / AWS
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Google Cloud Monitoring / Datadog

---

## Project Scope (MVP - v1.0)

### In Scope
- Resume parsing (PDF, DOCX, TXT)
- 5-layer analysis engine
- RMS calculation and scoring (0-100)
- Detailed audit report generation
- Optimization recommendations
- AI-powered resume rewriting
- Career Profile Identity detection
- PDF export of reports
- User account creation and login
- Analysis history for logged-in users
- Responsive web interface
- FERPA compliance measures

### Out of Scope (Future Versions)
- Job matching and search integration (v2.0)
- Batch analysis for career counselors (v2.0+)
- LinkedIn profile optimization (v2.1)
- Cover letter generation (v2.1)
- Interview preparation (v2.2)
- Mobile applications (v3.0)
- Multi-language support (v3.0)

---

## Success Metrics

### Technical
- **Analysis Accuracy**: 90%+ agreement with human expert reviews
- **Performance**: 95% of analyses complete within 60 seconds
- **Reliability**: 99.5% uptime in first month
- **Test Coverage**: 80%+ code coverage
- **Security**: Zero critical vulnerabilities

### User Experience
- **User Satisfaction**: 4.0/5.0 average rating
- **Recommendation Quality**: 85%+ rated "helpful" or better
- **Completion Rate**: 80%+ of users complete full analysis
- **Return Rate**: 50%+ of users analyze multiple versions

### Business
- **User Acquisition**: 100+ BYU CS students in first month
- **RMS Improvement**: Average 20+ point increase after recommendations
- **Engagement**: 60%+ of users download optimized resume
- **Cost Efficiency**: Stay within $1,000 budget for MVP

---

## Development Timeline

**Duration**: 12 weeks (3 months)  
**Target Launch**: April 30, 2026

### Phase 1: Foundation & Design (Weeks 1-3)
- System architecture
- Database design
- Algorithm design
- Technical prototype with Gemini API integration

### Phase 2: Core Development (Weeks 4-8)
- API specification and design
- Backend implementation (5 analyzers, RMS calculator, Gemini service)
- Frontend implementation (upload, dashboard, reports)

### Phase 3: Integration & Testing (Weeks 9-10)
- End-to-end integration testing
- User acceptance testing (20 BYU CS students)
- Performance and security testing

### Phase 4: Deployment & Launch (Weeks 11-12)
- Security audit and FERPA compliance
- Production deployment
- Monitoring and documentation

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 13+
- Docker & Docker Compose
- Google Cloud account (Gemini API key)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/wapinheiro/resume_analyzer_2.0.git
cd resume_analyzer_2.0
```

2. **Set up backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Set up frontend**
```bash
cd frontend
npm install
```

4. **Configure environment variables**
```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost/resume_analyzer
GEMINI_API_KEY=your_gemini_key_here

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your_secret_here
```

5. **Run services**
```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm run dev
```

Visit http://localhost:3000

---

## Documentation

- **[Project Plan](docs/project/project_plan.md)** – Complete project roadmap and milestones
- **[Concept Document](docs/concept/concept.md)** – Framework, methodology, and system design
- **[Requirements (v2.5)](docs/requirements/v2.5/requirements.md)** – Detailed feature specifications
- **[Technical Spec](docs/technical/)** – API design and data dictionary
- **[Design Documents](docs/design/)** – UI/UX and system architecture

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

### Code Standards
- **Python**: PEP 8, type hints required
- **TypeScript**: Airbnb style guide
- **Testing**: 80%+ coverage required
- **Documentation**: All functions must have docstrings/comments

---

## Support

- **Issues**: [GitHub Issues](https://github.com/wapinheiro/resume_analyzer_2.0/issues)
- **Email**: Contact project maintainer
- **Documentation**: See `/docs` folder

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- BYU Computer Science Department
- Recruiting research and hiring manager insights
- Career services professionals and academic advisors
- Early student testers and feedback providers

---

## Quick Links

- [Project Repository](https://github.com/wapinheiro/resume_analyzer_2.0)
- [Project Board](https://github.com/wapinheiro/resume_analyzer_2.0/projects)
- [Documentation](docs/)
- [Issues & Roadmap](https://github.com/wapinheiro/resume_analyzer_2.0/issues)

---

**Made with care by [Wagner Pinheiro](https://github.com/wapinheiro)**

*Resume Analyzer 2.0: Transform from "Student" to "Market Ready"*
