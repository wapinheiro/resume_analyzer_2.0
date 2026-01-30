# Resume Analyzer 2.0 - Requirements Specification

**Version**: 1.0  
**Date**: January 29, 2026  
**Status**: Draft  
**Author**: Wagner Pinheiro

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [User Stories](#5-user-stories)
6. [Data Requirements](#6-data-requirements)
7. [External Interface Requirements](#7-external-interface-requirements)
8. [System Features](#8-system-features)
9. [Constraints and Assumptions](#9-constraints-and-assumptions)
10. [Acceptance Criteria](#10-acceptance-criteria)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for Resume Analyzer 2.0, an intelligent resume analysis and career guidance tool for Computer Science students.

### 1.2 Scope
Resume Analyzer 2.0 will:
- Analyze student resumes using a 5-layer framework
- Generate quantitative Risk-Mitigation Scores (RMS)
- Provide actionable optimization recommendations
- Rewrite resumes to demonstrate best practices
- Identify Career Profile Identity (CPI)
- Match students with relevant job opportunities

**Out of Scope for v1.0**:
- Interview preparation features
- LinkedIn profile optimization
- Cover letter generation
- Mobile applications
- Multi-language support

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **RMS** | Risk-Mitigation Score - A 0-100 quantitative measure of resume quality |
| **CPI** | Career Profile Identity - A triangulated professional identity label |
| **CAR** | Challenge-Action-Result - A bullet point writing framework |
| **ATS** | Applicant Tracking System - Software used by companies to filter resumes |
| **Layer** | One of five sequential analysis dimensions in the framework |

### 1.4 References
- [Concept Document](../concept/concept.md)
- IEEE Std 830-1998 - IEEE Recommended Practice for Software Requirements Specifications
- The Layered Analysis Framework (supporting documentation)
- The Three Recruiting Risks Model (supporting documentation)

### 1.5 Overview
This document is organized into functional requirements (what the system does), non-functional requirements (how the system performs), user stories (user perspectives), and acceptance criteria.

---

## 2. Overall Description

### 2.1 Product Perspective
Resume Analyzer 2.0 is a standalone web application that integrates with:
- Google Gemini API for natural language processing
- Job board APIs (LinkedIn, Indeed, Glassdoor)
- Document parsing libraries
- PostgreSQL database

### 2.2 Product Functions
The system provides seven core functions:
1. Resume upload and parsing
2. Multi-layer resume analysis
3. RMS calculation and benchmarking
4. Optimization recommendation generation
5. AI-powered resume rewriting
6. Career Profile Identity assessment
7. Job opportunity matching and search

### 2.3 User Characteristics

| User Type | Characteristics | Technical Expertise |
|-----------|----------------|---------------------|
| **CS Student** | Junior/senior undergrad, seeking internships/jobs | Intermediate - Advanced |
| **Recent Graduate** | 0-2 years experience, career transition | Intermediate - Advanced |
| **Career Counselor** | Advises 50-200 students, needs batch analysis | Beginner - Intermediate |
| **System Administrator** | Manages deployment, monitors performance | Advanced |

### 2.4 Operating Environment
- **Client**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Server**: Linux-based cloud environment (AWS, GCP, or Azure)
- **Database**: PostgreSQL 13+
- **APIs**: Google Gemini, job board APIs

### 2.5 Design and Implementation Constraints
- Must comply with FERPA (Family Educational Rights and Privacy Act) for student data
- API rate limits for Google Gemini (varies by tier)
- Job board API rate limits (varies by provider)
- Must support resumes up to 10 pages / 50,000 characters
- Response time for analysis must be under 60 seconds

### 2.6 Assumptions and Dependencies
- Users have internet access
- Users can provide resumes in PDF, DOCX, or TXT format
- Google Gemini API remains available and pricing stable
- Job board APIs remain accessible
- Users understand basic resume terminology

---

## 3. Functional Requirements

### 3.1 Document Processing

#### FR-1.1: Resume Upload
**Priority**: MUST HAVE  
**Description**: The system shall accept resume uploads in PDF, DOCX, and TXT formats.

**Requirements**:
- FR-1.1.1: System shall validate file format before upload
- FR-1.1.2: System shall reject files larger than 10MB
- FR-1.1.3: System shall display upload progress indicator
- FR-1.1.4: System shall provide clear error messages for invalid files

#### FR-1.2: Text Extraction
**Priority**: MUST HAVE  
**Description**: The system shall extract text content from uploaded resumes.

**Requirements**:
- FR-1.2.1: System shall preserve text structure (sections, bullets, formatting)
- FR-1.2.2: System shall handle multi-column layouts
- FR-1.2.3: System shall extract URLs and email addresses
- FR-1.2.4: System shall handle special characters and Unicode

#### FR-1.3: Section Identification
**Priority**: MUST HAVE  
**Description**: The system shall identify standard resume sections.

**Requirements**:
- FR-1.3.1: System shall identify Education section
- FR-1.3.2: System shall identify Experience/Work History section
- FR-1.3.3: System shall identify Skills section
- FR-1.3.4: System shall identify Projects section
- FR-1.3.5: System shall identify Summary/Objective section (if present)
- FR-1.3.6: System shall handle non-standard section names (e.g., "Technical Proficiencies" for Skills)

#### FR-1.4: Data Extraction
**Priority**: MUST HAVE  
**Description**: The system shall extract structured data from resume content.

**Requirements**:
- FR-1.4.1: System shall extract dates and date ranges
- FR-1.4.2: System shall extract company/organization names
- FR-1.4.3: System shall extract job titles and roles
- FR-1.4.4: System shall extract technologies and tools mentioned
- FR-1.4.5: System shall extract quantitative metrics (numbers, percentages, dollar amounts)
- FR-1.4.6: System shall extract URLs (GitHub, LinkedIn, portfolio)

---

### 3.2 Layer 1: Foundation Analysis

#### FR-2.1: Format Validation
**Priority**: MUST HAVE  
**Description**: The system shall analyze resume formatting for ATS compatibility.

**Requirements**:
- FR-2.1.1: System shall detect single-column vs. multi-column layout
- FR-2.1.2: System shall identify font types used
- FR-2.1.3: System shall detect presence of images, graphics, or tables
- FR-2.1.4: System shall verify reverse-chronological ordering
- FR-2.1.5: System shall check for consistent spacing and margins

#### FR-2.2: Link Validation
**Priority**: MUST HAVE  
**Description**: The system shall validate all URLs present in the resume.

**Requirements**:
- FR-2.2.1: System shall check if URLs are properly formatted
- FR-2.2.2: System shall verify URLs are accessible (HTTP 200 response)
- FR-2.2.3: System shall identify LinkedIn profile links
- FR-2.2.4: System shall identify GitHub profile links
- FR-2.2.5: System shall identify portfolio/personal website links
- FR-2.2.6: System shall flag dead links (404 errors)

#### FR-2.3: Keyword Optimization
**Priority**: SHOULD HAVE  
**Description**: The system shall analyze keyword usage for ATS optimization.

**Requirements**:
- FR-2.3.1: System shall identify technical terms without full name + acronym format
- FR-2.3.2: System shall suggest "Full Name (Acronym)" formatting where applicable
- FR-2.3.3: System shall detect industry-standard keywords for the identified CPI

#### FR-2.4: Layer 1 Scoring
**Priority**: MUST HAVE  
**Description**: The system shall calculate a Layer 1 score (0-10).

**Requirements**:
- FR-2.4.1: System shall assign 10 points for flawless ATS compatibility
- FR-2.4.2: System shall assign 5 points for moderate issues (multi-column, inconsistent formatting)
- FR-2.4.3: System shall assign 0 points for critical failures (dead links, photos, major formatting issues)
- FR-2.4.4: System shall provide detailed justification for the score

---

### 3.3 Layer 2: Core Spec Analysis

#### FR-3.1: Skills Extraction
**Priority**: MUST HAVE  
**Description**: The system shall extract and categorize technical skills.

**Requirements**:
- FR-3.1.1: System shall identify programming languages
- FR-3.1.2: System shall identify frameworks and libraries
- FR-3.1.3: System shall identify cloud platforms and DevOps tools
- FR-3.1.4: System shall identify databases and data tools
- FR-3.1.5: System shall identify soft skills (for flagging/removal)

#### FR-3.2: Skills Categorization
**Priority**: MUST HAVE  
**Description**: The system shall assess whether skills are properly categorized.

**Requirements**:
- FR-3.2.1: System shall check if skills are grouped by type
- FR-3.2.2: System shall flag uncategorized "alphabet soup" skill lists
- FR-3.2.3: System shall suggest optimal categorization structure

#### FR-3.3: Modernity Assessment
**Priority**: MUST HAVE  
**Description**: The system shall evaluate the modernity of the tech stack.

**Requirements**:
- FR-3.3.1: System shall identify 2026 high-signal markers (AI/ML, Cloud Native, Modern Web)
- FR-3.3.2: System shall flag legacy/outdated technologies
- FR-3.3.3: System shall flag non-technical filler (MS Office, Windows)
- FR-3.3.4: System shall calculate a "modernity score" based on tech stack recency

#### FR-3.4: Layer 2 Scoring
**Priority**: MUST HAVE  
**Description**: The system shall calculate a Layer 2 score (0-10).

**Requirements**:
- FR-3.4.1: System shall assign 10 points for modern, categorized stack
- FR-3.4.2: System shall assign 5 points for uncategorized or partially outdated stack
- FR-3.4.3: System shall assign 0 points for no skills section or only non-technical skills
- FR-3.4.4: System shall provide detailed justification for the score

---

### 3.4 Layer 3: Impact Analysis

#### FR-4.1: Bullet Point Analysis
**Priority**: MUST HAVE  
**Description**: The system shall analyze all bullet points for CAR formula compliance.

**Requirements**:
- FR-4.1.1: System shall identify bullet points in Experience and Projects sections
- FR-4.1.2: System shall detect presence of Challenge, Action, and Result components
- FR-4.1.3: System shall flag bullets missing any CAR component
- FR-4.1.4: System shall calculate percentage of bullets following CAR format

#### FR-4.2: Action Verb Detection
**Priority**: MUST HAVE  
**Description**: The system shall analyze the strength of action verbs used.

**Requirements**:
- FR-4.2.1: System shall identify the first word of each bullet point
- FR-4.2.2: System shall classify verbs as "weak" (helped, worked on) or "power" (engineered, optimized)
- FR-4.2.3: System shall flag passive voice constructions
- FR-4.2.4: System shall suggest power verb replacements for weak verbs

#### FR-4.3: Quantification Detection
**Priority**: MUST HAVE  
**Description**: The system shall detect and evaluate quantitative metrics.

**Requirements**:
- FR-4.3.1: System shall identify numbers, percentages, dollar amounts, time periods
- FR-4.3.2: System shall calculate percentage of bullets with quantification
- FR-4.3.3: System shall flag vague claims without metrics
- FR-4.3.4: System shall suggest quantification opportunities using metric proxies (volume, efficiency, frequency, scale)

#### FR-4.4: Layer 3 Scoring
**Priority**: MUST HAVE  
**Description**: The system shall calculate a Layer 3 score (0-10).

**Requirements**:
- FR-4.4.1: System shall assign 10 points for 100% CAR format, 3+ metrics, all power verbs
- FR-4.4.2: System shall assign 5 points for mixed quality (some metrics, some weak verbs)
- FR-4.4.3: System shall assign 0 points for passive voice, zero metrics, duty-based language
- FR-4.4.4: System shall provide detailed justification for the score

---

### 3.5 Layer 4: Storyline Analysis

#### FR-5.1: Professional Identity Detection
**Priority**: MUST HAVE  
**Description**: The system shall identify the primary professional identity conveyed by the resume.

**Requirements**:
- FR-5.1.1: System shall analyze tech stack to determine primary focus area
- FR-5.1.2: System shall analyze project types for consistency
- FR-5.1.3: System shall analyze job titles and roles for alignment
- FR-5.1.4: System shall determine if identity is "specialist" or "generalist"
- FR-5.1.5: System shall assess if identity is clear within 6 seconds (top 1/3 of resume)

#### FR-5.2: Narrative Consistency Analysis
**Priority**: MUST HAVE  
**Description**: The system shall evaluate the "Red Thread" across all resume sections.

**Requirements**:
- FR-5.2.1: System shall check if Summary aligns with Skills
- FR-5.2.2: System shall check if Projects align with stated identity
- FR-5.2.3: System shall check if Experience aligns with career goals
- FR-5.2.4: System shall flag unrelated projects creating cognitive load
- FR-5.2.5: System shall calculate a "coherence score" for narrative consistency

#### FR-5.3: Signal vs. Noise Assessment
**Priority**: MUST HAVE  
**Description**: The system shall identify content that dilutes the core narrative.

**Requirements**:
- FR-5.3.1: System shall flag projects unrelated to primary CPI
- FR-5.3.2: System shall flag skills that don't support the narrative
- FR-5.3.3: System shall suggest content to remove or de-emphasize
- FR-5.3.4: System shall suggest content to highlight or expand

#### FR-5.4: Layer 4 Scoring
**Priority**: MUST HAVE  
**Description**: The system shall calculate a Layer 4 score (0-10).

**Requirements**:
- FR-5.4.1: System shall assign 10 points for clear specialist identity with perfect coherence
- FR-5.4.2: System shall assign 5 points for unclear focus or mixed signals
- FR-5.4.3: System shall assign 0 points for confusing generalist with no coherent identity
- FR-5.4.4: System shall provide detailed justification for the score

---

### 3.6 Layer 5: X-Factor Analysis

#### FR-6.1: Agency Detection
**Priority**: MUST HAVE  
**Description**: The system shall identify evidence of self-directed work.

**Requirements**:
- FR-6.1.1: System shall identify projects labeled as "Personal Project" or "Open Source"
- FR-6.1.2: System shall distinguish class projects from independent work
- FR-6.1.3: System shall detect GitHub contributions to public repositories
- FR-6.1.4: System shall flag resumes with only class projects

#### FR-6.2: Engineering Judgment Detection
**Priority**: SHOULD HAVE  
**Description**: The system shall identify evidence of architectural decision-making.

**Requirements**:
- FR-6.2.1: System shall detect "Why" explanations in bullet points
- FR-6.2.2: System shall identify trade-off discussions (e.g., "Chose X over Y because...")
- FR-6.2.3: System shall detect technical reasoning and justification
- FR-6.2.4: System shall flag purely tool-listing bullets without context

#### FR-6.3: Multiplier Effect Detection
**Priority**: SHOULD HAVE  
**Description**: The system shall identify evidence of teaching, mentoring, or leadership.

**Requirements**:
- FR-6.3.1: System shall detect Teaching Assistant (TA) roles
- FR-6.3.2: System shall detect tutoring or mentoring experience
- FR-6.3.3: System shall detect technical writing or documentation work
- FR-6.3.4: System shall detect translation of technical concepts to non-technical audiences

#### FR-6.4: Layer 5 Scoring
**Priority**: MUST HAVE  
**Description**: The system shall calculate a Layer 5 score (0-10).

**Requirements**:
- FR-6.4.1: System shall assign 10 points for high agency, judgment, and multiplier effects
- FR-6.4.2: System shall assign 5 points for some personal projects but no "Why" explanations
- FR-6.4.3: System shall assign 0 points for only class projects with no independent work
- FR-6.4.4: System shall provide detailed justification for the score

---

### 3.7 RMS Calculation

#### FR-7.1: Score Calculation
**Priority**: MUST HAVE  
**Description**: The system shall calculate the overall Risk-Mitigation Score.

**Requirements**:
- FR-7.1.1: System shall apply weighted formula: `RMS = (L1×0.20) + (L2×0.15) + (L3×0.25) + (L4×0.25) + (L5×0.15)`
- FR-7.1.2: System shall scale result to 0-100 range
- FR-7.1.3: System shall round to nearest integer
- FR-7.1.4: System shall store individual layer scores and final RMS

#### FR-7.2: Risk Category Assignment
**Priority**: MUST HAVE  
**Description**: The system shall assign a risk category based on RMS.

**Requirements**:
- FR-7.2.1: System shall assign "Market Ready" for RMS 90-100
- FR-7.2.2: System shall assign "The Tourist" for RMS 75-89
- FR-7.2.3: System shall assign "The Student" for RMS below 75
- FR-7.2.4: System shall provide category-specific messaging

---

### 3.8 Optimization Recommendations

#### FR-8.1: Recommendation Generation
**Priority**: MUST HAVE  
**Description**: The system shall generate specific, actionable recommendations for each layer.

**Requirements**:
- FR-8.1.1: System shall generate at least 3 recommendations per layer with issues
- FR-8.1.2: System shall prioritize recommendations by estimated RMS impact
- FR-8.1.3: System shall provide before/after examples for each recommendation
- FR-8.1.4: System shall include specific line numbers or section references

#### FR-8.2: Impact Estimation
**Priority**: SHOULD HAVE  
**Description**: The system shall estimate the RMS impact of each recommendation.

**Requirements**:
- FR-8.2.1: System shall calculate potential score improvement for each fix
- FR-8.2.2: System shall rank recommendations by impact (high/medium/low)
- FR-8.2.3: System shall show cumulative impact of all recommendations

---

### 3.9 Resume Rewriting

#### FR-9.1: AI-Powered Rewriting
**Priority**: MUST HAVE  
**Description**: The system shall generate an optimized version of the resume.

**Requirements**:
- FR-9.1.1: System shall rewrite all bullet points using CAR formula
- FR-9.1.2: System shall replace weak verbs with power verbs
- FR-9.1.3: System shall add quantification where missing (using conservative estimates)
- FR-9.1.4: System shall reorganize skills into proper categories
- FR-9.1.5: System shall strengthen narrative coherence
- FR-9.1.6: System shall preserve factual accuracy (no fabrication)

#### FR-9.2: Comparison View
**Priority**: MUST HAVE  
**Description**: The system shall provide side-by-side comparison of original and optimized resumes.

**Requirements**:
- FR-9.2.1: System shall highlight changes made
- FR-9.2.2: System shall provide annotations explaining each change
- FR-9.2.3: System shall allow toggling between original and optimized versions
- FR-9.2.4: System shall display RMS scores for both versions

---

### 3.10 Career Profile Identification

#### FR-10.1: CPI Detection
**Priority**: MUST HAVE  
**Description**: The system shall identify the student's Career Profile Identity.

**Requirements**:
- FR-10.1.1: System shall analyze tech stack frequency and recency
- FR-10.1.2: System shall identify problem-solving focus areas
- FR-10.1.3: System shall map to one of the predefined CPI categories
- FR-10.1.4: System shall provide confidence score for CPI assignment
- FR-10.1.5: System shall handle ambiguous cases (suggest multiple CPIs)

#### FR-10.2: Job Title Mapping
**Priority**: MUST HAVE  
**Description**: The system shall map CPI to relevant job titles.

**Requirements**:
- FR-10.2.1: System shall provide 5-10 target job titles per CPI
- FR-10.2.2: System shall include both common and niche titles
- FR-10.2.3: System shall differentiate internship vs. full-time titles

#### FR-10.3: Keyword Generation
**Priority**: MUST HAVE  
**Description**: The system shall generate search keywords aligned with CPI.

**Requirements**:
- FR-10.3.1: System shall generate 10-15 high-signal keywords
- FR-10.3.2: System shall include both technical and domain keywords
- FR-10.3.3: System shall provide search query templates

---

### 3.11 Job Matching & Search

#### FR-11.1: Job Board Integration
**Priority**: SHOULD HAVE  
**Description**: The system shall search multiple job boards for relevant opportunities.

**Requirements**:
- FR-11.1.1: System shall integrate with LinkedIn Jobs API
- FR-11.1.2: System shall integrate with Indeed API
- FR-11.1.3: System shall integrate with Glassdoor API (if available)
- FR-11.1.4: System shall handle API rate limits gracefully

#### FR-11.2: Job Filtering
**Priority**: SHOULD HAVE  
**Description**: The system shall filter job results based on CPI alignment.

**Requirements**:
- FR-11.2.1: System shall filter by tech stack match
- FR-11.2.2: System shall filter by job title relevance
- FR-11.2.3: System shall filter by location (optional user input)
- FR-11.2.4: System shall filter by experience level (entry-level, internship)

#### FR-11.3: Match Scoring
**Priority**: SHOULD HAVE  
**Description**: The system shall score each job opportunity for resume alignment.

**Requirements**:
- FR-11.3.1: System shall calculate tech stack overlap percentage
- FR-11.3.2: System shall calculate keyword match score
- FR-11.3.3: System shall calculate overall match score (0-100)
- FR-11.3.4: System shall rank jobs by match score

#### FR-11.4: Results Presentation
**Priority**: SHOULD HAVE  
**Description**: The system shall present top job opportunities to the user.

**Requirements**:
- FR-11.4.1: System shall display top 20-50 jobs
- FR-11.4.2: System shall show match score for each job
- FR-11.4.3: System shall provide direct application links
- FR-11.4.4: System shall display company name, location, and job title
- FR-11.4.5: System shall show job posting date

---

### 3.12 Reporting & Export

#### FR-12.1: Audit Report Generation
**Priority**: MUST HAVE  
**Description**: The system shall generate a comprehensive audit report.

**Requirements**:
- FR-12.1.1: System shall include executive summary with RMS and category
- FR-12.1.2: System shall include layer-by-layer detailed findings
- FR-12.1.3: System shall include strengths and weaknesses analysis
- FR-12.1.4: System shall include prioritized action items
- FR-12.1.5: System shall include visual charts (RMS breakdown, layer scores)

#### FR-12.2: PDF Export
**Priority**: MUST HAVE  
**Description**: The system shall allow exporting reports as PDF.

**Requirements**:
- FR-12.2.1: System shall generate print-friendly PDF layout
- FR-12.2.2: System shall preserve formatting and charts
- FR-12.2.3: System shall include all report sections
- FR-12.2.4: System shall allow downloading optimized resume as separate PDF

---

### 3.13 User Management

#### FR-13.1: User Accounts
**Priority**: SHOULD HAVE  
**Description**: The system shall support user account creation and management.

**Requirements**:
- FR-13.1.1: System shall allow registration with email and password
- FR-13.1.2: System shall support BYU SSO authentication (future)
- FR-13.1.3: System shall allow password reset via email
- FR-13.1.4: System shall store user profile information

#### FR-13.2: Analysis History
**Priority**: SHOULD HAVE  
**Description**: The system shall maintain a history of user analyses.

**Requirements**:
- FR-13.2.1: System shall save all resume analyses for logged-in users
- FR-13.2.2: System shall allow viewing past analyses
- FR-13.2.3: System shall allow comparing multiple versions of same resume
- FR-13.2.4: System shall track RMS improvement over time

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### NFR-1.1: Response Time
**Priority**: MUST HAVE  
- Resume analysis shall complete within 60 seconds for 95% of requests
- Document upload shall complete within 10 seconds for files up to 10MB
- Page load time shall be under 3 seconds on standard broadband connection
- API calls to Google Gemini shall timeout after 30 seconds

#### NFR-1.2: Throughput
**Priority**: SHOULD HAVE  
- System shall support 100 concurrent users
- System shall process 1,000 resume analyses per day
- Database queries shall return results within 500ms

#### NFR-1.3: Scalability
**Priority**: SHOULD HAVE  
- System architecture shall support horizontal scaling
- System shall handle 10x traffic increase during peak recruiting season
- Database shall support 100,000+ stored analyses

### 4.2 Security Requirements

#### NFR-2.1: Data Protection
**Priority**: MUST HAVE  
- All user data shall be encrypted at rest (AES-256)
- All data in transit shall use TLS 1.3
- Passwords shall be hashed using bcrypt with salt
- Resume files shall be deleted after 30 days (configurable)

#### NFR-2.2: Authentication & Authorization
**Priority**: MUST HAVE  
- System shall implement secure session management
- System shall enforce password complexity requirements
- System shall implement rate limiting on login attempts (5 attempts per 15 minutes)
- System shall support role-based access control (student, counselor, admin)

#### NFR-2.3: Privacy
**Priority**: MUST HAVE  
- System shall comply with FERPA regulations
- System shall not share user data with third parties without consent
- System shall provide data export and deletion capabilities
- System shall anonymize data for analytics

### 4.3 Reliability Requirements

#### NFR-3.1: Availability
**Priority**: MUST HAVE  
- System shall maintain 99.5% uptime (excluding planned maintenance)
- Planned maintenance shall be scheduled during low-traffic periods
- System shall provide graceful degradation if external APIs are unavailable

#### NFR-3.2: Error Handling
**Priority**: MUST HAVE  
- System shall log all errors with timestamps and context
- System shall display user-friendly error messages
- System shall recover gracefully from API failures
- System shall validate all user inputs

#### NFR-3.3: Data Integrity
**Priority**: MUST HAVE  
- System shall implement database transactions for critical operations
- System shall perform regular automated backups (daily)
- System shall maintain audit logs for all data modifications

### 4.4 Usability Requirements

#### NFR-4.1: User Interface
**Priority**: MUST HAVE  
- Interface shall be intuitive for users with basic computer skills
- Interface shall follow WCAG 2.1 Level AA accessibility guidelines
- Interface shall provide clear progress indicators during analysis
- Interface shall be responsive (mobile, tablet, desktop)

#### NFR-4.2: Documentation
**Priority**: SHOULD HAVE  
- System shall provide in-app help and tooltips
- System shall provide user guide documentation
- System shall provide FAQ section
- System shall provide video tutorials for key features

### 4.5 Maintainability Requirements

#### NFR-5.1: Code Quality
**Priority**: SHOULD HAVE  
- Code shall follow PEP 8 style guide (Python)
- Code shall maintain 80%+ test coverage
- Code shall be documented with docstrings
- Code shall use type hints (Python 3.10+)

#### NFR-5.2: Modularity
**Priority**: SHOULD HAVE  
- System shall use modular architecture (separate services for parsing, analysis, AI)
- System shall use dependency injection for testability
- System shall implement clear API contracts between modules

### 4.6 Portability Requirements

#### NFR-6.1: Platform Independence
**Priority**: SHOULD HAVE  
- System shall run on Linux, macOS, and Windows servers
- System shall use containerization (Docker) for deployment
- System shall support multiple database backends (PostgreSQL primary, MySQL secondary)

### 4.7 Compliance Requirements

#### NFR-7.1: Legal Compliance
**Priority**: MUST HAVE  
- System shall comply with FERPA (student data privacy)
- System shall comply with GDPR (if serving EU users)
- System shall comply with CCPA (California privacy law)
- System shall display Terms of Service and Privacy Policy

---

## 5. User Stories

### 5.1 Epic: Resume Analysis

#### US-1.1: Upload Resume
**As a** CS student  
**I want to** upload my resume in PDF format  
**So that** I can receive an analysis of its quality

**Acceptance Criteria**:
- User can drag-and-drop or browse to select file
- System validates file format and size
- System displays upload progress
- System shows confirmation when upload is complete

**Priority**: MUST HAVE  
**Story Points**: 3

---

#### US-1.2: View RMS Score
**As a** CS student  
**I want to** see my Risk-Mitigation Score  
**So that** I understand how competitive my resume is

**Acceptance Criteria**:
- RMS score is prominently displayed (0-100)
- Risk category is clearly labeled (Market Ready / Tourist / Student)
- Visual indicator (color coding) shows score quality
- Score breakdown by layer is available

**Priority**: MUST HAVE  
**Story Points**: 2

---

#### US-1.3: View Detailed Findings
**As a** CS student  
**I want to** see specific issues found in my resume  
**So that** I know exactly what to fix

**Acceptance Criteria**:
- Findings are organized by layer
- Each finding includes specific location (section, line)
- Each finding includes explanation of why it's an issue
- Findings are prioritized by impact

**Priority**: MUST HAVE  
**Story Points**: 5

---

### 5.2 Epic: Optimization

#### US-2.1: Receive Recommendations
**As a** CS student  
**I want to** receive actionable recommendations  
**So that** I can improve my resume effectively

**Acceptance Criteria**:
- Recommendations are specific and actionable
- Each recommendation includes before/after example
- Recommendations are prioritized by impact
- Estimated RMS improvement is shown for each

**Priority**: MUST HAVE  
**Story Points**: 5

---

#### US-2.2: View Optimized Resume
**As a** CS student  
**I want to** see an AI-generated optimized version of my resume  
**So that** I can understand best practices through example

**Acceptance Criteria**:
- Optimized resume is displayed in readable format
- Side-by-side comparison with original is available
- Changes are highlighted and explained
- Optimized resume can be downloaded as PDF

**Priority**: MUST HAVE  
**Story Points**: 8

---

### 5.3 Epic: Career Guidance

#### US-3.1: Discover Career Profile
**As a** CS student  
**I want to** understand my Career Profile Identity  
**So that** I can focus my job search effectively

**Acceptance Criteria**:
- CPI is clearly stated (e.g., "Backend Specialist")
- Supporting evidence from resume is shown
- Specialist vs. generalist assessment is provided
- Confidence score for CPI is displayed

**Priority**: MUST HAVE  
**Story Points**: 5

---

#### US-3.2: Find Matching Jobs
**As a** CS student  
**I want to** see job opportunities that match my profile  
**So that** I can apply to relevant positions

**Acceptance Criteria**:
- At least 20 job opportunities are displayed
- Jobs are ranked by match score
- Each job shows company, title, location, and match %
- Direct application links are provided
- Jobs can be filtered by location

**Priority**: SHOULD HAVE  
**Story Points**: 8

---

### 5.4 Epic: Account Management

#### US-4.1: Create Account
**As a** CS student  
**I want to** create an account  
**So that** I can save my analyses and track progress

**Acceptance Criteria**:
- User can register with email and password
- Email verification is sent
- Password requirements are clearly stated
- User is redirected to dashboard after registration

**Priority**: SHOULD HAVE  
**Story Points**: 3

---

#### US-4.2: View Analysis History
**As a** CS student  
**I want to** view my past resume analyses  
**So that** I can track my improvement over time

**Acceptance Criteria**:
- All past analyses are listed with dates
- RMS scores are shown for each analysis
- User can view full report for any past analysis
- RMS trend chart is displayed

**Priority**: SHOULD HAVE  
**Story Points**: 5

---

### 5.5 Epic: Career Counselor Features

#### US-5.1: Batch Analysis
**As a** career counselor  
**I want to** analyze multiple student resumes at once  
**So that** I can efficiently review many students

**Acceptance Criteria**:
- Counselor can upload multiple resumes (up to 50)
- Batch analysis progress is displayed
- Summary report shows all RMS scores
- Individual reports can be accessed for each student

**Priority**: COULD HAVE  
**Story Points**: 13

---

## 6. Data Requirements

### 6.1 Data Entities

#### 6.1.1 User
- `user_id` (UUID, Primary Key)
- `email` (String, Unique, Required)
- `password_hash` (String, Required)
- `first_name` (String, Optional)
- `last_name` (String, Optional)
- `role` (Enum: student, counselor, admin)
- `created_at` (Timestamp)
- `last_login` (Timestamp)

#### 6.1.2 Resume
- `resume_id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `file_name` (String)
- `file_path` (String)
- `file_type` (Enum: pdf, docx, txt)
- `uploaded_at` (Timestamp)
- `raw_text` (Text)
- `structured_data` (JSON)

#### 6.1.3 Analysis
- `analysis_id` (UUID, Primary Key)
- `resume_id` (UUID, Foreign Key)
- `user_id` (UUID, Foreign Key)
- `rms_score` (Integer, 0-100)
- `risk_category` (Enum: market_ready, tourist, student)
- `layer1_score` (Float, 0-10)
- `layer2_score` (Float, 0-10)
- `layer3_score` (Float, 0-10)
- `layer4_score` (Float, 0-10)
- `layer5_score` (Float, 0-10)
- `cpi` (String)
- `cpi_confidence` (Float, 0-1)
- `analyzed_at` (Timestamp)
- `findings` (JSON)
- `recommendations` (JSON)

#### 6.1.4 OptimizedResume
- `optimized_resume_id` (UUID, Primary Key)
- `analysis_id` (UUID, Foreign Key)
- `optimized_text` (Text)
- `changes` (JSON)
- `generated_at` (Timestamp)

#### 6.1.5 JobMatch
- `job_match_id` (UUID, Primary Key)
- `analysis_id` (UUID, Foreign Key)
- `job_title` (String)
- `company` (String)
- `location` (String)
- `job_url` (String)
- `match_score` (Integer, 0-100)
- `posted_date` (Date)
- `source` (Enum: linkedin, indeed, glassdoor)

### 6.2 Data Retention
- Resume files: 30 days after upload (configurable)
- Analysis results: Indefinite for logged-in users, 7 days for anonymous
- User accounts: Until user requests deletion
- Job matches: 30 days (jobs expire)

### 6.3 Data Backup
- Daily automated backups of database
- 30-day retention of backups
- Point-in-time recovery capability

---

## 7. External Interface Requirements

### 7.1 User Interfaces

#### UI-1: Upload Page
- Clean, minimal design
- Drag-and-drop upload area
- File format and size requirements clearly stated
- Progress indicator during upload and analysis

#### UI-2: Analysis Dashboard
- RMS score prominently displayed with visual gauge
- Layer scores shown as horizontal bar chart
- Quick summary of top 3 issues
- Call-to-action buttons (View Details, Download Report)

#### UI-3: Detailed Report Page
- Tabbed interface for each layer
- Expandable sections for findings
- Inline examples and explanations
- Sticky navigation for easy section jumping

#### UI-4: Comparison View
- Split-screen layout (original left, optimized right)
- Synchronized scrolling
- Highlighted changes with annotations
- Toggle to show/hide annotations

#### UI-5: Job Matches Page
- Card-based layout for job listings
- Filter sidebar (location, match score threshold)
- Sort options (match score, date posted)
- Pagination for large result sets

### 7.2 API Interfaces

#### API-1: Google Gemini API
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **Authentication**: API key in query parameter or header
- **Rate Limit**: Varies by tier (free tier: 60 requests/minute)
- **Purpose**: Resume rewriting, recommendation generation, analysis

#### API-2: LinkedIn Jobs API
- **Endpoint**: `https://api.linkedin.com/v2/jobs`
- **Authentication**: OAuth 2.0
- **Rate Limit**: 100 requests/day (free tier)
- **Purpose**: Job search and matching

#### API-3: Indeed API
- **Endpoint**: `https://api.indeed.com/ads/apisearch`
- **Authentication**: Publisher ID
- **Rate Limit**: Varies by plan
- **Purpose**: Job search and matching

### 7.3 Hardware Interfaces
- None (web-based application)

### 7.4 Software Interfaces

#### SI-1: PostgreSQL Database
- **Version**: 13+
- **Interface**: psycopg2 (Python adapter)
- **Purpose**: Persistent data storage

#### SI-2: Redis Cache
- **Version**: 6+
- **Interface**: redis-py
- **Purpose**: Session management, caching

---

## 8. System Features

### 8.1 Feature Priority (MoSCoW)

#### MUST HAVE (v1.0)
- Resume upload and parsing (PDF, DOCX, TXT)
- All 5 layers of analysis
- RMS calculation and scoring
- Detailed audit report generation
- Optimization recommendations
- AI-powered resume rewriting
- Career Profile Identity detection
- PDF export of reports
- Basic error handling and validation

#### SHOULD HAVE (v1.0)
- User account creation and login
- Analysis history for logged-in users
- Job matching and search
- Interactive comparison view
- Email notifications
- Progress tracking during analysis

#### COULD HAVE (v1.1)
- Batch analysis for counselors
- LinkedIn profile optimization
- Cover letter generation
- Peer comparison / benchmarking
- Browser extension for quick analysis

#### WON'T HAVE (v1.0)
- Mobile applications
- Interview preparation
- Multi-language support
- Video resume analysis
- Real-time collaboration features

---

## 9. Constraints and Assumptions

### 9.1 Constraints

#### Technical Constraints
- Must use Google Gemini API (dependency on external service)
- Limited by Google Gemini rate limits (varies by tier)
- Job board API availability and rate limits
- Resume parsing accuracy limited by document quality
- Analysis time constrained by API response times

#### Business Constraints
- Initial release targeted at BYU CS students only
- Free tier for students (no revenue in v1.0)
- Limited budget for API costs
- Development team of 2-3 people
- 3-month development timeline for MVP

#### Regulatory Constraints
- Must comply with FERPA
- Must comply with GDPR (if serving EU users)
- Must comply with Google Gemini usage policies
- Must respect job board API terms of service

### 9.2 Assumptions

#### User Assumptions
- Users have reliable internet access
- Users can provide resumes in standard formats
- Users understand basic resume terminology
- Users are willing to create accounts for full features

#### Technical Assumptions
- Google Gemini API will remain available and stable
- Job board APIs will remain accessible
- Cloud hosting costs will remain predictable
- Document parsing libraries will handle most resume formats

#### Business Assumptions
- Students will find value in quantitative scoring
- AI-generated recommendations will be actionable
- Job matching will improve user engagement
- University partnerships are achievable

---

## 10. Acceptance Criteria

### 10.1 System-Level Acceptance Criteria

#### AC-1: Functional Completeness
- [ ] All MUST HAVE functional requirements are implemented
- [ ] All 5 layers of analysis are operational
- [ ] RMS calculation produces accurate scores
- [ ] Resume rewriting generates coherent, improved content
- [ ] CPI detection correctly identifies at least 80% of profiles

#### AC-2: Performance
- [ ] 95% of analyses complete within 60 seconds
- [ ] System supports 100 concurrent users without degradation
- [ ] Page load times are under 3 seconds
- [ ] Database queries return within 500ms

#### AC-3: Quality
- [ ] Analysis accuracy: 90%+ agreement with human expert reviews
- [ ] Recommendation quality: 85%+ rated "helpful" or better
- [ ] Job match relevance: 70%+ rated "good fit" or better
- [ ] Bug density: <5 critical bugs per 1000 lines of code

#### AC-4: Security
- [ ] All data encrypted at rest and in transit
- [ ] Authentication and authorization working correctly
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] FERPA compliance verified

#### AC-5: Usability
- [ ] 90% of users can complete analysis without help
- [ ] WCAG 2.1 Level AA compliance verified
- [ ] Mobile responsiveness tested on 3+ devices
- [ ] User satisfaction score: 4.0/5.0 or higher

### 10.2 Feature-Level Acceptance Criteria

Each user story includes specific acceptance criteria (see Section 5).

### 10.3 Testing Requirements

#### Unit Testing
- 80%+ code coverage
- All critical functions have unit tests
- Edge cases and error conditions tested

#### Integration Testing
- API integrations tested with mock services
- Database operations tested
- End-to-end workflows tested

#### User Acceptance Testing
- 20+ BYU CS students test the system
- Feedback collected and incorporated
- Critical issues resolved before launch

#### Performance Testing
- Load testing with 100+ concurrent users
- Stress testing to identify breaking points
- API timeout scenarios tested

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **ATS** | Applicant Tracking System - Software used by companies to filter and manage job applications |
| **CAR Formula** | Challenge-Action-Result - A framework for writing impactful bullet points |
| **CPI** | Career Profile Identity - A triangulated professional identity label |
| **FERPA** | Family Educational Rights and Privacy Act - U.S. law protecting student data |
| **Layer** | One of five sequential analysis dimensions in the framework |
| **Power Verb** | Strong action verb (e.g., Engineered, Optimized) vs. weak verb (e.g., Helped, Worked on) |
| **Red Thread** | Consistent narrative connecting all resume sections |
| **RMS** | Risk-Mitigation Score - A 0-100 quantitative measure of resume quality |
| **The Tourist** | A candidate with unclear professional identity (RMS 75-89) |
| **The Student** | A high-risk candidate with weak resume (RMS <75) |

---

## Appendix B: Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | Team | Initial draft |

---

**Document Status**: Draft  
**Next Review Date**: 2026-02-05  
**Approval Required From**: Project Stakeholders, Technical Lead
