# Resume Analyzer 2.0 - System Architecture

**Version**: 1.0  
**Date**: January 30, 2026  
**Status**: Draft - Awaiting Approval  
**Author**: Wagner Pinheiro

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [System Components](#4-system-components)
5. [Component Interactions](#5-component-interactions)
6. [Data Flow](#6-data-flow)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Security Architecture](#8-security-architecture)
9. [Scalability & Performance](#9-scalability--performance)
10. [Design Decisions](#10-design-decisions)
11. [Alternatives Considered](#11-alternatives-considered)
12. [Implementation Plan](#12-implementation-plan)
13. [Open Questions](#13-open-questions)

---

## 1. Executive Summary

Resume Analyzer 2.0 will be built as a **modular monolith** web application, combining the simplicity of a single deployment unit with the maintainability of well-defined module boundaries. The system will use **Python/FastAPI** for the backend, **React/Next.js** for the frontend, **PostgreSQL** for data persistence, and **Google Gemini API** for AI-powered analysis.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture Style** | Modular Monolith | Simplifies deployment, reduces operational complexity for MVP |
| **Backend Framework** | FastAPI (Python 3.10+) | High performance, async support, automatic API docs, type safety |
| **Frontend Framework** | Next.js 14+ (React 18+) | SSR/SSG support, excellent DX, production-ready |
| **Database** | PostgreSQL 13+ | ACID compliance, JSON support, proven scalability |
| **AI Provider** | Google Gemini API | State-of-the-art LLM, competitive pricing, Google Cloud integration |
| **Deployment** | Docker + GCP Cloud Run | Containerized, auto-scaling, pay-per-use pricing |

---

## 2. Architecture Overview

### 2.1 Architecture Style: Modular Monolith

We will implement a **modular monolith** architecture with clear module boundaries:

```
┌─────────────────────────────────────────────────────────────┐
│                    Resume Analyzer 2.0                      │
│                     (Single Deployment)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Document   │  │   Analysis   │  │     User     │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     AI       │  │     Job      │  │   Reporting  │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│              Shared Infrastructure Layer                    │
│  (Database, Caching, Logging, Authentication)              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 High-Level System Diagram

```mermaid
graph TB
    User[User Browser]
    CDN[CDN / Static Assets]
    LB[Load Balancer]
    Web[Next.js Frontend]
    API[FastAPI Backend]
    DB[(PostgreSQL)]
    Cache[(Redis Cache)]
    Storage[Cloud Storage]
    Gemini[Google Gemini API]
    JobAPI[Job Board APIs]
    
    User -->|HTTPS| CDN
    User -->|HTTPS| LB
    LB --> Web
    Web -->|REST API| API
    API --> DB
    API --> Cache
    API --> Storage
    API -->|AI Analysis| Gemini
    API -->|Job Search| JobAPI
    
    style API fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff
    style DB fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style Gemini fill:#ea4335,stroke:#333,stroke-width:2px,color:#fff
```

### 2.3 Layered Architecture

The system follows a **3-tier layered architecture**:

1. **Presentation Layer** (Frontend)
   - Next.js application
   - React components
   - State management
   - Client-side routing

2. **Application Layer** (Backend)
   - FastAPI REST endpoints
   - Business logic services
   - External API integrations
   - Authentication & authorization

3. **Data Layer**
   - PostgreSQL database
   - Redis cache
   - Cloud storage (GCS/S3)

---

## 3. Technology Stack

### 3.1 Backend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Python | 3.10+ | Core backend language |
| **Framework** | FastAPI | 0.109+ | REST API framework |
| **ORM** | SQLAlchemy | 2.0+ | Database abstraction |
| **Validation** | Pydantic | 2.5+ | Data validation & serialization |
| **Async Runtime** | asyncio | Built-in | Async/await support |
| **Testing** | Pytest | 7.4+ | Unit & integration testing |
| **Document Parsing** | PyPDF2, python-docx | Latest | PDF/DOCX parsing |
| **HTTP Client** | httpx | 0.26+ | Async HTTP requests |

### 3.2 Frontend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Next.js | 14+ | React framework with SSR |
| **UI Library** | React | 18+ | Component-based UI |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS |
| **State Management** | Zustand | 4.4+ | Lightweight state management |
| **Forms** | React Hook Form | 7.49+ | Form handling & validation |
| **HTTP Client** | Axios | 1.6+ | API communication |
| **Charts** | Recharts | 2.10+ | Data visualization |
| **Testing** | Jest, React Testing Library | Latest | Component testing |

### 3.3 Infrastructure Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Database** | PostgreSQL 13+ | Primary data store |
| **Cache** | Redis 7+ | Session & query caching |
| **Storage** | Google Cloud Storage | Resume file storage |
| **Container** | Docker | Application containerization |
| **Orchestration** | Docker Compose (dev), GCP Cloud Run (prod) | Container management |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Monitoring** | Google Cloud Monitoring | Application monitoring |
| **Logging** | Google Cloud Logging | Centralized logging |

### 3.4 External Services

| Service | Purpose | API |
|---------|---------|-----|
| **Google Gemini** | AI-powered resume analysis & rewriting | Gemini 1.5 Pro API |
| **LinkedIn Jobs** | Job search integration | LinkedIn Jobs API |
| **Indeed** | Job search integration | Indeed API |
| **SendGrid** | Email notifications | SendGrid API |

---

## 4. System Components

### 4.1 Frontend Components

#### 4.1.1 Pages
- **Landing Page** (`/`)
  - Hero section with value proposition
  - Feature highlights
  - Call-to-action (Upload Resume)
  
- **Upload Page** (`/upload`)
  - Drag-and-drop file upload
  - File validation
  - Progress indicator
  
- **Analysis Dashboard** (`/analysis/:id`)
  - RMS score display
  - Layer-by-layer breakdown
  - Visual charts
  
- **Detailed Report** (`/report/:id`)
  - Comprehensive findings
  - Recommendations
  - Before/after comparison
  
- **Job Matches** (`/jobs/:id`)
  - Job search results
  - Match scores
  - Application links
  
- **History** (`/history`)
  - Past analyses
  - RMS trend chart
  - Version comparison

#### 4.1.2 Shared Components
- **Header/Navigation**
- **Footer**
- **File Uploader**
- **Score Card**
- **Layer Score Chart**
- **Recommendation Card**
- **Comparison View**
- **Loading Spinner**
- **Error Boundary**

### 4.2 Backend Modules

#### 4.2.1 Document Service
**Responsibilities**:
- Accept file uploads
- Validate file format and size
- Extract text from PDF/DOCX/TXT
- Identify resume sections
- Extract structured data (dates, companies, skills, etc.)

**Key Classes**:
- `DocumentUploader`: Handles file upload and validation
- `TextExtractor`: Extracts text from various formats
- `SectionIdentifier`: Identifies resume sections using NLP
- `DataExtractor`: Extracts structured data using regex and NLP

**Dependencies**:
- PyPDF2 (PDF parsing)
- python-docx (DOCX parsing)
- spaCy (NLP for section identification)

---

#### 4.2.2 Analysis Service
**Responsibilities**:
- Orchestrate 5-layer analysis
- Calculate layer scores
- Calculate final RMS
- Assign risk category

**Key Classes**:
- `AnalysisOrchestrator`: Coordinates all layer analyzers
- `Layer1Analyzer`: Foundation analysis (ATS compatibility)
- `Layer2Analyzer`: Core Spec analysis (skills, tech stack)
- `Layer3Analyzer`: Impact analysis (CAR, metrics, verbs)
- `Layer4Analyzer`: Storyline analysis (narrative coherence)
- `Layer5Analyzer`: X-Factor analysis (agency, judgment)
- `RMSCalculator`: Calculates weighted RMS score

**Dependencies**:
- AI Service (for NLP tasks)
- Document Service (for parsed resume data)

---

#### 4.2.3 AI Service
**Responsibilities**:
- Interface with Google Gemini API
- Generate resume rewrites
- Provide NLP capabilities (entity extraction, classification)
- Generate recommendations

**Key Classes**:
- `GeminiClient`: Wrapper for Gemini API
- `ResumeRewriter`: Generates optimized resume versions
- `RecommendationGenerator`: Creates actionable recommendations
- `CPIDetector`: Identifies Career Profile Identity

**Dependencies**:
- Google Generative AI SDK
- httpx (async HTTP client)

---

#### 4.2.4 Job Service
**Responsibilities**:
- Search job boards for relevant opportunities
- Filter and rank jobs by CPI alignment
- Calculate match scores

**Key Classes**:
- `JobSearchOrchestrator`: Coordinates multi-board search
- `LinkedInJobClient`: LinkedIn Jobs API integration
- `IndeedJobClient`: Indeed API integration
- `JobMatcher`: Calculates match scores
- `JobRanker`: Ranks jobs by relevance

**Dependencies**:
- httpx (API requests)
- Analysis Service (for CPI data)

---

#### 4.2.5 User Service
**Responsibilities**:
- User registration and authentication
- Session management
- User profile management
- Analysis history tracking

**Key Classes**:
- `UserRepository`: Database operations for users
- `AuthService`: Authentication and authorization
- `SessionManager`: Session handling
- `HistoryTracker`: Tracks user analysis history

**Dependencies**:
- bcrypt (password hashing)
- JWT (session tokens)
- SQLAlchemy (database ORM)

---

#### 4.2.6 Reporting Service
**Responsibilities**:
- Generate comprehensive audit reports
- Create PDF exports
- Generate visualizations

**Key Classes**:
- `ReportGenerator`: Creates structured reports
- `PDFExporter`: Generates PDF documents
- `ChartGenerator`: Creates visual charts

**Dependencies**:
- ReportLab (PDF generation)
- Matplotlib (chart generation)

---

### 4.3 Shared Infrastructure

#### 4.3.1 Database Layer
- **ORM**: SQLAlchemy 2.0
- **Migration Tool**: Alembic
- **Connection Pooling**: SQLAlchemy built-in
- **Schema**: See `database_design.md` (Week 2 deliverable)

#### 4.3.2 Caching Layer
- **Technology**: Redis
- **Use Cases**:
  - Session storage
  - API response caching
  - Rate limiting counters
  - Job search result caching

#### 4.3.3 Storage Layer
- **Technology**: Google Cloud Storage (or AWS S3)
- **Use Cases**:
  - Uploaded resume files
  - Generated PDF reports
  - Optimized resume files

#### 4.3.4 Logging & Monitoring
- **Logging**: Python `logging` module + Google Cloud Logging
- **Monitoring**: Google Cloud Monitoring (or Datadog)
- **Metrics**: Request latency, error rates, API usage

---

## 5. Component Interactions

### 5.1 Resume Analysis Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DocService
    participant AnalysisService
    participant AIService
    participant DB
    participant Storage
    
    User->>Frontend: Upload Resume
    Frontend->>API: POST /api/upload
    API->>DocService: validateAndStore()
    DocService->>Storage: Save file
    DocService->>DocService: extractText()
    DocService->>DocService: identifySections()
    DocService-->>API: ParsedResume
    
    API->>AnalysisService: analyzeResume()
    AnalysisService->>AnalysisService: runLayer1()
    AnalysisService->>AnalysisService: runLayer2()
    AnalysisService->>AIService: analyzeImpact() [Layer 3]
    AIService->>Gemini: API Request
    Gemini-->>AIService: Analysis Result
    AnalysisService->>AnalysisService: runLayer4()
    AnalysisService->>AnalysisService: runLayer5()
    AnalysisService->>AnalysisService: calculateRMS()
    AnalysisService-->>API: AnalysisResult
    
    API->>DB: Save analysis
    API-->>Frontend: Analysis ID
    Frontend->>User: Display Results
```

### 5.2 Resume Rewriting Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant AIService
    participant Gemini
    participant DB
    participant Storage
    
    User->>Frontend: Request Optimized Resume
    Frontend->>API: POST /api/rewrite/:analysisId
    API->>DB: Fetch analysis data
    DB-->>API: AnalysisResult
    
    API->>AIService: rewriteResume()
    AIService->>Gemini: Generate optimized version
    Note over AIService,Gemini: Prompt includes:<br/>- Original resume<br/>- Layer findings<br/>- Recommendations
    Gemini-->>AIService: Optimized resume text
    
    AIService->>AIService: formatResume()
    AIService->>Storage: Save optimized PDF
    AIService-->>API: OptimizedResume
    
    API->>DB: Save optimized version
    API-->>Frontend: Optimized resume data
    Frontend->>User: Display comparison
```

### 5.3 Job Matching Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant JobService
    participant LinkedInAPI
    participant IndeedAPI
    participant DB
    participant Cache
    
    User->>Frontend: View Job Matches
    Frontend->>API: GET /api/jobs/:analysisId
    API->>DB: Fetch CPI and keywords
    DB-->>API: CPIData
    
    API->>Cache: Check cached results
    alt Cache Hit
        Cache-->>API: Cached jobs
    else Cache Miss
        API->>JobService: searchJobs(cpi, keywords)
        
        par Parallel API Calls
            JobService->>LinkedInAPI: Search
            LinkedInAPI-->>JobService: LinkedIn results
        and
            JobService->>IndeedAPI: Search
            IndeedAPI-->>JobService: Indeed results
        end
        
        JobService->>JobService: mergeAndDeduplicate()
        JobService->>JobService: calculateMatchScores()
        JobService->>JobService: rankJobs()
        JobService-->>API: RankedJobs
        
        API->>Cache: Cache results (15 min TTL)
    end
    
    API-->>Frontend: Job matches
    Frontend->>User: Display jobs
```

---

## 6. Data Flow

### 6.1 Data Flow Diagram

```mermaid
graph LR
    A[User Upload] -->|Resume File| B[Document Service]
    B -->|Parsed Text| C[Analysis Service]
    C -->|Layer 1-5 Analysis| D[RMS Calculator]
    C -->|Resume Data| E[AI Service]
    E -->|Gemini API| F[Optimized Resume]
    C -->|CPI Data| G[Job Service]
    G -->|Job APIs| H[Job Matches]
    D -->|RMS Score| I[Database]
    F -->|Optimized Text| I
    H -->|Job Results| I
    I -->|Report Data| J[Reporting Service]
    J -->|PDF| K[User Download]
    
    style B fill:#fbbc04,stroke:#333,stroke-width:2px
    style C fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#ea4335,stroke:#333,stroke-width:2px,color:#fff
    style I fill:#336791,stroke:#333,stroke-width:2px,color:#fff
```

### 6.2 Data States

| State | Description | Storage Location |
|-------|-------------|------------------|
| **Uploaded** | Raw resume file | Cloud Storage |
| **Parsed** | Extracted text and sections | Memory (transient) |
| **Analyzed** | Layer scores and findings | PostgreSQL |
| **Optimized** | AI-generated improved version | PostgreSQL + Cloud Storage |
| **Reported** | PDF audit report | Cloud Storage |
| **Cached** | Job search results | Redis (15 min TTL) |

---

## 7. Deployment Architecture

### 7.1 Development Environment

```
┌─────────────────────────────────────────┐
│         Docker Compose Setup            │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐            │
│  │ Next.js  │  │ FastAPI  │            │
│  │  :3000   │  │  :8000   │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │PostgreSQL│  │  Redis   │            │
│  │  :5432   │  │  :6379   │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

**Docker Compose Services**:
- `frontend`: Next.js development server
- `backend`: FastAPI with hot reload
- `db`: PostgreSQL 13
- `cache`: Redis 7
- `storage`: MinIO (local S3-compatible storage)

### 7.2 Production Environment (Google Cloud Platform)

```mermaid
graph TB
    Internet[Internet]
    CDN[Cloud CDN]
    LB[Cloud Load Balancer]
    
    subgraph "Cloud Run"
        Frontend[Next.js Container<br/>Auto-scaling]
        Backend[FastAPI Container<br/>Auto-scaling]
    end
    
    subgraph "Managed Services"
        DB[Cloud SQL<br/>PostgreSQL]
        Cache[Memorystore<br/>Redis]
        Storage[Cloud Storage<br/>Buckets]
    end
    
    subgraph "External APIs"
        Gemini[Gemini API]
        Jobs[Job Board APIs]
    end
    
    Internet --> CDN
    Internet --> LB
    CDN --> Frontend
    LB --> Frontend
    LB --> Backend
    Backend --> DB
    Backend --> Cache
    Backend --> Storage
    Backend --> Gemini
    Backend --> Jobs
    
    style Frontend fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff
    style Backend fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff
    style DB fill:#336791,stroke:#333,stroke-width:2px,color:#fff
```

### 7.3 Infrastructure Components

| Component | GCP Service | Configuration |
|-----------|-------------|---------------|
| **Frontend Hosting** | Cloud Run | Auto-scale 0-10 instances |
| **Backend Hosting** | Cloud Run | Auto-scale 0-20 instances |
| **Database** | Cloud SQL (PostgreSQL) | db-f1-micro (dev), db-n1-standard-1 (prod) |
| **Cache** | Memorystore (Redis) | 1GB basic tier |
| **File Storage** | Cloud Storage | Standard storage class |
| **CDN** | Cloud CDN | Global edge caching |
| **Load Balancer** | Cloud Load Balancing | HTTPS load balancer |
| **Secrets** | Secret Manager | API keys, DB credentials |
| **Monitoring** | Cloud Monitoring | Metrics, alerts, dashboards |
| **Logging** | Cloud Logging | Centralized log aggregation |

### 7.4 CI/CD Pipeline

```mermaid
graph LR
    A[Git Push] --> B[GitHub Actions]
    B --> C{Branch?}
    C -->|main| D[Run Tests]
    C -->|feature| E[Run Tests Only]
    D --> F{Tests Pass?}
    F -->|Yes| G[Build Docker Images]
    F -->|No| H[Notify Failure]
    G --> I[Push to GCR]
    I --> J[Deploy to Cloud Run]
    J --> K[Run Smoke Tests]
    K --> L{Healthy?}
    L -->|Yes| M[Complete]
    L -->|No| N[Rollback]
    
    style D fill:#34a853,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff
    style J fill:#fbbc04,stroke:#333,stroke-width:2px
```

**GitHub Actions Workflow**:
1. **Trigger**: Push to `main` or `develop` branch
2. **Lint**: Run code linters (Black, ESLint)
3. **Test**: Run unit and integration tests
4. **Build**: Build Docker images for frontend and backend
5. **Push**: Push images to Google Container Registry
6. **Deploy**: Deploy to Cloud Run (staging or production)
7. **Verify**: Run smoke tests against deployed environment
8. **Notify**: Send deployment status to Slack/email

---

## 8. Security Architecture

### 8.1 Security Layers

```mermaid
graph TB
    subgraph "Network Security"
        A[HTTPS/TLS 1.3]
        B[Cloud Armor WAF]
        C[DDoS Protection]
    end
    
    subgraph "Application Security"
        D[JWT Authentication]
        E[Rate Limiting]
        F[Input Validation]
        G[CORS Policy]
    end
    
    subgraph "Data Security"
        H[Encryption at Rest]
        I[Encryption in Transit]
        J[Password Hashing]
        K[Data Anonymization]
    end
    
    subgraph "Infrastructure Security"
        L[Secret Manager]
        M[IAM Roles]
        N[VPC Network]
        O[Audit Logging]
    end
    
    style A fill:#34a853,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff
    style H fill:#ea4335,stroke:#333,stroke-width:2px,color:#fff
    style L fill:#fbbc04,stroke:#333,stroke-width:2px
```

### 8.2 Authentication & Authorization

**Authentication Flow**:
1. User submits email/password
2. Backend validates credentials
3. Backend generates JWT token (24-hour expiry)
4. Frontend stores token in httpOnly cookie
5. Subsequent requests include token in Authorization header
6. Backend validates token on each request

**Authorization Levels**:
- **Anonymous**: Can upload and analyze resume (single-use)
- **Authenticated User**: Can save history, view past analyses
- **Admin**: Can view all analyses, manage users

### 8.3 Data Protection

| Data Type | Protection Mechanism |
|-----------|---------------------|
| **Passwords** | bcrypt hashing with salt (cost factor 12) |
| **Session Tokens** | JWT with HMAC-SHA256 signature |
| **Resume Files** | Encrypted at rest (AES-256), auto-delete after 30 days |
| **Database** | Encrypted at rest (Cloud SQL encryption) |
| **API Keys** | Stored in Secret Manager, never in code |
| **PII** | Anonymized for analytics, FERPA compliant |

### 8.4 Compliance

- **FERPA**: Student data privacy compliance
  - User consent for data collection
  - Data retention policy (30 days for files, 1 year for analyses)
  - Data export and deletion capabilities
  
- **GDPR** (if serving EU users):
  - Right to access personal data
  - Right to erasure ("right to be forgotten")
  - Data portability
  
- **CCPA** (California users):
  - Disclosure of data collection practices
  - Opt-out of data sale (not applicable - we don't sell data)

---

## 9. Scalability & Performance

### 9.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Analysis Time** | < 60s for 95% of requests | Backend timer |
| **Page Load Time** | < 3s (LCP) | Lighthouse |
| **API Response Time** | < 500ms (p95) | Cloud Monitoring |
| **Database Query Time** | < 100ms (p95) | Query logs |
| **Concurrent Users** | 100+ | Load testing |
| **Daily Analyses** | 1,000+ | Analytics |

### 9.2 Scalability Strategy

#### Horizontal Scaling
- **Cloud Run Auto-scaling**: 
  - Frontend: 0-10 instances
  - Backend: 0-20 instances
  - Scale based on CPU (60% threshold) and request count

#### Caching Strategy
- **Redis Caching**:
  - Job search results: 15 min TTL
  - User sessions: 24 hour TTL
  - API responses (idempotent): 5 min TTL
  
- **CDN Caching**:
  - Static assets: 1 year TTL
  - Next.js pages: 1 hour TTL (ISR)

#### Database Optimization
- **Indexing**: 
  - Primary keys on all tables
  - Foreign key indexes
  - Composite indexes on common query patterns
  
- **Connection Pooling**:
  - SQLAlchemy pool size: 5-20 connections
  - Pool recycle: 3600 seconds

### 9.3 Performance Optimization

#### Backend Optimizations
- **Async I/O**: Use `asyncio` for all I/O operations
- **Batch Processing**: Batch Gemini API calls where possible
- **Lazy Loading**: Load data only when needed
- **Pagination**: Limit query results (default 50 items)

#### Frontend Optimizations
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Next.js Image component
- **SSR/SSG**: Pre-render static pages
- **Lazy Loading**: Load components on scroll

---

## 10. Design Decisions

### 10.1 Why Modular Monolith?

**Decision**: Use modular monolith instead of microservices

**Rationale**:
- ✅ **Simplicity**: Single deployment, easier to develop and debug
- ✅ **Lower Operational Overhead**: No service mesh, no distributed tracing complexity
- ✅ **Faster Development**: No network latency between modules
- ✅ **Cost-Effective**: Single Cloud Run service cheaper than multiple services
- ✅ **Easy to Refactor**: Can extract microservices later if needed

**Trade-offs**:
- ❌ Cannot scale individual modules independently
- ❌ Shared failure domain (one module crash affects all)
- ✅ Acceptable for MVP with < 1,000 daily users

---

### 10.2 Why FastAPI?

**Decision**: Use FastAPI instead of Django or Flask

**Rationale**:
- ✅ **Performance**: Async support, comparable to Node.js/Go
- ✅ **Type Safety**: Pydantic models with automatic validation
- ✅ **Auto-Documentation**: OpenAPI/Swagger docs generated automatically
- ✅ **Modern Python**: Built for Python 3.10+ with type hints
- ✅ **Developer Experience**: Excellent error messages, hot reload

**Alternatives Considered**:
- Django: Too heavy for API-only backend, admin panel not needed
- Flask: Lacks async support, requires more boilerplate

---

### 10.3 Why Next.js?

**Decision**: Use Next.js instead of Create React App or pure React

**Rationale**:
- ✅ **SEO**: Server-side rendering for landing page
- ✅ **Performance**: Automatic code splitting, image optimization
- ✅ **Developer Experience**: File-based routing, hot reload
- ✅ **Production-Ready**: Built-in optimizations, deployment-ready
- ✅ **Flexibility**: Can use SSR, SSG, or CSR per page

**Alternatives Considered**:
- Create React App: No SSR, deprecated in favor of frameworks
- Vite + React: Great DX but no SSR out of the box

---

### 10.4 Why PostgreSQL?

**Decision**: Use PostgreSQL instead of MongoDB or MySQL

**Rationale**:
- ✅ **ACID Compliance**: Critical for user data integrity
- ✅ **JSON Support**: Can store flexible analysis data
- ✅ **Mature Ecosystem**: Well-supported ORMs, tools
- ✅ **Scalability**: Proven to scale to millions of rows
- ✅ **GCP Integration**: Cloud SQL fully managed

**Alternatives Considered**:
- MongoDB: No ACID guarantees, overkill for structured data
- MySQL: Less advanced JSON support, weaker full-text search

---

### 10.5 Why Google Gemini?

**Decision**: Use Google Gemini instead of OpenAI GPT-4

**Rationale**:
- ✅ **Cost**: More competitive pricing than GPT-4
- ✅ **Performance**: Gemini 1.5 Pro has excellent reasoning
- ✅ **Context Window**: 1M token context (vs. 128K for GPT-4)
- ✅ **GCP Integration**: Native integration with Cloud Run
- ✅ **Multimodal**: Can process images (future feature)

**Alternatives Considered**:
- OpenAI GPT-4: More expensive, smaller context window
- Anthropic Claude: Good but less GCP integration

---

## 11. Alternatives Considered

### 11.1 Architecture Alternatives

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| **Microservices** | Independent scaling, fault isolation | Complex deployment, network overhead | ❌ Rejected (overkill for MVP) |
| **Serverless Functions** | Pay-per-use, auto-scaling | Cold starts, vendor lock-in | ❌ Rejected (analysis too long for functions) |
| **Modular Monolith** | Simple deployment, easy development | Shared failure domain | ✅ **Selected** |

### 11.2 Database Alternatives

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| **MongoDB** | Flexible schema, horizontal scaling | No ACID, eventual consistency | ❌ Rejected |
| **MySQL** | Mature, widely used | Weaker JSON support | ❌ Rejected |
| **PostgreSQL** | ACID, JSON, full-text search | Vertical scaling limits | ✅ **Selected** |

### 11.3 Deployment Alternatives

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| **VM (Compute Engine)** | Full control, cheaper | Manual scaling, maintenance | ❌ Rejected |
| **Kubernetes (GKE)** | Powerful orchestration | Complex, expensive | ❌ Rejected (overkill) |
| **Cloud Run** | Auto-scaling, pay-per-use | Less control | ✅ **Selected** |

---

## 12. Implementation Plan

### 12.1 Phase 1: Foundation (Week 1-3)

**Week 1: Core Setup**
- [ ] Set up GitHub repository structure
- [ ] Create Docker Compose development environment
- [ ] Set up FastAPI project structure
- [ ] Set up Next.js project structure
- [ ] Configure linters and formatters

**Week 2: Database & Models**
- [ ] Design database schema (see `database_design.md`)
- [ ] Create SQLAlchemy models
- [ ] Set up Alembic migrations
- [ ] Create initial migration

**Week 3: Technical Prototype**
- [ ] Implement basic document parsing
- [ ] Integrate Gemini API
- [ ] Implement Layer 3 analyzer (prototype)
- [ ] Test with 10 sample resumes

### 12.2 Phase 2: Core Development (Week 4-8)

**Week 4: API Design**
- [ ] Define OpenAPI specification
- [ ] Implement authentication endpoints
- [ ] Implement upload endpoint
- [ ] Implement analysis endpoint

**Week 5-6: Backend Implementation**
- [ ] Implement all 5 layer analyzers
- [ ] Implement RMS calculator
- [ ] Implement resume rewriter
- [ ] Implement job search service
- [ ] Write unit tests (80%+ coverage)

**Week 7-8: Frontend Implementation**
- [ ] Build upload page
- [ ] Build analysis dashboard
- [ ] Build detailed report page
- [ ] Build comparison view
- [ ] Implement responsive design

### 12.3 Testing Strategy

| Test Type | Coverage | Tools | Frequency |
|-----------|----------|-------|-----------|
| **Unit Tests** | 80%+ | Pytest, Jest | Every commit |
| **Integration Tests** | Key workflows | Pytest | Daily |
| **E2E Tests** | Critical paths | Playwright | Before release |
| **Load Tests** | 100 concurrent users | Locust | Weekly |
| **Security Tests** | OWASP Top 10 | Bandit, OWASP ZAP | Weekly |

---

## 13. Open Questions

### 13.1 Technical Questions

1. **Resume File Retention**: Should we delete files after 30 days or allow users to keep them longer?
   - **Recommendation**: 30 days default, allow paid users to extend

2. **Job API Rate Limits**: How do we handle rate limits from LinkedIn/Indeed?
   - **Recommendation**: Implement exponential backoff, cache results aggressively

3. **Gemini API Costs**: What if costs exceed budget?
   - **Recommendation**: Set monthly spending cap, implement usage quotas per user

4. **Multi-tenancy**: Do we need organization accounts for career counselors?
   - **Recommendation**: Defer to v1.1, focus on individual users for MVP

### 13.2 Product Questions

1. **Free vs. Paid**: Should we offer a freemium model?
   - **Recommendation**: Start fully free for BYU students, evaluate later

2. **Analysis History**: How many past analyses should we store?
   - **Recommendation**: Unlimited for authenticated users, 1 year retention

3. **Job Search**: Should job search be a separate feature or integrated?
   - **Recommendation**: Integrated, but optional (user can skip)

---

## Appendix A: API Endpoint Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/reset-password` - Reset password

### Resume Analysis
- `POST /api/upload` - Upload resume
- `GET /api/analysis/:id` - Get analysis results
- `POST /api/rewrite/:id` - Generate optimized resume
- `GET /api/report/:id` - Get detailed report
- `GET /api/report/:id/pdf` - Download PDF report

### Job Search
- `GET /api/jobs/:analysisId` - Get job matches
- `GET /api/jobs/:analysisId/refresh` - Refresh job search

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/history` - Get analysis history
- `DELETE /api/user/analysis/:id` - Delete analysis

---

## Appendix B: Environment Variables

### Backend
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/resume_analyzer
DATABASE_POOL_SIZE=10

# Redis
REDIS_URL=redis://localhost:6379/0

# Google Cloud
GCP_PROJECT_ID=resume-analyzer-prod
GCP_STORAGE_BUCKET=resume-analyzer-files

# Gemini API
GEMINI_API_KEY=<secret>
GEMINI_MODEL=gemini-1.5-pro

# Job APIs
LINKEDIN_API_KEY=<secret>
INDEED_API_KEY=<secret>

# Security
JWT_SECRET_KEY=<secret>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Email
SENDGRID_API_KEY=<secret>
FROM_EMAIL=noreply@resumeanalyzer.com
```

### Frontend
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

**Document Status**: Draft - Awaiting Approval  
**Next Steps**: Review and approve architecture, then proceed to database design (Week 2)  
**Approval Required From**: Project Stakeholders
