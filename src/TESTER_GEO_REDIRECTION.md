# 🧪 Comment Tester la Géo-Redirection

## 🎯 Objectif

Vérifier que la redirection automatique `/` → `/fr` ou `/en` fonctionne selon le pays.

---

## ✅ Test 1 : Depuis la France

### Étapes :

1. **Efface la préférence sauvegardée**
   ```javascript
   // Dans la console navigateur
   localStorage.removeItem('preferredLanguage');
   localStorage.removeItem('language');
   ```

2. **Va sur la homepage**
   ```
   https://www.maxence.design/
   ```

3. **Observe** :
   - ⏳ Loader "Détection de votre localisation..." (1-2 secondes)
   - 🇫🇷 Redirection automatique vers `/fr`
   - 📍 Console affiche : "Pays détecté: FR (France) → fr"

4. **Vérifie l'URL finale**
   ```
   https://www.maxence.design/fr
   ```

✅ **Résultat attendu** : Tu es sur `/fr` avec le contenu en français

---

## ✅ Test 2 : Visites Suivantes (Cache)

### Étapes :

1. **Recharge la page** (Ctrl+R ou F5)

2. **Observe** :
   - ⚡ Redirection instantanée (pas de loader)
   - 💾 Console affiche : "Langue préférée (cache): fr"
   - Pas d'appel API

3. **Vérifie** :
   ```javascript
   localStorage.getItem('preferredLanguage')
   // Devrait afficher : "fr"
   ```

✅ **Résultat attendu** : Redirection ultra-rapide grâce au cache

---

## ✅ Test 3 : Simulation Pays Étranger

Comme tu es en France, pour simuler un autre pays :

### Méthode 1 : VPN
1. Active un VPN (USA, UK, etc.)
2. Efface localStorage
3. Va sur `/`
4. Tu devrais être redirigé vers `/en`

### Méthode 2 : Forcer Manuellement
```javascript
// Force la langue anglaise
localStorage.setItem('preferredLanguage', 'en');
window.location.href = '/';
```

✅ **Résultat attendu** : Tu arrives sur `/en`

---

## ✅ Test 4 : Géolocalisation Détaillée

```javascript
// Exécute dans la console
testGeo()
```

**Tu devrais voir** :
```
📍 Informations détectées :
   Pays: France (FR)
   Ville: Paris
   Région: Île-de-France
   IP: xxx.xxx.xxx.xxx
   Timezone: Europe/Paris

🎯 Langue assignée: Français (/fr)
💾 Langue sauvegardée: fr
```

---

## ✅ Test 5 : Fallback (API Indisponible)

Simule une API down :

```javascript
// 1. Bloque l'API dans DevTools
// Network tab → Block request pattern → "ipapi.co"

// 2. Efface le cache
localStorage.removeItem('preferredLanguage');

// 3. Recharge
window.location.reload();
```

**Tu devrais voir** :
- ⚠️ Console : "Géolocalisation impossible, utilisation langue navigateur"
- 🇫🇷 Redirection vers `/fr` (langue navigateur = français)

---

## ✅ Test 6 : Changement Manuel de Langue

1. **Clique sur le sélecteur de langue** dans le menu
2. **Change de FR → EN**
3. **Observe** :
   - URL change : `/fr` → `/en`
   - localStorage mis à jour automatiquement

4. **Va sur `/` (homepage)**
   - Tu devrais rester sur `/en` (préférence sauvegardée)

---

## 🔍 Vérifications Console

### Messages attendus (première visite)

```
🌍 Pays détecté (IP): FR (France) → fr
💾 Langue sauvegardée: fr
```

### Messages attendus (visite suivante)

```
🌍 Langue préférée (cache): fr
```

---

## 🐛 Dépannage

### Problème : Toujours redirigé vers /en

**Solution** :
```javascript
// Efface tout le localStorage
localStorage.clear();

// Force français
localStorage.setItem('preferredLanguage', 'fr');

// Recharge
window.location.reload();
```

### Problème : Loader infini

**Solution** :
1. Vérifie la console pour les erreurs
2. L'API ipapi.co peut être temporairement indisponible
3. Attends 3 secondes (timeout automatique)
4. Le fallback langue navigateur devrait s'activer

### Problème : Pas de redirection

**Solution** :
```javascript
// Vérifie que tu es bien sur "/"
console.log(window.location.pathname);

// Si tu es déjà sur /fr ou /en, pas de redirection
// Va explicitement sur "/"
window.location.href = '/';
```

---

## 📊 Checklist de Validation

- [ ] Depuis `/` → Redirige vers `/fr` (France)
- [ ] Loader affiché pendant 1-2 secondes (première visite)
- [ ] Redirection instantanée (visites suivantes)
- [ ] `testGeo()` affiche "Pays: France (FR)"
- [ ] `localStorage.getItem('preferredLanguage')` retourne "fr"
- [ ] Changement manuel de langue fonctionne
- [ ] Préférence persiste après rafraîchissement
- [ ] Fallback langue navigateur fonctionne si API down

---

## 🎬 Scénario Complet de Test

```javascript
// 1. Reset complet
localStorage.clear();
console.clear();

// 2. Va sur homepage
window.location.href = '/';

// 3. Observe le loader

// 4. Vérifie l'URL finale
console.log(window.location.pathname); // Devrait être "/fr"

// 5. Teste la géolocalisation
testGeo();

// 6. Vérifie le cache
console.log(localStorage.getItem('preferredLanguage')); // "fr"

// 7. Teste redirection rapide
window.location.href = '/';
// Devrait être instantané

// 8. Change de langue manuellement
// Clique EN dans le menu

// 9. Va sur /
window.location.href = '/';
// Devrait rester sur /en

// 10. Reset
resetLanguagePreference();
```

---

## 🌍 Test en Production

Une fois déployé sur Vercel :

1. **Ouvre en navigation privée** (pas de cache)
2. **Va sur** `https://www.maxence.design/`
3. **Observe la redirection**
4. **Ouvre la console** et vérifie les logs

---

**Bonne chance pour les tests ! 🚀**

Si tout fonctionne, tu auras une expérience utilisateur parfaite avec la langue automatiquement adaptée au pays !
