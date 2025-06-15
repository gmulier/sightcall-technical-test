# AI Tutorials Generator

An intelligent web application that transforms conversation transcripts into structured, professional tutorials using OpenAI's GPT technology.

## Overview

AI Tutorials Generator automatically converts raw conversation transcripts (JSON format) into well-structured, step-by-step tutorials. Perfect for creating documentation from meetings, training sessions, or technical discussions.

## 🚀 Quick Start

### Prerequisites (to install)
- Docker and Docker Compose
- Git
- GitHub OAuth App for authentication (can be provided by the owner)
- OpenAI API key (can be provided by the owner)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gmulier/sightcall-technical-test.git
   cd sightcall-technical-test
   ```

2. **Configure environment**
   
   If the `.env` file is not provided by the owner, you need to create it at the project root using the `.env.example` template and configure it with your own API keys.

3. **Start the application**
   ```bash
   ./run start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

### Environment Configuration

Edit `.env` with your credentials:

```env
# GitHub OAuth (create at https://github.com/settings/applications/new)
SOCIAL_AUTH_GITHUB_KEY=your-github-client-id
SOCIAL_AUTH_GITHUB_SECRET=your-github-client-secret

# OpenAI API (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-your-openai-api-key

# Django Secret (generate a secure random string)
SECRET_KEY=your-secret-key-here
```

## Features

### **Authentication**
- GitHub OAuth2 integration
- Secure user sessions
- Personal workspace for each user

### **Transcript Management**
- Upload JSON transcript files
- Automatic duplicate detection (SHA-256 fingerprinting)
- File metadata tracking (duration, phrase count, language)
- Real-time upload status with user feedback

### **AI-Powered Tutorial Generation**
- OpenAI GPT-4o-mini integration
- Intelligent content structuring
- Automatic generation of:
  - Descriptive titles
  - Reading time estimates
  - Relevant tags/keywords
  - Contextual introductions
  - Step-by-step instructions
  - Practical examples
  - Concise summaries

### **Tutorial Management**
- Interactive tutorial viewer with Markdown rendering
- In-place editing capabilities
- Export to Markdown format
- Delete functionality with confirmation
- Responsive grid layout

### **User Experience**
- Modern, clean interface
- Real-time loading states and animations
- Toast notifications for user feedback
- Responsive design for all screen sizes
- Intuitive navigation and interactions

### **Technical Features**
- Dockerized deployment with intelligent startup
- Automatic database migrations
- Pre-flight checks and service readiness detection
- CSRF protection
- CORS configuration
- RESTful API architecture with DRF (Django REST Framework)
- PostgreSQL database with JSON field support

## Architecture

### Backend (Django + DRF)
- **Framework**: Django 4.2.7 with Django REST Framework
- **Database**: PostgreSQL with JSON field support
- **Authentication**: GitHub OAuth2 via social-auth-app-django
- **AI Integration**: OpenAI Python SDK
- **API**: RESTful endpoints with CSRF protection

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: JSXStyle for component-scoped CSS
- **State Management**: React hooks with custom data fetching
- **UI Components**: Lucide React icons, ReactMarkdown
- **Build Tool**: Vite for fast development and building

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Database**: PostgreSQL 15 with intelligent startup detection
- **Reverse Proxy**: Nginx for frontend serving
- **Process Management**: Gunicorn for Django application

## API Endpoints

### Authentication
- `GET /api/auth/status/` - Check authentication status
- `GET /auth/login/github/` - GitHub OAuth login
- `GET /logout/` - User logout

### Transcripts
- `GET /api/transcripts/` - List user's transcripts
- `POST /api/transcripts/` - Upload new transcript
- `POST /api/transcripts/{id}/generate/` - Generate tutorial from transcript

### Tutorials
- `GET /api/tutorials/` - List user's tutorials
- `PATCH /api/tutorials/{id}/` - Update tutorial
- `DELETE /api/tutorials/{id}/` - Delete tutorial

## 🛠️ Development

### Daily Commands
```bash
# Start the application
./run start

# Stop services
./run stop

# Restart services
./run restart

# Reset database
./run reset-db

# System diagnosis
./run diagnose

# Show all commands
./run help
```

### Debugging
```bash
# Access backend shell
docker-compose exec backend bash

# Access database
docker-compose exec db psql -U postgres -d aitutorials

# Check migrations
docker-compose exec backend python manage.py showmigrations
```

## 📁 Project Structure

```
├── backend/                 # Django application
│   ├── config/             # Django settings and URLs
│   ├── tutorials/          # Main app with models, views, serializers
│   ├── Dockerfile          # Backend container configuration
│   └── entrypoint.sh       # Automatic migrations script
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions and API client
│   │   └── types/          # TypeScript type definitions
│   └── Dockerfile          # Frontend container configuration
├── scripts/                # Management scripts
│   ├── common.sh           # Shared functions and utilities
│   ├── start.sh            # Application startup logic
│   ├── stop.sh             # Service shutdown
│   ├── reset-db.sh         # Database reset utility
│   ├── diagnose.sh         # System diagnostics
│   └── backend-entrypoint.sh # Backend container entrypoint
├── docker-compose.yml      # Multi-service orchestration
├── run                     # Main project manager script
└── .env.example           # Environment template
```

## 🔒 Security & Robustness Features

### Security
- **CSRF Protection**: All state-changing requests protected
- **CORS Configuration**: Restricted to allowed origins
- **OAuth2 Authentication**: Secure GitHub integration
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Django ORM protection
- **XSS Protection**: React's built-in escaping

### Robustness & Reliability
- **Intelligent Startup**: Pre-flight checks for Docker, ports, and configuration
- **Service Readiness Detection**: Smart waiting for services to be fully operational
- **Service Dependencies**: Proper startup order with dependency management
- **Graceful Error Handling**: Comprehensive error detection and user feedback
- **Modular Architecture**: Separated concerns with dedicated management scripts

## 🚀 Deployment

The application is fully containerized and ready for deployment:

1. **Production Environment**: Update `.env` with production values
2. **SSL/TLS**: Configure reverse proxy (nginx/traefik) for HTTPS
3. **Database**: Use managed PostgreSQL service for production
4. **Scaling**: Horizontal scaling supported via Docker Compose

---

**Built by Guillaume Mulier using Django, React, OpenAI and Docker**