# Deployment Guide

This guide covers deploying your AI Math Foundations platform to various hosting services.

## 🚀 Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

1. **Create a Render account:** https://render.com

2. **Create a new Web Service:**
   - Connect your GitHub repository
   - Select "Python" environment
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn app:app`

3. **Environment Variables:**
   - No special variables needed for basic deployment

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Access your public URL!

**Pros:** Free tier, automatic HTTPS, easy setup  
**Cons:** Cold starts on free tier

---

### Option 2: Railway

1. **Create a Railway account:** https://railway.app

2. **Deploy from GitHub:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configuration:**
   - Railway auto-detects Python
   - No additional configuration needed

4. **Access:**
   - Get your public URL from dashboard

**Pros:** Fast deployment, generous free tier  
**Cons:** Requires credit card for free tier

---

### Option 3: Heroku

1. **Create a Heroku account:** https://heroku.com

2. **Install Heroku CLI:**
   ```bash
   # Download from https://devcli.heroku.com/
   ```

3. **Create Procfile:**
   ```
   web: gunicorn app:app
   ```

4. **Deploy:**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

**Pros:** Mature platform, good documentation  
**Cons:** No free tier anymore

---

### Option 4: PythonAnywhere

1. **Create account:** https://www.pythonanywhere.com

2. **Upload code:**
   - Use Git or upload files
   - Install requirements in virtual environment

3. **Configure WSGI:**
   - Point to your Flask app
   - Set working directory

4. **Reload:**
   - Reload web app
   - Access your subdomain

**Pros:** Python-focused, easy for beginners  
**Cons:** Limited free tier

---

### Option 5: Vercel (with Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create vercel.json:**
   ```json
   {
     "builds": [
       {
         "src": "app.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "app.py"
       }
     ]
   }
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

**Pros:** Fast, global CDN  
**Cons:** Serverless limitations

---

## 🔧 Pre-Deployment Checklist

- [ ] Test locally: `python app.py`
- [ ] All dependencies in requirements.txt
- [ ] Remove debug mode in production
- [ ] Set proper environment variables
- [ ] Test all modules work
- [ ] Check mobile responsiveness
- [ ] Verify API endpoints
- [ ] Test with different browsers

---

## 🌐 Custom Domain (Optional)

### For Render:
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed

### For Railway:
1. Go to Settings → Domains
2. Add custom domain
3. Configure DNS

---

## 📊 Monitoring

### Free Monitoring Tools:
- **UptimeRobot** - Monitor uptime
- **Google Analytics** - Track usage
- **Sentry** - Error tracking

---

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit secrets to Git
   - Use platform's environment variable system

2. **HTTPS:**
   - Most platforms provide free HTTPS
   - Always use HTTPS in production

3. **Rate Limiting:**
   - Consider adding rate limiting for APIs
   - Use Flask-Limiter if needed

---

## 💡 Performance Tips

1. **Enable Caching:**
   - Cache static assets
   - Use CDN for libraries

2. **Optimize Images:**
   - Compress screenshots
   - Use appropriate formats

3. **Minimize Dependencies:**
   - Only include necessary packages
   - Keep requirements.txt clean

---

## 🐛 Troubleshooting

### Common Issues:

**Issue:** Application won't start
- Check logs for errors
- Verify all dependencies installed
- Check Python version compatibility

**Issue:** Static files not loading
- Verify static folder structure
- Check file paths in templates
- Ensure proper MIME types

**Issue:** Slow performance
- Check cold start times
- Optimize heavy computations
- Consider caching

---

## 📞 Need Help?

- Check platform documentation
- Open an issue on GitHub
- Ask in community forums

---

**Ready to deploy? Choose a platform and follow the steps above!** 🚀
