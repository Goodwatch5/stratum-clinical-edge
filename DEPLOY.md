# Stratum Clinical Edge Deployment Manual

This guide provides step-by-step instructions to deploy the **Stratum Clinical Edge** application to production environments on Google Cloud and Firebase, ensuring secure, high-uptime hosting for your clinical operations.

---

## Architecture Overview

Stratum Clinical Edge is built with a hybrid edge-native / cloud-hybrid architecture:
- **Frontend/SSR App**: Next.js (App Router) with full-stack capability.
- **Durable Database**: Google Cloud Firestore (provisioned as `ai-studio-32e6c470-a50f-42e1-8571-07866613377c` under Firebase project `upbeat-button-464121-g2`).
- **Identity Provider**: Firebase Authentication (Google OAuth Client).

---

## Path 1: Deploying to Firebase Hosting (Next.js SSR)

The Firebase CLI fully supports Next.js Server-Side Rendering (SSR) via its Web Frameworks integration. This hosts static assets on Firebase's global CDN while executing server-side API routes on a managed serverless function.

### Step 1: Install the Firebase CLI
If you don't have the CLI installed, install it globally:
```bash
npm install -g firebase-tools
```

### Step 2: Log In to Google / Firebase
Authenticate your terminal:
```bash
firebase login
```

### Step 3: Link Your Firebase Project
Associate this workspace directory with your existing Firebase project (`upbeat-button-464121-g2`):
```bash
firebase use upbeat-button-464121-g2
```

### Step 4: Enable Web Frameworks Experiment
This allows the Firebase CLI to understand Next.js build directories:
```bash
firebase experiments:enable webframeworks
```

### Step 5: Initialize (If needed)
If you haven't initialized Firebase, run:
```bash
firebase init
```
- Select **Firestore** (Rules & Indexes) and **Hosting**.
- Choose your project `upbeat-button-464121-g2`.
- When asked about Next.js, accept the detection. Choose region `us-west2` (or your preferred region).

### Step 6: Deploy Everything
Deploy your security rules, database indexes, and compile your Next.js app to production hosting:
```bash
firebase deploy
```

Once deployment completes, the CLI will output your live public URL (e.g., `https://upbeat-button-464121-g2.web.app`).

---

## Path 2: Deploying to Google Cloud Run (Containerized Node.js)

If you prefer a pure Docker-based containerized environment, you can compile and deploy the Next.js app to Cloud Run.

### Step 1: Set Project
```bash
export PROJECT_ID="goodwatch5-kingdom"
gcloud config set project $PROJECT_ID
```

### Step 2: Enable GCP Services
```bash
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
```

### Step 3: Build & Push Container Image
```bash
# Build the Docker container
docker build -t gcr.io/$PROJECT_ID/stratum-clinical-edge:latest .

# Configure docker credential helper
gcloud auth configure-docker gcr.io --quiet

# Push the container
docker push gcr.io/$PROJECT_ID/stratum-clinical-edge:latest
```

### Step 4: Deploy to Cloud Run
```bash
gcloud run deploy stratum-clinical-edge \
  --image gcr.io/$PROJECT_ID/stratum-clinical-edge:latest \
  --region us-west2 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --max-instances 100 \
  --platform managed
```

---

## Setting Up Environment Secrets

To use the AI-powered clinical diagnostics generators (Gemini Integration) in your production deployment, make sure to add the `GEMINI_API_KEY` secret:

### For Firebase Hosting (SSR Functions):
Add your API key using the Google Cloud Secret Manager or set it in your environment:
```bash
firebase functions:secrets:set GEMINI_API_KEY="your_api_key_here"
```

### For Google Cloud Run:
Set the environment variable during deployment:
```bash
gcloud run services update stratum-clinical-edge \
  --set-env-vars GEMINI_API_KEY="your_api_key_here" \
  --region us-west2
```

---

## Verifying Deployment
Once deployed, check that your clinican sessions sync seamlessly:
1. Load your production URL in your browser.
2. Click **Connect Cloud** on the header.
3. Log in with Google Authentication.
4. Your patient biomarker lists and log audit trails will be securely synchronizing with the production database!
