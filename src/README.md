# 🎯 Portfolio + CRM Freelance

Portfolio professionnel bilingue (FR/EN) avec dashboard CRM complet, développé avec React, Tailwind CSS, shadcn/ui, et Supabase.

---

## ⚡ Quick Start

```bash
# Installation
npm install

# Dev local
npm run dev

# Build production
npm run build
```

**URL locale :** `http://localhost:5173/#/fr` ou `http://localhost:5173/#/en`

---

## 🚨 **URGENT - Déployer le serveur Supabase**

### ❌ Problème actuel

Les routes `/clients` retournent **HTTP 404** car le serveur Supabase déployé utilise une **ancienne version du code**.

### ✅ Solution

**Vous n'avez PAS de CLI Supabase ?**  
👉 **Ouvrez ce fichier dans votre navigateur :** [`DEPLOIEMENT_WEB.html`](./DEPLOIEMENT_WEB.html)

Ce guide vous explique comment **copier-coller le code** via l'interface web de Supabase (sans CLI).

**Vous avez la CLI Supabase ?**
```bash
supabase functions deploy make-server-04919ac5
```

### 🔍 Vérification

Après déploiement, testez cette URL :
```
https://VOTRE_PROJECT_ID.supabase.co/functions/v1/make-server-04919ac5/health
```

Vous devriez voir :
```json
{
  "success": true,
  "message": "Server is running - CONSOLIDATED VERSION",
  "version": "consolidated-v1"
}
```

Si vous voyez `"version": "consolidated-v1"`, le déploiement a réussi ! ✅

---

## 🌐 Routing Bilingue

L'application utilise **HashRouter** pour des routes préfixées par langue :

```
maxence.design/#/fr              → Page d'accueil française
maxence.design/#/en              → English homepage
maxence.design/#/fr/projects     → Projets en français
maxence.design/#/en/about        → About page in English
maxence.design/#/dashboard       → Dashboard CRM
```

### Pourquoi HashRouter ?

- ✅ Fonctionne TOUJOURS, même après refresh (F5)
- ✅ Pas besoin de config serveur
- ✅ Compatible avec tous les hébergeurs
- ⚠️ URLs contiennent un `#` : `/#/fr` au lieu de `/fr`

---

## 📁 Structure du Projet

```
/components/
  /pages/          → Pages principales (HomePage, ProjectsPage, etc.)
  /dashboard/      → Dashboard CRM complet
  /layout/         → Navigation, Footer, Breadcrumbs
  /routing/        → Gestion du routing bilingue
  /blog/           → Composants blog
  /forms/          → Formulaires avec validation
  /ui/             → Composants shadcn/ui
  
/utils/
  /i18n/           → Traductions FR/EN complètes
  /supabase/       → Client Supabase
  /routing/        → Helpers de routing
  /seo/            → SEO et sitemap
  
/supabase/functions/server/
  index.tsx        → Backend Hono (100+ routes API)
  kv_store.tsx     → Abstraction KV pour Supabase
  
/styles/
  globals.css      → Design system (Tailwind v4)
```

---

## 🗄️ Base de Données

### Ajouter des Données de Test

**Via l'interface :**
1. Allez sur `/seed-data` dans l'app
2. Cliquez sur "Créer les données de test"
3. ✅ Projets, case studies et ressources créés

**Via la console (F12) :**
```javascript
await seedTestProjects()        // 6 projets
await initCaseStudies()         // 3 case studies
await seedRealResources()       // 5 ressources pro
await seedTestimonials()        // 5 témoignages
await seedFAQ()                 // 37 questions FAQ
```

---

## 🔐 Dashboard CRM

### Accès

- **URL :** `/#/dashboard`
- **Login par défaut :** `contact@maxence.design`
- **Mot de passe :** `vbz657D9`

### Features

- 📊 **Analytics & KPIs** - Métriques et graphiques interactifs
- 👥 **Leads** - Gestion des prospects avec statuts
- 💼 **Clients** - Conversion leads → clients
- 📁 **Projets** - Portfolio public/privé multilingue
- 💰 **Devis & Factures** - Générateur PDF avec envoi email
- ✍️ **Blog** - Éditeur riche multilingue
- 📖 **Case Studies** - Études de cas détaillées
- 📚 **Ressources** - Guides téléchargeables (gated content)
- 📧 **Newsletter** - Campagnes et templates

---

## 🎨 Design System

### Palette de Couleurs

```css
--color-dark: #0C0C0C;      /* Fond principal */
--color-mint: #00FFC2;      /* Accent principal */
--color-light: #F4F4F4;     /* Texte clair */
```

### Style

- **Inspiration :** Linear / Vercel
- **Minimaliste** avec beaucoup d'espace
- **Animations :** Motion (Framer Motion)
- **Composants :** shadcn/ui (40+ composants)

---

## 🌍 Traductions

### Fichiers

- `/utils/i18n/translations/fr.ts` - Français
- `/utils/i18n/translations/en.ts` - Anglais

### Utilisation

```typescript
import { useTranslation } from './utils/i18n/useTranslation';

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return <h1>{t('home.hero.title')}</h1>;
}
```

---

## 🧪 Debug

### Console Commands (F12)

```javascript
// Backend
testServerConnection()      // Test connexion serveur

// Données
await seedTestProjects()    // Créer 6 projets
await initCaseStudies()     // Créer 3 case studies
await seedRealResources()   // Créer 5 ressources

// Database
testDatabase()              // Test connexion DB
```

---

## 🐛 Problèmes Courants

### ❌ Erreur 404 sur `/clients`

**Solution :** Le serveur doit être redéployé.  
👉 Ouvrez [`DEPLOIEMENT_WEB.html`](./DEPLOIEMENT_WEB.html)

### ❌ Aucun projet affiché

**Solution :** Allez sur `/seed-data` et créez les données de test.

### ❌ Routes 404 au refresh

**Solution :** Vérifiez que vous utilisez bien HashRouter avec le `#` dans l'URL.

---

## 📚 Documentation

### Architecture

```
┌─────────────────┐
│   React App     │ ← Frontend (Vite + React)
│   (Browser)     │
└────────┬────────┘
         │ HTTPS
┌────────▼────────┐
│  Edge Function  │ ← Backend (Hono server)
│  (Supabase)     │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │ ← Database (table KV)
│   (Supabase)    │
└─────────────────┘
```

### Routes API Principales

```
POST   /auth/init-admin           → Créer admin initial
POST   /auth/login                → Login dashboard
GET    /leads                     → Liste des leads
POST   /leads                     → Créer lead
GET    /clients                   → Liste clients
GET    /projects                  → Liste projets publics
GET    /blog/posts                → Liste articles blog
POST   /newsletter/subscribe      → Inscription newsletter
```

100+ routes disponibles dans `/supabase/functions/server/index.tsx`

---

## 🆘 Support

**Erreur 404 sur /clients ?**  
👉 [`DEPLOIEMENT_WEB.html`](./DEPLOIEMENT_WEB.html) - Guide de déploiement sans CLI

**Autres questions ?**  
Ouvrez la console (F12) et utilisez les commandes de debug.

---

<div align="center">

**Fait avec ❤️ par Maxence**

[Site Live](https://maxence.design) · [Dashboard](https://maxence.design/#/dashboard)

</div>
