# 📋 Guide d'Installation - AI Tutorials MVP

> **Architecture Frontend/Backend séparée** : React + TypeScript + JSXStyle + Django + PostgreSQL

## 🎯 Installation Rapide

```bash
# 1. Cloner le projet
git clone <votre-repo>
cd sightcall-technical-test

# 2. Lancer l'installation automatique
./setup.sh

# 3. Configurer GitHub OAuth2 (voir section détaillée ci-dessous)

# 4. Lancer les serveurs
# Terminal 1 - Backend
cd backend && source ../venv/bin/activate && python manage.py runserver

# Terminal 2 - Frontend  
cd frontend && npm start
```

**URLs** : Frontend http://localhost:3000 | Backend http://localhost:8000

---

## 📋 Prérequis

### Obligatoires

- **Python 3.11+** : https://python.org/downloads
- **Node.js 18+ LTS** : https://nodejs.org/en/download  
- **Docker** : https://docs.docker.com/get-docker
- **Git** : https://git-scm.com/downloads

### Vérification

```bash
python3.11 --version   # ou python3 --version
node --version         # v18.x.x ou plus récent
npm --version          # v8.x.x ou plus récent  
docker --version       # 20.x.x ou plus récent
```

---

## 🔧 Installation Manuelle (si problème avec setup.sh)

### 1. Backend Django

```bash
# Environnement virtuel Python
python3.11 -m venv venv
source venv/bin/activate

# Dépendances Python
pip install --upgrade pip
pip install -r requirements.txt

# Base de données PostgreSQL
docker-compose up -d

# Attendre PostgreSQL (5 secondes)
sleep 5

# Migrations Django
cd backend
python manage.py migrate
cd ..
```

### 2. Frontend React

```bash
# Dépendances Node.js
cd frontend
npm install
cd ..
```

### 3. Configuration

```bash
# Créer .env (si pas déjà fait)
cp .env.example .env  # ou créer manuellement
```

---

## 🔑 Configuration GitHub OAuth2

### 1. Créer une GitHub App

1. Aller sur : https://github.com/settings/developers
2. **New OAuth App** avec :
   - **Application name** : `AI Tutorials MVP Local`
   - **Homepage URL** : `http://localhost:3000`
   - **Authorization callback URL** : `http://localhost:8000/auth/complete/github/`
3. Cliquer **Register application**
4. Noter le **Client ID** et générer un **Client Secret**

### 2. Configurer le fichier .env

```bash
# Éditer .env
nano .env

# Remplacer ces lignes :
SOCIAL_AUTH_GITHUB_KEY=your_actual_github_client_id  
SOCIAL_AUTH_GITHUB_SECRET=your_actual_github_client_secret
```

### 3. Exemple de .env complet

```bash
# Base de données PostgreSQL
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/aitutorials

# Django Configuration
SECRET_KEY=django-secret-key-for-development-only
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS pour le frontend React
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# GitHub OAuth2 - REMPLACER PAR VOS VRAIES CLÉS
SOCIAL_AUTH_GITHUB_KEY=abcd1234your_client_id
SOCIAL_AUTH_GITHUB_SECRET=xyz9876your_client_secret_very_long
```

---

## 🚀 Lancement des Serveurs

### Terminal 1 - Backend Django

```bash
cd backend
source ../venv/bin/activate
python manage.py runserver
```

**URL Backend** : http://localhost:8000

### Terminal 2 - Frontend React

```bash
cd frontend
npm start
```

**URL Frontend** : http://localhost:3000

---

## 🌐 URLs de l'Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur React |
| **Backend API** | http://localhost:8000 | API JSON Django |
| **Admin Django** | http://localhost:8000/admin | Interface d'administration |
| **Auth GitHub** | http://localhost:8000/auth/login/github/ | Connexion GitHub |

---

## 🧪 Test de l'Installation

### 1. Vérifier PostgreSQL

```bash
docker-compose ps
# Doit afficher le conteneur db en état "Up"

docker-compose logs db
# Doit afficher "database system is ready to accept connections"
```

### 2. Tester le Backend

```bash
curl http://localhost:8000/?format=json
# Doit retourner : {"authenticated": false, "login_url": "/auth/login/github/"}
```

### 3. Tester le Frontend

- Aller sur http://localhost:3000
- Voir la page de connexion avec le bouton GitHub
- Cliquer sur "Se connecter avec GitHub"
- Être redirigé vers GitHub OAuth2

---

## 🚨 Dépannage

### Problème : "Python command not found"

```bash
# Essayer python3 au lieu de python3.11
python3 --version

# Ou installer Python 3.11
# macOS
brew install python@3.11

# Ubuntu
sudo apt install python3.11
```

### Problème : "Node command not found"

```bash
# Installer Node.js 18+ LTS depuis https://nodejs.org
# Ou avec gestionnaire de paquets :

# macOS
brew install node

# Ubuntu  
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Problème : "Docker command not found"

```bash
# Installer Docker Desktop depuis https://docker.com
# Vérifier que Docker tourne :
docker ps
```

### Problème : "Port 8000 already in use"

```bash
# Trouver le processus qui utilise le port
lsof -ti:8000

# Le tuer
kill -9 $(lsof -ti:8000)
```

### Problème : "Port 3000 already in use"

```bash
# Tuer le processus sur le port 3000
kill -9 $(lsof -ti:3000)

# Ou lancer React sur un autre port
cd frontend
PORT=3001 npm start
```

### Problème : Erreur de migration Django

```bash
cd backend
source ../venv/bin/activate

# Réinitialiser les migrations
rm tutorials/migrations/000*.py
python manage.py makemigrations
python manage.py migrate
```

### Problème : GitHub OAuth2 ne fonctionne pas

1. **Vérifier la configuration GitHub App** :
   - Homepage URL = `http://localhost:3000` 
   - Callback URL = `http://localhost:8000/auth/complete/github/`

2. **Vérifier le fichier .env** :
   - Les clés GitHub sont correctes
   - Pas d'espaces autour des valeurs

3. **Tester les URLs** :
   ```bash
   curl http://localhost:8000/auth/login/github/
   # Doit rediriger vers GitHub
   ```

---

## 🔧 Commandes Utiles

### Django Backend

```bash
cd backend
source ../venv/bin/activate

# Migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Shell Django
python manage.py shell

# Tests
python manage.py test
```

### React Frontend

```bash
cd frontend

# Installer nouvelle dépendance
npm install package-name

# Build de production
npm run build

# Tests
npm test

# Linter
npm run lint
```

### PostgreSQL (Docker)

```bash
# Voir l'état
docker-compose ps

# Logs
docker-compose logs db

# Redémarrer
docker-compose restart db

# Arrêter
docker-compose down

# Se connecter à PostgreSQL
docker exec -it <container-name> psql -U postgres -d aitutorials
```

---

## 📁 Structure Après Installation

```
sightcall-technical-test/
├── frontend/                 # React + TypeScript + JSXStyle
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages (Login, Dashboard)  
│   │   ├── hooks/           # useAuth, etc.
│   │   ├── utils/           # API calls
│   │   └── types/           # Types TypeScript
│   ├── package.json         # Dépendances frontend
│   └── node_modules/        # Modules Node.js
├── backend/                 # Django + DRF + PostgreSQL
│   ├── config/              # Settings Django
│   ├── tutorials/           # App principale
│   └── manage.py            # CLI Django
├── venv/                    # Environnement Python
├── .env                     # Variables d'environnement
└── docker-compose.yml       # PostgreSQL
```

---

## 📖 Documentation Complémentaire

- [🏛 Architecture](ARCHITECTURE.md) - Décisions techniques
- [⚛️ Frontend](FRONTEND.md) - React + TypeScript + JSXStyle
- [📄 README](../README.md) - Vue d'ensemble du projet

---

## 🎯 Prochaines Étapes

1. **Fonctionnalités** : Upload transcriptions, génération IA
2. **Tests** : Tests unitaires React + Django
3. **Production** : Build optimisé + déploiement
4. **CI/CD** : Automatisation tests + déploiement

---

**🏆 Installation réussie ? Prêt pour le développement !** 