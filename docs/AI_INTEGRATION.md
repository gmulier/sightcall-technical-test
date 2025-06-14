# Intégration de l’API OpenAI (v1) dans Django REST Framework

Ce guide décrit, étape par étape, comment utiliser la nouvelle interface v1 du SDK OpenAI pour générer des tutoriels à partir de transcriptions dans un backend Django.

---

## 1. Prérequis

- Compte OpenAI avec une clé d’API valide (format v1).
- Python 3.8+ et `openai` >= 1.0.0 installé.
- Projet Django avec Django REST Framework configuré.

---

## 2. Installation du SDK OpenAI v1

```bash
pip install --upgrade openai
```

---

## 3. Configuration de la clé secrète

1. **Stockez** votre clé dans un fichier `.env` à la racine du projet :

   ```ini
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Chargez** la variable dans `settings.py` :

   ```python
   import os
   from pathlib import Path
   from dotenv import load_dotenv

   load_dotenv(Path(__file__).resolve().parent.parent / '.env')
   OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
   ```

---

## 4. Création du client OpenAI v1

Dans `backend/tutorials/openai_client.py`, instanciez le client v1 :

```python
from openai import OpenAI
from django.conf import settings

# Instanciation du client v1 avec la clé depuis settings
client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_tutorial_from_transcript(text: str) -> str:
    """
    Appelle OpenAI v1 Responses API pour générer un tutoriel
    à partir d’un texte de transcription.
    """
    # Préparez les prompts système et utilisateur
    messages = [
        {"role": "system",
         "content": settings.OPENAI_SYSTEM_PROMPT},
        {"role": "user",
         "content": settings.OPENAI_USER_PROMPT_TEMPLATE.format(text=text)},
    ]

    # Appel à la Responses API
    response = client.responses.create(
        model="gpt-4.1",
        input=messages
    )

    # Le texte généré se trouve dans response.output_text
    return response.output_text.strip()
```

---

## 5. Gestion des exceptions

Adaptez la capture d’erreurs :

```python
from openai.error import OpenAIError

def generate_tutorial_from_transcript(text: str) -> str:
    ...
    try:
        response = client.responses.create(...)
        return response.output_text.strip()
    except OpenAIError as e:
        # Log et renvoi d’une erreur adaptée
        raise RuntimeError(f"OpenAI API error: {e}")
```

---

## 6. Mise à jour du ViewSet DRF

Dans `views.py`, modifiez l’action `generate` pour utiliser la nouvelle fonction :

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Tutorial
from .serializers import TutorialSerializer
from .openai_client import generate_tutorial_from_transcript

class TranscriptViewSet(viewsets.ModelViewSet):
    ...
    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        transcript = self.get_object()
        raw_text = "\n".join(p["display"] for p in transcript.phrases)

        try:
            tutorial_text = generate_tutorial_from_transcript(raw_text)
            tutorial = Tutorial.objects.create(
                transcript=transcript, content=tutorial_text
            )
            serializer = TutorialSerializer(tutorial)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )
```

---

## 7. Configuration des prompts

Dans `settings.py`, définissez :

```python
OPENAI_SYSTEM_PROMPT = (
    "You are an expert instructional designer specializing in creating professional, concise tutorials "
    "from conversation transcripts. Each tutorial must include a title, introduction, numbered steps, examples, and a summary."
)

OPENAI_USER_PROMPT_TEMPLATE = (
    "Here is the raw transcript, each line is one phrase:\n\n{text}\n\n"
    "Generate a professional tutorial following the system instructions. Do not include emojis."
)
```

---

## 8. Références officielles

- Documentation OpenAI Python SDK v1 :  
  https://github.com/openai/openai-python  
- Responses API Reference :  
  https://platform.openai.com/docs/api-reference/responses  
