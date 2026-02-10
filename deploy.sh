#!/bin/bash

# Configuration
PROJECT_ID="your-project-id"  # Change this
SERVICE_NAME="ai-math-platform"
REGION="us-central1"

# Build and deploy to Cloud Run
echo "Building and deploying to Google Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --timeout 300 \
  --set-env-vars ENVIRONMENT=production \
  --set-env-vars GROQ_API_KEY=$GROQ_API_KEY

echo "Deployment complete!"
echo "Your app is running at:"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
