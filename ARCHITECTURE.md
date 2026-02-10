# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Math Foundations                      │
│                  Educational Platform v2.0                   │
└─────────────────────────────────────────────────────────────┘
```

---

## High-Level Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│   Browser    │◄───────►│  Flask App   │◄───────►│  Groq API    │
│   (Client)   │         │  (Backend)   │         │  (AI Model)  │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│              │         │              │
│  Chatbot UI  │         │  Math Engine │
│  JavaScript  │         │  (NumPy/SK)  │
│              │         │              │
└──────────────┘         └──────────────┘
```

---

## Component Breakdown

### 1. Frontend Layer

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Components                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   11 Module  │  │   Chatbot    │  │ Visualizers  │ │
│  │    Pages     │  │      UI      │  │ (Plotly/     │ │
│  │   (HTML)     │  │ (chatbot.js) │  │  Chart.js)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Styling (CSS3 + Glassmorphism)         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2. Backend Layer

```
┌─────────────────────────────────────────────────────────┐
│                    Backend Services                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Flask Application (app.py)          │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  Route Handlers                            │ │  │
│  │  │  - Module endpoints (/vectors, /matrices)  │ │  │
│  │  │  - Chatbot endpoints (/api/chat)           │ │  │
│  │  │  - Health check (/health)                  │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Chatbot    │  │ Math Engine  │  │    CORS      │ │
│  │   Module     │  │  (11 files)  │  │  Middleware  │ │
│  │ (chatbot.py) │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3. External Services

```
┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Groq API (Free Tier)                │  │
│  │  - Model: Llama 3.1 70B / 8B                     │  │
│  │  - Fast inference (500+ tokens/sec)              │  │
│  │  - Generous rate limits                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Module Interaction Flow

```
User Action
    │
    ▼
┌─────────────────┐
│  Module Page    │
│  (e.g., vectors)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User Inputs    │
│  Parameters     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JavaScript     │
│  Sends POST     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Flask Route    │
│  /api/calculate │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Math Engine    │
│  (NumPy/SK)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Response  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Visualization  │
│  (Plotly/Chart) │
└─────────────────┘
```

### Chatbot Interaction Flow

```
User Question
    │
    ▼
┌─────────────────┐
│  Chatbot UI     │
│  (chatbot.js)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Detect Context │
│  - Module       │
│  - Parameters   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  POST /api/chat │
│  {message,      │
│   module,       │
│   context}      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  chatbot.py     │
│  - Build prompt │
│  - Add context  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Groq API Call  │
│  - Llama 3.1    │
│  - System prompt│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Response    │
│  (with LaTeX)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Render in UI   │
│  - Format text  │
│  - Render math  │
└─────────────────┘
```

---

## Deployment Architecture

### Local Development

```
┌─────────────────────────────────────────┐
│         Developer Machine               │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Python 3.11+                     │ │
│  │  Flask Development Server         │ │
│  │  Port: 5000                       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  .env file                        │ │
│  │  - GROQ_API_KEY                   │ │
│  │  - ENVIRONMENT=development        │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Docker Container

```
┌─────────────────────────────────────────┐
│         Docker Container                │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Python 3.11-slim                 │ │
│  │  + Dependencies                   │ │
│  │  + Application Code               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Gunicorn                         │ │
│  │  - 1 worker                       │ │
│  │  - 8 threads                      │ │
│  │  - Port: 8080                     │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Google Cloud Run

```
┌─────────────────────────────────────────────────────────┐
│              Google Cloud Run (Free Tier)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              Load Balancer (HTTPS)             │    │
│  └──────────────────┬─────────────────────────────┘    │
│                     │                                   │
│         ┌───────────┴───────────┐                      │
│         ▼                       ▼                       │
│  ┌─────────────┐         ┌─────────────┐              │
│  │  Instance 1 │         │  Instance 2 │              │
│  │  (512Mi)    │   ...   │  (512Mi)    │              │
│  │  (1 CPU)    │         │  (1 CPU)    │              │
│  └─────────────┘         └─────────────┘              │
│                                                          │
│  Auto-scaling: 0 → 3 instances                          │
│  Region: us-central1                                    │
│  Cost: $0/month (within free tier)                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

```
ai-math-foundations/
│
├── app.py                      # Main Flask application
├── chatbot.py                  # AI chatbot backend ⭐ NEW
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container definition ⭐ NEW
├── deploy.sh                   # Deployment script ⭐ NEW
├── .env.example                # Environment template ⭐ NEW
│
├── templates/                  # HTML templates
│   ├── base.html              # Base template (modified)
│   ├── index.html             # Homepage
│   ├── vectors.html           # Vector module
│   └── ... (9 more modules)
│
├── static/
│   ├── css/
│   │   └── style.css          # Styles (chatbot added) ⭐
│   └── js/
│       ├── main.js            # Main JavaScript
│       ├── chatbot.js         # Chatbot UI ⭐ NEW
│       └── visualizers/       # Module visualizers
│           └── ... (11 files)
│
├── math_engine/               # Mathematical computations
│   ├── vector_logic.py
│   ├── matrix_logic.py
│   └── ... (9 more files)
│
└── docs/                      # Documentation
    ├── DEPLOYMENT.md          # Deployment guide ⭐ NEW
    ├── screenshots/           # Platform screenshots
    └── ...
```

---

## Technology Stack

### Frontend
```
┌─────────────────────────────────────────┐
│  HTML5 + CSS3 + JavaScript (ES6+)      │
├─────────────────────────────────────────┤
│  - Plotly.js 2.27.0 (3D viz)           │
│  - Chart.js 4.4.0 (2D charts)          │
│  - MathJax 3 (LaTeX rendering)         │
│  - Vanilla JS (no frameworks)          │
│  - CSS3 Animations + Glassmorphism     │
└─────────────────────────────────────────┘
```

### Backend
```
┌─────────────────────────────────────────┐
│  Python 3.11+                           │
├─────────────────────────────────────────┤
│  - Flask 3.0.0 (web framework)         │
│  - NumPy 1.24.3 (math operations)      │
│  - scikit-learn 1.3.2 (ML algorithms)  │
│  - SciPy 1.11.4 (scientific computing) │
│  - Pandas 2.1.3 (data manipulation)    │
│  - Groq 0.4.1 (AI API) ⭐ NEW          │
│  - Flask-CORS 4.0.0 ⭐ NEW              │
│  - Gunicorn 21.2.0 (production server) │
└─────────────────────────────────────────┘
```

### Infrastructure
```
┌─────────────────────────────────────────┐
│  Deployment                             │
├─────────────────────────────────────────┤
│  - Docker (containerization) ⭐ NEW     │
│  - Google Cloud Run ⭐ NEW              │
│  - HTTPS (automatic)                    │
│  - Auto-scaling (0-3 instances)        │
│  - Free tier ($0/month)                │
└─────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Transport Security                            │
│  ┌────────────────────────────────────────────────┐    │
│  │  HTTPS (TLS 1.3)                               │    │
│  │  - Automatic on Cloud Run                      │    │
│  │  - Certificate management                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 2: Application Security                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  - CORS configured                             │    │
│  │  - Input validation                            │    │
│  │  - Error handling                              │    │
│  │  - No secrets in code                          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 3: Environment Security                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  - API keys in environment variables           │    │
│  │  - .env file in .gitignore                     │    │
│  │  - Production/development separation           │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 4: Data Privacy                                  │
│  ┌────────────────────────────────────────────────┐    │
│  │  - Chat history stored locally only            │    │
│  │  - No user tracking                            │    │
│  │  - No data collection                          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Scaling Strategy

```
┌─────────────────────────────────────────────────────────┐
│                   Auto-Scaling Logic                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  No Traffic                                             │
│  ┌────────────────────────────────────────────────┐    │
│  │  Instances: 0                                  │    │
│  │  Cost: $0                                      │    │
│  └────────────────────────────────────────────────┘    │
│                     │                                   │
│                     ▼ (Request arrives)                 │
│  Low Traffic                                            │
│  ┌────────────────────────────────────────────────┐    │
│  │  Instances: 1                                  │    │
│  │  Cold start: ~3-5 seconds                      │    │
│  │  Warm requests: <1 second                      │    │
│  └────────────────────────────────────────────────┘    │
│                     │                                   │
│                     ▼ (Traffic increases)               │
│  Medium Traffic                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  Instances: 2                                  │    │
│  │  Load balanced                                 │    │
│  └────────────────────────────────────────────────┘    │
│                     │                                   │
│                     ▼ (High traffic)                    │
│  High Traffic                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │  Instances: 3 (max)                            │    │
│  │  Cost control enabled                          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## API Architecture

### REST Endpoints

```
┌─────────────────────────────────────────────────────────┐
│                      API Endpoints                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Module Endpoints (11 modules)                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  POST /api/calculate_vectors                   │    │
│  │  POST /api/calculate_matrices                  │    │
│  │  POST /api/transform                           │    │
│  │  POST /api/solve_system                        │    │
│  │  POST /api/calculate_eigen                     │    │
│  │  POST /api/gradient_descent                    │    │
│  │  POST /api/neural_forward                      │    │
│  │  POST /api/pca_analyze                         │    │
│  │  POST /api/generate_classification             │    │
│  │  POST /api/apply_filter                        │    │
│  │  POST /api/train_model                         │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Chatbot Endpoints ⭐ NEW                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  POST /api/chat                                │    │
│  │  POST /api/chat/suggest                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  System Endpoints                                       │
│  ┌────────────────────────────────────────────────┐    │
│  │  GET  /health                                  │    │
│  │  GET  / (homepage)                             │    │
│  │  GET  /<module> (module pages)                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────┐
│                  Performance Strategy                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend Optimization                                  │
│  ┌────────────────────────────────────────────────┐    │
│  │  - Lazy load chatbot                           │    │
│  │  - Defer non-critical scripts                  │    │
│  │  - Minimize DOM operations                     │    │
│  │  - Use CSS animations (GPU accelerated)        │    │
│  │  - LocalStorage for chat history               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Backend Optimization                                   │
│  ┌────────────────────────────────────────────────┐    │
│  │  - Gunicorn with 8 threads                     │    │
│  │  - Efficient NumPy operations                  │    │
│  │  - Minimal dependencies                        │    │
│  │  - Fast JSON serialization                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Infrastructure Optimization                            │
│  ┌────────────────────────────────────────────────┐    │
│  │  - Docker multi-stage build                    │    │
│  │  - Slim base image (Python 3.11-slim)          │    │
│  │  - Optimized container size                    │    │
│  │  - Cloud Run auto-scaling                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────┐
│                    Monitoring Stack                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Application Metrics                                    │
│  ┌────────────────────────────────────────────────┐    │
│  │  - Request count                               │    │
│  │  - Response times                              │    │
│  │  - Error rates                                 │    │
│  │  - API usage                                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Infrastructure Metrics (Cloud Run)                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  - Instance count                              │    │
│  │  - CPU usage                                   │    │
│  │  - Memory usage                                │    │
│  │  - Network traffic                             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Logging                                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  - Application logs                            │    │
│  │  - Error logs                                  │    │
│  │  - Access logs                                 │    │
│  │  - Cloud Run logs                              │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  External Monitoring                                    │
│  ┌────────────────────────────────────────────────┐    │
│  │  - Groq API usage (console.groq.com)           │    │
│  │  - GCP billing alerts                          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

### Architecture Highlights

✅ **Modular Design**: Separated concerns (frontend, backend, AI)  
✅ **Scalable**: Auto-scaling from 0 to 3 instances  
✅ **Secure**: Multiple security layers  
✅ **Fast**: Optimized for performance  
✅ **Free**: $0/month operation  
✅ **Professional**: Production-ready code  

### Key Technologies

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Flask, NumPy, scikit-learn
- **AI**: Groq API (Llama 3.1)
- **Deployment**: Docker, Google Cloud Run
- **Visualization**: Plotly.js, Chart.js

### Performance Targets

- Page load: < 2s ✅
- API response: < 1s ✅
- AI response: < 3s ✅
- Cold start: < 5s ✅

---

**Architecture Version**: 2.0.0  
**Last Updated**: February 10, 2026  
**Status**: Production Ready ✅
