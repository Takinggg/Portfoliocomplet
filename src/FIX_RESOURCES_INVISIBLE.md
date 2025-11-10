# ⚡ FIX : Ressources Invisibles

## 🚨 Problème
✅ Dashboard : 4 ressources visibles  
❌ Page /resources : Vide

---

## 🔧 Solution Rapide (30 secondes)

### 1. Ouvre la Console (F12)

### 2. Copie/colle ces commandes :

```javascript
// Charger les outils de debug
import("./utils/debugResources.ts").then(m => {
  window.debugResources = m.debugResources;
  window.fixResourcesPublished = m.fixResourcesPublished;
});
```

**Attends 2 secondes**, puis :

```javascript
// Diagnostic
await debugResources()
```

**Regarde le résultat** :
- Si "Public endpoint: 0 resources" → Problème confirmé
- Si "Public endpoint: 4 resources" → Pas de problème (recharge /resources)

### 3. Fix Automatique

```javascript
await fixResourcesPublished()
```

### 4. Recharge /resources (F5)

**✅ Les ressources doivent apparaître !**

---

## 📝 Cause Probable

Le champ `isPublished` est stocké comme STRING `"true"` au lieu de BOOLEAN `true`.

**Filtre API** :
```javascript
.filter((r) => r.isPublished === true)
```

**Si `isPublished = "true"`** (string) :
```javascript
"true" === true  // false ❌
```

**Après fix, `isPublished = true`** (boolean) :
```javascript
true === true  // true ✅
```

---

## 🧪 Test Manuel

```javascript
// 1. Vérifier l'API publique
const res = await fetch("https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/resources");
const data = await res.json();
console.log(data);

// AVANT fix : { success: true, resources: [] }  ❌
// APRÈS fix  : { success: true, resources: [{...}, {...}, {...}, {...}] } ✅
```

---

## ✅ Checklist

- [ ] Console ouverte (F12)
- [ ] Import debug tools
- [ ] `await debugResources()` exécuté
- [ ] Public endpoint : 0 resources (confirme le problème)
- [ ] `await fixResourcesPublished()` exécuté
- [ ] "Fix complete!" affiché
- [ ] Page /resources rechargée (F5)
- [ ] 4 ressources affichées

---

## 🎯 Si Ça Ne Marche Pas

Lis **DEBUG_RESOURCES_NOW.md** pour diagnostic approfondi.

---

**Temps total : 30 secondes** ⏱️
