# 🌱 Guide de Seeding des Données de Test

Ce guide explique comment créer des projets de test bilingues dans votre database Supabase.

---

## 📋 Vue d'ensemble

Le système de seeding vous permet de :
- ✅ Créer 6 projets de test professionnels bilingues (FR/EN)
- ✅ Tester l'intégration complète Supabase
- ✅ Démontrer le fonctionnement du portfolio bilingue
- ✅ Supprimer facilement toutes les données de test

---

## 🚀 Accès Rapide

### Option 1 : Via l'URL directe

Visitez : `http://localhost:5173/fr/seed-data` ou `http://localhost:5173/en/seed-data`

### Option 2 : Via l'exemple database

1. Allez sur `/fr/example` ou `/en/example`
2. Cliquez sur le lien vers "Seed Data" dans la page

---

## 🔑 Obtenir votre Access Token

Pour créer ou supprimer des projets, vous avez besoin d'un **Access Token** d'authentification.

### Étapes :

1. **Connectez-vous au Dashboard**
   ```
   http://localhost:5173/login
   ```

2. **Copiez votre Access Token**
   
   Dans la console du navigateur (F12), après connexion, exécutez :
   ```javascript
   const { data } = await supabase.auth.getSession()
   console.log(data.session.access_token)
   ```

3. **Collez le token dans la page Seed Data**
   
   Copiez le token affiché et collez-le dans le champ "Access Token" sur la page `/seed-data`

---

## 📦 Projets de Test Inclus

Le seeding crée **6 projets professionnels** avec des données complètes :

### 1. **Plateforme E-commerce Moderne** 🛒
- **Catégorie** : Web
- **Statut** : Completed
- **Technologies** : React, TypeScript, Node.js, PostgreSQL, Redis, Docker, AWS
- **Budget** : 35 000€
- Inclut : galerie d'images, témoignage client, résultats chiffrés

### 2. **Application Mobile Fitness** 📱
- **Catégorie** : Mobile
- **Statut** : Completed
- **Technologies** : React Native, TypeScript, GraphQL, TensorFlow, Firebase
- **Budget** : 48 000€
- Inclut : intégration IA, 50 000+ téléchargements

### 3. **Tableau de Bord SaaS Analytique** 📊
- **Catégorie** : Web
- **Statut** : Completed
- **Technologies** : React, TypeScript, Node.js, Kubernetes, MongoDB, Redis, D3.js
- **Budget** : 62 000€
- Inclut : traitement 10M+ événements/jour, architecture microservices

### 4. **Site Vitrine Corporate** 🏢
- **Catégorie** : Design
- **Statut** : Completed
- **Technologies** : Next.js, React, TypeScript, Strapi, Tailwind CSS
- **Budget** : 22 000€
- Inclut : SEO optimisé, score Lighthouse 95+

### 5. **Plateforme API RESTful** 🔌
- **Catégorie** : Consulting
- **Statut** : In Progress
- **Technologies** : Node.js, TypeScript, Docker, Kubernetes, PostgreSQL, Redis
- **Budget** : 75 000€
- Inclut : 5000+ req/s, 99.99% SLA

### 6. **Système de Design UI/UX** 🎨
- **Catégorie** : Design
- **Statut** : Review
- **Technologies** : React, TypeScript, Storybook, Figma, Style Dictionary
- **Budget** : 38 000€
- Inclut : accessibilité WCAG 2.1 AA, réduction 40% temps dev

---

## 🎯 Utilisation de la Page Seed Data

### Interface

La page `/seed-data` est divisée en 2 colonnes :

#### Colonne Gauche : Actions
- **Champ Access Token** : Pour s'authentifier
- **Bouton "Créer les projets de test"** : Crée les 6 projets
- **Bouton "Supprimer tous les projets"** : ⚠️ Supprime TOUS les projets
- **Liste des projets disponibles** : Preview des projets qui seront créés

#### Colonne Droite : Projets Actuels
- Affiche tous les projets existants dans la database
- Met à jour automatiquement après création/suppression
- Affiche le statut, la catégorie et la description

---

## 📝 Processus de Seeding

### Étape 1 : Vérifier la connexion

Assurez-vous que le statut indique :
```
✅ Statut de connexion: Connecté à Supabase
```

Si déconnecté, cliquez sur "Reconnecter"

### Étape 2 : Entrer l'Access Token

Collez votre token dans le champ "Access Token"

### Étape 3 : Créer les projets

Cliquez sur "Créer les projets de test"

Le système va :
1. Créer chaque projet un par un
2. Afficher le progrès dans la console
3. Afficher un toast de succès
4. Recharger automatiquement la liste

### Résultat attendu :

```
🌱 Début du seeding des projets de test...
✅ Projet créé: Plateforme E-commerce Moderne
✅ Projet créé: Application Mobile Fitness
✅ Projet créé: Tableau de Bord SaaS Analytique
✅ Projet créé: Site Vitrine Corporate
✅ Projet créé: Plateforme API RESTful
✅ Projet créé: Système de Design UI/UX

📊 Résumé du seeding:
   ✅ Succès: 6/6
   ❌ Erreurs: 0/6
```

---

## 🧪 Vérifier les Données

Une fois les projets créés, vous pouvez les voir :

### 1. Sur la page Seed Data
La colonne de droite affiche tous les projets avec leurs détails

### 2. Sur la page Projets publique
Visitez `/fr/projects` ou `/en/projects` pour voir les projets en action

### 3. Dans le Dashboard
Allez sur `/dashboard` > onglet "Projects" pour gérer les projets

### 4. Dans Supabase
Ouvrez votre projet Supabase et regardez la table KV store :
- Clé : `projects`
- Valeur : Array de tous les projets

---

## 🗑️ Supprimer les Données de Test

### Attention ! ⚠️

Le bouton "Supprimer tous les projets" va supprimer **TOUS** les projets de la database, pas seulement les projets de test.

### Procédure sécurisée :

1. Cliquez sur "Supprimer tous les projets"
2. Confirmez dans la popup de confirmation
3. Le système supprime tous les projets un par un
4. Toast de confirmation s'affiche
5. La liste se met à jour automatiquement

---

## 🔧 Personnaliser les Projets de Test

Pour modifier ou ajouter vos propres projets de test, éditez le fichier :

```
/utils/seedTestProjects.ts
```

### Structure d'un projet :

```typescript
{
  // French fields
  name_fr: "Nom du projet",
  description_fr: "Description...",
  tags_fr: ["Tag1", "Tag2"],
  duration_fr: "3 mois",
  challenges_fr: "Les défis...",
  solutions_fr: "Les solutions...",
  results_fr: "Les résultats...",
  category_fr: "web" | "mobile" | "design" | "consulting" | "other",
  
  // English fields
  name_en: "Project name",
  description_en: "Description...",
  tags_en: ["Tag1", "Tag2"],
  duration_en: "3 months",
  challenges_en: "Challenges...",
  solutions_en: "Solutions...",
  results_en: "Results...",
  category_en: "web" | "mobile" | "design" | "consulting" | "other",
  
  // Common fields
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold",
  budget: 35000,
  spent: 32500,
  startDate: "2024-01-15",
  endDate: "2024-05-20",
  imageUrl: "https://...",
  isPinned: true,
  technologies: ["React", "Node.js"],
  projectUrl: "https://...",
  githubUrl: "https://...",
  imageGallery: ["https://..."],
  testimonial: {
    text: "Super projet !",
    author: "Client Name",
    role: "CEO"
  }
}
```

---

## 🐛 Dépannage

### Erreur : "Token d'accès requis"
- Vous devez être connecté et avoir copié votre access token
- Suivez les instructions de la section "Obtenir votre Access Token"

### Erreur : "Serveur Supabase non disponible"
- Vérifiez que le serveur Supabase est démarré
- Cliquez sur "Reconnecter"
- Vérifiez les credentials dans `/utils/supabase/info.tsx`

### Erreur : "Unauthorized"
- Votre token est expiré ou invalide
- Reconnectez-vous au Dashboard
- Copiez un nouveau token

### Les projets n'apparaissent pas sur `/projects`
- Actualisez la page `/projects`
- Vérifiez que les projets sont bien dans la database
- Vérifiez la console pour les erreurs

---

## 📚 Ressources Connexes

- **Guide Database Bilingue** : `/EXEMPLE_DATABASE_BILINGUAL.md`
- **Guide Exemple** : `/README_EXAMPLE.md`
- **Quick Start** : `/QUICK_START_EXAMPLE.md`
- **Documentation principale** : `/README.md`

---

## ✅ Checklist

Avant de passer en production :

- [ ] Supprimer tous les projets de test
- [ ] Créer vos vrais projets dans le Dashboard
- [ ] Ajouter de vraies images (pas Unsplash pour la prod)
- [ ] Vérifier que tous les liens fonctionnent
- [ ] Tester l'affichage FR et EN
- [ ] Vérifier que le bilinguisme est complet
- [ ] Supprimer ou protéger la route `/seed-data` en production

---

## 💡 Conseils Pro

1. **Utilisez le seeding pour :**
   - Tester votre design avec du contenu réel
   - Démontrer le site à des clients
   - Créer des screenshots pour votre portfolio
   - Tester les performances avec plusieurs projets

2. **Images Unsplash** :
   - Les URLs d'images Unsplash sont parfaites pour le dev/test
   - En production, uploadez vos propres images
   - Utilisez un CDN pour les performances

3. **Bilinguisme** :
   - Assurez-vous que TOUS les champs sont remplis en FR et EN
   - Testez l'affichage dans les deux langues
   - Vérifiez que les traductions sont naturelles

4. **Performance** :
   - 6 projets est un bon nombre pour tester
   - Si vous avez 20+ projets, implémentez la pagination
   - Optimisez les images avec lazy loading

---

Vous êtes maintenant prêt à créer vos projets de test ! 🚀

Pour toute question : consultez la documentation ou vérifiez la console du navigateur.
