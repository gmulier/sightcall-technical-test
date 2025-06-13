# 🚨 Guide de Résolution des Problèmes - AI Tutorials MVP

---

## Problème original

Dans notre architecture actuelle, le front React tournant sur `http://localhost:3000` et le back Django REST sur `http://localhost:8000` ne partageaient plus correctement la session OAuth2 GitHub. Lorsqu’un utilisateur cliquait sur **Login with GitHub** dans React, il était redirigé vers Django qui créait bien la session et posait le cookie sur le domaine `:8000`, puis renvoyait vers React sans indication claire. Comme React était déjà monté, il n’avait aucun moyen de savoir qu’une nouvelle session venait d’être établie, et ses appels `fetch(..., credentials: 'include')` n’envoyaient pas les cookies à cause de la politique `SameSite=Lax` par défaut.

---

## Solution temporaire (quick & dirty)

Pour débloquer rapidement le flow en développement, j’ai mis en place trois ajustements principaux :

1. J’ai activé `CORS_ALLOW_CREDENTIALS = True` dans Django et ajouté `credentials: 'include'` à tous mes appels `fetch` pour autoriser l’envoi des cookies cross-origin.  
2. J’ai forcé `SESSION_COOKIE_SAMESITE = None` et `CSRF_COOKIE_SAMESITE = None`, afin de lever la restriction `SameSite=Lax` qui bloquait les cookies lorsque React et Django étaient sur des domaines différents.  
3. J’ai détourné la redirection OAuth2 en configurant `SOCIAL_AUTH_LOGIN_REDIRECT_URL = 'http://localhost:3000?auth=success'`. Dans React, un hook `useEffect` détectait la présence de `?auth=success` et relançait manuellement un appel à `/api/auth/status/` pour rafraîchir l’état d’authentification.

Cette combinaison a permis de restaurer le login sans déplacer tout le front dans Django, mais elle reste imparfaite.

---

## Pourquoi ce patch n’était pas propre

Ce hack reposait sur un **flag d’URL artificiel** plutôt que sur un vrai point de synchronisation avec l’API. En pratique, l’URL devenait vite “sale” et on pouvait se retrouver avec `?auth=success` sans disposer d’une session valide. Par ailleurs, la logique d’authentification était dispersée entre plusieurs routes React, ce qui rendait le code plus difficile à tester, à maintenir et à adapter pour d’autres providers OAuth ou micro-services.

---

## Solution propre et robuste

La version la plus simple et maintenable consiste à procéder de la manière suivante :

1. **Conserver les réglages indispensables**  
   - Activer `CORS_ALLOW_CREDENTIALS = True` et systématiser l’usage de `credentials: 'include'`.  
   - Passer `SESSION_COOKIE_SAMESITE = None` (et en production, définir `SESSION_COOKIE_SECURE = True`).  

2. **Remplacer le hack `?auth=success` par une route de callback dédiée**  
   Après le login GitHub, Django doit rediriger vers `http://localhost:3000/auth/callback` au lieu d’ajouter un paramètre dans l’URL principale.  

3. **Créer un endpoint `/api/auth/status/` dans Django**  
   Cet endpoint renvoie un JSON `{ authenticated: true, user: { … } }` si la session est valide, ou une réponse 401 sinon. Il constitue la “source de vérité” pour l’état de connexion.  

4. **Implémenter le flow dans React**  
   - Définir une route `<Route path="/auth/callback" element={<AuthCallback />} />`.  
   - Développer un composant **AuthCallback** qui, au montage, appelle `/api/auth/status/` avec `credentials: 'include'` et redirige vers la page d’accueil ou la page de login selon la réponse.  
   - Centraliser cet appel dans un hook `useAuthStatus` pour mettre à jour l’état global de l’utilisateur.

Avec cette approche, l’URL `/auth/callback` reflète exactement le déroulé OAuth, la vérification de l’authentification repose uniquement sur l’API, et le code reste clair, testable et facilement extensible pour de futures évolutions ou la mise en production.  