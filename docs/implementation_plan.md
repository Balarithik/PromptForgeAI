# Implementation Plan - PromptForge AI Article Generation Platform

PromptForge AI is a production-ready, full-stack AI Blog and Article Generation Platform built with **React (Frontend)**, **Tailwind CSS**, **Django & Django REST Framework (Backend)**, **PostgreSQL & Prisma Schema**, and **Google Gemini AI API**.

## Architectural Overview

```
 ┌────────────────────────────────────────────────────────┐
 │            React + Tailwind CSS Frontend               │
 │ (Dashboard, Template Cards, Form, Markdown Editor, UI) │
 └───────────────────────────┬────────────────────────────┘
                             │ REST API (JWT Auth)
 ┌───────────────────────────▼────────────────────────────┐
 │         Django REST Framework Backend                  │
 │ ┌────────────────────────────────────────────────────┐ │
 │ │ Auth Service | Template Engine | Article Pipeline   │ │
 │ │ AI Editing Actions | Evaluation Engine             │ │
 │ └─────────────────────────┬──────────────────────────┘ │
 └───────────────────────────┼────────────────────────────┘
                             │ Server-side LLM Integration
                 ┌───────────┴───────────┐
                 │  Google AI Studio API │
                 │    (Gemini Models)    │
                 └───────────────────────┘
```

## Key Technical Features

1. **Dynamic Prompt Template Engine**:
   - 10 Default Templates pre-seeded: SEO Blog, Technical Article, Tutorial/How-To, Academic Article, News Article, Explainer Article, Case Study, Product Review, Documentation, LinkedIn Article.
   - Templates stored with versioning, variable definitions, custom system prompts, user prompt templates, categories, and tags.

2. **Multi-Stage Generation Pipeline**:
   - **Direct Generation**: Fast single-pass generation.
   - **Full Multi-Stage Pipeline**:
     1. *Outline Generation*: Formulates structured H2/H3 headings and core bullet points.
     2. *Draft Generation*: Expands the outline into a full article with requested tone, target audience, and length.
     3. *AI Evaluation*: Evaluates quality across Relevance, Structure, Readability, Completeness, and SEO quality.
     4. *Self-Improvement*: Refines the draft based on low scores or evaluation suggestions.

3. **AI Editing & Inline Polish Actions**:
   - 12 AI actions: *Improve Writing*, *Simplify*, *Make Professional*, *Make Beginner Friendly*, *Expand*, *Summarize*, *Add Examples*, *Generate FAQ*, *Improve SEO*, *Generate Introduction*, *Generate Conclusion*, *Convert to Social Media*.

4. **Rich Article Editor & Quality Dashboard**:
   - Dual-mode Markdown Editor / Rendered Preview with code syntax highlighting.
   - Export options: Raw Markdown, HTML, Plain Text, Copy to Clipboard.
   - Visual Evaluation Gauge & Category breakdown scores.

5. **Security & Production Readiness**:
   - LLM API Keys (`GEMINI_API_KEY`) strictly maintained server-side in backend environment variables.
   - Smart fallback mechanism if no API key is provided, generating rich realistic sample articles so system works offline or during evaluation.
   - JWT authentication via Django REST Framework.
   - Full PostgreSQL integration + Prisma schema (`schema.prisma`) for DB compatibility.
   - Docker & Docker Compose setup (`docker-compose.yml`, backend & frontend `Dockerfile`).
   - Deployment ready for Vercel/Railway.

---

## Proposed Project Structure

```
PromptForgeAI/
├── docker-compose.yml
├── README.md
├── .env.example
├── schema.prisma
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── promptforge/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   └── api/
│       ├── __init__.py
│       ├── models.py          # User, PromptTemplate, Article, Evaluation, GenerationLog
│       ├── serializers.py     # DRF serializers for templates, articles, evaluations
│       ├── views.py           # REST views for auth, generation, templates, editing, history
│       ├── urls.py            # API routing
│       ├── ai_services.py     # Gemini AI integration, multi-stage pipeline, evaluation engine
│       ├── prompt_engine.py   # Variable interpolation & template engine
│       └── management/
│           └── commands/
│               └── seed_templates.py # Django command to seed default prompt templates
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── TemplateCard.jsx
        │   ├── GenerationForm.jsx
        │   ├── MarkdownEditor.jsx
        │   ├── QualityEvaluation.jsx
        │   ├── AI PolishToolbar.jsx
        │   ├── PipelineProgress.jsx
        │   └── StatCard.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── GeneratorWorkspace.jsx
        │   ├── TemplatesPage.jsx
        │   ├── HistoryPage.jsx
        │   └── AuthPage.jsx
        └── services/
            ├── api.js         # Axios API client
            └── auth.js        # Auth state management
```

---

## User Review Required

> [!IMPORTANT]
> The backend uses Django REST Framework + PostgreSQL with a dual Prisma schema definition (`schema.prisma`) provided in the repository so PostgreSQL can be used with Django ORM or Prisma tooling. The Gemini AI integration is handled securely on the server-side with fallback support when no key is set.

---

## Open Questions

None at present. We are ready to proceed with implementation upon user confirmation.

---

## Verification Plan

### Automated / Server Tests
- Django system checks: `python manage.py check`
- Backend API tests: `python manage.py test`
- Database migrations: `python manage.py makemigrations` and `python manage.py migrate`
- React Frontend build: `npm run build`

### Manual Verification
1. Test prompt template loading and dynamic variable generation.
2. Test full article generation using both Direct and Multi-Stage Pipeline.
3. Test inline AI polish actions (e.g. Improve SEO, Simplify, Generate FAQ).
4. Verify AI Evaluation system output (Scores & Feedback).
5. Verify Article History, Copy/Export features (Markdown, HTML).
6. Verify Docker Compose build and spin-up.
