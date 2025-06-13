# 🏗️ Choix d'Architecture - AI Tutorials MVP

## 🎯 Philosophie MVP Minimal

**Principe directeur :** Éviter les surcouches inutiles. Chaque composant doit apporter une valeur métier directe.

- ✅ **PostgreSQL + Django + DRF** : Stack éprouvée, cohérente
- ❌ **Pas de FastAPI** : Surcouche inutile pour un MVP simple  
- ❌ **Pas de microservices** : Complexité non justifiée
- ❌ **Pas d'ORM externe** : Django ORM suffit largement

---

## 🗄️ Choix Base de Données

### Structure Minimaliste (3 tables)

```sql
USER (6 champs métier + 7 champs Django)
├── github_id     # Clé GitHub OAuth2
├── username      # Login GitHub  
├── name          # Nom complet GitHub
├── email         # Email GitHub
├── avatar_url    # Photo profil GitHub
└── profile_url   # Lien profil GitHub

TRANSCRIPT (5 champs)
├── user_id FK    # Propriétaire
├── timestamp     # Date conversation
├── duration_in_ticks # Durée totale
└── phrases JSONB # Structure complète

TUTORIAL (4 champs)  
├── transcript_id FK # Source
├── content       # Tutoriel généré
├── created_at    # Date création
└── updated_at    # Dernière modif
```

### Justifications

**JSONB pour `phrases`** : Évite une table supplémentaire. PostgreSQL gère nativement JSON avec indexation.

**UUID comme PK** : Évite les collisions, plus sécurisé pour les API publiques.

**Relations simples** : 1 User → N Transcripts → N Tutorials. Pas de many-to-many inutiles.

---

## 👤 Modèle User Custom

### Choix : AbstractBaseUser vs AbstractUser

```python
# ❌ AbstractUser (standard Django)
class User(AbstractUser):
    # 17 champs ! first_name, last_name, password, groups, etc.
    github_id = models.CharField(...)

# ✅ AbstractBaseUser (minimal)  
class User(AbstractBaseUser):
    # 13 champs seulement (6 GitHub + 7 Django essentiels)
    github_id = models.CharField(...)
    username = models.CharField(...)
    # ...
```

### Avantages du modèle minimal

- **GitHub-first** : Mapping direct avec l'API OAuth2
- **Pas de champs inutiles** : `first_name`, `last_name`, `password` non utilisés
- **Profile complet** : `avatar_url`, `profile_url` pour l'UX
- **Compatible Django** : Admin, permissions, migrations

---

## 🔧 Choix Stack Technique

### Django REST Framework vs FastAPI

**❌ Pourquoi pas FastAPI ?**

```python
# FastAPI nécessiterait :
from fastapi import FastAPI
from sqlalchemy import create_engine  # Nouvel ORM
from alembic import command          # Nouvelles migrations  
from pydantic import BaseModel       # Nouveaux sérialiseurs

# = 3 couches supplémentaires pour le même résultat
```

**✅ Pourquoi DRF ?**

```python
# DRF avec Django existant :
from rest_framework import serializers  # Intégré
from django.db import models            # Déjà là
# = Réutilise l'infrastructure Django
```

### Comparatif MVP

| Critère | Django + DRF | FastAPI + SQLAlchemy |
|---------|--------------|---------------------|
| **Lignes de config** | ~50 lignes | ~200 lignes |
| **Nouvelles dépendances** | 0 | 4 (SQLAlchemy, Alembic, Pydantic, FastAPI) |
| **Admin interface** | ✅ Gratuit | ❌ À développer |
| **OAuth2 social** | ✅ django-social-auth | ❌ À implémenter |
| **Migrations** | ✅ Django ORM | ❌ Alembic à configurer |

**Verdict** : DRF = 5x moins de code pour la même fonctionnalité.

---

## 🔐 Authentification GitHub OAuth2

### Flow minimal

```
1. User → /auth/login/github/
2. GitHub OAuth2 → Autorisation  
3. Callback → Création automatique User
4. Session Django → API utilisable
```

### Avantages

- **Zero-config utilisateur** : Pas d'inscription manuelle
- **Données complètes** : Profile GitHub récupéré automatiquement  
- **Sécurité** : Délégation à GitHub
- **UX fluide** : 1 clic = compte créé

---

## 📊 Endpoints API Minimaux

### RESTful simple

```
POST /api/transcripts/              # Upload JSON
POST /api/transcripts/{id}/generate/ # Génération tutoriel  
GET  /api/tutorials/                # Liste utilisateur
GET  /api/tutorials/{id}/           # Détail
PUT  /api/tutorials/{id}/           # Édition
```

### Pas de sur-architecture

- **Pas de versioning** : /v1/, /v2/ inutiles pour un MVP
- **Pas de GraphQL** : REST suffit pour 5 endpoints
- **Pas de CQRS** : Read/Write simples
- **Pas de microservices** : 1 service = 1 équipe

---

## 🚀 Déploiement Simplifié

### Infrastructure minimal

```yaml
# docker-compose.yml (16 lignes)
services:
  db:
    image: postgres:15
  # C'est tout !
```

### Pas de Kubernetes

- **Pas de clusters** : 1 container Django + 1 PostgreSQL
- **Pas d'orchestration** : docker-compose suffit
- **Pas de load balancer** : Pas de trafic massif prévu
- **Pas de monitoring complexe** : Logs Django suffisent

---

## 📈 Évolutivité Future

### Points d'extension

1. **Frontend React** : API REST déjà prête
2. **Cache Redis** : Ajout transparent avec django-cache
3. **File upload S3** : django-storages
4. **Background tasks** : Celery si nécessaire

### Principes de migration

- **Pas de refactoring majeur** : Stack Django évolutive
- **API stable** : Endpoints REST standard  
- **Base solide** : PostgreSQL + Django = production-ready

---

## 🎯 Résumé des Choix

| Composant | Choix | Alternative rejetée | Raison |
|-----------|-------|-------------------|---------|
| **Backend** | Django + DRF | FastAPI | Surcouche inutile |
| **Base** | PostgreSQL | MongoDB | Relations simples |
| **User** | AbstractBaseUser | AbstractUser | Trop de champs |
| **Auth** | GitHub OAuth2 | Username/Password | UX + Sécurité |
| **API** | REST | GraphQL | MVP simple |
| **Deploy** | Docker Compose | Kubernetes | Pas de scale nécessaire |

**Principe MVP** : Choisir la solution la plus simple qui fonctionne, puis itérer si nécessaire. 