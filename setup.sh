#!/bin/bash

# 🚀 Script d'installation automatique - AI Tutorials MVP
echo "🚀 Installation automatique du projet AI Tutorials MVP"

# Vérifications des pré-requis
echo "📋 Vérification des pré-requis..."

# Vérifier Python 3.11
if ! command -v python3.11 &> /dev/null; then
    echo "❌ Python 3.11 n'est pas installé"
    echo "💡 Installation: brew install python@3.11 (macOS) ou apt install python3.11 (Ubuntu)"
    exit 1
fi
echo "✅ Python 3.11 trouvé"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    echo "💡 Installation: https://docs.docker.com/get-docker/"
    exit 1
fi
echo "✅ Docker trouvé"

# Vérifier Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi
echo "✅ Docker Compose trouvé"

# Installation
echo ""
echo "🛠️ Installation du projet..."

# 1. Créer l'environnement virtuel
echo "1️⃣ Création de l'environnement virtuel Python..."
python3.11 -m venv venv
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la création du venv"
    exit 1
fi

# 2. Activer l'environnement
echo "2️⃣ Activation de l'environnement virtuel..."
source venv/bin/activate

# 3. Installer les dépendances
echo "3️⃣ Installation des dépendances Python..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# 4. Créer le fichier d'environnement
echo "4️⃣ Configuration de l'environnement..."
if [ ! -f .env ]; then
    cat > .env << EOF
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/aitutorials
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
SOCIAL_AUTH_GITHUB_KEY=your-github-oauth-key
SOCIAL_AUTH_GITHUB_SECRET=your-github-oauth-secret
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
    echo "✅ Fichier .env créé avec la configuration par défaut"
else
    echo "⚠️ Fichier .env existe déjà, pas de modification"
fi

# 5. Lancer PostgreSQL
echo "5️⃣ Démarrage de PostgreSQL (Docker)..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du démarrage de Docker"
    exit 1
fi

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente du démarrage de PostgreSQL..."
sleep 5

# 6. Appliquer les migrations
echo "6️⃣ Application des migrations Django..."
cd backend
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors des migrations"
    exit 1
fi

# 7. Créer un utilisateur admin
echo "7️⃣ Création de l'utilisateur admin..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@test.com', 'admin123') if not User.objects.filter(username='admin').exists() else print('Admin existe déjà')" | python manage.py shell
cd ..

echo ""
echo "🎉 Installation terminée avec succès !"
echo ""
echo "🌐 Pour lancer le serveur :"
echo "   source venv/bin/activate"
echo "   cd backend"
echo "   python manage.py runserver"
echo ""
echo "📊 Accès à l'admin : http://127.0.0.1:8000/admin/"
echo "   Login: admin"
echo "   Password: admin123"
echo ""
echo "🔧 Commandes utiles :"
echo "   docker-compose ps          # Voir l'état de PostgreSQL"
echo "   docker-compose logs db     # Voir les logs PostgreSQL"
echo "   docker-compose down        # Arrêter PostgreSQL"
echo "" 