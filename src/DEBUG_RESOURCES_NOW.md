# 🔍 DEBUG RESSOURCES - GUIDE RAPIDE

## 🚨 Problème

Les ressources sont créées dans le dashboard mais n'apparaissent PAS sur `/resources`.

---

## 🔧 Étape 1 : Importer les Outils de Debug

Dans la console (F12), tape :

```javascript
import("./utils/debugResources.ts").then(m => {
  window.debugResources = m.debugResources;
  window.fixResourcesPublished = m.fixResourcesPublished;
  console.log("✅ Debug tools loaded!");
});
```

---

## 🔍 Étape 2 : Diagnostic Complet

```javascript
await debugResources()
```

**Ce que ça fait** :
1. ✅ Vérifie si tu es connecté
2. ✅ Récupère les ressources de l'endpoint ADMIN
3. ✅ Récupère les ressources de l'endpoint PUBLIC
4. ✅ Compare les deux résultats
5. ✅ Affiche le statut `isPublished` de chaque ressource

**Résultat attendu** :
```
🔍 ========================================
🔍 RESOURCE VISIBILITY DEBUG
🔍 ========================================

1️⃣ Checking authentication...
✅ Logged in as: admin@maxence.design

2️⃣ Fetching from ADMIN endpoint...
✅ Admin endpoint: 4 resources

   Resources found:
   1. Guide Complet - Calculer ses Tarifs Freelance
      ID: resource:xxx
      Category: guides
      isPublished: true (type: boolean)
      Downloads: 0

   2. Template - Cahier des Charges à Remplir
      ...

3️⃣ Fetching from PUBLIC endpoint...
✅ Public endpoint: 4 resources   <-- SI 0, C'EST LE PROBLÈME !

   Resources found:
   1. Guide Complet - Calculer ses Tarifs Freelance
      isPublished: true
   ...
```

---

## 🛠️ Étape 3 : Fix Automatique

Si le diagnostic montre que `isPublished` est `"true"` (STRING) au lieu de `true` (BOOLEAN), ou si PUBLIC endpoint retourne 0 ressources :

```javascript
await fixResourcesPublished()
```

**Ce que ça fait** :
- ✅ Récupère toutes les ressources
- ✅ Force `isPublished: true` (boolean) pour chacune
- ✅ Met à jour dans la base

**Résultat** :
```
🔧 Fixing resources isPublished status...

Found 4 resources

Updating: Guide Complet - Calculer ses Tarifs Freelance
  Current isPublished: "true" (type: string)
  ✅ Updated successfully

Updating: Template - Cahier des Charges à Remplir
  Current isPublished: true (type: boolean)
  ✅ Updated successfully

...

✅ Fix complete! Try fetching resources again.
```

---

## ✅ Étape 4 : Vérification

1. **Recharge la page /resources** (F5)
2. **Ouvre la console** (F12)
3. **Regarde les logs** :

```
📚 [FRONTEND] Fetching resources from API...
📡 [FRONTEND] Response status: 200 OK
📊 [FRONTEND] Full response data: {
  "success": true,
  "resources": [
    { "title": "Guide...", "isPublished": true },
    ...
  ]
}
✅ [FRONTEND] Success! Received 4 resources
📋 [FRONTEND] Resources titles:
  1. Guide Complet - Calculer ses Tarifs Freelance (isPublished: true)
  2. Template - Cahier des Charges à Remplir (isPublished: true)
  3. Checklist Complète - Lancement de Site Web (isPublished: true)
  4. Guide Complet - Comment Préparer un Cahier des Charges (isPublished: true)
```

4. **Les ressources doivent apparaître sur la page !** ✅

---

## 🔎 Diagnostic des Logs Serveur

Regarde aussi les logs dans la console :

### Logs Backend (dans les logs Edge Functions)

```
📚 [PUBLIC] Fetching public resources...
📦 [PUBLIC] KV returned 4 resources
🔍 [PUBLIC] Checking resources...
  1. Guide Complet - Calculer ses Tarifs Freelance - isPublished: true (type: boolean)
  2. Template - Cahier des Charges à Remplir - isPublished: true (type: boolean)
  3. Checklist Complète - Lancement de Site Web - isPublished: true (type: boolean)
  4. Guide Complet - Comment Préparer un Cahier des Charges - isPublished: true (type: boolean)
✅ [PUBLIC] Returning 4 published resources (out of 4 total)
```

**Si tu vois** :
- `isPublished: "true" (type: string)` → **PROBLÈME !** Utilise `fixResourcesPublished()`
- `Filtered out: ...` → **PROBLÈME !** La ressource n'est pas publiée

---

## 🧪 Tests Manuels

### Test API Direct

```javascript
// Test endpoint public
const res = await fetch("https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/resources");
const data = await res.json();
console.log("Public API:", data);
// Doit retourner: { success: true, resources: [...] } avec 4 ressources
```

```javascript
// Test endpoint admin
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();

const res = await fetch(
  "https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/resources/admin",
  { headers: { Authorization: `Bearer ${session.access_token}` } }
);
const data = await res.json();
console.log("Admin API:", data);
// Doit retourner: { success: true, resources: [...] } avec 4 ressources
```

---

## 🎯 Solutions Possibles

### Problème 1 : `isPublished` est une STRING au lieu de BOOLEAN

**Symptôme** :
```javascript
isPublished: "true"  // STRING ❌
```

**Solution** :
```javascript
await fixResourcesPublished()
```

### Problème 2 : Endpoint PUBLIC retourne 0 ressources

**Symptôme** :
```
Admin endpoint: 4 resources ✅
Public endpoint: 0 resources ❌
```

**Cause possible** :
- Filtre trop strict sur `isPublished`
- Type mismatch (string vs boolean)

**Solution** :
```javascript
await fixResourcesPublished()
```

### Problème 3 : KV Store vide

**Symptôme** :
```
📦 [PUBLIC] KV returned 0 resources
```

**Solution** :
```javascript
// Les ressources n'ont pas été créées
await seedRealResources()
```

### Problème 4 : Erreur API

**Symptôme** :
```
❌ API returned status 500
```

**Solution** :
1. Vérifie les logs Edge Functions sur Supabase
2. Vérifie la console du navigateur
3. Contacte le support avec les logs

---

## 📊 Checklist de Vérification

- [ ] Login réussi
- [ ] `await debugResources()` exécuté
- [ ] Admin endpoint retourne 4 ressources
- [ ] Public endpoint retourne 4 ressources
- [ ] Tous les `isPublished` sont `true` (boolean)
- [ ] Page /resources rechargée (F5)
- [ ] 4 ressources affichées sur la page

---

## 🆘 Si Rien ne Fonctionne

### Recreer les Ressources

```javascript
// 1. Supprime toutes les ressources
// (fais ça manuellement dans le dashboard)

// 2. Recrée-les
await seedRealResources()

// 3. Vérifie
await debugResources()
```

### Logs à Partager

Si tu as besoin d'aide, copie et partage :

1. **Output de** `await debugResources()`
2. **Logs console navigateur** (F12 → Console)
3. **Logs Edge Functions** (Supabase Dashboard → Edge Functions → Logs)
4. **Screenshot** de la page /resources

---

## 🎉 Success Criteria

**Tu as réussi quand** :

✅ `debugResources()` affiche :
```
Admin endpoint: 4 resources
Public endpoint: 4 resources
```

✅ La page `/resources` affiche les 4 cartes de ressources

✅ Tu peux cliquer sur "Télécharger" et voir la modal

✅ Les logs frontend montrent :
```
✅ [FRONTEND] Success! Received 4 resources
```

---

**© 2025 - Debug Ressources Maxence Portfolio**
