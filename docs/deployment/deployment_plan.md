# Deployment Plan

## Strategy
- **Development / Staging**: **Vercel** (Fast, free, good for iteration).
- **Production**: **AWS (BYU Account)** (Compliance, security, standard infrastructure).

## 1. Development Deployment (Vercel)

### Frontend (Next.js)
**Target**: Vercel
**Steps**:
1. Connect GitHub Repository to Vercel.
2. Vercel automatically detects Next.js.
3. Deploy.

### Backend (FastAPI)
**Target**: **Render** (Container)
*Why: Render natively runs Docker containers, which matches our future AWS strategy. It has a generous free tier.*

**Steps**:
1. Sign up for [Render.com](https://render.com) (via GitHub).
2. Create New **Web Service**.
3. Connect GitHub Repository.
4. Settings:
   - **Root Directory**: `backend`
   - **Environment**: Docker
   - **Region**: Oregon (US West) - *Optional, but good for speed*
5. Deploy.

## 2. Production Deployment (AWS - Future)
*To be implemented when BYU AWS account is available.*
- **Frontend**: AWS Amplify or S3+CloudFront.
- **Backend**: AWS App Runner or Lambda.
- **Database**: AWS RDS.
