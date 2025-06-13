# 🎯 Directives de Développement

## 🛠️ Règles de Code

1. **Minimalisme**
   - Écrire le moins de code possible pour atteindre l'objectif
   - Éviter les abstractions prématurées
   - Pas de sur-architecture

2. **Qualité**
   - Code simple, clair et lisible
   - Commentaires uniquement pour la logique complexe
   - Tests uniquement pour les cas critiques

3. **Cohérence**
   - Mise à jour systématique des fichiers dépendants
   - Architecture simple et compréhensible
   - Commits cohérents et explicites

## ✅ Checklist de Vérification

### Préparation
- [ ] Compréhension claire de l'objectif
- [ ] Évaluation de la nécessité
- [ ] Analyse de la réutilisation possible

### Backend (Django)
- [ ] Modèles à jour
- [ ] Serializers synchronisés
- [ ] Routes API fonctionnelles
- [ ] Permissions correctes
- [ ] Admin mis à jour

### Frontend (React)
- [ ] Composants simples et lisibles
- [ ] Pas de duplication de code
- [ ] Synchronisation API
- [ ] UX intuitive

### Vérification Finale
- [ ] Mise à jour de tous les fichiers
- [ ] Nomenclature cohérente
- [ ] Code compréhensible

## 📄 Documentation des Fonctionnalités

Chaque nouvelle fonctionnalité doit être documentée dans `docs/[slug_fonctionnalite].md` avec :

### Structure du Document
```markdown
### 📌 Fonctionnalité : [Nom]

#### 🎯 Objectif
> Description du besoin/problème

#### 🧩 Implémentation
> Étapes clés

#### 🗂 Fichiers modifiés
> Liste des fichiers impactés

#### ✅ Checklist de cohérence
- [ ] API exposée
- [ ] Sécurité
- [ ] Synchronisation
- [ ] Code nettoyé

#### 📌 Notes/Limites
> Points d'attention

#### 🔁 Évolutions futures
> Suggestions d'amélioration
```

## 🔒 Sécurité

- Authentification GitHub obligatoire
- Pas de clés API en dur dans le code
- Validation des données côté serveur
- Protection CSRF activée

## 🚀 Workflow de Développement

1. Créer une branche feature
2. Suivre la checklist
3. Documenter la fonctionnalité
4. Créer une PR avec description détaillée
5. Code review obligatoire 