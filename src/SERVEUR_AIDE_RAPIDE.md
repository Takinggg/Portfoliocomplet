# 🚀 Aide Rapide Serveur

## ⚡ Test en 5 Secondes

**Cliquez:** https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health

- ✅ Vous voyez du JSON → **Serveur OK**
- ❌ Erreur → **Voir solutions ci-dessous**

---

## 🔧 Solutions Express

### Problème: "404 Not Found"
```bash
supabase functions deploy server --no-verify-jwt
```

### Problème: "500 Error"
```bash
supabase functions logs server --tail
# Puis consultez: DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md
```

### Problème: "CORS Error"
```bash
supabase secrets set FRONTEND_URL="*"
supabase functions deploy server --no-verify-jwt
```

---

## 🛠️ Outils Rapides

### Console du navigateur (F12):
```javascript
testServer()  // Test automatique
```

### Dans votre app:
```tsx
import { ServerDiagnostic } from './components/ServerDiagnostic';
<ServerDiagnostic />
```

---

## 📚 Documentation

1. **TEST_SERVEUR_MAINTENANT.md** ← Commencez ici
2. **PROBLEMES_SERVEUR_SOLUTION.md** ← Vue d'ensemble
3. **DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md** ← Solutions détaillées

---

## 🔗 Liens Utiles

**Dashboard:** https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu  
**Logs:** https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions

---

## 💚 Note

**Votre app fonctionne même si le serveur est down (mode local automatique).**

---

**👉 Test maintenant:** Cliquez sur le lien health check en haut !
