# ✅ FIX FAQ - Suppression/Modification Corrigée

## 🐛 Problème Résolu

**Erreur 404 lors de la suppression/modification de FAQ** :
```
DELETE /faq-categories/general 404 (Not Found)
DELETE /faq-questions/123 404 (Not Found)
```

## 🔧 Solution Appliquée

Le serveur Supabase a été modifié pour **gérer automatiquement les préfixes** `faq_category_` et `faq_question_`.

### Routes Corrigées

#### ✅ Categories FAQ
- **PUT** `/faq-categories/:id` - Modification
- **DELETE** `/faq-categories/:id` - Suppression

#### ✅ Questions FAQ  
- **PUT** `/faq-questions/:id` - Modification
- **DELETE** `/faq-questions/:id` - Suppression

### Fonctionnement

Le serveur accepte maintenant **2 formats d'ID** :

```typescript
// Format 1 : ID simple (envoyé par le frontend)
DELETE /faq-categories/general
→ Transformé en : faq_category_general

// Format 2 : ID avec préfixe (déjà complet)
DELETE /faq-categories/faq_category_general
→ Utilisé tel quel
```

## 📋 Code Modifié

### Avant (❌ Erreur)
```typescript
app.delete("/faq-categories/:id", async (c) => {
  const id = c.req.param("id"); // "general"
  const existing = await kv.get(id); // ❌ Cherche "general" au lieu de "faq_category_general"
  // ...
});
```

### Après (✅ Corrigé)
```typescript
app.delete("/faq-categories/:id", async (c) => {
  let id = c.req.param("id"); // "general"
  
  // Ajoute le préfixe si absent
  if (!id.startsWith("faq_category_")) {
    id = `faq_category_${id}`; // → "faq_category_general"
  }
  
  const existing = await kv.get(id); // ✅ Trouve la catégorie
  // ...
});
```

## 🚀 Déployer la Correction

### Option 1 : Supabase CLI (Recommandé)

```bash
cd supabase/functions/server
supabase functions deploy make-server-04919ac5 --no-verify-jwt
```

### Option 2 : Dashboard Supabase

1. Allez sur **Dashboard Supabase** → **Edge Functions**
2. Sélectionnez `make-server-04919ac5`
3. Remplacez le code par `/supabase/functions/server/index.tsx`
4. Cliquez sur **Deploy**

## ✅ Tester Après Déploiement

### 1. Dashboard → FAQ

**Tester Catégories :**
```
✅ Créer une nouvelle catégorie
✅ Modifier une catégorie existante
✅ Supprimer une catégorie
```

**Tester Questions :**
```
✅ Créer une nouvelle question
✅ Modifier une question existante
✅ Supprimer une question
```

### 2. Vérifier la Console

```javascript
// Suppression réussie
console.log("✅ Deleted FAQ category: faq_category_general");

// Au lieu de l'erreur 404
// DELETE https://...co/functions/v1/.../faq-categories/general 404
```

## 🔍 Routes Complètes FAQ

### Categories
```typescript
GET    /faq-categories           // Liste toutes (public)
POST   /faq-categories           // Créer (auth requise)
PUT    /faq-categories/:id       // Modifier (auth requise) ✅ CORRIGÉ
DELETE /faq-categories/:id       // Supprimer (auth requise) ✅ CORRIGÉ
```

### Questions
```typescript
GET    /faq                      // Liste toutes (public)
POST   /faq-questions            // Créer (auth requise)
PUT    /faq-questions/:id        // Modifier (auth requise) ✅ CORRIGÉ
DELETE /faq-questions/:id        // Supprimer (auth requise) ✅ CORRIGÉ
```

## 📊 Stockage KV

### Format des Clés

```typescript
// Catégories
faq_category_general
faq_category_technique
faq_category_1699876543210  // ID généré avec timestamp

// Questions
faq_question_1699876543210
faq_question_1699876543211
```

### Récupération

```typescript
// Toutes les catégories
await kv.getByPrefix("faq_category_");

// Toutes les questions
await kv.getByPrefix("faq_question_");
```

## 🌐 Support Bilingue

Les FAQ sont **100% bilingues** (FR/EN) :

```typescript
interface FAQCategory {
  id: string;
  name: string;        // FR
  name_en?: string;    // EN
  icon: string;
  // ...
}

interface FAQQuestion {
  id: string;
  question: string;     // FR
  question_en?: string; // EN
  answer: string;       // FR
  answer_en?: string;   // EN
  // ...
}
```

## 🎯 Résumé

| Action | Statut | Fix |
|--------|--------|-----|
| ✅ Créer catégorie | Fonctionnel | - |
| ✅ Modifier catégorie | **Corrigé** | Préfixe auto |
| ✅ Supprimer catégorie | **Corrigé** | Préfixe auto |
| ✅ Créer question | Fonctionnel | - |
| ✅ Modifier question | **Corrigé** | Préfixe auto |
| ✅ Supprimer question | **Corrigé** | Préfixe auto |

---

**Date de correction** : {{ date }}  
**Fichier modifié** : `/supabase/functions/server/index.tsx`  
**Lignes modifiées** : Routes PUT/DELETE FAQ (lignes ~1880-2010)
