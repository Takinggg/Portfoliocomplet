# ⚡ Quick Seed - 30 Secondes

Créez 6 projets de test en 30 secondes.

---

## 🎯 3 Étapes

### 1️⃣ Obtenez votre token (15s)

```bash
# 1. Allez sur /login
# 2. Connectez-vous
# 3. Console (F12) :
const { data } = await supabase.auth.getSession()
console.log(data.session.access_token)
# 4. Copiez le token
```

### 2️⃣ Accédez à la page (5s)

```
http://localhost:5173/fr/seed-data
```

### 3️⃣ Créez les projets (10s)

```bash
# 1. Collez le token
# 2. Cliquez "Créer les projets de test"
# 3. Attendez ✅
```

---

## ✅ Résultat

```
✅ 6 projet(s) bilingue(s) chargé(s)
```

**Projets créés :**
1. 🛒 E-commerce (€35k, Web)
2. 📱 Fitness App (€48k, Mobile)
3. 📊 SaaS Dashboard (€62k, Web)
4. 🏢 Corporate Site (€22k, Design)
5. 🔌 API Platform (€75k, Consulting)
6. 🎨 Design System (€38k, Design)

---

## 🔗 Vérifiez

- `/fr/projects` → Voir les projets publics
- `/dashboard` → Gérer dans le CRM
- `/fr/seed-data` → Liste complète

---

## 🗑️ Supprimer

Bouton "Supprimer tous les projets" sur `/seed-data`

⚠️ Supprime TOUS les projets !

---

## 📚 Plus d'infos

- Guide complet : `/GUIDE_SEED_DATA.md`
- Guide visuel : `/VISUAL_SEED_GUIDE.md`
- English : `/SEED_DATA_GUIDE_EN.md`

---

C'est tout ! 🚀
