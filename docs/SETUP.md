# 🚀 Setup Guide - AI Tutorials MVP

Ce guide permet à **n'importe qui** de lancer le projet sur sa machine en quelques minutes.

## 📋 Pré-requis

### 1. **Python 3.11**
```bash
# Vérifier la version
python3.11 --version
# Doit afficher: Python 3.11.x

# Installation sur macOS (via Homebrew)
brew install python@3.11

# Installation sur Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3.11-venv

# Installation sur Windows
# Télécharger depuis https://www.python.org/downloads/
```

### 2. **Docker & Docker Compose**
```bash
# Vérifier Docker
docker --version
docker-compose --version

# Installation sur macOS
brew install --cask docker

# Installation sur Windows/Linux
# Suivre: https://docs.docker.com/get-docker/
```

### 3. **Git**
```bash
git --version
```

## 🛠️ Installation Rapide

### 1. **Cloner le projet**
```bash
git clone https://github.com/username/sightcall-technical-test.git
cd sightcall-technical-test
```

### 2. **Créer l'environnement virtuel Python**
```bash
python3.11 -m venv venv
source venv/bin/activate  # Linux/macOS
# OU
venv\Scripts\activate     # Windows
```

### 3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

### 4. **Configurer l'environnement**
```bash
# Créer le fichier de configuration
cat > .env << EOF
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/aitutorials
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
SOCIAL_AUTH_GITHUB_KEY=your-github-oauth-key
SOCIAL_AUTH_GITHUB_SECRET=your-github-oauth-secret
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
```

### 5. **Lancer PostgreSQL (Docker)**
```bash
docker-compose up -d
```

### 6. **Appliquer les migrations**
```bash
cd backend
python manage.py migrate
```

### 7. **Créer un utilisateur admin**
```bash
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@test.com', 'admin123')" | python manage.py shell
```

### 8. **Lancer le serveur**
```bash
python manage.py runserver
```

## ✅ Vérification

### 1. **API Django**
- 🌐 **URL :** http://127.0.0.1:8000/
- 📊 **Admin :** http://127.0.0.1:8000/admin/
  - Login : `admin`
  - Password : `admin123`

### 2. **Base de données PostgreSQL**
```bash
# Vérifier que PostgreSQL tourne
docker-compose ps

# Voir les tables créées
docker exec sightcall-technical-test-db-1 psql -U postgres -d aitutorials -c "\dt"

# Voir l'utilisateur admin
docker exec sightcall-technical-test-db-1 psql -U postgres -d aitutorials -c "SELECT username, email FROM auth_user;"
```

## 🔧 Configuration

### **Variables d'environnement (.env)**
```env
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/aitutorials
```

### **PostgreSQL (Docker)**
- **Host :** 127.0.0.1
- **Port :** 5433 (externe) → 5432 (interne)
- **Database :** aitutorials
- **User :** postgres
- **Password :** postgres

## 🚨 Dépannage

### **Problème : Port 5432 déjà utilisé**
```bash
# Changer le port dans docker-compose.yml
ports:
  - "5434:5432"  # Au lieu de 5433

# Mettre à jour .env
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5434/aitutorials
```

### **Problème : Permission denied sur Docker**
```bash
# Linux - ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
# Puis redémarrer la session
```

### **Problème : python3.11 non trouvé**
```bash
# Utiliser python3 ou python si 3.11 est la version par défaut
python --version  # Vérifier que c'est >= 3.11
```

### **Problème : Migrations échouent**
```bash
# Vérifier que PostgreSQL tourne
docker-compose ps

# Recréer la base si nécessaire
docker-compose down
docker-compose up -d
python manage.py migrate
```

## 📁 Structure du Projet

```
sightcall-technical-test/
├── backend/             # Code Django
│   ├── config/         # Configuration Django (ex-aitutorials)
│   │   ├── settings.py # Paramètres du projet
│   │   └── urls.py    # Routing principal
│   ├── apps/          # Applications Django
│   │   └── tutorials/ # App des tutoriels IA
│   └── manage.py      # Commandes Django
├── venv/              # Environnement virtuel
├── docker-compose.yml # PostgreSQL
├── requirements.txt   # Dépendances Python
├── .env              # Variables d'environnement
└── docs/             # Documentation
```

## 🎯 Commandes Utiles

```bash
# Lancer le projet complet
docker-compose up -d && cd backend && python manage.py runserver

# Arrêter PostgreSQL
docker-compose down

# Voir les logs PostgreSQL
docker-compose logs db

# Reset complet de la base
docker-compose down -v  # Supprime les données !
docker-compose up -d
cd backend && python manage.py migrate

# Créer des migrations après modification des models
cd backend
python manage.py makemigrations
python manage.py migrate
```

## 🔄 Workflow de Développement

1. **Toujours activer l'environnement virtuel** : `source venv/bin/activate`
2. **PostgreSQL doit tourner** : `docker-compose up -d`
3. **Appliquer les nouvelles migrations** : `python manage.py migrate`
4. **Lancer Django** : `python manage.py runserver`

---

## 📧 Support

En cas de problème, vérifier :
1. ✅ Python 3.11 installé
2. ✅ Docker en cours d'exécution
3. ✅ Port 5433 libre
4. ✅ Variables d'environnement dans `.env`

**Le projet doit fonctionner identiquement sur macOS, Linux et Windows !** 🚀 