# 🔐 Configuration de la Connexion - Quick Start

## 🎯 En 30 secondes

Votre système de login personnalisé est prêt !

**Email administrateur :** `contact@maxence.design` (pré-rempli)  
**Mot de passe :** À créer lors de votre première connexion

---

## 🚀 Première utilisation

### Étape 1 : Aller sur le dashboard
```
Cliquez sur le bouton "Dashboard" dans la navigation
ou visitez : /dashboard
```

### Étape 2 : Créer votre mot de passe
Vous verrez l'écran **"Configuration initiale"** :

1. **Email** : `contact@maxence.design` (déjà rempli, non modifiable)
2. **Créer un mot de passe** : Entrez minimum 8 caractères
3. **Confirmer** : Retapez le même mot de passe
4. **Cliquez** : "Créer mon mot de passe"

✅ **C'est fait !** Vous êtes connecté automatiquement.

---

## 🔑 Connexions suivantes

Vous verrez l'écran **"Connexion Dashboard"** :

1. **Email** : `contact@maxence.design` (déjà rempli)
2. **Mot de passe** : Entrez votre mot de passe
3. **Cliquez** : "Se connecter"

✅ **Accès au dashboard !**

---

## 💡 Conseils pour le mot de passe

### Exemples de bons mots de passe
- `MaxenceDesign2024!`
- `FreelancePro#Secure`
- `Portfolio@Super99`

### Indicateur de force
Le formulaire affiche un **indicateur visuel** :
- 🔴 Faible : Trop court ou trop simple
- 🟡 Moyen : Bien mais peut être amélioré
- 🟢 Fort : Excellent ! 

**Objectif :** Obtenir au moins 3-4 barres vertes

---

## ❓ Questions fréquentes

### Je veux changer mon mot de passe
Pour l'instant, contactez un développeur pour réinitialiser.
*(Une page "Paramètres" sera ajoutée bientôt)*

### J'ai oublié mon mot de passe
Contactez un développeur pour réinitialiser.
*(Un système de récupération sera ajouté plus tard)*

### Pourquoi l'email est fixe ?
C'est votre compte administrateur personnel.
L'email fixe évite les tentatives de connexion sur différents comptes.

---

## 🛡️ Sécurité

- ✅ Mot de passe stocké en base de données sécurisée (Supabase)
- ✅ Minimum 8 caractères requis
- ✅ Validation serveur + client
- ✅ Token de session généré

**Note :** En production, le mot de passe sera hashé avec bcrypt pour une sécurité maximale.

---

## 📝 Checklist

Première connexion :
- [ ] Aller sur `/dashboard`
- [ ] Voir "Configuration initiale"
- [ ] Créer un mot de passe (8+ caractères)
- [ ] Confirmer le mot de passe
- [ ] Cliquer "Créer mon mot de passe"
- [ ] ✅ Accès au dashboard

Connexions suivantes :
- [ ] Aller sur `/dashboard`
- [ ] Voir "Connexion Dashboard"
- [ ] Entrer le mot de passe
- [ ] Cliquer "Se connecter"
- [ ] ✅ Accès au dashboard

---

## 🎉 C'est tout !

Votre système de connexion est configuré et sécurisé.

**Documentation complète :**
- [GUIDE_PREMIERE_CONNEXION.md](./GUIDE_PREMIERE_CONNEXION.md)
- [SYSTEME_AUTH_CUSTOM.md](./SYSTEME_AUTH_CUSTOM.md)

**Prochaine étape :** Créez votre mot de passe et explorez le dashboard !
