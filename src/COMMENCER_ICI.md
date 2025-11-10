# 👋 COMMENCER ICI

**Bienvenue dans ton projet Portfolio + CRM !**

Ce fichier te guide étape par étape pour démarrer.

---

## 🎯 Qu'est-ce que c'est ?

Un **portfolio professionnel bilingue** (FR/EN) avec un **dashboard CRM complet** pour gérer ton activité freelance.

### Features principales :
- ✅ Site vitrine multilingue (FR/EN)
- ✅ Dashboard CRM pour leads, clients, projets, factures
- ✅ Blog intégré avec éditeur riche
- ✅ Système de réservation avec calendrier
- ✅ Analytics et KPIs
- ✅ Newsletter avec campagnes
- ✅ Ressources téléchargeables

---

## ⚡ Démarrage Rapide (5 minutes)

### 1. Installe les dépendances

```bash
npm install
```

### 2. Lance le serveur de développement

```bash
npm run dev
```

**URL locale :** `http://localhost:5173/#/fr`

### 3. Explore l'application

- `http://localhost:5173/#/fr` - Homepage française
- `http://localhost:5173/#/en` - English homepage
- `http://localhost:5173/#/dashboard` - Dashboard CRM

---

## 📝 Première Configuration

### Créer des Données de Test

L'application est vide au départ. Ajoute des données de test :

**Option 1 : Via l'interface**
1. Va sur `http://localhost:5173/#/seed-data`
2. Click sur "Créer les données de test"
3. ✅ 6 projets + 3 case studies + 5 ressources créés

**Option 2 : Via la console**
```javascript
// Ouvre la console du navigateur (F12)
await seedTestProjects()        // 6 projets
await initCaseStudies()         // 3 case studies
await seedRealResources()       // 5 ressources
await seedFAQ()                 // 37 questions FAQ
await seedTestimonials()        // 5 témoignages
```

### Accéder au Dashboard

1. Va sur `http://localhost:5173/#/dashboard`
2. Login : `admin@example.com`
3. Mot de passe : À définir lors de la première connexion

### ⚠️ Note sur les URLs

Les URLs utilisent un `#` (ex: `/#/fr`) car **HashRouter** est activé. C'est normal !

**Pourquoi ?** Figma Make ne permet pas de configurer le serveur. HashRouter garantit que tout fonctionne toujours, même après un refresh (F5).

[Lire l'explication complète →](./POURQUOI_HASH_ROUTER.md)

---

## 📁 Structure du Projet

```
/
├── components/
│   ├── pages/          → Pages (HomePage, ProjectsPage, etc.)
│   ├── dashboard/      → Dashboard CRM
│   ├── layout/         → Navigation, Footer
│   ├── ui/             → Composants shadcn/ui
│   └── routing/        → Gestion routing bilingue
│
├── utils/
│   ├── i18n/           → Traductions FR/EN
│   ├── supabase/       → Client Supabase
│   └── routing/        → Helpers routing
│
├── supabase/functions/server/
│   └── index.tsx       → Backend API (100+ routes)
│
├── styles/
│   └── globals.css     → Design system
│
└── README.md           → Documentation complète
```

---

## 🎨 Personnalisation

### Changer les Couleurs

Ouvre `/styles/globals.css` et modifie :

```css
--color-dark: #0C0C0C;      /* Ton noir */
--color-mint: #00FFC2;      /* Ton accent */
--color-light: #F4F4F4;     /* Ton blanc */
```

### Modifier les Traductions

1. Ouvre `/utils/i18n/translations/fr.ts` pour le français
2. Ouvre `/utils/i18n/translations/en.ts` pour l'anglais
3. Modifie les textes comme tu veux

### Ajouter des Projets

**Via le Dashboard :**
1. Va sur `/dashboard`
2. Connecte-toi
3. Onglet "Projets"
4. Click sur "Nouveau projet"

**Via la console :**
```javascript
await dataService.createProject({
  title: { fr: "Mon projet", en: "My project" },
  description: { fr: "Description", en: "Description" },
  // ...
})
```

---

## 🚀 Déploiement

### Backend (Supabase)

```bash
# Installer Supabase CLI
npm i supabase -g

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref ptcxeqtjlxittxayffgu

# Déployer
supabase functions deploy server
```

### Frontend (Vercel)

```bash
# Build
npm run build

# Déployer sur Vercel
npx vercel --prod
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[README.md](./README.md)** | Documentation complète du projet |
| **[STATUS.md](./STATUS.md)** | État actuel du projet |
| **[Attributions.md](./Attributions.md)** | Crédits et licenses |

---

## 🆘 Besoin d'Aide ?

### Commandes Console Utiles

Ouvre la console (F12) et essaie :

```javascript
testServerConnection()      // Vérifier connexion backend
deployServer()              // Guide déploiement
testDatabase()              // Tester la base de données
testAnalytics()             // Tester analytics
```

### Problèmes Courants

**"Aucun projet affiché"**
→ Va sur `/seed-data` et crée des données de test

**"Serveur non disponible (401)"**
→ Déploie le backend : `supabase functions deploy server`

**"Routes 404"**
→ Normal dans Figma Make, les routes fonctionnent en production

---

## 🎯 Prochaines Étapes

1. ✅ Tu as installé et lancé l'app
2. ➡️ Crée des données de test sur `/seed-data`
3. ➡️ Explore le dashboard sur `/dashboard`
4. ➡️ Personnalise les couleurs dans `/styles/globals.css`
5. ➡️ Ajoute tes vrais projets
6. ➡️ Déploie en production

---

## 💡 Conseils

- **Utilise le dashboard** pour gérer tout ton contenu
- **Les traductions** sont automatiques (format bilingue)
- **Le routing** fonctionne nativement (pas besoin de config)
- **Les données** sont dans Supabase (pas en local)

---

**Prêt à commencer ? Lance `npm run dev` ! 🚀**

Des questions ? Check [README.md](./README.md) pour plus de détails.
