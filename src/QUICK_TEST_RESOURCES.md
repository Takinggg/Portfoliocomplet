# 🚀 Test Rapide - Système de Ressources

## ⚡ Test en 3 minutes

### **1️⃣ Créer des ressources de démo (30 secondes)**
```javascript
// Dans la console du navigateur
await seedResources()
```
✅ Crée 8 ressources de démo dans différentes catégories

---

### **2️⃣ Voir les ressources publiques (30 secondes)**
1. Naviguez vers `/resources`
2. Vous devriez voir 8 ressources affichées
3. Testez les filtres par catégorie
4. Testez la recherche

---

### **3️⃣ Télécharger une ressource (1 minute)**
1. Cliquez sur "Télécharger" sur n'importe quelle ressource
2. Modal s'ouvre
3. Entrez :
   - **Nom** : "Test User"
   - **Email** : "test@example.com"
4. Cliquez "Télécharger"
5. ✅ Le fichier devrait s'ouvrir dans un nouvel onglet

---

### **4️⃣ Vérifier le lead créé (1 minute)**
1. Allez au **Dashboard** → **CRM** → **Leads**
2. Cherchez "test@example.com"
3. ✅ Un nouveau lead devrait exister avec :
   - Source: "Resource Download: [nom de la ressource]"
   - Note: "Downloaded resource: [nom] (catégorie)"

---

### **5️⃣ Gérer les ressources (Admin) (30 secondes)**
1. Dashboard → **Contenu** → **Ressources**
2. Vous voyez les 8 ressources créées
3. Stats affichent :
   - Total: 8
   - Publiées: 8
   - Téléchargements: 1+
4. Testez :
   - ✏️ Modifier une ressource
   - 👁️ Toggle public/privé
   - 🗑️ Supprimer une ressource

---

## 📋 Checklist de Vérification

- [ ] Les ressources s'affichent sur `/resources`
- [ ] Les filtres par catégorie fonctionnent
- [ ] La recherche fonctionne
- [ ] Le modal de téléchargement s'ouvre
- [ ] Le téléchargement fonctionne (fichier s'ouvre)
- [ ] Un lead est créé automatiquement
- [ ] Le compteur de téléchargements augmente
- [ ] L'onglet Ressources est visible dans le Dashboard
- [ ] La création de ressource fonctionne
- [ ] La modification fonctionne
- [ ] La suppression fonctionne

---

## 🔧 Commandes Utiles

### **Créer des ressources de démo**
```javascript
await seedResources()
```

### **Vérifier toutes les ressources**
```javascript
// Ressources publiques
const res = await fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/resources');
const data = await res.json();
console.log('📚 Resources:', data.resources);
```

### **Simuler un téléchargement**
```javascript
const resourceId = 'resource:1730899200000-abc123'; // Remplacer par un vrai ID

const res = await fetch(
  `https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/resources/${resourceId}/download`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      name: 'Test User'
    })
  }
);

const data = await res.json();
console.log('📥 Download result:', data);
```

---

## 🎯 Workflow Complet de Test

### **Scénario : Nouveau visiteur télécharge une ressource**

1. **Visiteur** arrive sur le site
2. Clique sur "Ressources" dans la nav
3. Parcourt le catalogue
4. Filtre par "Guides PDF"
5. Clique sur "Guide Complet du Design Web Moderne"
6. Modal s'ouvre → entre son email
7. ✅ **Lead créé dans le CRM**
8. Fichier téléchargé
9. **Admin** voit dans le Dashboard :
   - Nouveau lead avec source "Resource Download"
   - Compteur de téléchargements incrémenté
   - Analytics mise à jour

---

## ⚠️ Notes Importantes

### **URLs de Fichiers**
Les ressources de démo utilisent des URLs d'exemple. Pour un test complet :
1. Uploadez un vrai fichier PDF/ZIP
2. Ou remplacez les `fileUrl` par des fichiers réels

### **Supabase Storage**
Le bucket `make-04919ac5-resources` est créé automatiquement au premier upload.

### **Lead Generation**
- ✅ Nouveau email → Nouveau lead
- ✅ Email existant → Note ajoutée au lead

---

## 🎉 Test Réussi !

Si toutes les étapes fonctionnent, le système de Ressources est **100% opérationnel** ! 🚀

**Prochaines étapes :**
- Ajouter de vraies ressources avec de vrais fichiers
- Personnaliser les images de couverture
- Configurer les emails de confirmation (optionnel)
- Analyser les téléchargements dans le temps
