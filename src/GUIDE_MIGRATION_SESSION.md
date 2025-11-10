# 🔄 Guide de Migration vers Supabase Session

**Objectif :** Migrer de localStorage vers Supabase Auth Session pour une meilleure sécurité

---

## 🎯 Pourquoi migrer ?

### Problèmes actuels avec localStorage

❌ **Vulnérable aux attaques XSS**
```typescript
// N'importe quel script peut lire :
const token = localStorage.getItem("auth_token");
```

❌ **Pas de gestion automatique de l'expiration**
```typescript
// Le token reste jusqu'à déconnexion manuelle
```

❌ **Pas de refresh automatique**
```typescript
// Si le token expire, l'utilisateur doit se reconnecter
```

### Avantages de Supabase Session

✅ **Cookies httpOnly** - Inaccessibles en JavaScript  
✅ **Refresh automatique** - Le token est renouvelé automatiquement  
✅ **Gestion de l'expiration** - Session invalide après expiration  
✅ **Protection CSRF** - Mécanismes de protection natifs  

---

## 📝 Plan de migration

### Étape 1 : Modifier le backend (déjà fait ✅)

Le backend utilise déjà Supabase Auth :
```typescript
// ✅ Backend - index.tsx
const { data, error } = await supabase.auth.signInWithPassword({
  email: ADMIN_EMAIL,
  password: password,
});
```

### Étape 2 : Modifier le frontend

#### 2.1 Créer le client Supabase dans le frontend

**Fichier :** `/utils/supabase/client.tsx` (déjà existe)

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey);
  }
  return supabaseInstance;
}
```

#### 2.2 Modifier LoginPage.tsx

**Avant :**
```typescript
// ❌ Version actuelle avec localStorage
const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/auth/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${publicAnonKey}`,
  },
  body: JSON.stringify({ password }),
});

const data = await response.json();

if (response.ok && data.success) {
  localStorage.setItem("auth_token", data.token);
  localStorage.setItem("user_email", ADMIN_EMAIL);
  onLoginSuccess();
}
```

**Après :**
```typescript
// ✅ Version avec Supabase Session
import { createClient } from "../../utils/supabase/client";

const supabase = createClient();
const ADMIN_EMAIL = "contact@maxence.design";

const { data, error } = await supabase.auth.signInWithPassword({
  email: ADMIN_EMAIL,
  password: password,
});

if (error) {
  toast.error(error.message || "Mot de passe incorrect");
  return;
}

if (data.session) {
  toast.success("Connexion réussie !");
  onLoginSuccess();
}
```

#### 2.3 Modifier App.tsx

**Avant :**
```typescript
// ❌ Version actuelle avec localStorage
useEffect(() => {
  const token = localStorage.getItem("auth_token");
  setIsAuthenticated(!!token);
}, []);

const handleLogout = () => {
  localStorage.removeItem("auth_token");
  setIsAuthenticated(false);
  setCurrentPage("home");
};
```

**Après :**
```typescript
// ✅ Version avec Supabase Session
import { createClient } from "./utils/supabase/client";

const supabase = createClient();

useEffect(() => {
  // Check initial session
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };
  checkSession();

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setIsAuthenticated(!!session);
      
      if (event === 'SIGNED_OUT') {
        setCurrentPage("home");
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);

const handleLogout = async () => {
  await supabase.auth.signOut();
  setIsAuthenticated(false);
  setCurrentPage("home");
};
```

#### 2.4 Modifier DashboardPage.tsx

**Avant :**
```typescript
// ❌ Version actuelle
const userEmail = localStorage.getItem("user_email") || "admin@maxence.dev";
```

**Après :**
```typescript
// ✅ Version avec Supabase Session
const [userEmail, setUserEmail] = useState("contact@maxence.design");

useEffect(() => {
  const getUserEmail = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setUserEmail(user.email);
    }
  };
  getUserEmail();
}, []);
```

#### 2.5 Modifier les appels API pour utiliser le token de session

**Avant :**
```typescript
// ❌ Version actuelle - utilise publicAnonKey
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
  {
    headers: { Authorization: `Bearer ${publicAnonKey}` }
  }
);
```

**Après :**
```typescript
// ✅ Version avec token de session
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  toast.error("Session expirée");
  onLogout();
  return;
}

const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
  {
    headers: { Authorization: `Bearer ${session.access_token}` }
  }
);
```

---

## 🔧 Code complet pour la migration

### LoginPage.tsx (version complète)

```typescript
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { createClient } from "../../utils/supabase/client";

type Page = "home";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (page: Page) => void;
}

export default function LoginPage({ onLoginSuccess, onNavigate }: LoginPageProps) {
  const ADMIN_EMAIL = "contact@maxence.design";
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("Veuillez entrer votre mot de passe");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: password,
      });

      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message || "Mot de passe incorrect");
        return;
      }

      if (data.session) {
        toast.success("Connexion réussie !");
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... même JSX que l'original (sans le message d'aide du mot de passe)
  );
}
```

### App.tsx (modifications)

```typescript
import { useState, useEffect } from "react";
import { createClient } from "./utils/supabase/client";
// ... autres imports

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  // Initialize admin account on app startup
  useEffect(() => {
    initAdminAccount();
  }, []);

  // Check authentication with Supabase Session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setIsAuthenticated(!!session);
        
        if (event === 'SIGNED_OUT') {
          setCurrentPage("home");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentPage("home");
  };

  // ... reste du code
}
```

### DashboardPage.tsx (modifications)

```typescript
import { createClient } from "../../utils/supabase/client";

export default function DashboardPage({ onLogout, onNavigate }: DashboardPageProps) {
  // ... autres states
  const [userEmail, setUserEmail] = useState("contact@maxence.design");
  const supabase = createClient();

  // Get user email from session
  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUserEmail();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        onLogout();
        return;
      }

      const authHeader = `Bearer ${session.access_token}`;

      const [leadsRes, clientsRes, projectsRes, invoicesRes, bookingsRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`, {
          headers: { Authorization: authHeader }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`, {
          headers: { Authorization: authHeader }
        }),
        // ... autres requêtes
      ]);

      // ... reste du code
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // ... reste du code
}
```

---

## ✅ Avantages après migration

### Sécurité
- ✅ **Token dans httpOnly cookie** - Protection XSS
- ✅ **Validation côté serveur** - Token vérifié par Supabase
- ✅ **Expiration automatique** - Session invalide après expiration

### Expérience utilisateur
- ✅ **Refresh automatique** - Pas de déconnexion intempestive
- ✅ **Persistance de session** - Reste connecté au refresh
- ✅ **Multi-onglets** - Session synchronisée entre onglets

### Maintenance
- ✅ **Code plus simple** - Pas besoin de gérer localStorage
- ✅ **Moins de bugs** - Supabase gère la complexité
- ✅ **Standard** - Utilise les meilleures pratiques

---

## 🧪 Tests après migration

### 1. Test de connexion
```
1. Aller sur /dashboard
2. Entrer le mot de passe
3. Vérifier que la connexion fonctionne
4. Vérifier que le token est dans les cookies (DevTools > Application > Cookies)
```

### 2. Test de persistance
```
1. Se connecter
2. Rafraîchir la page (F5)
3. Vérifier que vous restez connecté
```

### 3. Test de déconnexion
```
1. Cliquer sur "Déconnexion"
2. Vérifier la redirection vers la page d'accueil
3. Essayer d'accéder au dashboard
4. Vérifier la redirection vers login
```

### 4. Test multi-onglets
```
1. Se connecter dans un onglet
2. Ouvrir un nouvel onglet
3. Aller sur /dashboard
4. Vérifier que vous êtes déjà connecté
```

### 5. Test d'expiration
```
1. Se connecter
2. Attendre l'expiration du token (1 heure par défaut)
3. Faire une action
4. Vérifier que vous êtes déconnecté automatiquement
```

---

## 📊 Comparaison

| Aspect | localStorage | Supabase Session |
|--------|--------------|------------------|
| **Sécurité** | ❌ Vulnérable XSS | ✅ httpOnly cookies |
| **Expiration** | ❌ Manuelle | ✅ Automatique |
| **Refresh** | ❌ Manuel | ✅ Automatique |
| **Multi-onglets** | ⚠️ Nécessite storage events | ✅ Natif |
| **Complexité** | ⚠️ Code custom | ✅ Géré par Supabase |

---

## 🎯 Checklist de migration

- [ ] Importer createClient dans LoginPage
- [ ] Remplacer fetch par supabase.auth.signInWithPassword
- [ ] Retirer localStorage.setItem
- [ ] Modifier App.tsx pour utiliser getSession
- [ ] Ajouter onAuthStateChange listener
- [ ] Modifier handleLogout pour utiliser signOut
- [ ] Modifier DashboardPage pour récupérer l'email de la session
- [ ] Utiliser session.access_token dans les requêtes API
- [ ] Tester la connexion
- [ ] Tester la déconnexion
- [ ] Tester la persistance
- [ ] Supprimer le code localStorage

---

## 🚀 Déploiement

Une fois la migration terminée :

1. **Tester en local** - Vérifier que tout fonctionne
2. **Commit & Push** - Sauvegarder les changements
3. **Déployer** - Mettre en production
4. **Vérifier** - Tester en production
5. **Documenter** - Mettre à jour la documentation

---

## 📝 Notes importantes

- ⚠️ **Ne pas bloquer les routes publiques** (POST /leads, POST /bookings)
- ⚠️ **Protéger uniquement le dashboard** avec requireAuth
- ⚠️ **Garder l'initialisation admin** au démarrage
- ✅ **La migration est rétrocompatible** - Pas de perte de données

---

## ✅ Résultat final

**Avant migration :**
- localStorage pour le token ❌
- Vulnérable XSS ❌
- Gestion manuelle de l'expiration ❌

**Après migration :**
- Supabase Session ✅
- Cookies httpOnly ✅
- Gestion automatique ✅

**Niveau de sécurité : Moyen → Élevé** 🔒
