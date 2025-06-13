# 🤖 AI Tutorials MVP

> Application web MVP pour la génération de tutoriels à partir de transcriptions, avec authentification GitHub OAuth2.

## 🏗 Architecture

**Frontend/Backend séparés** pour une architecture moderne et scalable :

- **Frontend** : React + TypeScript + JSXStyle (port 3000)
- **Backend** : Django + DRF + PostgreSQL (port 8000)
- **Auth** : GitHub OAuth2 avec social-auth-app-django

## 🚀 Démarrage rapide

### 1. Installation automatique
```bash
./setup.sh
```

### 2. Configuration GitHub OAuth2 
1. Créez une GitHub App sur https://github.com/settings/developers
2. Configurez les URLs de callback :
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:8000/auth/complete/github/`
3. Ajoutez vos clés dans `.env` :
   ```bash
   SOCIAL_AUTH_GITHUB_KEY=your_client_id
   SOCIAL_AUTH_GITHUB_SECRET=your_client_secret
   ```

### 3. Lancement des serveurs
```bash
# Terminal 1 - Backend Django (port 8000)
cd backend && python manage.py runserver

# Terminal 2 - Frontend React (port 3000)  
cd frontend && npm start
```

### 4. Accès à l'application
- **Frontend** : http://localhost:3000 (interface utilisateur)
- **Backend API** : http://localhost:8000 (API JSON)
- **Admin Django** : http://localhost:8000/admin/

## 🛠 Stack Technique

### Frontend
- **React 18** + **TypeScript** - Framework moderne avec type safety
- **JSXStyle** - CSS-in-JS performant *(critère obligatoire)*
- **Custom Hooks** - Gestion d'état réactive (useAuth)
- **Fetch API** - Communication avec le backend Django

### Backend  
- **Django 4.2** + **Django REST Framework** - API robuste
- **PostgreSQL** - Base de données relationnelle
- **social-auth-app-django** - Authentification GitHub OAuth2
- **python-social-auth** - Pipeline d'authentification personnalisé

## 📁 Structure du projet

```
├── frontend/                 # React + TypeScript + JSXStyle
│   ├── src/
│   │   ├── components/      # Composants réutilisables  
│   │   ├── pages/           # Pages principales (Login, Dashboard)
│   │   ├── hooks/           # Custom React hooks (useAuth)
│   │   ├── utils/           # Utilitaires API
│   │   └── types/           # Types TypeScript
│   └── package.json         # Dépendances frontend
├── backend/                 # Django + DRF API
│   ├── config/              # Configuration Django
│   ├── tutorials/           # App principale (models, views, API)
│   └── manage.py           # CLI Django
├── docs/                   # Documentation
├── .env                    # Variables d'environnement
├── docker-compose.yml      # PostgreSQL via Docker
└── setup.sh               # Installation automatique
```

## 🎯 Fonctionnalités

### ✅ Implémenté (MVP)
- [x] Authentification GitHub OAuth2 complète
- [x] Interface React moderne avec JSXStyle
- [x] API Django REST Framework
- [x] Base de données PostgreSQL avec modèles optimisés
- [x] Architecture frontend/backend séparée
- [x] Documentation complète

### 🚧 Prochaines étapes
- [ ] Upload et parsing de transcriptions
- [ ] Génération de tutoriels avec IA
- [ ] CRUD complet des transcriptions/tutoriels
- [ ] Tests automatisés
- [ ] Déploiement production

## 📖 Documentation

- [📋 Setup détaillé](docs/SETUP.md) - Installation et configuration
- [🏛 Architecture](docs/ARCHITECTURE.md) - Décisions techniques  
- [⚛️ Frontend](docs/FRONTEND.md) - React + TypeScript + JSXStyle

## 🔧 Développement

### Commandes utiles
```bash
# Backend Django
cd backend
python manage.py makemigrations    # Créer migrations
python manage.py migrate           # Appliquer migrations  
python manage.py createsuperuser   # Créer admin
python manage.py shell             # Shell Django

# Frontend React
cd frontend  
npm start                          # Dev server
npm run build                      # Build production
npm test                          # Tests unitaires
```

### Variables d'environnement
```bash
# Base de données
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/aitutorials

# Django
SECRET_KEY=your-secret-key
DEBUG=True

# GitHub OAuth2
SOCIAL_AUTH_GITHUB_KEY=your_github_client_id  
SOCIAL_AUTH_GITHUB_SECRET=your_github_client_secret

# CORS (frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🎨 Philosophie MVP

- **Minimal mais robuste** - Architecture solide sans complexité inutile
- **Type safety** - TypeScript côté frontend, Django ORM côté backend  
- **Composants modulaires** - Code réutilisable et maintenable
- **API-first** - Backend JSON pur, frontend découplé
- **Zero redondance** - Chaque ligne de code a un objectif précis

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.