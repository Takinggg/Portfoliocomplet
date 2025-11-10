# ✅ CORRECTION : Erreur "Project not found"

## 🐛 Problème identifié

```
Error fetching project: Error: Project not found
```

Cette erreur se produisait lors de la récupération d'un projet spécifique via son ID.

### Cause racine

Le problème était une **double utilisation du préfixe** `project_` :

1. **Lors de la création** (ligne 676) :
   ```typescript
   const projectId = `project_${Date.now()}_${crypto.randomUUID()}`;
   ```
   L'ID généré contenait déjà le préfixe `project_`

2. **Lors du stockage** (ligne 706) :
   ```typescript
   await kv.set(projectId, project);
   ```
   Stocké avec l'ID complet : `project_1234567_abc-def`

3. **Lors de la récupération** (ligne 622) :
   ```typescript
   const project = await kv.get(`project_${id}`);
   ```
   ❌ **PROBLÈME** : Si `id = "project_1234_abc"`, on cherche `project_project_1234_abc` !

### Résultat
- Projet stocké sous : `project_1234_abc`
- Recherché sous : `project_project_1234_abc` ❌
- **Résultat** : Project not found

## 🔧 Corrections appliquées

### 1. ID sans préfixe lors de la génération

**Avant :**
```typescript
const projectId = `project_${Date.now()}_${crypto.randomUUID()}`;
```

**Après :**
```typescript
// Generate unique project ID (without prefix - it will be added when storing)
const projectId = `${Date.now()}_${crypto.randomUUID()}`;
```

### 2. Préfixe ajouté lors du stockage

**Avant :**
```typescript
await kv.set(projectId, project);
```

**Après :**
```typescript
// Store with project_ prefix in KV store
await kv.set(`project_${projectId}`, project);
```

### 3. Structure de l'objet projet

L'objet projet contient maintenant un ID **sans préfixe** :
```typescript
const project = {
  id: projectId, // "1234567_abc-def" (sans "project_")
  name: "TaskFlow",
  // ...
};
```

### 4. Corrections sur toutes les routes

#### ✅ GET `/projects/:id`
```typescript
app.get("/make-server-04919ac5/projects/:id", async (c) => {
  const id = c.req.param("id"); // "1234567_abc-def"
  const project = await kv.get(`project_${id}`); // Recherche "project_1234567_abc-def"
  
  if (!project) {
    return c.json({ success: false, error: "Project not found" }, 404);
  }
  
  return c.json({ success: true, project }); // ✅ Format cohérent
});
```

#### ✅ PUT `/projects/:id`
```typescript
app.put("/make-server-04919ac5/projects/:id", async (c) => {
  const projectId = c.req.param("id");
  
  // Get with prefix
  const existingProject = await kv.get(`project_${projectId}`);
  
  const updatedProject = {
    ...existingProject,
    ...body,
    id: projectId, // Preserve ID (without prefix)
  };
  
  // Store with prefix
  await kv.set(`project_${projectId}`, updatedProject);
});
```

#### ✅ DELETE `/projects/:id`
```typescript
app.delete("/make-server-04919ac5/projects/:id", async (c) => {
  const projectId = c.req.param("id");
  
  // Check if exists (with prefix)
  const existingProject = await kv.get(`project_${projectId}`);
  
  // Delete (with prefix)
  await kv.del(`project_${projectId}`);
});
```

#### ✅ PUT `/projects/:id/pin`
```typescript
app.put("/make-server-04919ac5/projects/:id/pin", async (c) => {
  const projectId = c.req.param("id");
  
  // Get (with prefix)
  const existingProject = await kv.get(`project_${projectId}`);
  
  // Store (with prefix)
  await kv.set(`project_${projectId}`, updatedProject);
});
```

### 5. Format de réponse cohérent

**Avant :**
```typescript
return c.json(project); // ❌ Format incohérent
```

**Après :**
```typescript
return c.json({ success: true, project }); // ✅ Cohérent avec les autres routes
```

Cela permet au frontend de toujours accéder à `data.project` de manière uniforme.

## 📊 Exemple de flux complet

### Création d'un projet

```typescript
// 1. POST /projects
{
  name: "TaskFlow",
  category: "web",
  language: "fr"
}

// 2. Backend génère ID
const projectId = "1731024000000_abc-def-ghi"; // Sans préfixe

// 3. Backend stocke
await kv.set("project_1731024000000_abc-def-ghi", {
  id: "1731024000000_abc-def-ghi", // Sans préfixe dans l'objet
  name: "TaskFlow",
  // ...
});

// 4. Backend répond
{
  success: true,
  project: {
    id: "1731024000000_abc-def-ghi",
    name: "TaskFlow",
    // ...
  }
}
```

### Récupération d'un projet

```typescript
// 1. GET /projects/1731024000000_abc-def-ghi
//    ID passé dans l'URL : "1731024000000_abc-def-ghi"

// 2. Backend cherche
await kv.get("project_1731024000000_abc-def-ghi"); // ✅ Trouve le projet

// 3. Backend répond
{
  success: true,
  project: {
    id: "1731024000000_abc-def-ghi",
    name: "TaskFlow",
    // ...
  }
}
```

### Update d'un projet

```typescript
// 1. PUT /projects/1731024000000_abc-def-ghi
{
  isPinned: true
}

// 2. Backend récupère
const existing = await kv.get("project_1731024000000_abc-def-ghi");

// 3. Backend met à jour
await kv.set("project_1731024000000_abc-def-ghi", {
  ...existing,
  isPinned: true,
  id: "1731024000000_abc-def-ghi" // Préserve l'ID sans préfixe
});
```

## 🎯 Convention d'ID établie

### Dans le KV Store
```
Clé : "project_1234567_abc-def"    ← Avec préfixe
```

### Dans l'objet JSON
```json
{
  "id": "1234567_abc-def",         ← Sans préfixe
  "name": "TaskFlow",
  // ...
}
```

### Dans les URLs
```
GET /projects/1234567_abc-def      ← Sans préfixe
```

### Dans le frontend
```typescript
const projectId = "1234567_abc-def";  // Sans préfixe
fetch(`/projects/${projectId}`);       // Sans préfixe
```

## ✅ Avantages de cette convention

1. **URLs propres** : `/projects/123` au lieu de `/projects/project_123`
2. **Cohérence** : L'ID dans l'objet = l'ID dans l'URL
3. **Préfixe uniquement pour le stockage** : Organisation claire du KV store
4. **Facile à migrer** : Si on change de stockage, on peut facilement retirer les préfixes

## 🔄 Migration des anciens projets

Si des projets ont été créés avec l'ancien système (ID contenant déjà `project_`), ils ont un ID qui ressemble à `project_project_1234_abc`.

### Option 1 : Script de migration (recommandé)
```typescript
const oldProjects = await kv.getByPrefix("project_");
for (const project of oldProjects) {
  if (project.id.startsWith("project_")) {
    // Ancien format détecté
    const newId = project.id.replace("project_", "");
    const newProject = { ...project, id: newId };
    
    // Stocker avec nouveau format
    await kv.set(`project_${newId}`, newProject);
    
    // Supprimer ancien
    await kv.del(project.id);
  }
}
```

### Option 2 : Supprimer et recréer
Utiliser `seedProjetTaskFlow()` pour recréer les projets avec le nouveau format.

## 🚀 Statut

**CORRIGÉ** ✅

- Routes GET, POST, PUT, DELETE corrigées
- Convention d'ID unifiée
- Format de réponse cohérent
- Prêt pour le déploiement

## 🧪 Test

Pour tester la correction :

```typescript
// 1. Créer un projet
const response = await fetch('/projects', {
  method: 'POST',
  body: JSON.stringify({ name: "Test", category: "web" })
});
const { project } = await response.json();

// 2. Récupérer le projet
const projectId = project.id; // Ex: "1731024000000_abc"
const getResponse = await fetch(`/projects/${projectId}`);
const { project: fetchedProject } = await getResponse.json();

// 3. Vérifier
console.log(fetchedProject.id === projectId); // true ✅
```

## 📝 Notes

- Cette correction s'applique au fichier `/supabase/functions/server/index.tsx`
- Les projets existants doivent être migrés ou recréés
- Le format de réponse est maintenant cohérent avec les autres routes
- Le frontend doit utiliser `data.project` (pas `data` directement)
