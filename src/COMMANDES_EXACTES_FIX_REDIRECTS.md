# ⚡ COMMANDES EXACTES - Fix _redirects

## 🎯 Copie-Colle ces Commandes

**Ouvre ton terminal à la racine du projet et exécute :**

```bash
# 1. Supprime le dossier _redirects (si existe)
rm -rf public/_redirects

# 2. Crée le FICHIER _redirects
echo "/*    /index.html   200" > public/_redirects

# 3. Vérifie que c'est un fichier (pas un dossier)
file public/_redirects
# Devrait afficher : "public/_redirects: ASCII text"

# 4. Vérifie le contenu
cat public/_redirects
# Devrait afficher : "/*    /index.html   200"

# 5. Commit
git add public/_redirects
git commit -m "fix: Create _redirects as file not folder"

# 6. Push vers Vercel
git push origin main
```

---

## ⏰ Attends 2-3 Minutes

Vercel va déployer automatiquement.

---

## ✅ Teste

**Une fois déployé :**

1. Va sur : **https://www.maxence.design/en**
2. Appuie sur **F5** (actualisation)
3. **Résultat attendu** : ✅ Plus de 404 !

---

## 🎉 C'est Tout !

Si tu as suivi ces commandes exactement, le problème est résolu.

---

## 🐛 En Cas d'Erreur

### Erreur : "rm: cannot remove"

**Solution :**
```bash
# Force la suppression
sudo rm -rf public/_redirects
# Puis continue avec la commande 2
```

### Erreur : "Permission denied"

**Solution :**
```bash
# Donne les permissions
chmod +w public/
# Puis réessaie les commandes
```

### Git ne voit pas le changement

**Solution :**
```bash
# Reset le cache Git
git rm -r --cached public/_redirects 2>/dev/null || true
git add public/_redirects
git commit -m "fix: Create _redirects as file not folder"
git push origin main
```

---

**Exécute ces commandes maintenant ! ⚡**
