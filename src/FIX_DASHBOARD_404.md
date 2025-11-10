# 🔧 FIX : Dashboard 404

**Problème :** Le dashboard affiche une 404 avec l'URL `/en/preview_page.html`

## 🎯 La Cause

Dans `App.tsx`, il y a **DEUX** fonctions `getLanguageFromPath()` qui lisent `window.location.pathname` au lieu de `window.location.hash`.

### ❌ Code problématique

```typescript
// Ligne ~100 et ~416 dans App.tsx
const getLanguageFromPath = (): string => {
  const pathname = window.location.pathname; // ❌ MAUVAIS avec HashRouter
  const match = pathname.match(/^\/(en|fr)(\/|$)/);
  return match ? match[1] : 'fr';
};
```

### Pourquoi ça pose problème ?

Avec **HashRouter** :
- L'URL est : `maxence.design/#/fr/projects`
- `window.location.pathname` = `/` (toujours `/` !)
- `window.location.hash` = `#/fr/projects`

Donc quand tu cliques sur "Dashboard" :
1. Le code lit `pathname` = `/`
2. Pas de match avec `/(en|fr)/`
3. Retourne 'fr' par défaut
4. Navigue vers `fr/dashboard` ❌
5. Route non trouvée → 404

## ✅ La Solution

Créer un helper `hashHelpers.ts` qui lit correctement le hash.

### Étape 1 : Créer le helper

**Fichier créé :** `/utils/routing/hashHelpers.ts`

```typescript
export function getLanguageFromHash(): string {
  const hash = window.location.hash; // Ex: #/fr/projects
  const match = hash.match(/#\/(en|fr)(\/|$)/);
  return match ? match[1] : 'fr';
}

export function buildHashPath(page: string, lang?: string): string {
  const currentLang = lang || getLanguageFromHash();
  
  // Special routes without language prefix
  if (page === 'dashboard' || page === 'login') {
    return page;
  }
  
  // Home page
  if (page === 'home') {
    return currentLang;
  }
  
  // All other pages with language prefix
  return `${currentLang}/${page}`;
}
```

### Étape 2 : Modifier App.tsx

**Changement 1 : Import**

```typescript
// AVANT
import { ClientSideFallback } from "./components/routing/ClientSideFallback";

// APRÈS
import { ClientSideFallback } from "./components/routing/ClientSideFallback";
import { getLanguageFromHash, buildHashPath } from "./utils/routing/hashHelpers";
```

**Changement 2 : Remplacer getLanguageFromPath dans RouteWrapper (ligne ~100)**

```typescript
// AVANT
const getLanguageFromPath = (): string => {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/(en|fr)(\/|$)/);
  return match ? match[1] : 'fr';
};

const navigateTo = (page: string) => {
  const lang = getLanguageFromPath();
  // ...
};

// APRÈS  
const navigateTo = (page: string) => {
  const lang = getLanguageFromHash(); // ✅ Utiliser helper
  // ...
};
```

**Changement 3 : Remplacer dans PublicLayout (ligne ~414)**

```typescript
// AVANT
const getLanguageFromPath = (): string => {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/(en|fr)(\/|$)/);
  return match ? match[1] : 'fr';
};

const buildNavPath = (page: string): string => {
  const lang = getLanguageFromPath();
  if (page === 'dashboard' || page === 'login') {
    return page;
  }
  if (page === 'home') {
    return lang;
  }
  return `${lang}/${page}`;
};

// APRÈS
const buildNavPath = (page: string): string => {
  return buildHashPath(page); // ✅ Utiliser helper
};
```

## 🧪 Test

1. Va sur `https://maxence.design/#/fr`
2. Clique sur "Dashboard" dans le menu
3. L'URL doit devenir `https://maxence.design/#/dashboard` (pas `/#/fr/dashboard`)
4. ✅ Le dashboard doit s'afficher (pas de 404)

## 📝 Fichiers à Modifier

- [x] `/utils/routing/hashHelpers.ts` (créé)
- [ ] `/App.tsx` (ligne ~53 : import)
- [ ] `/App.tsx` (ligne ~107 : utiliser getLanguageFromHash)
- [ ] `/App.tsx` (ligne ~127 : utiliser getLanguageFromHash)  
- [ ] `/App.tsx` (ligne ~133 : utiliser getLanguageFromHash)
- [ ] `/App.tsx` (ligne ~140 : utiliser getLanguageFromHash)
- [ ] `/App.tsx` (ligne ~415-434 : utiliser buildHashPath)

## ⚠️ À Faire Manuellement

Le fichier `App.tsx` contient des regex avec des backslashes qui empêchent l'edit automatique.

Ouvre `/App.tsx` et remplace TOUTES les occurrences de :
```typescript
window.location.pathname
```

Par :
```typescript
window.location.hash
```

Et TOUTES les regex :
```typescript
.match(/^\/(en|fr)(\/|$)/)
```

Par :
```typescript
.match(/#\/(en|fr)(\/|$)/)
```
