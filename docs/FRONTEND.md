# Frontend Architecture - React + TypeScript + JSXStyle

## 🎯 Vue d'ensemble

Frontend moderne séparé du backend avec React, TypeScript et JSXStyle pour un MVP propre et modulaire.

## 🛠 Stack Technique

- **React 18** - Framework UI moderne
- **TypeScript** - Type safety et meilleure DX
- **JSXStyle** - CSS-in-JS performant *(critère obligatoire)*
- **Fetch API** - Appels HTTP vers le backend Django

## 📁 Structure Modulaire

```
frontend/src/
├── components/         # Composants réutilisables
│   ├── Button.tsx     # Bouton stylé avec JSXStyle
│   ├── Layout.tsx     # Structure de page globale  
│   ├── Avatar.tsx     # Avatar utilisateur GitHub
│   └── index.ts       # Exports centralisés
├── pages/             # Pages principales
│   ├── LoginPage.tsx  # Page de connexion GitHub
│   ├── DashboardPage.tsx # Dashboard utilisateur
│   └── index.ts       # Exports centralisés
├── hooks/             # Custom React hooks
│   └── useAuth.ts     # Gestion d'authentification
├── utils/             # Utilitaires
│   └── api.ts         # Appels API vers Django
├── types/             # Types TypeScript
│   └── index.ts       # Interfaces User, Auth, etc.
├── App.tsx            # Composant racine
└── index.tsx          # Point d'entrée
```

## 🎨 Styling avec JSXStyle

### Exemple de composant avec JSXStyle :

```tsx
import { Block } from 'jsxstyle';

const MyComponent = () => (
  <Block
    backgroundColor="#24292e"
    color="white"
    padding="12px 24px"
    borderRadius="8px"
    fontSize="16px"
    fontWeight={600}
  >
    Contenu stylé
  </Block>
);
```

### Avantages JSXStyle :
- ✅ CSS-in-JS performant
- ✅ Type safety sur les propriétés CSS
- ✅ Pas de fichiers CSS séparés à gérer
- ✅ Styles co-localisés avec les composants

## 🔗 Communication Frontend ↔ Backend

### Configuration API
```typescript
const API_BASE_URL = 'http://localhost:8000';
```

### Endpoints utilisés :
- `GET /?format=json` - Vérifier statut d'authentification
- `GET /auth/login/github/` - Initier connexion GitHub
- `GET /auth/logout/` - Déconnexion utilisateur

### Flow d'authentification :
1. **Check auth** → Appel API au démarrage
2. **Login** → Redirection vers GitHub OAuth2
3. **Callback** → GitHub redirige vers Django
4. **Success** → Retour frontend avec utilisateur connecté

## 🚀 Développement

### Démarrage rapide :
```bash
# Backend (port 8000)
cd backend && python manage.py runserver

# Frontend (port 3000) 
cd frontend && npm start
```

### URLs locales :
- Frontend : http://localhost:3000
- Backend API : http://localhost:8000

## 🎯 Philosophie MVP

- **Zero redondance** - Pas de code dupliqué
- **Composants modulaires** - Réutilisables et testables  
- **Types stricts** - TypeScript pour la robustesse
- **Styling cohérent** - JSXStyle pour la consistance
- **API simple** - Communication JSON minimale

## 🔄 Prochaines étapes

1. Ajout des fonctionnalités AI Tutorials
2. Tests unitaires avec React Testing Library
3. Build de production optimisé
4. Déploiement frontend séparé 