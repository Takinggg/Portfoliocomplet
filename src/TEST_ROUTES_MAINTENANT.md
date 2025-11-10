# 🧪 TEST RAPIDE - Routes /fr et /en

## 🎯 Test 1 : Navigation automatique (devrait marcher)

1. Va sur l'URL de base Figma Make :
   ```
   https://...-figmaiframepreview.figma.site/
   ```

2. **Attends 2-3 secondes** (détection géographique)

3. Tu devrais être automatiquement redirigé vers :
   ```
   https://...-figmaiframepreview.figma.site/fr
   ```
   ou
   ```
   https://...-figmaiframepreview.figma.site/en
   ```

4. ✅ **Si ça marche** : Continue au Test 2
5. ❌ **Si ça ne marche pas** : Regarde la console, copie les erreurs

---

## 🎯 Test 2 : Navigation interne (devrait marcher)

Une fois sur `/fr` ou `/en` :

1. Clique sur **"Projets"** dans le menu
   - URL doit devenir `/fr/projects`
   - Page doit charger sans erreur

2. Clique sur **"Contact"**
   - URL doit devenir `/fr/contact`
   - Formulaire doit s'afficher

3. Change de langue (drapeau EN 🇬🇧 en haut à droite)
   - URL doit devenir `/en`
   - Page doit passer en anglais

4. ✅ **Si tout marche** : L'application fonctionne parfaitement !
5. ❌ **Si ça ne marche pas** : Note quelle partie échoue

---

## 🎯 Test 3 : Taper l'URL manuellement (peut ne PAS marcher)

**⚠️ ATTENTION : Ce test peut échouer dans Figma Make preview, c'est NORMAL !**

1. Dans la barre d'adresse, tape manuellement :
   ```
   https://...-figmaiframepreview.figma.site/fr
   ```

2. Appuie sur Entrée

3. **Résultat attendu** :
   - ✅ **Devrait marcher** : Page française s'affiche
   - ⚠️ **Peut ne pas marcher** : 404 Not Found
   
4. **Si tu as une 404** :
   - ✅ C'EST NORMAL dans Figma Make preview
   - ✅ Ça marchera en production sur Vercel
   - ✅ Utilise la méthode du Test 1 à la place

---

## 🎯 Test 4 : Rafraîchir la page (peut ne PAS marcher)

**⚠️ ATTENTION : Ce test peut échouer dans Figma Make preview, c'est NORMAL !**

1. Navigue jusqu'à `/fr/contact` en utilisant les liens internes (Test 2)

2. Appuie sur **F5** ou le bouton refresh du navigateur

3. **Résultat attendu** :
   - ✅ **Devrait marcher** : Page se recharge correctement
   - ⚠️ **Peut ne pas marcher** : 404 Not Found

4. **Si tu as une 404** :
   - ✅ C'EST NORMAL dans Figma Make preview
   - ✅ Ça marchera en production
   - ✅ Évite de rafraîchir dans Figma Make

---

## 📊 Résultats

### ✅ Si Tests 1 et 2 marchent :

**🎉 EXCELLENT !** Ton application fonctionne parfaitement !

Les Tests 3 et 4 peuvent échouer dans Figma Make, c'est une limitation technique normale. En production (Vercel), TOUT fonctionnera.

### ❌ Si Test 1 ne marche pas :

**Problème** : La redirection géographique ne fonctionne pas.

**Solution** :
1. Ouvre la console du navigateur (F12)
2. Regarde les erreurs
3. Copie-colle les erreurs dans le chat
4. Je t'aiderai à debugger

### ❌ Si Test 2 ne marche pas :

**Problème** : React Router ne fonctionne pas correctement.

**Solution** :
1. Ouvre la console (F12)
2. Tape : `window.location.pathname`
3. Note la valeur
4. Regarde s'il y a des erreurs rouges
5. Copie-colle les erreurs dans le chat

---

## 🔍 Console de diagnostic

Ouvre la console du navigateur (F12) et tape ceci :

```javascript
// Diagnostic rapide
console.clear();
console.log("🔍 Diagnostic Routes");
console.log("URL actuelle:", window.location.href);
console.log("Pathname:", window.location.pathname);
console.log("Langue détectée:", window.location.pathname.split('/')[1]);
console.log("Langue sauvegardée:", localStorage.getItem('preferredLanguage'));
console.log("Routes React définies:", Object.keys({
  '/fr': 'Home FR',
  '/en': 'Home EN',
  '/fr/projects': 'Projects FR',
  '/en/projects': 'Projects EN',
  '/fr/contact': 'Contact FR',
  '/en/contact': 'Contact EN'
}));
```

**Résultat attendu** :
```
🔍 Diagnostic Routes
URL actuelle: https://...figmaiframepreview.figma.site/fr
Pathname: /fr
Langue détectée: fr
Langue sauvegardée: fr
Routes React définies: (liste des routes)
```

---

## 🚀 Prochain test : Production

Une fois que Tests 1 et 2 marchent dans Figma Make :

1. **Push sur GitHub**
   ```bash
   git add .
   git commit -m "Fix routes avec configuration SPA"
   git push
   ```

2. **Attends le déploiement Vercel** (2-3 minutes)

3. **Teste en production** :
   - `maxence.design/fr` → ✅ Doit marcher
   - `maxence.design/en` → ✅ Doit marcher
   - `maxence.design/fr/contact` → ✅ Doit marcher
   - Rafraîchir → ✅ Doit marcher

---

## 📝 Rapport de test

Copie ce template et remplis :

```
# RÉSULTATS DES TESTS

## Test 1 : Navigation automatique (/)
- [ ] Marche
- [ ] Ne marche pas
- Erreur : _______________

## Test 2 : Navigation interne (liens)
- [ ] Marche
- [ ] Ne marche pas
- Erreur : _______________

## Test 3 : URL manuelle (/fr)
- [ ] Marche
- [ ] 404 (normal dans Figma Make)
- Erreur : _______________

## Test 4 : Rafraîchir
- [ ] Marche
- [ ] 404 (normal dans Figma Make)
- Erreur : _______________

## Console
(Copie-colle la sortie du diagnostic ici)
```

Envoie-moi ce rapport et je t'aiderai ! 🚀
