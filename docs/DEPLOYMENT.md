# Google Cloud Free Tier Deployment Guide

## Prerequisites

1. **Google Cloud account** (free tier - $300 credit for new users)
2. **Groq API key** (100% free - get from https://console.groq.com)

## Setup Steps

### 1. Install Google Cloud SDK

Download and install from: https://cloud.google.com/sdk/docs/install

For Windows:
```bash
# Download the installer from the link above and run it
# Or use PowerShell:
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

### 2. Login to Google Cloud

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 3. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 4. Get Your Groq API Key

1. Visit https://console.groq.com
2. Sign up for a free account (no credit card required)
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### 5. Set Environment Variables

**On Windows (PowerShell):**
```powershell
$env:GROQ_API_KEY="your-groq-api-key-here"
```

**On Windows (CMD):**
```cmd
set GROQ_API_KEY=your-groq-api-key-here
```

**On Linux/Mac:**
```bash
export GROQ_API_KEY="your-groq-api-key-here"
```

### 6. Update deploy.sh

Edit `deploy.sh` and change:
```bash
PROJECT_ID="your-project-id"  # Change to your actual GCP project ID
```

### 7. Deploy

**On Windows (PowerShell):**
```powershell
# Make the script executable (if using Git Bash or WSL)
# Or run the gcloud command directly:
gcloud run deploy ai-math-platform `
  --source . `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 3 `
  --timeout 300 `
  --set-env-vars ENVIRONMENT=production `
  --set-env-vars GROQ_API_KEY=$env:GROQ_API_KEY
```

**On Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

## Free Tier Limits

### Google Cloud Run (Always Free Tier)
- **2 million requests/month**
- **360,000 GB-seconds of compute time**
- **180,000 vCPU-seconds**
- **1 GB network egress per month**

### Groq API (Free Tier)
- **Generous rate limits**
- **Fast inference (500+ tokens/sec)**
- **Multiple model options**
- **No credit card required**

**This is MORE than enough for educational use!**

## Cost Monitoring

1. **Set up billing alerts** in GCP Console:
   - Go to Billing → Budgets & alerts
   - Create a budget with alerts at 50%, 90%, 100%

2. **Monitor usage** in Cloud Console:
   - Cloud Run → Your service → Metrics
   - Check request count, CPU, and memory usage

3. **Expected cost**: **$0/month** (within free tier)

## Local Testing

Before deploying, test locally:

### 1. Create .env file

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```
GROQ_API_KEY=your_actual_key_here
ENVIRONMENT=development
PORT=5000
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run locally

```bash
python app.py
```

Visit http://localhost:5000

### 4. Test the chatbot

1. Click the AI chatbot button (bottom right)
2. Ask a question like "Explain gradient descent"
3. Verify you get a response

## Updating the App

Simply run the deployment command again:

```bash
./deploy.sh
```

Or on Windows:
```powershell
gcloud run deploy ai-math-platform --source . --region us-central1
```

Cloud Run will automatically:
- Build a new container
- Deploy with zero downtime
- Route traffic to the new version

## Troubleshooting

### Error: "API key not found"

Make sure you set the environment variable:
```bash
echo $GROQ_API_KEY  # Should show your key
```

### Error: "Permission denied"

Run:
```bash
gcloud auth login
gcloud auth application-default login
```

### Error: "Service not found"

Make sure you enabled the APIs:
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Chatbot not responding

1. Check browser console for errors (F12)
2. Verify GROQ_API_KEY is set in Cloud Run:
   ```bash
   gcloud run services describe ai-math-platform --region us-central1
   ```
3. Check Cloud Run logs:
   ```bash
   gcloud run logs read --service ai-math-platform --region us-central1
   ```

## Custom Domain (Optional)

To use your own domain:

1. **Verify domain ownership** in Google Search Console
2. **Map domain** in Cloud Run:
   ```bash
   gcloud run domain-mappings create --service ai-math-platform --domain yourdomain.com --region us-central1
   ```
3. **Update DNS** records as instructed by GCP

## Security Best Practices

1. **Never commit .env file** (already in .gitignore)
2. **Rotate API keys** periodically
3. **Monitor usage** for unusual activity
4. **Set up billing alerts** to avoid surprises
5. **Use environment variables** for all secrets

## Performance Optimization

### Current Configuration
- **Memory**: 512Mi (sufficient for the app)
- **CPU**: 1 (adequate for educational use)
- **Min instances**: 0 (scales to zero when not in use)
- **Max instances**: 3 (prevents runaway costs)

### If you need more performance:
```bash
gcloud run services update ai-math-platform \
  --memory 1Gi \
  --cpu 2 \
  --region us-central1
```

## Monitoring

View real-time metrics:
```bash
gcloud run services describe ai-math-platform --region us-central1
```

View logs:
```bash
gcloud run logs tail --service ai-math-platform --region us-central1
```

## Maintenance

### Weekly
- Check Groq API usage at https://console.groq.com
- Monitor Cloud Run metrics in GCP Console

### Monthly
- Review error logs
- Update dependencies if needed:
  ```bash
  pip list --outdated
  ```

### As Needed
- Add new module knowledge to `chatbot.py`
- Improve chatbot responses based on user feedback
- Update system prompts for better AI responses

## Success Criteria

✅ Chatbot fully functional on all pages  
✅ Free tier deployment successful  
✅ Total cost: $0/month  
✅ Response time < 2 seconds  
✅ Mobile-friendly interface  
✅ Professional appearance  
✅ Ready for users/research paper  

## Support

- **Google Cloud**: https://cloud.google.com/support
- **Groq**: https://console.groq.com/docs
- **Flask**: https://flask.palletsprojects.com/

## Next Steps

After successful deployment:

1. **Share the URL** with users
2. **Gather feedback** on chatbot responses
3. **Monitor usage** patterns
4. **Iterate** on prompts and features
5. **Document** user interactions for research

---

**Congratulations!** Your AI Math Platform is now live and accessible worldwide! 🎉
