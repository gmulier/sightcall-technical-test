# Choix Techniques du Projet

Ce document présente mes décisions techniques pour la mise en place du projet, ainsi que les raisons qui m'ont poussé à retenir chaque solution.

---

## 1. Authentification GitHub OAuth2

- **Option initiale envisagée** : `django-oauth-toolkit`
  - Fournie par Django, intégration native des mécanismes OAuth2.
  - Mais trop orientée “provider” OAuth2, plus complexe à configurer pour un simple client GitHub.

- **Option finalement retenue** : `social-auth-app-django`
  - Plus légère et spécialisée pour l’authentification via GitHub.
  - Mise en place rapide, configuration via `settings.py` et URLs.
  - Récupération automatique du profil utilisateur (username, email).
  - Très bonne documentation et maintenance active.

> **Pourquoi ce choix ?**
> Pour un MVP rapide, je privilégie la solution la plus simple à configurer et la plus adaptée à une utilisation « client » OAuth2, sans surcharger le projet.

---

## 2. Upload de fichiers (transcripts, images, vidéos)

- **Option initiale envisagée** : envoi de JSON brut dans le corps de la requête.
  - Simple pour le JSON, mais inadapté aux fichiers binaires (images, vidéos).

- **Option finalement retenue** : Django `FileField` + DRF `MultiPartParser`
  - Champ natif `FileField`/`ImageField` pour stocker les fichiers localement.
  - `MultiPartParser` gère automatiquement les uploads `multipart/form-data`.
  - Parfaitement supporté par React via `FormData`.

> **Pourquoi ce choix ?**
> Permet de gérer tous types de fichiers (JSON, images, vidéos) de manière fiable et sans charger intégralement le contenu en mémoire.
> Même si dans un premier temps l'objectif est de traiter les json, je pense déjà au après avec le traitement de vidéos comme celles fournies pour la démo.
---

## 3. Traitement AI / GPT

- **Option retenue** : SDK officiel `openai` (Python)
  - Simplicité d’utilisation et intégration native.
  - Appels directs à l’API OpenAI pour générer le tutoriel à partir du transcript.
  - Permet un contrôle fin du prompt et des paramètres (modèles, température, etc.).
  - Documentation rapide à prendre en main et exemples nombreux.

> **Pourquoi ce choix ?**
> Garder un accès direct et léger à l’API OpenAI, minimiser les dépendances et faciliter la maintenance.


## 4. Styling React

- **Option initiale imposée** : `jsxstyle` 

- **Option retenue** : `jsxstyle`
  - Génère des classes CSS optimisées à partir de composants React.
  - Peu de dépendances externes.

> **Pourquoi ce choix ?**
> Respecter les consignes du test tout en garantissant des composants faciles à lire et à maintenir.

---

## 5. Base de données

- **Option initiale envisagée** : SQLite (local, rapide à configurer pour un MVP).
  - Plugin natif Django facile à installer.
  - Convient pour des tests et un prototype local sans configuration préalable.

- **Option retenue** : PostgreSQL
  - Plugin natif Django facile à installer : psycopg2 ou psycopg2-binary
  - Plus à l’aise avec PostgreSQL en projet réel : meilleures performances, fiabilité et fonctionnalités avancées (JSONB, transactions).
  - En bonus : déployer une version production, j’utiliserai **Supabase** (PostgreSQL géré, authentification OAuth2 intégrée, API en temps réel) qui se combine parfaitement avec React.

> **Pourquoi ce choix ?**
> PostgreSQL offre un environnement proche de la prod, tout en restant simple à migrer vers Supabase pour une version déployée rapidement.

---

## 6. Documentation de l’API

- **Option retenue** : `drf-spectacular` + Swagger UI
  - Génération automatique d’OpenAPI v3 à partir des `Serializers` et `ViewSets`.
  - Interface Swagger interactive pour tester facilement l’API.
  - Moins de code à maintenir, documentation toujours à jour.

> **Pourquoi ce choix ?**
> Assurer une documentation fiable et actualisée, tout en facilitant les tests et la présentation du projet lors de l’entretien.

---

# Conclusion

Chaque composant technique a été sélectionné pour son rapport **simplicité / rapidité d’implémentation** et sa **cohérence avec les besoins d’un MVP**. Ces choix permettent de garantir un projet **maintenable**, **performant**, et avec une architecture la plus **simple possible**.