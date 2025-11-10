# 🚨 ATTENTION : NE PAS ÉDITER _redirects DANS FIGMA MAKE !

## ❌ CE QUE TU FAIS DE FAUX

Tu essaies d'éditer le fichier `_redirects` dans **l'éditeur de Figma Make**.

**PROBLÈME** : Figma Make crée automatiquement des fichiers `.tsx` (composants React), ce qui transforme `_redirects` en un DOSSIER au lieu d'un FICHIER TEXTE !

---

## 🔴 CE QUI SE PASSE QUAND TU ÉDITES DANS FIGMA MAKE

### 1. Tu cliques sur "Edit _redirects" dans Figma Make

### 2. Figma Make crée automatiquement :

```
/public/_redirects/                    ← DOSSIER créé automatiquement ❌
    └── Code-component-70-563.tsx      ← Fichier React ❌
```

### 3. Vercel voit un DOSSIER, pas un FICHIER

**→ Vercel IGNORE le dossier**  
**→ Résultat : 404 sur /fr et /en** 😞

---

## ✅ CE QU'IL FAUT FAIRE

### 🚫 NE PAS éditer _redirects dans Figma Make !

**`_redirects` n'est PAS un composant React !**  
**C'est un fichier de configuration texte simple !**

---

## 🎯 MÉTHODE CORRECTE : Utilise GitHub DIRECTEMENT

### Option 1 : Interface GitHub (Recommandée pour toi)

#### Étape 1 : Va sur GitHub

🌐 `https://github.com/TON_USERNAME/TON_REPO`

#### Étape 2 : Navigue vers `/public/`

```
📁 ton-repo/
   📁 public/          ← Clique ici
```

#### Étape 3 : Vérifie s'il y a un dossier `_redirects/`

Si tu vois :

```
📁 _redirects/                         ← DOSSIER ❌
   📄 Code-component-70-531.tsx
   📄 Code-component-70-563.tsx
```

**→ SUPPRIME tous les fichiers dedans** (clique sur chaque fichier → 🗑️ poubelle)

#### Étape 4 : Crée le fichier `_redirects`

1. Dans `/public/`, clique sur **"Add file"** → **"Create new file"**
2. Nom : `_redirects` (PAS de `.txt`, PAS de `.tsx` !)
3. Contenu :

```
/*    /index.html   200
```

4. Commit : `fix: Create _redirects as text file`

---

### Option 2 : Terminal (Si tu as accès)

```bash
# Va dans ton projet
cd /chemin/vers/ton/projet

# Supprime tout ce qui s'appelle _redirects
rm -rf public/_redirects

# Crée le FICHIER texte
echo "/*    /index.html   200" > public/_redirects

# Vérifie que c'est un FICHIER
file public/_redirects
# Doit afficher : "public/_redirects: ASCII text"

# Commit
git add public/_redirects vercel.json
git commit -m "fix: Create _redirects as file not folder"
git push
```

---

## 🚫 CHOSES À NE JAMAIS FAIRE

### ❌ N'édite JAMAIS `_redirects` dans Figma Make

Figma Make = Éditeur de composants React (`.tsx`)  
`_redirects` = Fichier de configuration texte

**CE SONT DEUX CHOSES DIFFÉRENTES !**

### ❌ Ne crée JAMAIS de fichiers `.tsx` dans `_redirects`

```
❌ INCORRECT :
/public/_redirects/Code-component-70-563.tsx
/public/_redirects/quelquechose.tsx
```

**`_redirects` n'est PAS un dossier de composants !**

### ❌ Ne crée PAS de dossier nommé `_redirects`

```
❌ INCORRECT :
📁 _redirects/              ← Dossier
   📄 fichier.tsx

✅ CORRECT :
📄 _redirects               ← Fichier texte simple
```

---

## 📋 TYPES DE FICHIERS EXPLIQUÉS

### Fichiers React (.tsx) → Figma Make ✅

Ces fichiers DOIVENT être édités dans Figma Make :
- `App.tsx`
- `HomePage.tsx`
- `ContactPage.tsx`
- Tous les composants dans `/components/`

**→ Ce sont des composants React**

---

### Fichiers de Configuration → GitHub DIRECTEMENT ✅

Ces fichiers NE DOIVENT JAMAIS être édités dans Figma Make :
- `_redirects` (pas d'extension !)
- `vercel.json`
- `manifest.json`
- `robots.txt`
- `.gitignore`

**→ Ce sont des fichiers de configuration**

---

## 🎓 POURQUOI FIGMA MAKE CRÉE DES DOSSIERS ?

### Comportement de Figma Make :

1. Tu cliques sur "Edit file" dans Figma Make
2. Figma Make pense que tu veux créer un **composant React**
3. Figma Make crée automatiquement un **fichier `.tsx`**
4. Si le nom existe déjà, Figma Make crée un **dossier** pour stocker plusieurs versions

**→ C'est NORMAL pour les composants React**  
**→ Mais INCORRECT pour les fichiers de configuration !**

---

## ✅ RÈGLE SIMPLE À RETENIR

### Pour éditer un fichier :

**Question** : Est-ce un composant React (`.tsx`) ?

- **OUI** → Utilise Figma Make ✅
- **NON** → Utilise GitHub directement ✅

### Exemples :

| Fichier | Type | Où l'éditer ? |
|---------|------|---------------|
| `HomePage.tsx` | Composant React | Figma Make ✅ |
| `_redirects` | Configuration | GitHub ❌ Figma Make |
| `vercel.json` | Configuration | GitHub ❌ Figma Make |
| `ContactPage.tsx` | Composant React | Figma Make ✅ |
| `robots.txt` | Configuration | GitHub ❌ Figma Make |

---

## 🎯 ACTION IMMÉDIATE (3 étapes)

### 1️⃣ ARRÊTE d'éditer `_redirects` dans Figma Make

**NE CLIQUE PAS** sur le fichier `_redirects` dans l'éditeur Figma Make !

### 2️⃣ VA SUR GITHUB

🌐 `https://github.com/TON_USERNAME/TON_REPO`

### 3️⃣ SUIS CE GUIDE

Ouvre et suis **EXACTEMENT** :

📖 `/ACTION_GITHUB_VISUELLE_EMOJIS.md`

**Ce guide te montre comment créer le fichier DIRECTEMENT sur GitHub.**

---

## 🔍 COMMENT VÉRIFIER QUE C'EST CORRECT ?

### Sur GitHub, tu dois voir :

```
📁 public/
   📄 _redirects                       ← Icône fichier 📄
   📄 browserconfig.xml
   📄 manifest.json
```

**PAS** :

```
📁 public/
   📁 _redirects/                      ← Icône dossier 📁 (MAUVAIS !)
      📄 Code-component-70-563.tsx
```

---

## 💡 RÉSUMÉ ULTRA-SIMPLE

**PROBLÈME** : Tu édites `_redirects` dans Figma Make  
**CONSÉQUENCE** : Figma Make crée un dossier avec des fichiers `.tsx`  
**SOLUTION** : Crée le fichier DIRECTEMENT sur GitHub  

**FICHIER À OUVRIR** : `/ACTION_GITHUB_VISUELLE_EMOJIS.md`

---

## 📞 PROCHAINE ÉTAPE

### 🎯 Ouvre MAINTENANT :

```
/ACTION_GITHUB_VISUELLE_EMOJIS.md
```

**Ce guide te montre EXACTEMENT comment créer le fichier sur GitHub.**

**TEMPS ESTIMÉ : 5 MINUTES**

---

## ⚠️ IMPORTANT

**N'édite PLUS `_redirects` dans Figma Make !**

Utilise **UNIQUEMENT GitHub** pour ce fichier.

---

═══════════════════════════════════════════════════════════════

**VA SUR GITHUB ET SUIS /ACTION_GITHUB_VISUELLE_EMOJIS.md ! 🚀**

═══════════════════════════════════════════════════════════════
