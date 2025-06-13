#!/bin/bash

# 🤖 AI Tutorials MVP - Installation automatique
# Frontend React + TypeScript + JSXStyle + Backend Django + PostgreSQL

set -e  # Arrêter en cas d'erreur

echo "🚀 Installation AI Tutorials MVP - Frontend/Backend séparés"
echo "=================================================="

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier Python 3.11+
if ! command -v python3.11 &> /dev/null; then
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3.11+ requis. Installez-le depuis https://python.org"
        exit 1
    fi
    PYTHON_CMD=python3
else
    PYTHON_CMD=python3.11
fi

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js requis. Installez-le depuis https://nodejs.org"
    echo "   Version recommandée : 18.x LTS ou plus récente"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm requis (normalement installé avec Node.js)"
    exit 1
fi

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker requis pour PostgreSQL. Installez-le depuis https://docker.com"
    exit 1
fi

# Afficher les versions
echo "✅ Python: $($PYTHON_CMD --version)"
echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo "✅ Docker: $(docker --version)"

echo ""
echo "🐍 Configuration du backend Django..."

# 1. Créer l'environnement virtuel Python
if [ ! -d "venv" ]; then
    echo "Création de l'environnement virtuel Python..."
    $PYTHON_CMD -m venv venv
fi

# 2. Activer l'environnement virtuel
source venv/bin/activate

# 3. Installer les dépendances Python
echo "Installation des dépendances Python..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "⚛️ Configuration du frontend React..."

# 4. Installer les dépendances frontend
cd frontend
echo "Installation des dépendances Node.js..."
npm install
cd ..

echo ""
echo "🐘 Configuration de PostgreSQL..."

# 5. Lancer PostgreSQL avec Docker
echo "Démarrage de PostgreSQL..."
docker-compose up -d

# Attendre que PostgreSQL soit prêt
echo "Attente de PostgreSQL..."
sleep 5

# 6. Migrations Django
echo "Application des migrations Django..."
cd backend
python manage.py migrate
cd ..

echo ""
echo "📝 Configuration des variables d'environnement..."

# 7. Créer le fichier .env s'il n'existe pas
if [ ! -f ".env" ]; then
    echo "Création du fichier .env..."
    cat > .env << EOF
# Base de données PostgreSQL
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/aitutorials

# Django Configuration
SECRET_KEY=django-secret-key-for-development-only-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS pour le frontend React
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# GitHub OAuth2 (À CONFIGURER MANUELLEMENT)
SOCIAL_AUTH_GITHUB_KEY=your_github_client_id_here
SOCIAL_AUTH_GITHUB_SECRET=your_github_client_secret_here
EOF
    echo "✅ Fichier .env créé avec la configuration par défaut"
else
    echo "✅ Fichier .env existe déjà"
fi

echo ""
echo "🎉 Installation terminée avec succès !"
echo "======================================"
echo ""
echo "📋 ÉTAPES FINALES REQUISES :"
echo ""
echo "1️⃣  CONFIGURER GITHUB OAUTH2 (OBLIGATOIRE) :"
echo "   • Aller sur : https://github.com/settings/developers"
echo "   • Créer une nouvelle GitHub App avec :"
echo "     - Homepage URL: http://localhost:3000"
echo "     - Authorization callback URL: http://localhost:8000/auth/complete/github/"
echo "   • Récupérer Client ID et Client Secret"
echo "   • Éditer le fichier .env :"
echo "     nano .env"
echo "   • Remplacer :"
echo "     SOCIAL_AUTH_GITHUB_KEY=your_github_client_id_here"
echo "     SOCIAL_AUTH_GITHUB_SECRET=your_github_client_secret_here"
echo ""
echo "2️⃣  LANCER LES SERVEURS :"
echo ""
echo "   Terminal 1 - Backend Django (port 8000) :"
echo "   cd backend && source ../venv/bin/activate && python manage.py runserver"
echo ""
echo "   Terminal 2 - Frontend React (port 3000) :"
echo "   cd frontend && npm start"
echo ""
echo "3️⃣  ACCÉDER À L'APPLICATION :"
echo "   • Frontend (interface utilisateur) : http://localhost:3000"
echo "   • Backend API : http://localhost:8000"
echo "   • Admin Django : http://localhost:8000/admin"
echo ""
echo "🆘 EN CAS DE PROBLÈME :"
echo "   • Vérifier Docker : docker-compose ps"
echo "   • Vérifier PostgreSQL : docker-compose logs db"
echo "   • Logs Django : Voir la console du terminal backend"
echo "   • Logs React : Voir la console du terminal frontend"
echo ""
echo "📖 Documentation complète : docs/SETUP.md"
echo ""
echo "✨ Bon développement !" 