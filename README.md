# 🤖 AI Tutorials MVP - Sightcall Technical Test

**Application Django pour générer des tutoriels IA à partir de transcriptions JSON.**

## 🚀 Quick Start

```bash
# 1. Cloner le projet
git clone https://github.com/username/sightcall-technical-test.git
cd sightcall-technical-test

# 2. Setup automatique
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Lancer PostgreSQL + Django
docker-compose up -d
cd backend
python manage.py migrate
python manage.py runserver
```

**🌐 Accès :** http://127.0.0.1:8000/

## 📚 Documentation Complète

👉 **[Guide d'Installation Détaillé](docs/SETUP.md)**  
🏗️ **[Choix d'Architecture](docs/ARCHITECTURE.md)**

## 🎯 Fonctionnalités

- ✅ **Authentification GitHub OAuth**
- ✅ **Upload de transcriptions JSON**
- ✅ **Génération de tutoriels via OpenAI GPT**
- ✅ **Édition de tutoriels**
- ✅ **API REST avec Django REST Framework**
- ✅ **Interface Web moderne**

## 🛠️ Stack Technique

- **Backend :** Django 4.2.7 + Django REST Framework
- **Base de données :** PostgreSQL 15 (Docker)
- **Authentification :** GitHub OAuth (social-auth-app-django)
- **IA :** OpenAI GPT API
- **Frontend :** React + TypeScript (à venir)
- **Infrastructure :** Docker Compose

> **Pourquoi ces choix ?** Voir [Choix d'Architecture](docs/ARCHITECTURE.md)

## 📁 Structure

```
sightcall-technical-test/
├── backend/               # Code Django
│   ├── config/           # Configuration (ex-aitutorials)
│   ├── apps/tutorials/   # App des tutoriels IA
│   └── manage.py         # Commandes Django
├── docs/                 # Documentation
├── docker-compose.yml    # PostgreSQL
├── requirements.txt      # Dépendances Python
└── .env                 # Configuration d'environnement
```

## 🔧 Développement

```bash
# Activer l'environnement
source venv/bin/activate

# Lancer PostgreSQL
docker-compose up -d

# Aller dans le backend
cd backend

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

## 📊 Base de données

**Admin Django :** http://127.0.0.1:8000/admin/

```bash
# Voir les tables
docker exec sightcall-technical-test-db-1 psql -U postgres -d aitutorials -c "\dt"
```

## 🐛 Support

En cas de problème :
1. Vérifier les [pré-requis](docs/SETUP.md#📋-pré-requis)
2. Consulter la [section dépannage](docs/SETUP.md#🚨-dépannage)
3. Vérifier que Docker tourne : `docker-compose ps`

---

**💡 Ce projet fonctionne sur macOS, Linux et Windows !**