# 📸 GUIDE VISUEL - FIX 404 ÉTAPE PAR ÉTAPE

## 🎯 SUIS CES ÉTAPES EXACTEMENT DANS L'ORDRE

---

## ✅ ÉTAPE 1 : VÉRIFIER QUE LE CODE EST SUR GITHUB

### 1.1 Dans Figma Make

- Clique sur **"Push to GitHub"** en haut à droite
- Attends le message de confirmation

### 1.2 Vérifie sur GitHub

1. Va sur : https://github.com/TON-USERNAME/TON-REPO
2. Clique sur le fichier `vercel.json` (à la racine)
3. Vérifie qu'il contient :
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

**SI LE FICHIER N'EXISTE PAS OU EST DIFFÉRENT :**
- ❌ Le push n'a pas fonctionné
- 🔧 Repousse le code depuis Figma Make

---

## ✅ ÉTAPE 2 : ATTENDRE LE DÉPLOIEMENT VERCEL

### 2.1 Ouvre Vercel Dashboard

Va sur : https://vercel.com/dashboard

### 2.2 Clique sur ton projet

Trouve ton projet dans la liste et clique dessus

### 2.3 Vérifie le statut du déploiement

**Tu dois voir UN de ces statuts :**

#### 🟢 Status : "Ready" (VERT)
✅ Le déploiement est terminé !
→ Passe à l'étape 3

#### 🟡 Status : "Building" (JAUNE)
⏳ Le déploiement est en cours
→ **ATTENDS 2-3 MINUTES** puis rafraîchis la page
→ Une fois "Ready", passe à l'étape 3

#### 🔴 Status : "Failed" (ROUGE)
❌ Le déploiement a échoué !
→ Clique sur le déploiement
→ Scroll jusqu'à "Build Logs"
→ Copie les dernières lignes (les erreurs en rouge)
→ **ENVOIE-MOI LES ERREURS !**

---

## ✅ ÉTAPE 3 : FORCER UN REDÉPLOIEMENT SANS CACHE

**CETTE ÉTAPE EST CRUCIALE ! ⚠️**

### 3.1 Sur Vercel Dashboard

1. Clique sur ton projet
2. Clique sur l'onglet **"Deployments"**
3. Clique sur le déploiement le plus récent (celui en haut)

### 3.2 Redéployer

1. Clique sur les **3 petits points** `⋮` en haut à droite
2. Clique sur **"Redeploy"**

### 3.3 DÉSACTIVER LE CACHE ⚠️ IMPORTANT

**UNE POPUP S'OUVRE :**

- ❌ **DÉCOCHE** la case **"Use existing Build Cache"**
  - Cette case est **COCHÉE PAR DÉFAUT**
  - Tu DOIS la **DÉCOCHER** !
  
- ✅ Clique sur **"Redeploy"**

### 3.4 Attends

- Le statut passe à "Building" (jaune)
- **Attends 2-3 minutes**
- Le statut passe à "Ready" (vert) ✅

---

## ✅ ÉTAPE 4 : TESTER EN NAVIGATION PRIVÉE

**OBLIGATOIRE ! LE CACHE PEUT MONTRER L'ANCIENNE VERSION !**

### 4.1 Ouvre une fenêtre de navigation privée

**Chrome / Edge :**
- `Ctrl+Shift+N` (Windows)
- `Cmd+Shift+N` (Mac)

**Firefox :**
- `Ctrl+Shift+P` (Windows)
- `Cmd+Shift+P` (Mac)

**Safari :**
- `Cmd+Shift+N`

### 4.2 Va sur l'URL

Tape exactement :
```
https://www.maxence.design/fr
```

**Qu'est-ce qui se passe ?**

#### ✅ SCÉNARIO 1 : La page s'affiche en français
🎉 **ÇA MARCHE !**

→ Le problème était le cache !
→ Vide le cache de ton navigateur normal :
  - Chrome : `Ctrl+Shift+Delete` → "Cached images and files" → "Clear data"
  - Firefox : `Ctrl+Shift+Delete` → "Cache" → "Clear Now"

#### ❌ SCÉNARIO 2 : Page 404
Le problème persiste.
→ Passe à l'étape 5 pour diagnostiquer

#### ❌ SCÉNARIO 3 : Page blanche
Erreur de chargement.
→ Ouvre la console (F12) et passe à l'étape 5

---

## ✅ ÉTAPE 5 : DIAGNOSTIC DANS LA CONSOLE

### 5.1 Ouvre les DevTools

**Sur la page https://www.maxence.design/fr :**
- Appuie sur `F12`
- OU `Ctrl+Shift+I` (Windows)
- OU `Cmd+Option+I` (Mac)

### 5.2 Va dans l'onglet "Console"

### 5.3 Copie-colle ce script

Copie TOUT le contenu du fichier `/TEST_DIAGNOSTIC_CONSOLE.js`

Colle-le dans la console et appuie sur `Entrée`

### 5.4 Copie le résultat

- Sélectionne TOUT le texte affiché
- `Ctrl+C` pour copier
- **ENVOIE-MOI LE RÉSULTAT !**

---

## ✅ ÉTAPE 6 : VÉRIFIER LES PARAMÈTRES VERCEL

### 6.1 Va dans Settings

1. Sur Vercel Dashboard → Ton projet
2. Clique sur **"Settings"** (onglet en haut)
3. Clique sur **"General"** (dans le menu à gauche)

### 6.2 Scroll jusqu'à "Build & Development Settings"

**Note EXACTEMENT ce qui est écrit :**

```
Framework Preset: ?
Build Command: ?
Output Directory: ?
Install Command: ?
```

### 6.3 Compare avec les valeurs recommandées

**OPTION A : Laisser Figma Make gérer (recommandé)**
```
Framework Preset: Other
Build Command: (VIDE)
Output Directory: (VIDE)
Install Command: (VIDE)
```

**OPTION B : Utiliser Vite**
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 6.4 Si c'est différent, change !

1. Clique sur **"Edit"** à côté de "Build & Development Settings"
2. Change les valeurs
3. Clique sur **"Save"**
4. Force un nouveau déploiement (retour à l'étape 3)

---

## ✅ ÉTAPE 7 : VÉRIFIER LES BUILD LOGS

### 7.1 Sur Vercel Dashboard

1. Ton projet → Onglet **"Deployments"**
2. Clique sur le dernier déploiement (celui en haut)

### 7.2 Scroll jusqu'à "Build Logs"

**Y a-t-il des erreurs ou warnings en ROUGE ou JAUNE ?**

#### ✅ Pas d'erreur
Les logs se terminent par :
```
✓ Build completed
✓ Deployed
```
→ Le build fonctionne correctement

#### ❌ Il y a des erreurs
Copie les **10 dernières lignes** et **ENVOIE-LES MOI !**

---

## ✅ ÉTAPE 8 : TEST FINAL - TOUTES LES URLS

**Si tout est OK jusqu'ici, teste TOUTES ces URLs :**

En navigation privée :

```
✅ https://www.maxence.design/
✅ https://www.maxence.design/fr
✅ https://www.maxence.design/en
✅ https://www.maxence.design/fr/projects
✅ https://www.maxence.design/en/about
✅ https://www.maxence.design/fr/blog
✅ https://www.maxence.design/en/services
```

**Pour chaque URL :**
- Est-ce qu'elle s'affiche correctement ? ✅
- Est-ce qu'elle retourne 404 ? ❌

---

## ✅ ÉTAPE 9 : TEST ACTUALISATION (F5)

1. Va sur n'importe quelle page (ex: `/fr/projects`)
2. Appuie sur **F5** pour actualiser
3. Est-ce que la page se recharge correctement ? ✅
4. Ou est-ce qu'elle retourne 404 ? ❌

---

## 🔧 SI ÇA NE MARCHE TOUJOURS PAS

### Solution de dernier recours : _redirects

**SI ET SEULEMENT SI rien d'autre ne fonctionne :**

1. Demande-moi de créer un fichier `/public/_redirects`
2. Je vais ajouter une configuration alternative
3. Tu repousses le code
4. Tu redéploies

**Mais AVANT de faire ça, envoie-moi :**
- Le résultat de l'étape 5 (script de diagnostic)
- Le résultat de l'étape 6 (paramètres Vercel)
- Le résultat de l'étape 7 (build logs)

---

## 📋 CHECKLIST COMPLÈTE

Coche au fur et à mesure :

- [ ] Étape 1 : Code poussé sur GitHub ✅
- [ ] Étape 2 : Vercel status = "Ready" ✅
- [ ] Étape 3 : Redéploiement SANS cache ✅
- [ ] Étape 4 : Test en navigation privée ✅
- [ ] Étape 5 : Script de diagnostic exécuté ✅
- [ ] Étape 6 : Paramètres Vercel vérifiés ✅
- [ ] Étape 7 : Build logs vérifiés ✅
- [ ] Étape 8 : Toutes les URLs testées ✅
- [ ] Étape 9 : Actualisation (F5) testée ✅

---

## 🎯 PROCHAINES ÉTAPES

**Une fois que tu as fait TOUTES les étapes ci-dessus :**

**Scénario A : Ça marche ! 🎉**
- Ferme cette fenêtre
- Profite de ton site bilingue qui fonctionne !

**Scénario B : Ça ne marche toujours pas 😔**
- Envoie-moi :
  1. Le résultat du script de diagnostic (étape 5)
  2. Les paramètres Vercel (étape 6)
  3. Les build logs (étape 7)
  4. Une capture d'écran de l'erreur 404

→ **JE VAIS IDENTIFIER LE PROBLÈME EXACT ET LE RÉSOUDRE ! 🔍**

---

═══════════════════════════════════════════════════════════════

**COMMENCE PAR L'ÉTAPE 1 ! FAIS LES ÉTAPES DANS L'ORDRE ! 🚀**

═══════════════════════════════════════════════════════════════
