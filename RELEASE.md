# Stratum Clinical Edge — Production Release & Standalone Deployment Guide

This guide explains how to release **Stratum Clinical Edge** and run it completely independently outside Google AI Studio on your own infrastructure, cloud provider, server, or local machine.

---

## 🎯 Architecture Summary

Stratum Clinical Edge is a standard, portable **Next.js 15+ (App Router)** full-stack application built with:
- **Frontend / SSR**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Offline / Edge Intelligence**: IndexedDB isolated vault, Service Worker PWA, local triage engine.
- **Backend / Real-time Database**: Google Cloud Firestore (`db`) with multi-tenant custom database support.
- **Authentication**: Firebase Authentication (Google OAuth provider).
- **Diagnostics Intelligence**: Server-side Gemini AI API routes (`/api/gemini`).
- **Containerization**: Production Docker multi-stage build + `docker-compose.yml`.

---

## 🚀 Fast Track 1: Push to GitHub & Deploy on Vercel (Recommended)

Vercel provides native Next.js hosting with instant SSL, automated CI/CD on git push, and zero server maintenance.

### Step 1: Push Your Codebase to GitHub

In your local terminal (or within this repo):

```bash
# 1. Add your GitHub repository as remote origin (replace with your repo URL):
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 2. Push the main branch:
git push -u origin main
```

*(Note: The git repository is already initialized with a clean root commit in this directory).*

### Step 2: Import into Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and log in.
2. Select your repository and click **Import**.
3. Framework Preset will auto-detect as **Next.js**.
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - *(Optional)* `NEXT_PUBLIC_FIREBASE_*` variables if overriding defaults (see Environment Variables section below).
5. Click **Deploy**.

Your app is now live at `https://your-project.vercel.app`!

---

## 🐳 Fast Track 2: Run with Docker or Docker Compose (Any VPS / Server)

Stratum Clinical Edge includes a production-grade multi-stage `Dockerfile` and `docker-compose.yml` with non-root security and native health checks.

### Run with Docker Compose:
```bash
# 1. Clone or extract the repository
git clone <your-repo-url>
cd stratum-clinical-edge

# 2. Create your environment file
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# 3. Build and run in detached mode
docker compose up --build -d

# 4. Check status & health
docker compose ps
curl http://localhost:3000/api/health
```

### Run with Pure Docker:
```bash
docker build -t stratum-clinical-edge:latest .
docker run -d -p 3000:3000 --name stratum-edge \
  -e GEMINI_API_KEY="your_gemini_api_key" \
  stratum-clinical-edge:latest
```

---

## 💻 Fast Track 3: Run Standalone on Node.js (macOS, Linux, Windows)

```bash
# 1. Ensure Node.js 20+ is installed
node -v

# 2. Install dependencies
npm ci

# 3. Configure environment
cp .env.example .env.local
# Set GEMINI_API_KEY in .env.local

# 4. Build production bundle
npm run build

# 5. Start production server
npm start
```

The application will run on `http://localhost:3000`.

---

## ☁️ Fast Track 4: Deploy to Google Cloud Run (Containerized)

```bash
export PROJECT_ID="your-gcp-project-id"
export REGION="us-west2"

# 1. Authenticate with Google Cloud
gcloud auth login
gcloud config set project $PROJECT_ID

# 2. Enable Cloud Run & Container Registry
gcloud services enable run.googleapis.com containerregistry.googleapis.com

# 3. Build and push image
docker build -t gcr.io/$PROJECT_ID/stratum-clinical-edge:latest .
gcloud auth configure-docker gcr.io --quiet
docker push gcr.io/$PROJECT_ID/stratum-clinical-edge:latest

# 4. Deploy to Cloud Run
gcloud run deploy stratum-clinical-edge \
  --image gcr.io/$PROJECT_ID/stratum-clinical-edge:latest \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --set-env-vars GEMINI_API_KEY="your_api_key_here" \
  --platform managed
```

---

## 📦 Fast Track 5: Generate a Standalone Release Archive

To download or transfer the entire codebase as a compact, self-contained archive (without `node_modules` or `.next` cache):

```bash
npm run export:bundle
```

This generates a tarball in `release-bundle/` (e.g. `stratum-clinical-edge-release-*.tar.gz`) that can be extracted on any computer:
```bash
tar -xzf stratum-clinical-edge-release-*.tar.gz
npm ci
npm run build
npm start
```

---

## 🔑 Firebase Production Configuration Checklist

When hosting outside Google AI Studio, follow these simple steps to ensure Google Authentication and Firestore sync function properly:

### 1. Authorize Your External Domain in Firebase Auth
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (`upbeat-button-464121-g2` or your own project).
3. Navigate to **Authentication** -> **Settings** -> **Authorized domains**.
4. Click **Add domain** and enter your production domain (e.g., `your-app.vercel.app`, `clinical.yourdomain.com`, or `localhost`).
   *(Without this, Google Sign-in popups will display `auth/unauthorized-domain`).*

### 2. Environment Variables Reference

You can configure Firebase using environment variables in `.env.local` or your hosting dashboard:

| Variable | Description | Default Fallback |
|---|---|---|
| `GEMINI_API_KEY` | Server-side Gemini AI generation key | None (Required for AI) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | Configured in `firebase-applet-config.json` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `upbeat-button-464121-g2.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `upbeat-button-464121-g2` |
| `NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID` | Firestore Database ID | `ai-studio-rightwayclinical-32e6c470-a50f-42e1-8571-07866613377c` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage Bucket URL | `upbeat-button-464121-g2.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Web App ID | Configured in `firebase-applet-config.json` |

---

## 🏥 Standalone Offline & Air-Gapped Operation

Stratum Clinical Edge was built specifically to operate when disconnected from the internet:
- **Offline PWA Installation**: Open the application in Chrome, Edge, Safari, or mobile browser, and click **Install App** (or the browser install icon) to install it directly to your device desktop/home screen.
- **Local Storage Vault**: All clinical notes, ABCD assessments, biomarker logs, and directives are saved immediately in IndexedDB.
- **Automatic Re-sync**: When network connectivity is restored, the application automatically synchronizes pending offline queues with Firestore.

---

## 🧪 Verification & Health Check

Run the built-in attestation test suite on your server to verify everything is operational:

```bash
# 1. Verify 15-point machine attestation
npm run verify:machine

# 2. Verify complete workflow proof
npm run verify:workflow

# 3. Test live health probe
curl http://localhost:3000/api/health
```

All commands will report green `PASSED` / `VERIFIED` status.
