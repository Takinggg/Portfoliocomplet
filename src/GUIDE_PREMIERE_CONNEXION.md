# 🔐 Guide Première Connexion

## ✨ Nouveau système d'authentification

Votre dashboard utilise maintenant un système d'authentification personnalisé et sécurisé.

---

## 🚀 Première connexion

### Étape 1 : Accéder à la page de login
```
URL: /dashboard
```

Vous serez automatiquement redirigé vers la page de connexion.

### Étape 2 : Configuration initiale
Lors de votre **première visite**, vous verrez l'écran de configuration :

```
📧 Email (pré-rempli) : contact@maxence.design
🔒 Créer un mot de passe : [à définir]
🔒 Confirmer le mot de passe : [à définir]
```

### Étape 3 : Créer votre mot de passe

**Règles :**
- ✅ Minimum 8 caractères
- ✅ Majuscules + minuscules recommandées
- ✅ Chiffres recommandés
- ✅ Caractères spéciaux recommandés

**Indicateur de force :**
Un indicateur visuel vous montre la force de votre mot de passe :
- 🔴 **Faible** : 1-2 barres
- 🟡 **Moyen** : 3 barres
- 🟢 **Fort** : 4-5 barres

### Étape 4 : Valider
Cliquez sur **"Créer mon mot de passe"**

✅ **Confirmation** : "🎉 Mot de passe créé avec succès !"

Vous êtes automatiquement connecté au dashboard.

---

## 🔑 Connexions suivantes

Une fois votre mot de passe créé, vous verrez l'écran de connexion standard :

```
📧 Email : contact@maxence.design (pré-rempli)
🔒 Mot de passe : [entrez votre mot de passe]
```

Entrez simplement votre mot de passe et cliquez sur **"Se connecter"**.

---

## 🎯 Fonctionnalités

### Email fixe
L'email `contact@maxence.design` est **pré-configuré et non modifiable**.

Cela simplifie la connexion : vous n'avez qu'à retenir votre mot de passe.

### Validation en temps réel
Lors de la création du mot de passe :
- ✅ Vérification de la correspondance
- ✅ Indicateur de force
- ✅ Messages d'erreur clairs

### Sécurité
- 🔒 Mot de passe stocké dans Supabase (KV Store)
- 🔒 Token de session généré à chaque connexion
- 🔒 Validation côté serveur

---

## ⚠️ Important

### Perte du mot de passe
Si vous oubliez votre mot de passe, vous devrez :
1. Accéder à la console Supabase
2. Supprimer la clé `admin_credentials` du KV Store
3. Retourner sur `/dashboard` pour recréer un mot de passe

**Alternative (développeur) :**
```javascript
// Dans la console du navigateur ou backend
// Supprimer les credentials admin
await kv.del("admin_credentials");
```

### Changement de mot de passe
Pour changer votre mot de passe :
1. Supprimez `admin_credentials` (voir ci-dessus)
2. Reconnectez-vous pour créer un nouveau mot de passe

**Ou créez une page "Paramètres" avec changement de mot de passe** (à implémenter).

---

## 🔧 Configuration technique

### Routes API créées

**Check admin existe :**
```
GET /auth/check-admin
Response: { exists: boolean }
```

**Setup mot de passe (première fois uniquement) :**
```
POST /auth/setup-admin
Body: { email, password }
Response: { success, token, email }
```

**Login (connexions suivantes) :**
```
POST /auth/login
Body: { email, password }
Response: { success, token, email }
```

### Stockage

**KV Store :**
```typescript
{
  key: "admin_credentials",
  value: {
    email: "contact@maxence.design",
    password: "...",  // En production : hash bcrypt
    createdAt: "2024-11-05T..."
  }
}
```

**localStorage (frontend) :**
```typescript
{
  auth_token: "admin_token_...",
  user_email: "contact@maxence.design"
}
```

---

## 🛡️ Sécurité

### Actuellement (MVP)
- ✅ Mot de passe stocké en base
- ✅ Token de session généré
- ✅ Validation serveur
- ⚠️ Mot de passe en clair (KV Store)

### Pour la production
**TODO** (à implémenter avant mise en ligne) :
1. **Hasher les mots de passe** avec bcrypt
2. **JWT tokens** au lieu de tokens simples
3. **Expiration des sessions**
4. **Rate limiting** contre brute force
5. **2FA** (optionnel mais recommandé)

**Exemple avec bcrypt :**
```typescript
import bcrypt from "bcrypt";

// Setup
const hashedPassword = await bcrypt.hash(password, 10);
await kv.set("admin_credentials", { email, password: hashedPassword });

// Login
const valid = await bcrypt.compare(password, adminData.password);
```

---

## 📝 Exemple de workflow

### Première fois
```
1. Utilisateur visite /dashboard
   ↓
2. Redirigé vers /login
   ↓
3. Système détecte : pas de mot de passe créé
   ↓
4. Affiche formulaire "Configuration initiale"
   ↓
5. Utilisateur crée son mot de passe
   ↓
6. Mot de passe stocké en base
   ↓
7. Token généré et stocké
   ↓
8. Redirection vers dashboard ✅
```

### Connexions suivantes
```
1. Utilisateur visite /dashboard
   ↓
2. Redirigé vers /login
   ↓
3. Système détecte : mot de passe existe
   ↓
4. Affiche formulaire "Connexion"
   ↓
5. Utilisateur entre son mot de passe
   ↓
6. Validation serveur
   ↓
7. Token généré et stocké
   ↓
8. Redirection vers dashboard ✅
```

---

## 💡 Conseils

### Mot de passe sécurisé
Exemples de bons mots de passe :
- `MaxenceDesign2024!`
- `FreelancePro#2024`
- `Portfolio@Secure99`

**Ne pas utiliser :**
- Mots simples : "password", "admin"
- Dates de naissance
- Noms communs

### Gestionnaire de mots de passe
Utilisez un gestionnaire comme :
- **1Password**
- **Bitwarden**
- **LastPass**
- **Navigateur** (Chrome/Firefox)

---

## 🎨 Design

Le formulaire de login utilise le design system de l'application :
- ✅ Couleurs : `#0C0C0C` + `#00FFC2`
- ✅ Backdrop blur et effets glassmorphism
- ✅ Animations fluides
- ✅ Indicateurs visuels clairs
- ✅ Messages d'erreur explicites

---

## ✅ Checklist

### Première connexion
- [ ] Accéder à `/dashboard`
- [ ] Voir l'écran "Configuration initiale"
- [ ] Email pré-rempli à `contact@maxence.design`
- [ ] Créer un mot de passe sécurisé (8+ caractères)
- [ ] Voir l'indicateur de force
- [ ] Confirmer le mot de passe
- [ ] Cliquer "Créer mon mot de passe"
- [ ] Voir la confirmation
- [ ] Accéder au dashboard ✅

### Connexions suivantes
- [ ] Accéder à `/dashboard`
- [ ] Voir l'écran "Connexion"
- [ ] Email pré-rempli
- [ ] Entrer le mot de passe
- [ ] Cliquer "Se connecter"
- [ ] Accéder au dashboard ✅

---

## 🚀 C'est prêt !

Votre système d'authentification personnalisé est opérationnel.

**Prochaine étape :** Créez votre mot de passe et accédez au dashboard !
