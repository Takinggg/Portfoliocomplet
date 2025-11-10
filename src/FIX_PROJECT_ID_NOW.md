# 🔧 FIX - Erreur "Project not found"

## ❌ Vous voyez cette erreur ?

```
Error fetching project: Error: Project not found
projectId: "project_1762606626722_..."
```

## ✅ Solution en 1 commande (10 secondes)

### Ouvrez la console (F12) et tapez :

```javascript
fixProjectIds()
```

### Ce que ça fait :

1. ✅ Détecte automatiquement les projets avec ancien format d'ID
2. ✅ Les supprime de la base de données
3. ✅ Les recrée avec le bon format
4. ✅ Préserve toutes vos données

### Résultat attendu :

```
🔧 RÉPARATION des IDs de projets

📊 2 projet(s) trouvé(s)

✅ Format correct : 0 projet(s)
❌ Format incorrect : 2 projet(s)

Projets à réparer :
  1. TaskFlow - Plateforme SaaS
     Ancien ID : project_1762606626722_c2e98d4c-3cfd-4084-89a1-5147ba879d06
     Nouveau ID : 1762606626722_c2e98d4c-3cfd-4084-89a1-5147ba879d06

🔧 Réparation automatique en cours...

🔄 Réparation: TaskFlow
   ✅ Recréé avec ID: 1731024123456_abc-def

✅ Réparés avec succès : 2
❌ Échecs : 0

🎉 Projets réparés ! Rechargez la page.
```

### Ensuite :

1. **Rechargez** la page (F5)
2. Allez sur **/projects**
3. Cliquez sur un projet
4. **Ça marche !** ✅

---

## 🔍 Comprendre le problème

### Ancien format (cassé) :

```
ID de l'objet : "project_1762606626722_abc"
                 ^^^^^^^^ Ce préfixe ne devrait pas être là !
```

Quand le frontend demande ce projet, le backend ajoute à nouveau `project_` :
```
Recherche dans KV : "project_project_1762606626722_abc"
                     ^^^^^^^^ Double préfixe = NOT FOUND ❌
```

### Nouveau format (correct) :

```
ID de l'objet : "1762606626722_abc"
                 Pas de préfixe ✅
```

Le backend ajoute le préfixe pour le stockage :
```
Recherche dans KV : "project_1762606626722_abc"
                     Un seul préfixe = FOUND ✅
```

---

## 📋 Autres commandes utiles

### Voir tous les projets

```javascript
checkProjectIdsFormat()
```

Affiche :
- Nombre total de projets
- Combien sont au bon format
- Combien sont cassés
- Liste détaillée avec noms et IDs

### Créer des projets de test

Si après la réparation vous n'avez plus de projets :

```javascript
seedProjetTaskFlow()
```

Crée TaskFlow (FR + EN) - un projet SaaS professionnel complet

---

## 🚨 Pourquoi mes projets avaient le mauvais format ?

Vos projets ont probablement été créés **avant la correction** du système.

L'ancien code générait des IDs avec le préfixe `project_` :
```typescript
// ANCIEN CODE (cassé)
const id = `project_${Date.now()}_${crypto.randomUUID()}`;
```

Le nouveau code génère des IDs sans préfixe :
```typescript
// NOUVEAU CODE (correct)
const id = `${Date.now()}_${crypto.randomUUID()}`;
```

Le préfixe `project_` est maintenant ajouté **uniquement lors du stockage**, pas dans l'ID de l'objet.

---

## ✅ C'est résolu ?

Après avoir exécuté `fixProjectIds()` et rechargé :

- ✅ Les projets s'affichent sur `/projects`
- ✅ Cliquer dessus affiche les détails
- ✅ Pas d'erreur "Project not found"
- ✅ Le dashboard affiche tous les projets

**Félicitations !** 🎉

---

## 🆘 Toujours pas résolu ?

### Vérifier que le serveur répond

```javascript
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-04919ac5/projects?lang=fr')
  .then(r => r.json())
  .then(console.log)
```

Vous devriez voir : `{ success: true, projects: [...] }`

### Vérifier les credentials

Le fichier `/utils/supabase/info.tsx` doit contenir :
- `projectId` : Votre ID Supabase
- `publicAnonKey` : Votre clé publique

### Tester manuellement

```javascript
// Récupérer un projet spécifique
const id = "1731024000000_abc"; // Remplacer par un vrai ID de checkProjectIdsFormat()
fetch(`https://YOUR_PROJECT.supabase.co/functions/v1/make-server-04919ac5/projects/${id}`)
  .then(r => r.json())
  .then(console.log)
```

---

## 📖 Guides complets

- `/GUIDE_RAPIDE_PROJETS.md` - Guide utilisateur complet
- `/FIX_PROJECT_NOT_FOUND_ERROR.md` - Documentation technique détaillée
- `/FIX_PROJECT_NOT_FOUND_FINAL.md` - Récapitulatif des corrections

---

**Dernière mise à jour** : Novembre 2024  
**Temps de résolution** : 10 secondes avec `fixProjectIds()`
