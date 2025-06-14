# Upload JSON – Explication détaillée

Avant toute chose, l’objectif est simple : permettre à un utilisateur authentifié via OAuth2 GitHub d’envoyer un fichier JSON depuis l’interface React, puis de transformer ce contenu en objets `Transcript` dans la base Postgres hébergée dans Docker.

## 1. Récupération du token CSRF (côté React)

Django protège toutes les requêtes `POST` par un jeton CSRF que l’on trouve dans le cookie `csrftoken`. Le petit utilitaire suivant extrait ce jeton :

```typescript
const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') return value;
  }
  return '';
};
```

- **Pourquoi** : sans ce jeton dans l’en-tête `X-CSRFToken`, Django renverra un **403 Forbidden**.  
- **Comment** : on boucle sur `document.cookie`, on repère la clé `csrftoken` et on renvoie sa valeur.

## 2. Envoi du fichier JSON (côté React)

Dès que l’utilisateur sélectionne un fichier, on construit un `FormData` et on déclenche la requête :

```typescript
const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/api/transcripts/', {
    method: 'POST',
    credentials: 'include',                    // Envoie les cookies de session
    headers: { 'X-CSRFToken': getCsrfToken() },// Jeton CSRF obligatoire
    body: formData
  });

  // Gérer la réponse (succès ou erreur)
};
```

- `credentials: 'include'` : garantit l’envoi des cookies de session (auth Django).  
- `X-CSRFToken` : empêche la rejection CSRF sur le serveur.  
- `FormData` : transmet le fichier brut, pas un JSON sérialisé.

## 3. Traitement du JSON (côté Django)

Le `TranscriptViewSet` DRF est configuré pour accepter un upload de fichier :

```python
class TranscriptViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser]                 # Autorise la réception de fichiers
    permission_classes = [permissions.IsAuthenticated] # Restreint aux utilisateurs connectés

    def create(self, request, *args, **kwargs):
        raw = request.FILES['file'].read()             # Récupère les octets du JSON
        data = json.loads(raw)                         # Transforme en dict Python

        serializer = self.get_serializer(data=data)    # Prépare la validation
        serializer.is_valid(raise_exception=True)      # Vérifie les champs requis
        serializer.save(user=request.user)             # Enregistre lié à l’utilisateur

        return Response(serializer.data, status=201)
```

- **MultiPartParser** : sans lui, DRF ne reconnaîtrait pas `request.FILES['file']`.  
- **is_valid()** : s’assure que le JSON contient bien tous les champs attendus par le serializer.  
- **serializer.save(user=…)** : lie le nouvel objet à l’utilisateur connecté.

## 4. Configuration CORS & CSRF

Pour que React (`localhost:3000`) et Django (`localhost:8000`) communiquent sans blocage :

```python
# settings.py
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ['content-type', 'x-csrftoken']
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']
```

- Autorise l’envoi et la réception de cookies de session entre deux domaines.  
- Permet l’en-tête `X-CSRFToken`.

## 5. Flux complet résumé

1. L’utilisateur sélectionne un fichier JSON dans le dashboard React.  
2. `getCsrfToken()` extrait le jeton CSRF depuis le cookie.  
3. `fetch()` envoie le fichier, les cookies de session et le jeton CSRF.  
4. Django vérifie la session (cookie) et le CSRF (middleware).  
5. DRF lit les octets du fichier, les convertit en dict et le passe au serializer.  
6. Le serializer vérifie chaque champ exigé par le modèle `Transcript`.  
7. Un nouvel enregistrement `Transcript` est créé en base, lié à l’utilisateur connecté.

## 6. Points d’erreur courants

- **403 Forbidden (auth)** : oubli de `credentials: 'include'`.  
- **403 Forbidden (CSRF)** : absence de `X-CSRFToken` ou configuration CORS incomplète.  
- **400 Bad Request** : JSON mal formé ou champ manquant → vérifier `serializer.is_valid()`.