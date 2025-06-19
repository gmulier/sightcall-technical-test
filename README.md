# AI Tutorials Generator

**Transform any conversation into professional documentation with AI-powered intelligence**

An advanced web application that automatically converts conversation transcripts into polished, step-by-step tutorials using OpenAI's latest GPT-4o technology. Upload transcripts with videos and get structured tutorials with synchronized video clips in seconds.

## Overview

**Transform conversations into professional tutorials in seconds!** 

AI Tutorials Generator leverages cutting-edge OpenAI technology to automatically convert raw conversation transcripts into polished, step-by-step tutorials. Simply upload your JSON transcript (with optional video), and watch as AI creates structured documentation complete with:

- **Intelligent Content Organization** - Automatic step detection and logical flow
- **Smart Video Integration** - AI-extracted clips synchronized with tutorial steps  
- **Professional HTML Export** - Self-contained tutorials with embedded media
- **Rich Metadata** - Auto-generated titles, tags, and reading estimates

Perfect for creating documentation from meetings, training sessions, technical discussions, or any recorded conversation that needs to become actionable content.

## How It Works

1. **Upload** your JSON transcript + optional video file
2. **AI Processing** - GPT-4o analyzes conversation flow and content  
3. **Tutorial Generation** - Structured content with titles, steps, tips, and summaries
4. **Video Sync** - Automatic clip extraction at relevant timestamps
5. **Export** - Download complete ZIP package with HTML tutorial + video clips

## Quick Start

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

### **Authentication & Security**
- GitHub OAuth2 integration for seamless login
- Secure user sessions with personal workspaces
- CSRF protection and input validation
- Automatic duplicate detection to prevent re-uploads

### **Smart File Management**
- **Drag & Drop Upload** - Simply drag JSON transcripts and videos
- **Intelligent File Detection** - Auto-identifies file types
- **Dual File Support** - Upload transcript + video simultaneously
- **Real-time Feedback** - Live upload progress and status
- **Multiple Video Formats** - MP4, MOV, AVI, MKV, WebM support

### **AI-Powered Tutorial Generation**
- **GPT-4o Integration** - Latest OpenAI model for superior content quality
- **Conversation Analysis** - Understands context and flow from transcripts
- **Auto-Generated Content**:
  - Compelling titles and introductions
  - Step-by-step instructions with logical flow
  - Practical tips and best practices
  - Comprehensive summaries
  - Relevant tags and estimated reading time

### **Advanced Video Processing**
- **Smart Clip Extraction** - AI detects optimal moments for visual demonstrations
- **Automatic Timestamping** - Syncs video clips with tutorial steps
- **Professional Organization** - Hierarchical storage for easy management
- **Embedded Players** - HTML5 video integration in tutorial viewer
- **Offline Playback** - Video clips included in ZIP exports for standalone viewing

### **Tutorial Management**
- **Interactive Preview** - Modern component-based tutorial viewer
- **Inline Editing** - Edit tutorials directly in the interface with specialized editors
- **One-Click Download** - Export complete ZIP packages with HTML + video clips
- **Offline Compatible** - Self-contained exports work without internet connection
- **Safe Deletion** - Confirmation dialogs for important actions
- **Responsive Design** - Works perfectly on all devices

### **User Experience**
- **Modern Interface** - Clean, professional design
- **Instant Feedback** - Toast notifications and loading states
- **Keyboard Navigation** - Efficient shortcuts (ESC to close modals)
- **Smart Interactions** - Click outside to close, intuitive workflows
- **Mobile Friendly** - Fully responsive across all screen sizes

### **Technical Excellence**
- **Containerized Deployment** - One-command startup with Docker
- **Intelligent Health Checks** - Automatic service readiness detection
- **Database Automation** - Auto-migrations and setup
- **RESTful API** - Clean, documented endpoints
- **Production Ready** - Scalable architecture with PostgreSQL

## Architecture

### Backend (Django + DRF)
- **Framework**: Django 4.2.7 with Django REST Framework
- **Database**: PostgreSQL 15 with JSON field support  
- **Authentication**: GitHub OAuth2 integration
- **AI Integration**: OpenAI GPT-4o Python SDK
- **Video Processing**: MoviePy for professional clip extraction
- **API**: Secure RESTful endpoints with CSRF protection

### Frontend (React + TypeScript)
- **Framework**: React 18 with full TypeScript support
- **Styling**: Component-scoped CSS with JSXStyle and centralized styling system
- **State Management**: Custom React hooks for optimal performance
- **UI Components**: Modular architecture with specialized Reader/Editor components
- **User Experience**: Drag & drop, real-time feedback, responsive design

### Infrastructure
- **Containerization**: Docker with optimized multi-stage builds
- **Database**: PostgreSQL 15 with intelligent startup detection
- **Web Server**: Nginx for efficient static file serving
- **Process Management**: Gunicorn for production-ready deployment

## API Endpoints

### Authentication
- `GET /api/auth/status/` - Check authentication status
- `GET /auth/login/github/` - GitHub OAuth login
- `GET /logout/` - User logout

### Transcripts
- `GET /api/transcripts/` - List user's transcripts
- `POST /api/transcripts/` - Upload transcript with optional video file
- `POST /api/transcripts/{id}/generate/` - Generate tutorial with video clips

### Tutorials
- `GET /api/tutorials/` - List user's tutorials
- `PATCH /api/tutorials/{id}/` - Update tutorial
- `DELETE /api/tutorials/{id}/` - Delete tutorial
- `GET /api/tutorials/{id}/export_zip/` - Download ZIP package with HTML + videos

## Development

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

## Project Structure

```
├── backend/                 # Django application
│   ├── config/             # Django settings and URLs
│   ├── tutorials/          # Main app with models, views, serializers
│   │   └── services/       # Business logic (TutorialService, VideoService, HtmlService)
│   ├── Dockerfile          # Backend container configuration
│   └── entrypoint.sh       # Automatic migrations script
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── TutorialModal/    # Modal orchestrator
│   │   │   ├── TutorialReader/   # Tutorial viewing components
│   │   │   └── TutorialEditor/   # Tutorial editing components
│   │   ├── pages/          # Main application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions and API client
│   │   ├── styles/         # Centralized styling system
│   │   └── types/          # TypeScript type definitions
│   └── Dockerfile          # Frontend container configuration
├── media/                  # Media storage
│   ├── transcript_videos/  # Uploaded source videos
│   └── tutorials/          # Organized video clips by tutorial
├── docs/                   # Technical documentation
├── scripts/                # Management scripts
├── docker-compose.yml      # Multi-service orchestration
├── run                     # Main project manager script
└── .env.example           # Environment template
```

## Security & Robustness Features

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

## Deployment

The application is fully containerized and ready for deployment:

1. **Production Environment**: Update `.env` with production values
2. **SSL/TLS**: Configure reverse proxy (nginx/traefik) for HTTPS
3. **Database**: Use managed PostgreSQL service for production
4. **Scaling**: Horizontal scaling supported via Docker Compose

---

**Built by Guillaume Mulier using Django, React, OpenAI and Docker**