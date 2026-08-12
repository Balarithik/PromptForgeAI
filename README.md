# PromptForge AI — Enterprise Article & Blog Generation Platform

![PromptForge AI Stack](https://img.shields.io/badge/Stack-React%20%7C%20Django%20REST%20%7C%20PostgreSQL%20%7C%20Prisma%20%7C%20Gemini%202.5-indigo)
![License](https://img.shields.io/badge/License-MIT-blue)

**PromptForge AI** is a production-ready, full-stack AI Blog and Article Generation Platform designed for enterprises, engineering teams, and digital content agencies. Built with **React**, **Tailwind CSS**, **Django REST Framework**, **PostgreSQL**, **Prisma Schema**, and **Google AI Studio (Gemini 2.5 Flash API)**.

---

## 🌟 Key Features

### 1. 🎯 Dynamic Prompt Template Engine (10 Standard Templates)
Pre-seeded with 10 industry-tailored prompt schemas featuring version control, variable definitions, custom system prompts, and category tagging:
1. **SEO Blog Article** (Keyword density, H2/H3 structure, Meta descriptions)
2. **Technical Article** (Architecture breakdowns, runnable code snippets, performance considerations)
3. **Tutorial / How-To Guide** (Numbered steps, prerequisites, troubleshooting)
4. **Academic Article** (Abstract, formal methodology, research focus, references)
5. **News Article** (Inverted pyramid, lead hook, journalistic quotes)
6. **Explainer Article** (Mental models, intuitive analogies, progressive disclosure)
7. **Case Study** (Challenge -> Solution -> Quantifiable ROI metrics callout)
8. **Product Review** (Features, Pros & Cons matrix, pricing, final verdict rating)
9. **Developer Documentation** (API endpoints table, code snippets, error codes)
10. **LinkedIn / Social Media Article** (Viral hooks, mobile spacing, hashtags)

### 2. ⚡ Multi-Stage Generation Pipeline
Supports two architectural pipelines:
* **Direct Pass**: Fast single-pass article synthesis.
* **Multi-Stage Orchestration**:
  1. *Stage 1: Outline Formulation* — Generates structured H2/H3 sub-topic hierarchy.
  2. *Stage 2: Draft Synthesis* — Expands outline into a full article with specified tone, target audience, and length.
  3. *Stage 3: AI Quality Evaluation* — Scores draft across 5 dimensions (Relevance, Structure, Readability, Completeness, SEO Quality).
  4. *Stage 4: Auto-Refinement* — Applies automatic editorial polishing if overall quality score is below threshold.

### 3. 🪄 12 AI Inline Polish Actions
Inline transformation tools available inside the Markdown workspace:
- ✨ **Improve Writing**
- 💡 **Simplify Text**
- 💼 **Make Professional**
- 🌱 **Make Beginner Friendly**
- 🔍 **Expand Content**
- 📝 **Summarize**
- 💻 **Add Examples / Code**
- ❓ **Generate FAQ Section**
- 🚀 **Improve SEO Ranking**
- 🎯 **Generate Introduction**
- 🏁 **Generate Conclusion**
- 📱 **Convert to Social / LinkedIn Post**

### 4. 📊 Editorial Quality Evaluation Audit
Measures article performance against 5 core editorial dimensions (Relevance, Structure, Readability, Completeness, SEO Quality), highlights key strengths, lists actionable improvement points, and offers one-click automatic refinement.

### 5. 🛡️ Security & Enterprise Readiness
- **Server-Side API Key Security**: Google AI Studio `GEMINI_API_KEY` is maintained exclusively in backend environment variables.
- **Intelligent Fallback Engine**: System automatically generates realistic high-quality articles when no API key is set, ensuring offline testability out of the box.
- **Dual DB Schema Support**: Django ORM PostgreSQL models paired with `schema.prisma` for Prisma CLI compatibility.
- **Docker Containerization**: Complete `docker-compose.yml` for local PostgreSQL + Django + React stack.

---

## 🏗️ System Architecture

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 React + Tailwind CSS Frontend               │
  │ (Dashboard, Workspace, Markdown Editor, Polish Toolbar, UI) │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ REST API (JSON)
  ┌──────────────────────────────▼──────────────────────────────┐
  │              Django REST Framework Backend                  │
  │ ┌─────────────────────────────────────────────────────────┐ │
  │ │ Prompt Engine | Multi-Stage Pipeline | AI Evaluator     │ │
  │ └────────────────────────────┬────────────────────────────┘ │
  └──────────────────────────────┼──────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │    PostgreSQL Database        │
                 │   (or Prisma Schema Layer)    │
                 └───────────────────────────────┘
```

---

## 📁 Repository Structure

```
PromptForgeAI/
├── docker-compose.yml         # Local Docker setup (Postgres + Django + React)
├── schema.prisma              # PostgreSQL schema for Prisma CLI users
├── vercel.json                # Vercel deployment routing configuration
├── .env.example               # Environment variables template
├── README.md                  # System documentation
├── backend/
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   ├── promptforge/           # Django settings, urls, wsgi
│   └── api/
│       ├── models.py          # PromptTemplate, Article, Evaluation, GenerationLog
│       ├── prompt_engine.py   # Variable interpolation & template engine
│       ├── ai_services.py     # Gemini AI API integration & multi-stage pipeline
│       ├── serializers.py     # DRF serializers
│       ├── views.py           # REST endpoints
│       └── management/
│           └── commands/
│               └── seed_templates.py # Seed script for 10 default templates
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/        # Navbar, Sidebar, Form, Editor, Evaluation, Toolbar
        ├── pages/             # Dashboard, GeneratorWorkspace, Templates, History
        └── services/          # Axios REST client
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL (optional, defaults to SQLite for zero-config local testing if Postgres is not running)

---

### Option A: Local Native Setup (Recommended for Development)

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt

# Run migrations & seed default templates
python manage.py makemigrations api
python manage.py migrate
python manage.py seed_templates

# Start Django backend server
python manage.py runserver 8000
```

#### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

### Option B: Docker Compose Setup

Run the entire platform (PostgreSQL 16, Django Backend, React Frontend) in containerized services:

```bash
docker-compose up --build
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/`

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env` in the root and configure:

```ini
GEMINI_API_KEY=your_google_ai_studio_api_key
SECRET_KEY=django-insecure-promptforge-production-key
DEBUG=True
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/promptforge_db
```

---

## 📡 REST API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats/` | Dashboard statistics (total articles, avg quality score, total words) |
| `GET` | `/api/templates/` | List prompt templates (supports `?category=` filter) |
| `POST` | `/api/templates/` | Create a new custom prompt template |
| `POST` | `/api/articles/generate/` | Main AI article generation endpoint (Direct or Multi-Stage) |
| `GET` | `/api/articles/` | List generated article library |
| `GET` | `/api/articles/<id>/` | Fetch article details and evaluation audit |
| `POST` | `/api/articles/<id>/ai-edit/` | Execute inline AI polish action (e.g. Improve, Simplify, FAQ) |
| `POST` | `/api/articles/<id>/evaluate/` | Re-run AI Quality Evaluation Audit |
| `DELETE` | `/api/articles/<id>/` | Delete article from library |

---

## 🌐 Production Deployment Guide

### Deploying Frontend to Vercel
1. Push repository to GitHub.
2. Connect repository to [Vercel](https://vercel.com).
3. Set Build Command: `npm run build` inside `frontend`.
4. Set Output Directory: `dist`.

### Deploying Backend to Railway / Render / DigitalOcean
1. Provision a managed PostgreSQL instance on Railway / Render / Supabase.
2. Deploy `backend/` directory using the provided `Dockerfile`.
3. Set Environment Variables:
   - `DATABASE_URL`: Managed Postgres connection string
   - `GEMINI_API_KEY`: Your Google AI Studio API key
   - `SECRET_KEY`: Production secret key

---

## 📄 License
This project is open-source under the MIT License.
