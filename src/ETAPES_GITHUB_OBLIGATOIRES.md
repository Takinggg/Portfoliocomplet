# 🚨 ÉTAPES OBLIGATOIRES SUR GITHUB (Tu DOIS le faire)

## 💡 POURQUOI TU DOIS FAIRE ÇA ?

**Figma Make NE PEUT PAS créer de fichiers texte simples !**

Quand je crée le fichier `_redirects`, Figma Make le transforme automatiquement en un DOSSIER avec des fichiers `.tsx`.

**→ Tu DOIS créer ce fichier MANUELLEMENT sur GitHub.**

**→ C'est la SEULE solution.**

---

## 🎯 ÉTAPES À SUIVRE (5 minutes)

### 1️⃣ Va sur GitHub.com

Ouvre ton navigateur et va sur :

```
https://github.com/TON_USERNAME/TON_REPO
```

(Remplace `TON_USERNAME` et `TON_REPO` par ton nom d'utilisateur et le nom de ton repo)

---

### 2️⃣ Navigue vers le dossier `/public/`

Une fois sur ton repo :

1. Clique sur le dossier **`public`**
2. Tu vas voir une liste de fichiers

---

### 3️⃣ Vérifie s'il y a un dossier `_redirects/`

**Si tu vois un DOSSIER `_redirects/`** (avec une icône de dossier 📁) :

1. **Clique dessus**
2. **Supprime TOUS les fichiers** qui sont dedans :
   - Clique sur `Code-component-70-578.tsx`
   - Clique sur l'icône **🗑️ poubelle** (en haut à droite)
   - Confirme la suppression
   - Répète pour `Code-component-70-600.tsx`
3. Une fois vide, le dossier **disparaît automatiquement**

---

### 4️⃣ Retourne dans `/public/`

Clique sur **`public`** dans le fil d'Ariane en haut.

---

### 5️⃣ Crée le fichier `_redirects`

1. Clique sur **"Add file"** (en haut à droite)
2. Clique sur **"Create new file"**
3. Dans le champ **"Name your file..."**, tape **EXACTEMENT** :

```
_redirects
```

**⚠️ ATTENTION :**
- **PAS** de `.txt` à la fin
- **PAS** de `.conf` à la fin
- **PAS** de `.tsx` à la fin
- **JUSTE** `_redirects`

---

### 6️⃣ Copie-colle le contenu

Dans la zone de texte (en dessous), **copie-colle EXACTEMENT** cette ligne :

```
/*    /index.html   200
```

**⚠️ Respecte les espaces :**
- `/*` (slash + étoile)
- **4 espaces**
- `/index.html`
- **3 espaces**
- `200`

---

### 7️⃣ Commit le fichier

1. **Scroll** vers le bas
2. Dans "Commit message", laisse le message par défaut ou tape :

```
Create _redirects file
```

3. Clique sur **"Commit new file"** (bouton vert)

---

### 8️⃣ Vérifie que c'est un FICHIER (pas un dossier)

Retourne dans `/public/` et vérifie :

**✅ BON (icône fichier 📄) :**
```
📄 _redirects
📄 browserconfig.xml
📄 manifest.json
```

**❌ MAUVAIS (icône dossier 📁) :**
```
📁 _redirects/
   📄 Code-component-...
```

**Si tu vois l'icône fichier 📄, c'est bon !**

---

### 9️⃣ Attends que Vercel redéploie

1. Va sur **https://vercel.com/dashboard**
2. Clique sur ton projet
3. Tu verras **"Building..."** (attends 2-3 minutes)
4. Quand tu vois **"Ready"** ✅, c'est déployé !

---

### 🔟 Teste ton site

Ouvre ces URLs :

- ✅ `https://www.maxence.design/fr`
- ✅ `https://www.maxence.design/en`

Appuie sur **F5** (actualiser) → **Plus de 404 !**

---

## 🎓 RÉSUMÉ ULTRA-SIMPLE

1. **Va sur GitHub.com** → Ton repo → `/public/`
2. **Supprime** le dossier `_redirects/` (tous les fichiers dedans)
3. **Crée** un nouveau fichier nommé `_redirects` (sans extension)
4. **Copie-colle** : `/*    /index.html   200`
5. **Commit**
6. **Attends** 2-3 min (Vercel redéploie)
7. **Teste** ton site

---

## 🆘 BESOIN D'AIDE ?

Si tu es bloqué à une étape, dis-moi laquelle et je t'aide !

---

## ⏰ TEMPS TOTAL

**5 à 10 minutes** (en comptant le déploiement Vercel)

---

**C'EST LA SEULE CHOSE QUE TU DOIS FAIRE MANUELLEMENT !**

**Après ça, tout fonctionnera ! 🚀**
