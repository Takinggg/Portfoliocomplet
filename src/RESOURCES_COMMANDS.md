# 🎮 Commandes Console - Système de Ressources

## 🚀 Commandes Rapides

### **Setup Initial (Une seule fois)**

```javascript
// 1. Créer le bucket Supabase Storage
await createResourcesBucket()

// 2. Seeder 8 ressources de démo
await seedResources()

// 3. Vérifier que tout fonctionne
await quickTestResources.runAll()
```

---

## 📚 Gestion des Ressources

### **Lister toutes les ressources**
```javascript
await listResources()
// Affiche : ID, titre, catégorie, nombre de téléchargements
```

### **Créer une ressource de test**
```javascript
const resource = await createTestResource()
// Crée une ressource avec un nom unique
```

### **Télécharger une ressource**
```javascript
// Obtenir l'ID d'abord
const resources = await listResources()
const resourceId = resources[0].id

// Télécharger
await downloadResource(resourceId, "test@email.com", "Test User")
// ✅ Crée automatiquement un lead dans le CRM
```

---

## 📊 Analytics

### **Voir les statistiques de téléchargement**
```javascript
await getAnalytics()
// Affiche :
// - Total downloads
// - Top resources
// - Downloads by resource
// - Downloads by user
```

---

## 🧪 Tests

### **Test complet du système**
```javascript
await testResources()
// Exécute tous les tests :
// 1. Liste les ressources
// 2. Crée une ressource
// 3. Télécharge la ressource
// 4. Affiche les analytics
```

### **Tests rapides**
```javascript
// Vérifier l'endpoint
await quickTestResources.checkEndpoint()

// Vérifier l'authentification
await quickTestResources.checkAuth()

// Compter les ressources
await quickTestResources.countResources()

// Tout exécuter
await quickTestResources.runAll()
```

---

## 🔐 Authentification

### **Vérifier si connecté**
```javascript
await quickTestResources.checkAuth()
// ✅ Authenticated
// ❌ Not authenticated
```

### **Se connecter (si nécessaire)**
```javascript
// Aller sur /login puis:
// Email: admin@maxence.design
// Password: Admin123!
```

---

## 📦 Exemples Pratiques

### **Workflow complet de test**

```javascript
// 1. Setup initial
console.log("🚀 Setup...");
await createResourcesBucket();
await seedResources();

// 2. Vérifier les ressources
console.log("\n📚 Listing resources...");
const resources = await listResources();

// 3. Tester un téléchargement
console.log("\n📥 Testing download...");
const firstResource = resources[0];
await downloadResource(
  firstResource.id, 
  "prospect@example.com", 
  "Jean Dupont"
);

// 4. Voir les stats
console.log("\n📊 Analytics...");
await getAnalytics();

console.log("\n✅ All tests passed!");
```

### **Créer plusieurs ressources rapidement**

```javascript
// Définir vos ressources
const customResources = [
  {
    title: "Mon Super Guide",
    description: "Description détaillée...",
    category: "guides",
    fileUrl: "https://example.com/file.pdf",
    tags: ["seo", "marketing"],
    isPublished: true
  },
  // ... plus de ressources
];

// Les créer
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();

for (const resource of customResources) {
  const response = await fetch(
    'https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/resources',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(resource)
    }
  );
  
  const data = await response.json();
  console.log(data.success ? `✅ ${resource.title}` : `❌ Error`);
}
```

### **Simuler 10 téléchargements**

```javascript
// Utile pour tester les analytics
const resources = await listResources();
const testEmails = [
  "user1@test.com",
  "user2@test.com",
  "user3@test.com",
  // ... etc
];

for (let i = 0; i < 10; i++) {
  const resource = resources[i % resources.length];
  const email = testEmails[i % testEmails.length];
  
  await downloadResource(resource.id, email, `Test User ${i+1}`);
  console.log(`${i+1}/10 completed`);
}

console.log("✅ 10 downloads simulated!");
await getAnalytics();
```

---

## 🔍 Debugging

### **Vérifier une ressource spécifique**
```javascript
const resourceId = "resource:1730899200000-abc123";

// Récupérer via l'API publique
const response = await fetch(
  'https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/resources'
);
const { resources } = await response.json();
const resource = resources.find(r => r.id === resourceId);

console.log(resource);
```

### **Vérifier les leads créés**
```javascript
// Après avoir téléchargé avec test@example.com
// Allez dans Dashboard → CRM → Leads
// Cherchez "test@example.com"
// Vous devriez voir:
// - Source: "Resource Download: [titre]"
// - Note: "Downloaded resource: [titre] (catégorie)"
```

### **Logger toutes les requêtes**
```javascript
// Voir les logs serveur dans Supabase Dashboard:
// 1. Aller sur supabase.com/dashboard
// 2. Sélectionner votre projet
// 3. Edge Functions → Logs
// 4. Filtrer par "make-server-04919ac5"
```

---

## 📝 Notes

### **IDs des Ressources**
- Format: `resource:timestamp-uuid`
- Exemple: `resource:1730899200000-550e8400-e29b-41d4-a716-446655440000`

### **IDs des Téléchargements**
- Format: `download:resourceId:timestamp`
- Exemple: `download:resource:1730899200000-abc:1730899500000`

### **IDs des Leads**
- Format: `lead:email`
- Exemple: `lead:test@example.com`

### **Catégories Valides**
- `templates`
- `guides`
- `checklists`
- `tools`

---

## ⚠️ Troubleshooting

### **"Session expirée"**
→ Reconnectez-vous au Dashboard

### **"Bucket not found"**
→ Exécutez `await createResourcesBucket()`

### **"Resource not found"**
→ Vérifiez l'ID avec `await listResources()`

### **"Unauthorized"**
→ Vérifiez avec `await quickTestResources.checkAuth()`

### **Aucune ressource affichée**
→ Exécutez `await seedResources()` pour créer des démos

---

## 🎯 Workflows Recommandés

### **Développement**
```javascript
// 1. Créer quelques ressources de test
await seedResources()

// 2. Tester les téléchargements
await testResources()

// 3. Vérifier les analytics
await getAnalytics()
```

### **Production**
```javascript
// 1. Créer de vraies ressources via Dashboard UI
// 2. Tester un téléchargement en console
await downloadResource(resourceId, "test@email.com")

// 3. Monitorer les analytics régulièrement
await getAnalytics()
```

### **Debug**
```javascript
// 1. Vérifier l'état du système
await quickTestResources.runAll()

// 2. Lister les ressources
await listResources()

// 3. Vérifier les logs dans Supabase Dashboard
```

---

## 💡 Tips

- ✅ Toujours être connecté pour les opérations admin
- ✅ Les téléchargements publics ne nécessitent pas d'auth
- ✅ Chaque téléchargement crée/met à jour un lead
- ✅ Les analytics sont en temps réel
- ✅ Le bucket est créé automatiquement au premier upload

---

## 🚀 Prêt à utiliser !

Toutes ces commandes sont disponibles immédiatement dans la console du navigateur. Commencez par :

```javascript
await quickTestResources.runAll()
```

**Bonne utilisation ! 🎉**
