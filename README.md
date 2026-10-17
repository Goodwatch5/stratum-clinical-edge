# Stratum Clinical Edge

> **Decentralized Clinical Intelligence Platform**  
> *Privacy-First, Edge-Native, Offline-Capable Healthcare AI.*  
> Led by Dr. Odell Anderson Jr. & Dee Gone — Stratum Healthcare Network.

[![CI / Validation Pipeline](https://github.com/stratum-healthcare/stratum-clinical-edge/actions/workflows/ci.yml/badge.svg)](https://github.com/stratum-healthcare/stratum-clinical-edge/actions/workflows/ci.yml)
[![Container Build & Delivery](https://github.com/stratum-healthcare/stratum-clinical-edge/actions/workflows/container.yml/badge.svg)](https://github.com/stratum-healthcare/stratum-clinical-edge/actions/workflows/container.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Runtime: Next.js 15](https://img.shields.io/badge/Runtime-Next.js%2015-black.svg)](https://nextjs.org/)

---

## 🏛️ Project Identity & Overview

**Stratum Clinical Edge** is an enterprise-grade clinical decision support and regional health intelligence workstation. Operating across safe, sandboxed edge containers ("seventeen-pockets"), the system ensures continuous operational capability during network partitions, power outages, and austere field conditions.

- **Developer Sandbox Runtime**: [`https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app`](https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app)
- **Production Architecture**: Hybrid Edge-Native + Google Cloud Run / Firebase Firestore.

---

## ⚡ Core Capabilities

### 1. Dual Persistence Architecture
- **Offline-First IndexedDB Vault**: Every clinical log, patient biomarker entry, and directive is stored locally with sub-millisecond read/write latency.
- **Durable Cloud Synchronization**: Automatic cryptographic synchronization with Google Cloud Firestore (`ai-studio-rightwayclinical-32e6c470-a50f-42e1-8571-07866613377c`) whenever uplink connectivity is detected.

### 2. Clinical Command Center
- **Triage Preparedness & Surge Protocols**: Instant status indicators for Airway/Breathing acuity, Care Cadre staffing levels, and cold-chain pharmaceutical buffers.
- **Sovereign Clinical Directives**: Clinical policy drafting and cryptographic decree broadcasting directly to the Council audit stream.

### 3. Spatial Health Radar & Outpost Telemetry
- Interactive geographic radar HUD mapping regional outposts (Frontline pavilions, high-altitude research citadels, coastal health bastions).
- Visual distance rings, GPS tracking, and real-time medical provisions telemetry.

### 4. ViGenAiR ABCD Emergency Dispatch & AI Oracle
- Structured assessment engine evaluating Airway, Breathing, Circulation, and Deficit markers.
- Autonomous urgency scoring (Code Red / Code Amber / Code Green) with server-side Gemini intelligence synthesis.

---

## 🏛️ Seventeen Pockets Architecture & Dual Pipeline Topology

```
                  SEVENTEEN POCKETS
                          │
                   Canonical Codebase
                      /         \
                     /           \
                GitLab           GitHub
                  │                │
               CI/CD             CI
                  \              /
                   \            /
                    ▼          ▼
                      Google Cloud
                          │
                      Production
```

- **Canonical Codebase**: Single authoritative source of truth for Stratum Clinical Edge.
- **GitLab CI/CD**: Evaluates regional telemetry, sovereign offline vault validation, and zero-trust perimeter checks via `.gitlab-ci.yml`.
- **GitHub CI**: Validates ESLint compliance, Next.js production compilations, and packages multi-arch Docker images to GitHub Container Registry (`ghcr.io`).
- **Google Cloud Production**: Cloud Run deployment is not currently configured. The GitHub workflow publishes a container image to GHCR; deployment requires a separately configured Cloud Run target and deployment credentials.

---

## 🛠️ Quickstart

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher (or Docker)

### Local Development
```bash
# 1. Clone repository
git clone https://github.com/stratum-healthcare/stratum-clinical-edge.git
cd stratum-clinical-edge

# 2. Install dependencies
npm ci

# 3. Configure environment
cp .env.example .env.local
# Add your GEMINI_API_KEY if testing AI capabilities locally

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🐳 Container Deployment (Docker & Compose)

### Running with Docker Compose
```bash
# Build and run the production container locally
docker compose up --build -d

# Verify container health
curl http://localhost:3000/api/health
```

### Building the Docker Image Directly
```bash
docker build -t stratum-clinical-edge:latest .
docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key" stratum-clinical-edge:latest
```

---

## 🚀 Cloud Run & Production Deployment

Refer to [`DEPLOY.md`](DEPLOY.md) for full deployment instructions.

### Deploying to Google Cloud Run
```bash
export PROJECT_ID="your-gcp-project-id"

# 1. Build and push image
docker build -t gcr.io/$PROJECT_ID/stratum-clinical-edge:latest .
docker push gcr.io/$PROJECT_ID/stratum-clinical-edge:latest

# 2. Deploy to Cloud Run
gcloud run deploy stratum-clinical-edge \
  --image gcr.io/$PROJECT_ID/stratum-clinical-edge:latest \
  --region us-west2 \
  --port 3000 \
  --memory 512Mi \
  --set-env-vars GEMINI_API_KEY="your_api_key" \
  --platform managed
```

---

## 🧪 CI/CD Pipelines

The repository includes pre-configured pipeline configurations:
- **GitHub Actions**:
  - [`.github/workflows/ci.yml`](.github/workflows/ci.yml): Linting (`eslint`) and Next.js production build validation on all pull requests and pushes to `main`.
  - [`.github/workflows/container.yml`](.github/workflows/container.yml): Multi-platform Docker container builds with GitHub Container Registry (ghcr.io) caching.
- **GitLab CI/CD**:
  - [`.gitlab-ci.yml`](.gitlab-ci.yml): 4-stage pipeline (telemetry intelligence, clinical readiness, database validation, and edge deploy).

---

## 🛡️ Health & Readiness Probe

The application includes an automated probe endpoint for container orchestrators (Kubernetes / Cloud Run / Docker):

```bash
GET /api/health
```

**Sample Response**:
```json
{
  "status": "healthy",
  "service": "stratum-clinical-edge",
  "timestamp": "2026-09-07T08:58:00.000Z",
  "uptime": 142.3,
  "version": "0.1.0",
  "environment": "production"
}
```

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.  
Copyright © 2026 Stratum Healthcare Network (Dr. Odell Anderson Jr. & Dee Gone).
