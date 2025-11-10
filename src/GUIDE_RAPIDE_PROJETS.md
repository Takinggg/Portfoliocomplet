# 🚀 Guide Rapide - Projets

## ❌ Erreur "Project not found" ?

Cette erreur signifie qu'**aucun projet n'existe** dans votre base de données ou que vous essayez d'accéder à un projet qui n'existe pas.

## ✅ Solution en 30 secondes

### Étape 1 : Ouvrir la console du navigateur

`F12` (Windows/Linux) ou `Cmd + Option + J` (Mac)

### Étape 2 : Créer des projets de test

Tapez dans la console :

```javascript
seedProjetTaskFlow()
```

Attendez quelques secondes. Vous verrez :

```
✅ Version FR créée : 1234567_abc-def
✅ Version EN créée : 1234568_ghi-jkl
🎉 PROJET TASKFLOW CRÉÉ AVEC SUCCÈS (FR + EN)
```

### Étape 3 : Recharger la page

Appuyez sur `F5` ou `Cmd + R`

### Étape 4 : Voir le résultat

1. Allez sur la page "Projets" (menu en haut)
2. Vous verrez maintenant le projet **TaskFlow**
3. Cliquez dessus pour voir les détails
4. Plus d'erreur ! ✅

---

## 🔍 Vérifier les projets existants

Pour voir quels projets existent dans votre base de données :

```javascript
checkProjectIdsFormat()
```

Cela affichera :
- Le nombre total de projets
- Leur format (ancien ou nouveau)
- Leur nom et langue

**Exemple de résultat :**

```
📊 2 projet(s) trouvé(s) au total

📋 Résultats de l'analyse :

  ✅ Nouveau format (correct) : 2 projet(s)
  ⚠️  Ancien format (à corriger) : 0 projet(s)

✅ Tous les projets sont au bon format !

  1. TaskFlow - Plateforme SaaS de Gestion de Projets (fr)
  2. TaskFlow - SaaS Project Management Platform (en)
```

---

## 📝 Créer des projets manuellement

### Via le Dashboard

1. Cliquez sur le bouton **"Dashboard"** en haut à droite
2. Connectez-vous (email: admin@admin.com, password: admin123)
3. Allez dans l'onglet **"Projets"**
4. Cliquez sur **"+ Nouveau projet"**
5. Remplissez le formulaire :
   - **Nom** : Ex: "Mon Site E-commerce"
   - **Catégorie** : Ex: "web"
   - **Langue** : **Obligatoire** - Choisir FR ou EN
   - Budget, dates, description, etc.
6. Cliquez sur **"Créer le projet"**

### Via la console (avancé)

```javascript
// Créer un projet français
await fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-04919ac5/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    name: "Mon Super Projet",
    category: "web",
    language: "fr",
    description: "Description de mon projet",
    budget: 5000,
    status: "completed"
  })
}).then(r => r.json()).then(console.log)
```

---

## 🐛 Débogage

### Problème : Projets non affichés dans la liste

**Vérifier que le serveur répond :**

```javascript
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-04919ac5/projects?lang=fr')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Résultat attendu :**
```json
{
  "success": true,
  "projects": [
    {
      "id": "1234567_abc-def",
      "name": "TaskFlow",
      "language": "fr",
      ...
    }
  ]
}
```

### Problème : Erreur "Project not found" au clic

**Causes possibles :**

1. **Ancien format d'ID** : Les projets créés avant la correction ont un mauvais format
   - Solution : `checkProjectIdsFormat()` puis supprimer et recréer

2. **ID invalide** : L'ID passé dans l'URL n'existe pas
   - Solution : Vérifier l'ID avec `checkProjectIdsFormat()`

3. **Serveur non déployé** : Le backend n'est pas accessible
   - Solution : Déployer avec `supabase functions deploy server`

### Problème : Anciens projets avec double préfixe

Si `checkProjectIdsFormat()` affiche :

```
⚠️  Ancien format (à corriger) : 3 projet(s)
```

**Solutions :**

**Option A : Supprimer et recréer (recommandé)**
1. Dashboard → Projets
2. Supprimer chaque ancien projet
3. `seedProjetTaskFlow()` pour recréer

**Option B : Les garder (limité)**
- Ils resteront visibles dans le dashboard
- Mais ne seront pas accessibles publiquement
- Créez de nouveaux projets avec le bon format

---

## 📊 Comprendre les formats d'ID

### ❌ ANCIEN format (ne fonctionne plus)

```
ID de l'objet : "project_1234567_abc"
Stockage KV   : "project_1234567_abc"
URL           : /projects/project_1234567_abc
Recherche KV  : "project_project_1234567_abc" ← ERREUR !
```

**Problème :** Double préfixe `project_project_`

### ✅ NOUVEAU format (correct)

```
ID de l'objet : "1234567_abc"
Stockage KV   : "project_1234567_abc"
URL           : /projects/1234567_abc
Recherche KV  : "project_1234567_abc" ← OK !
```

**Avantage :** URLs propres, pas de duplication

---

## 🎯 Checklist de diagnostic

Cochez chaque étape :

```
□ 1. Ouvrir la console (F12)
□ 2. Exécuter : checkProjectIdsFormat()
□ 3. Vérifier le nombre de projets
□ 4. Si 0 projet : seedProjetTaskFlow()
□ 5. Si anciens projets : les supprimer
□ 6. Recharger la page (F5)
□ 7. Aller sur /projects
□ 8. Voir TaskFlow dans la liste
□ 9. Cliquer sur TaskFlow
□ 10. Voir les détails sans erreur ✅
```

---

## 💡 Astuces

### Créer plusieurs projets rapidement

```javascript
// Créer TaskFlow (FR + EN)
await seedProjetTaskFlow()

// Ensuite créer d'autres projets depuis le dashboard
// Ou utiliser seedProjectsComplet() pour un portfolio complet
```

### Tester la navigation

```javascript
// 1. Voir tous les projets FR
fetch('.../projects?lang=fr').then(r => r.json()).then(console.log)

// 2. Récupérer un projet spécifique
fetch('.../projects/1234567_abc').then(r => r.json()).then(console.log)
```

### Vider tous les projets (ATTENTION!)

⚠️ **Cela supprime TOUS les projets**

```javascript
// À utiliser uniquement si vous voulez tout recommencer
// (fonction à créer si nécessaire)
```

---

## 📚 Ressources

- **Documentation complète** : `/FIX_PROJECT_NOT_FOUND_ERROR.md`
- **Récapitulatif** : `/CORRECTIONS_FINALES_PROJETS.md`
- **Script de migration** : `/utils/migrateProjectIds.ts`
- **Script de seed** : `/utils/seedProjetTaskFlow.ts`

---

## 🆘 Besoin d'aide ?

Si l'erreur persiste après avoir suivi ce guide :

1. Vérifiez que votre serveur Supabase est déployé
2. Vérifiez vos credentials dans `/utils/supabase/info.tsx`
3. Regardez les logs de la console pour plus de détails
4. Vérifiez que les routes `/projects` fonctionnent

### Test rapide du serveur

```javascript
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-04919ac5/health')
  .then(r => r.json())
  .then(console.log)
```

**Résultat attendu :**
```json
{
  "status": "healthy",
  "message": "Server is running"
}
```

---

## ✅ C'est résolu !

Une fois que vous voyez les projets sans erreur :

✅ Les projets s'affichent sur `/projects`
✅ Les détails s'affichent au clic
✅ Le dashboard affiche tous les projets (FR + EN)
✅ Les badges FR/EN sont visibles

**Félicitations !** 🎉

Vous pouvez maintenant :
- Créer autant de projets que vous voulez
- Les afficher en français et en anglais
- Gérer tout depuis le dashboard

---

**Dernière mise à jour** : Novembre 2024
