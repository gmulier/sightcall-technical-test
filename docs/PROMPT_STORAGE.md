# Gestion et Stockage des Prompts pour l’API OpenAI

Cette documentation décrit les deux méthodes que j'ai envisagée pour stocker et gérer les prompts utilisés lors des appels à l’API OpenAI dans un projet Django REST Framework.

---

## 1. Stockage dans `settings.py`

### Description

Définir les prompts dans les variables de configuration de Django afin de les centraliser et de pouvoir les modifier sans toucher au code métier.

### Mise en place

1. Dans `settings.py`, ajouter :

   ```python
   OPENAI_SYSTEM_PROMPT = (
       "Tu es un assistant qui génère des tutoriels clairs et concis "
       "à partir d’une transcription de conversation."
   )
   OPENAI_USER_PROMPT_TEMPLATE = (
       "Génère un tutoriel pour cette transcription :\n\n{text}"
   )
   ```
2. Dans le client OpenAI (`openai_client.py`) :

   ```python
   from django.conf import settings

   def generate_tutorial_from_transcript(text: str) -> str:
       messages = [
           {"role": "system", "content": settings.OPENAI_SYSTEM_PROMPT},
           {"role": "user",   "content": settings.OPENAI_USER_PROMPT_TEMPLATE.format(text=text)}
       ]
       response = openai.ChatCompletion.create(..., messages=messages)
       return response.choices[0].message.content.strip()
   ```

### Avantages

* Simplicité de lecture et de modification
* Versionnement Git de la configuration

### Références

* [Django Settings](https://docs.djangoproject.com/en/stable/topics/settings/)

---

## 2. Stockage en base de données

### Description

Utiliser un modèle Django `PromptTemplate` pour stocker les prompts et pouvoir les éditer via l’interface d’administration ou une API dédiée.

### Mise en place

1. Définir un modèle `PromptTemplate` :

   ```python
   from django.db import models

   class PromptTemplate(models.Model):
       name    = models.CharField(max_length=100, unique=True)
       role    = models.CharField(max_length=10, choices=[('system','system'), ('user','user')])
       content = models.TextField()
   ```
2. Charger les prompts dans `openai_client.py` :

   ```python
   from .models import PromptTemplate

   def generate_tutorial_from_transcript(text: str) -> str:
       sys_tmpl  = PromptTemplate.objects.get(name='system_tutorial')
       user_tmpl = PromptTemplate.objects.get(name='user_tutorial')
       messages = [
           {"role": sys_tmpl.role,    "content": sys_tmpl.content},
           {"role": user_tmpl.role,   "content": user_tmpl.content.format(text=text)}
       ]
       response = openai.ChatCompletion.create(..., messages=messages)
       return response.choices[0].message.content.strip()
   ```

### Avantages

* Édition en production via Django Admin
* Flexibilité maximale sans redéploiement

### Références

* [Django Models](https://docs.djangoproject.com/en/stable/topics/db/models/)