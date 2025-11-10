# 🎯 Portfolio + CRM - Maxence

Portfolio professionnel bilingue (FR/EN) avec dashboard CRM intégré.

---

## 🚀 Quick Start

```bash
# Installation
npm install

# Dev local
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

---

## 📁 Structure

```
/components/
  /pages/          → Pages principales (HomePage, ProjectsPage, etc.)
  /dashboard/      → Dashboard CRM
  /layout/         → Navigation, Footer
  /routing/        → Gestion des routes bilingues
  
/utils/
  /i18n/           → Traductions FR/EN
  /supabase/       → Client Supabase
  
/supabase/functions/server/
  index.tsx        → Backend Hono (leads, projets, emails, etc.)
```

---

## 🌐 Routing bilingue

Les routes `/fr` et `/en` fonctionnent nativement :

```
maxence.design/fr           → Page d'accueil FR
maxence.design/en           → Page d'accueil EN
maxence.design/fr/projects  → Projets FR
maxence.design/en/about     → À propos EN
```

**Pas de config serveur nécessaire** - Figma Make gère les rewrites automatiquement.

---

## 🗄️ Base de données

### Tables Supabase

Toutes les tables utilisent le préfixe `kv_store_` :

- `kv_store_04919ac5` : Table KV générale
- Données stockées : leads, clients, projets, factures, blog posts, etc.

### Ajouter des données de test

1. Va sur `/seed-data` dans l'app
2. Click sur "Créer les données de test"
3. ✅ Des projets, case studies et ressources bilingues seront créés

---

## 🔐 Dashboard CRM

### Connexion

- URL : `/dashboard`
- Login : `admin@example.com`
- Mot de passe : Défini lors de la première utilisation

### Features

- 📊 Analytics & KPIs
- 👥 Gestion des leads
- 💼 Gestion des clients
- 📁 Gestion des projets
- 💰 Devis & factures
- 📧 Newsletter
- ✍️ Blog management
- 📖 Case studies

---

## 🎨 Design System

### Palette de couleurs

```css
--color-dark: #0C0C0C;      /* Fond principal */
--color-mint: #00FFC2;      /* Accent principal */
--color-light: #F4F4F4;     /* Texte clair */
```

### Style

- Design minimaliste type Linear/Vercel
- Animations Motion (Framer Motion)
- Composants shadcn/ui
- Tailwind CSS v4

---

## 📚 Docs importantes

- `/ROUTING_FONCTIONNE_DEJA.md` → Explication du routing bilingue
- `/ARCHITECTURE_SEED_DATA.md` → Architecture des données
- `/README.md` → README complet

---

## 🐛 Debugging

### Vérifier la connexion Supabase

```bash
# Ouvre la console dans l'app
# Vérifie les logs du serveur
```

### Routes 404

Si tu as des 404 :
1. Vérifie que le build est à jour (`npm run build`)
2. Check les logs de la console
3. Vérifie que tu es en production (pas en dev local)

### Données manquantes

1. Va sur `/seed-data`
2. Crée les données de test
3. Actualise la page

---

## 🚀 Déploiement

L'app est déployée automatiquement sur Figma Make.

Pour déployer ailleurs :
1. Push sur GitHub
2. Connecte à Vercel/Netlify
3. Ajoute les secrets Supabase dans l'environnement

---

## 📞 Support

Questions ? Check :
- `/COMMENCER_ICI.md`
- `/INDEX_DOCUMENTATION.md`
- La console du navigateur pour les erreurs

---

**Bon développement ! 🎉**
