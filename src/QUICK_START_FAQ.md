# ⚡ FAQ - QUICK START

## 🎯 Objectif

Importer 37 questions FAQ bilingues en **moins de 2 minutes**.

---

## ✅ Pré-requis

- [x] Être sur le site
- [x] Avoir un compte (sinon : créer sur `/login`)

---

## 🚀 3 ÉTAPES SIMPLES

### 1️⃣ Se connecter

```
URL : /login
Email : votre.email@example.com
Password : votre-mot-de-passe
```

### 2️⃣ Ouvrir la console

```
Windows/Linux : F12
Mac : Cmd + Option + J
```

### 3️⃣ Exécuter les commandes

```javascript
await window.deleteAllFAQQuestions()
await window.seedAllBilingualFAQs()
```

---

## ✅ Vérification

### Dashboard
```
URL : /dashboard?tab=faq
Attendu : 6 catégories + 37 questions
```

### Page publique
```
URL : /faq
Attendu : Catégories cliquables avec questions
```

---

## 📊 Résultat

```
✅ 6 catégories bilingues
   ├─ Services (8 questions)
   ├─ Tarifs & Paiement (6 questions)
   ├─ Processus & Délais (6 questions)
   ├─ Communication (4 questions)
   ├─ Technique (7 questions)
   └─ Légal & Sécurité (6 questions)

✅ 37 questions bilingues (FR + EN)
✅ Synchronisé avec Supabase
✅ Visible sur /faq et /en/faq
```

---

## 🆘 Problème ?

### "Function not defined"
→ Rafraîchir la page (F5)

### "Unauthorized"
→ Se reconnecter sur `/login`

### Questions manquantes
→ Rafraîchir la page après l'import

---

## 📚 Plus d'infos ?

- **Guide complet :** `LISEZ_MOI_FAQ_FINAL.md`
- **Détails techniques :** `SOLUTION_FINALE_FAQ_404.md`
- **Tous les guides :** `INDEX_FAQ_GUIDES.md`

---

## ⏱️ Temps estimé

```
Connexion       : 30 secondes
Console         : 10 secondes
Commande 1      : 5 secondes
Commande 2      : 30 secondes
Vérification    : 30 secondes
────────────────────────────
TOTAL           : < 2 minutes
```

---

## 🎉 C'est tout !

Simple, rapide, efficace. **Bon courage ! 🚀**
