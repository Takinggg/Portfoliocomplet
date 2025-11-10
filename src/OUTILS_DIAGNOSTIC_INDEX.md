# 🛠️ Index des Outils de Diagnostic

Tous les outils disponibles pour diagnostiquer et résoudre les problèmes de votre serveur backend.

---

## 📚 Documentation

### 1. **DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md**
📖 Guide complet et détaillé de dépannage

**Contenu:**
- ✅ Checklist de diagnostic étape par étape
- ✅ Solutions aux problèmes courants
- ✅ Tests manuels avec curl
- ✅ Commandes CLI utiles
- ✅ Instructions pour redéploiement

**Utilisation:** Référence principale quand quelque chose ne fonctionne pas

---

### 2. **GUIDE_RAPIDE_DIAGNOSTIC.md**
⚡ Guide express pour tests rapides

**Contenu:**
- ✅ Test ultra-rapide (30 secondes)
- ✅ Solutions aux problèmes fréquents
- ✅ Checklist rapide
- ✅ Liens directs vers le dashboard

**Utilisation:** Quand vous avez besoin d'un diagnostic rapide

---

## 🧩 Composants React

### 3. **ServerDiagnostic.tsx**
🔍 Composant de diagnostic complet avec interface graphique

**Fonctionnalités:**
- ✅ Teste automatiquement toutes les routes API
- ✅ Affiche un résumé visuel (réussis/erreurs/warnings)
- ✅ Détails expandables pour chaque test
- ✅ Boutons pour copier les URLs
- ✅ Liens vers les logs Supabase

**Usage:**
```tsx
import { ServerDiagnostic } from './components/ServerDiagnostic';

<ServerDiagnostic />
```

**Résultat:**
- Tests: Connexion serveur, Health check, Blog posts, Newsletter, Fallback local
- Interface: Cards avec statuts colorés, détails JSON, boutons d'action

---

### 4. **ServerHealthCheck.tsx**
💚 Vérification rapide de santé du serveur

**Fonctionnalités:**
- ✅ Vérifie la disponibilité du serveur
- ✅ Compte les articles de blog
- ✅ Détecte le mode (server/local)
- ✅ Affiche des warnings si données manquantes

**Usage:**
```tsx
import { ServerHealthCheck } from './components/ServerHealthCheck';

<ServerHealthCheck />
```

**Résultat:**
- Statut serveur backend
- Nombre d'articles blog
- Mode actuel (server/local)

---

### 5. **ServerDiagnosticPage.tsx**
📄 Page complète de diagnostic

**Fonctionnalités:**
- ✅ Combine ServerDiagnostic + ServerHealthCheck
- ✅ Affiche les liens utiles vers Supabase
- ✅ Commandes CLI copiables
- ✅ Guide de dépannage intégré

**Usage:**
```tsx
import { ServerDiagnosticPage } from './components/pages/ServerDiagnosticPage';

// Ajoutez une route
<Route path="/diagnostic" element={<ServerDiagnosticPage />} />
```

**Résultat:**
- Page dédiée avec tous les outils de diagnostic
- Liens directs vers logs, SQL editor, etc.
- Parfait pour partager avec votre équipe

---

## 🔧 Utilitaires JavaScript

### 6. **quickServerTest.ts**
⚡ Script de test automatique

**Fonctionnalités:**
- ✅ Teste toutes les routes principales
- ✅ Affiche un résumé dans la console
- ✅ Recommande des actions si erreurs
- ✅ Utilisable directement dans la console du navigateur

**Usage dans votre code:**
```typescript
import { quickServerTest } from './utils/quickServerTest';

await quickServerTest();
```

**Usage dans la console du navigateur:**
```javascript
// Le script est automatiquement chargé
quickServerTest();
// ou
testServer();
```

**Résultat:**
```
🚀 Démarrage du test rapide du serveur...

1️⃣ Test Health Check...
✅ Health Check OK

2️⃣ Test Blog Posts...
✅ Blog Posts: 12 articles

...

📊 RÉSUMÉ DES TESTS
Total: 4 tests
✅ Réussis: 4
⚠️ Avertissements: 0
❌ Erreurs: 0

🎉 Tous les tests sont passés avec succès !
```

---

### 7. **serverService.ts**
🌐 Service central de détection serveur

**Fonctionnalités:**
- ✅ Détecte automatiquement si le serveur est disponible
- ✅ Cache le résultat (30 secondes)
- ✅ Fournit `fetchWithFallback()` pour toutes les requêtes
- ✅ Gère le basculement automatique en mode local

**Usage:**
```typescript
import { checkServerAvailability, fetchWithFallback } from './utils/serverService';

// Vérifier si serveur disponible
const isAvailable = await checkServerAvailability();

// Fetch avec fallback automatique
const { data, mode } = await fetchWithFallback(
  '/blog/posts',
  { method: 'GET' },
  async () => {
    // Fallback: retourner des données locales
    return getLocalPosts();
  }
);
```

---

### 8. **blogService.ts**
📝 Service spécialisé pour le blog

**Fonctionnalités:**
- ✅ Gère blog posts avec fallback local
- ✅ Support multilingue (FR/EN)
- ✅ Normalise les articles
- ✅ Incrémente les vues

**Usage:**
```typescript
import { fetchBlogPosts, fetchBlogPost } from './utils/blogService';

// Tous les posts
const { posts, mode } = await fetchBlogPosts('fr');

// Un post spécifique
const { post, mode } = await fetchBlogPost('slug-article', 'fr');
```

---

## 🎯 Quand Utiliser Quoi ?

### Scenario 1: "Le serveur ne fonctionne plus après le déploiement"
**Outils recommandés:**
1. **GUIDE_RAPIDE_DIAGNOSTIC.md** - Test ultra-rapide dans le navigateur
2. **ServerDiagnosticPage** - Interface complète pour voir tous les détails
3. **DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md** - Solutions détaillées

**Workflow:**
```
1. Ouvrir URL health check dans le navigateur
   ↓
2. Si erreur → Aller sur /diagnostic dans l'app
   ↓
3. Cliquer "Lancer le diagnostic" pour voir tous les tests
   ↓
4. Consulter DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md pour solutions
```

---

### Scenario 2: "Je veux vérifier rapidement si tout va bien"
**Outils recommandés:**
1. **ServerHealthCheck** - Dans votre Dashboard
2. **testServer()** - Dans la console du navigateur

**Workflow:**
```
1. F12 pour ouvrir la console
   ↓
2. Taper: testServer()
   ↓
3. Voir les résultats instantanément
```

---

### Scenario 3: "Je développe et je veux tester le serveur régulièrement"
**Outils recommandés:**
1. **ServerDiagnostic** - Intégré dans le Dashboard
2. **quickServerTest.ts** - Script automatique

**Workflow:**
```
1. Ajouter ServerDiagnostic dans votre Dashboard
   ↓
2. Utiliser le bouton "Lancer le diagnostic" quand nécessaire
   ↓
3. Voir immédiatement l'état de toutes les routes
```

---

### Scenario 4: "Je partage le projet avec quelqu'un"
**Outils recommandés:**
1. **ServerDiagnosticPage** - Page dédiée à partager
2. **GUIDE_RAPIDE_DIAGNOSTIC.md** - Documentation à lire

**Workflow:**
```
1. Envoyer le lien: /diagnostic
   ↓
2. La personne clique "Lancer le diagnostic"
   ↓
3. Elle voit immédiatement l'état du serveur
   ↓
4. Référer au GUIDE_RAPIDE_DIAGNOSTIC.md si problèmes
```

---

## 📦 Structure Complète

```
📁 Votre Projet
│
├── 📄 DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md    ← Guide complet
├── 📄 GUIDE_RAPIDE_DIAGNOSTIC.md                  ← Guide rapide
├── 📄 OUTILS_DIAGNOSTIC_INDEX.md                  ← Ce fichier
│
├── 📁 components/
│   ├── ServerHealthCheck.tsx                       ← Health check rapide
│   ├── ServerDiagnostic.tsx                        ← Diagnostic complet
│   └── pages/
│       └── ServerDiagnosticPage.tsx                ← Page dédiée
│
└── 📁 utils/
    ├── serverService.ts                            ← Service central
    ├── blogService.ts                              ← Service blog
    ├── dataService.ts                              ← Service données
    └── quickServerTest.ts                          ← Script de test
```

---

## 🔗 Liens Utiles

**Votre Projet Supabase:**
- Dashboard: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu
- Logs: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions
- Functions: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions
- SQL Editor: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/editor
- Secrets: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/settings/functions

**Endpoints de Test:**
- Health: https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
- Blog: https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=fr
- Newsletter: https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/newsletter/stats

---

## 🚀 Quick Start

**Test le plus rapide possible (10 secondes):**

1. Ouvrez cette URL:
   ```
   https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
   ```

2. Vous voyez du JSON avec `"success": true` ? ✅ **Serveur OK**

3. Vous voyez une erreur ? ❌ **Consultez GUIDE_RAPIDE_DIAGNOSTIC.md**

---

## ✨ Recommandations

### Pour le Développement
1. Gardez **ServerHealthCheck** dans votre Dashboard
2. Utilisez **testServer()** dans la console pour tests rapides
3. Consultez les logs Supabase en cas de problème

### Pour la Production
1. Configurez **ServerDiagnosticPage** sur une route `/diagnostic`
2. Gardez **DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md** sous la main
3. Vérifiez régulièrement les logs Edge Functions

### Pour le Debugging
1. Commencez par **GUIDE_RAPIDE_DIAGNOSTIC.md**
2. Si le problème persiste, utilisez **ServerDiagnostic**
3. En dernier recours, consultez **DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md**

---

**Dernière mise à jour:** 7 novembre 2025  
**Version:** 1.0  
**Project ID:** ptcxeqtjlxittxayffgu
