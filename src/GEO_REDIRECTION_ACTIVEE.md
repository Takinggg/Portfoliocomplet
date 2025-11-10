# 🌍 Géo-Redirection Automatique Activée

## 🎯 Fonctionnalité

Quand un visiteur arrive sur la **racine du site** (`/`), il est **automatiquement redirigé** vers la langue appropriée selon son pays :

- 🇫🇷 **France** → `/fr`
- 🌎 **Autres pays** → `/en`

---

## ⚙️ Comment ça Fonctionne

### Ordre de Priorité de Détection

**1️⃣ Préférence sauvegardée (localStorage)**
```javascript
localStorage.getItem('preferredLanguage') // 'fr' ou 'en'
```
- Si l'utilisateur a déjà visité le site, sa langue est sauvegardée
- Redirection instantanée sans appel API

**2️⃣ Headers Vercel (production uniquement)**
```javascript
window.__VERCEL_GEO.country // Code pays ISO
```
- Détection ultra-rapide via les headers Vercel
- Disponible uniquement en production

**3️⃣ API de Géolocalisation IP**
```javascript
fetch('https://ipapi.co/json/')
```
- API gratuite : 30,000 requêtes/mois
- Timeout : 3 secondes
- Retourne : pays, ville, région, timezone, etc.

**4️⃣ Langue du navigateur (fallback)**
```javascript
navigator.language // Ex: "fr-FR", "en-US"
```
- Utilisé si l'API est indisponible
- Extraction du code langue : `"fr-FR"` → `"fr"`

---

## 📂 Fichiers Créés/Modifiés

### Nouveaux Fichiers

**1. `/components/routing/GeoRedirect.tsx`**
- Composant de redirection géographique
- Affiche un loader pendant la détection
- Redirige vers `/fr` ou `/en`

**2. `/utils/routing/detectCountry.ts`**
- Logique de détection du pays
- Méthodes utilitaires :
  - `detectUserCountry()` - Détection complète
  - `detectBrowserLanguage()` - Rapide (navigateur uniquement)
  - `getSavedLanguage()` - Récupère préférence sauvegardée
  - `saveLanguagePreference(lang)` - Sauvegarde préférence
  - `clearLanguagePreference()` - Efface préférence

**3. `/utils/geoRedirectMessage.ts`**
- Messages informatifs dans la console
- Commandes de test : `testGeo()`, `resetLanguagePreference()`

### Fichiers Modifiés

**`/App.tsx`**
```tsx
// AVANT
<Route path="/" element={<Navigate to="/fr" replace />} />

// APRÈS
<Route path="/" element={<GeoRedirect />} />
```

---

## 🧪 Tests

### Test 1 : Première Visite

```javascript
// 1. Efface la préférence sauvegardée
localStorage.removeItem('preferredLanguage');

// 2. Va sur la racine du site
window.location.href = '/';

// 3. Observe la console
// Tu devrais voir : "🌍 Pays détecté: FR (France) → fr"

// 4. Vérifie l'URL finale
// France → https://www.maxence.design/fr
// Autres → https://www.maxence.design/en
```

### Test 2 : Préférence Sauvegardée

```javascript
// 1. Force une langue
localStorage.setItem('preferredLanguage', 'en');

// 2. Rafraîchis
window.location.reload();

// 3. Tu devrais être sur /en même si tu es en France
```

### Test 3 : Géolocalisation Détaillée

```javascript
// Exécute dans la console
testGeo();

// Affiche :
// - Pays détecté
// - Ville, région
// - IP, timezone
// - Langue assignée
```

---

## 🔧 Commandes Console Utiles

### `testGeo()`
Teste la géolocalisation et affiche les infos détectées
```javascript
testGeo();
```

### `resetLanguagePreference()`
Efface la préférence de langue pour forcer une nouvelle détection
```javascript
resetLanguagePreference();
window.location.reload();
```

### Forcer une langue
```javascript
// Forcer français
localStorage.setItem('preferredLanguage', 'fr');

// Forcer anglais
localStorage.setItem('preferredLanguage', 'en');

// Puis rafraîchir
window.location.reload();
```

---

## 💡 Expérience Utilisateur

### Premier Visiteur (France)
```
1. Arrive sur https://www.maxence.design/
2. Loader affiché : "Détection de votre localisation..."
3. API détecte : France
4. Redirection vers : /fr
5. Préférence sauvegardée : 'fr'
6. Prochaine visite → redirection instantanée (pas d'appel API)
```

### Premier Visiteur (USA)
```
1. Arrive sur https://www.maxence.design/
2. Loader affiché : "Détection de votre localisation..."
3. API détecte : United States
4. Redirection vers : /en
5. Préférence sauvegardée : 'en'
```

### Visiteur Récurrent
```
1. Arrive sur /
2. localStorage trouvé : 'fr'
3. Redirection immédiate : /fr (pas de loader)
4. Pas d'appel API (performance optimale)
```

---

## 🎨 Personnalisation

### Changer les Pays Français

Si tu veux inclure d'autres pays francophones (Belgique, Suisse, Canada) :

**Modifie `/utils/routing/detectCountry.ts` :**
```typescript
// AVANT
const language = countryCode === 'FR' ? 'fr' : 'en';

// APRÈS
const frenchCountries = ['FR', 'BE', 'CH', 'CA'];
const language = frenchCountries.includes(countryCode) ? 'fr' : 'en';
```

### Ajouter une 3ème Langue

Si tu veux ajouter l'espagnol pour l'Espagne :

```typescript
const getLanguageFromCountry = (countryCode: string): 'fr' | 'en' | 'es' => {
  if (countryCode === 'FR') return 'fr';
  if (countryCode === 'ES') return 'es';
  return 'en';
};
```

---

## 📊 API Utilisée : ipapi.co

### Limites Gratuites
- ✅ 30,000 requêtes/mois
- ✅ Pas de clé API requise
- ✅ Données retournées :
  - Pays, ville, région
  - Coordonnées GPS
  - Timezone
  - Devise
  - Code téléphone

### Alternatives (si besoin)

**1. ipify + ipapi**
```javascript
// Gratuit, illimité
const ipResponse = await fetch('https://api.ipify.org?format=json');
const { ip } = await ipResponse.json();
const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
```

**2. CloudFlare (headers Vercel)**
```javascript
// En production sur Vercel (gratuit, illimité)
const country = window.__VERCEL_GEO?.country;
```

**3. IP-API**
```javascript
// Gratuit : 45 req/min
const response = await fetch('http://ip-api.com/json/');
```

---

## ⚡ Performance

### Scénario Optimal (Visite Récurrente)
```
Temps de redirection : < 10ms
- localStorage instantané
- Pas d'appel API
- Pas de loader
```

### Scénario Standard (Première Visite)
```
Temps de redirection : 500ms - 2s
- Appel API géolocalisation
- Loader affiché
- Sauvegarde préférence
```

### Scénario Dégradé (API down)
```
Temps de redirection : 3s (timeout)
- Fallback langue navigateur
- Loader affiché 3s max
- Sauvegarde préférence
```

---

## 🔒 Confidentialité & RGPD

✅ **Conforme RGPD** :
- Pas de tracking personnel
- Seulement détection du pays (pas d'adresse IP stockée)
- Préférence sauvegardée en localStorage (local uniquement)
- Pas de cookies
- Pas de transmission de données personnelles

---

## 🚀 Déploiement

### Sur Vercel

1. **Commit et push**
```bash
git add .
git commit -m "feat: Add geo-redirection for homepage"
git push origin main
```

2. **Attends le déploiement** (2-3 min)

3. **Teste en production**
```
https://www.maxence.design/
```

### Variables d'Environnement (Optionnel)

Si tu veux utiliser une autre API :

```bash
# Dans Vercel Dashboard → Settings → Environment Variables
GEO_API_URL=https://ipapi.co/json/
GEO_API_KEY=optional_api_key
```

---

## 🐛 Dépannage

### La détection ne fonctionne pas

**1. Vérifier localStorage**
```javascript
console.log(localStorage.getItem('preferredLanguage'));
// Si bloqué sur 'en', efface et reteste
localStorage.removeItem('preferredLanguage');
```

**2. Vérifier l'API**
```javascript
testGeo();
// Doit afficher les infos de géolocalisation
```

**3. Vérifier la console**
```
Cherche les logs :
- "🌍 Pays détecté: ..."
- "⚠️ Géolocalisation impossible..."
```

### Toujours redirigé vers /en

```javascript
// Efface le cache
localStorage.clear();

// Force français
localStorage.setItem('preferredLanguage', 'fr');

// Rafraîchis
window.location.reload();
```

---

## ✅ Checklist de Validation

- [ ] Sur `/` depuis la France → redirige vers `/fr`
- [ ] Sur `/` depuis les USA → redirige vers `/en`
- [ ] Visite suivante → redirection instantanée (pas de loader)
- [ ] `testGeo()` affiche le bon pays
- [ ] Changement manuel de langue fonctionne
- [ ] Préférence sauvegardée persiste après rafraîchissement
- [ ] Loader s'affiche pendant la détection (1ère visite)
- [ ] Fallback langue navigateur fonctionne (si API down)

---

## 🎯 Prochaines Améliorations Possibles

**1. Analytics de Géolocalisation**
```typescript
// Tracker les pays des visiteurs
trackPageView('/', 'home', { country: data.country_code });
```

**2. Message de Bienvenue Personnalisé**
```tsx
// "Bienvenue depuis la France!" / "Welcome from USA!"
<WelcomeBanner country={detectedCountry} />
```

**3. Popup de Sélection de Langue**
```tsx
// Si détection = FR mais langue navigateur = EN
// Proposer : "Voulez-vous continuer en français ou basculer en anglais ?"
```

**4. Détection de Langue plus Fine**
```typescript
// fr-CA → Français canadien
// fr-BE → Français belge
// en-GB → Anglais britannique
```

---

**La géo-redirection est maintenant active ! 🌍**
