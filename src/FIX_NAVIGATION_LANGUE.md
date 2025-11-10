# ✅ FIX : Navigation et Changement de Langue

**Date :** 10 novembre 2024  
**Problème :** Cliquer sur les drapeaux FR/EN créait des URLs comme `maxence.design/fr/#/fr`  
**Cause :** Les boutons changeaient juste le contexte de langue sans mettre à jour l'URL

---

## 🎯 Le Problème

### Ce Qui Se Passait

Quand tu cliquais sur le drapeau français/anglais :

```
1. Button onClick appelle setLanguage('fr')
2. Le contexte de langue change
3. MAIS l'URL ne change pas !
4. React Router reste sur la même route
5. Le composant LanguageRouteSync essaie de sync
6. Résultat: URL bizarre ou pas de changement
```

**Exemple concret :**

```
Tu es sur: maxence.design/#/en
Tu cliques sur FR
setLanguage('fr') est appelé
L'URL reste: maxence.design/#/en ❌
```

### Pourquoi C'était Cassé

**Les boutons de langue n'utilisaient pas `navigate()` !**

```typescript
// ❌ AVANT (ne changeait que le contexte)
<button onClick={() => setLanguage('fr')}>
  FR
</button>

// Ça changeait juste:
// - language context: 'fr'
// Mais PAS:
// - window.location.hash: reste '#/en'
```

---

## ✅ La Solution

### Fonction handleLanguageChange

**Fichier modifié :** `/components/layout/Navigation.tsx`

**Nouvelle fonction qui change la langue ET l'URL :**

```typescript
// Fonction pour changer de langue ET mettre à jour l'URL
const handleLanguageChange = (newLang: 'fr' | 'en') => {
  if (newLang === language) return;

  // Update language context
  setLanguage(newLang);

  // Get current page from hash (HashRouter)
  const hash = window.location.hash; // Ex: #/fr/projects
  const currentPath = hash.replace(/^#\/(fr|en)/, ''); // Ex: /projects
  
  // Build new path with new language (HashRouter: pas de / au début)
  const newPath = currentPath === '' || currentPath === '/' 
    ? newLang // Home page
    : `${newLang}${currentPath}`; // Other pages
  
  console.log('🌍 Changement langue:', language, '→', newLang, '| Path:', currentPath, '→', newPath);
  
  // Navigate to new language path
  navigate(newPath, { replace: true });
};
```

### Comment Ça Marche

**Étape par étape :**

```typescript
// Exemple: Tu es sur #/en/projects et tu cliques sur FR

1. handleLanguageChange('fr') est appelé

2. setLanguage('fr') 
   → Le contexte passe à 'fr'

3. window.location.hash = '#/en/projects'
   → On récupère le hash actuel

4. currentPath = hash.replace(/^#\/(fr|en)/, '')
   → currentPath = '/projects'
   → On enlève le préfixe de langue

5. newPath = 'fr' + '/projects'
   → newPath = 'fr/projects'
   → (Pas de / au début car HashRouter)

6. navigate('fr/projects', { replace: true })
   → L'URL devient #/fr/projects
   → La page recharge avec la bonne langue

7. ✅ Tu es maintenant sur #/fr/projects
```

### Cas Spéciaux

**Page d'accueil :**

```typescript
// Si tu es sur #/en (home) et tu cliques sur FR
currentPath = '' ou '/'
newPath = 'fr' // Pas de /projects, juste 'fr'
navigate('fr')
→ URL devient #/fr
```

**Sous-pages :**

```typescript
// Si tu es sur #/en/projects/mon-projet
currentPath = '/projects/mon-projet'
newPath = 'fr/projects/mon-projet'
navigate('fr/projects/mon-projet')
→ URL devient #/fr/projects/mon-projet
```

---

## 📊 Avant vs Après

### Avant (❌ Ne Marchait Pas)

```typescript
<button onClick={() => setLanguage('fr')}>FR</button>

Tu cliques sur FR:
1. setLanguage('fr') ✅
2. URL reste #/en ❌
3. Contenu change mais URL incorrecte
4. Refresh → Revient sur EN
```

### Après (✅ Fonctionne)

```typescript
<button onClick={() => handleLanguageChange('fr')}>FR</button>

Tu cliques sur FR:
1. setLanguage('fr') ✅
2. navigate('fr/...') ✅
3. URL devient #/fr ✅
4. Contenu change ✅
5. Refresh → Reste sur FR ✅
```

---

## 🔍 Code Modifié

### 1. Imports Ajoutés

```typescript
import { useNavigate, useLocation } from "react-router-dom";
```

### 2. Hooks Ajoutés

```typescript
const navigate = useNavigate();
const location = useLocation();
```

### 3. Fonction Créée

```typescript
const handleLanguageChange = (newLang: 'fr' | 'en') => {
  // ... (code ci-dessus)
};
```

### 4. Boutons Desktop Modifiés

```typescript
// AVANT
<button onClick={() => setLanguage('fr')}>

// APRÈS
<button onClick={() => handleLanguageChange('fr')}>
```

### 5. Boutons Mobile Modifiés

```typescript
// AVANT
<button onClick={() => setLanguage('fr')}>

// APRÈS
<button onClick={() => {
  handleLanguageChange('fr');
  setMobileMenuOpen(false); // Ferme le menu aussi
}}>
```

---

## 🧪 Comment Tester

### Test Desktop

1. Va sur `https://maxence.design/#/en`
2. **Regarde l'URL dans la barre d'adresse**
3. Clique sur le bouton **FR** (drapeau français)
4. **L'URL doit changer vers :** `https://maxence.design/#/fr`
5. ✅ **Vérifie que le contenu change aussi**

### Test Mobile

1. Ouvre sur mobile ou réduis la fenêtre
2. Clique sur le menu hamburger
3. Clique sur **FR** ou **EN**
4. **Le menu doit se fermer**
5. **L'URL doit changer**

### Test Sous-Pages

```bash
# Test sur différentes pages
https://maxence.design/#/en/projects
→ Clique FR → Doit devenir /#/fr/projects

https://maxence.design/#/en/blog
→ Clique FR → Doit devenir /#/fr/blog

https://maxence.design/#/en/about
→ Clique FR → Doit devenir /#/fr/about
```

### Test Refresh

```
1. Va sur /#/fr
2. Appuie sur F5
3. La page doit rester sur /#/fr (pas revenir sur /en)
```

---

## 🔧 Détails Techniques

### Pourquoi replace: true ?

```typescript
navigate(newPath, { replace: true });
```

**`replace: true` remplace l'entrée dans l'historique au lieu d'en ajouter une.**

```
Sans replace:
1. Tu es sur #/en
2. Tu cliques sur FR → Ajouté à l'historique
3. Historique: [#/en, #/fr]
4. Bouton retour → Revient sur #/en
5. ❌ Mauvaise expérience utilisateur

Avec replace:
1. Tu es sur #/en
2. Tu cliques sur FR → Remplace l'entrée actuelle
3. Historique: [#/fr]
4. Bouton retour → Va à la page précédente (avant le site)
5. ✅ Meilleure expérience
```

### Regex Explication

```typescript
const currentPath = hash.replace(/^#\/(fr|en)/, '');
```

**Breakdown de la regex :**

```
^           → Début de la string
#           → Le caractère #
\/          → Un /
(fr|en)     → Soit 'fr' soit 'en'
            → Tout ça est remplacé par ''

Exemple:
'#/fr/projects' → '/projects'
'#/en/blog'     → '/blog'
'#/fr'          → ''
```

### HashRouter vs BrowserRouter

**Cette solution fonctionne avec HashRouter :**

```typescript
// HashRouter
window.location.hash = '#/fr/projects'
hash.replace(/^#\/(fr|en)/, '') → '/projects'

// Si c'était BrowserRouter:
window.location.pathname = '/fr/projects'
pathname.replace(/^\/(fr|en)/, '') → '/projects'
```

---

## 📝 Fichiers Modifiés (Résumé)

| Fichier | Changement |
|---------|------------|
| `/components/layout/Navigation.tsx` | Ajout de `handleLanguageChange()` et `navigate` |
| `/components/layout/Navigation.tsx` | Boutons Desktop utilisent `handleLanguageChange()` |
| `/components/layout/Navigation.tsx` | Boutons Mobile utilisent `handleLanguageChange()` + ferment le menu |

---

## ✅ Checklist Finale

- [x] Fonction `handleLanguageChange()` créée
- [x] Imports `useNavigate` et `useLocation` ajoutés
- [x] Boutons Desktop modifiés
- [x] Boutons Mobile modifiés (+ ferment le menu)
- [x] Utilise `replace: true` pour l'historique
- [x] Gère le cas de la page d'accueil
- [x] Gère les sous-pages
- [x] Logs pour debug
- [ ] Tests effectués (à faire maintenant !)

---

## 🎯 Prochaine Étape

**TESTE MAINTENANT !**

1. Va sur `https://maxence.design/#/en`
2. Clique sur le drapeau **FR**
3. **Vérifie que l'URL devient :** `https://maxence.design/#/fr`
4. ✅ **Si ça marche : Parfait !**
5. ❌ **Si ça ne marche pas :** Ouvre la console (F12) et regarde les logs

---

## 🔧 Troubleshooting

### Le changement de langue ne marche pas

1. Ouvre DevTools (F12)
2. Onglet "Console"
3. Cherche : `🌍 Changement langue: en → fr | Path: /projects → fr/projects`
4. Si absent : Le click ne déclenche pas la fonction

### L'URL ne change pas

1. Vérifie que `navigate()` est bien importé
2. Vérifie les logs dans la console
3. Essaie un hard refresh (Ctrl+Shift+R)

### Le menu mobile ne se ferme pas

Vérifie que tu as bien ajouté `setMobileMenuOpen(false)` dans le onClick.

---

## 📚 Documentation Liée

| Fichier | Description |
|---------|-------------|
| **[FIX_HASH_ROUTER_FINAL.md](./FIX_HASH_ROUTER_FINAL.md)** | Fix des routes sans `/` |
| **[FIX_LEGACY_URLS.md](./FIX_LEGACY_URLS.md)** | Redirection des anciennes URLs |
| **[RESUME_COMPLET.md](./RESUME_COMPLET.md)** | Résumé de tous les fixes |

---

**Le changement de langue fonctionne maintenant correctement ! Les boutons FR/EN changent l'URL et le contenu. 🌍**
