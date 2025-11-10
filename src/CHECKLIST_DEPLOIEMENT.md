# ✅ CHECKLIST DE DÉPLOIEMENT

## 🎯 Étape par Étape

### ☐ 1. Vérifier le code

```bash
# Vérifie que vercel.json contient les rewrites
cat vercel.json | grep -A2 "rewrites"
```

**Tu dois voir :**
```json
"rewrites": [
  {
    "source": "/(.*)",
```

✅ Si tu vois ça = Le fix est dans le code

---

### ☐ 2. Commit et Push

```bash
git add vercel.json
git commit -m "fix: rewrites SPA pour React Router sur Vercel"
git push origin main
```

✅ Si ça dit "Everything up-to-date" = C'est déjà poussé

---

### ☐ 3. Vérifier sur Vercel Dashboard

1. Va sur https://vercel.com/dashboard
2. Clique sur ton projet
3. Regarde l'onglet "Deployments"

**Tu dois voir :**
- 🔵 **Building...** (en cours)
- ⏳ Attend 2-3 minutes...
- ✅ **Ready** (terminé)

---

### ☐ 4. Tester ton site

#### Test A : Redirection automatique
```
Va sur : maxence.design
Résultat : maxence.design/fr
```
☐ ✅ L'URL change en `/fr`

---

#### Test B : Accès direct à une page
```
Va sur : maxence.design/fr/services
Résultat : Page Services s'affiche
```
☐ ✅ Pas de 404, page s'affiche

---

#### Test C : Rafraîchissement
```
1. Va sur maxence.design/fr/blog
2. Appuie sur F5
Résultat : Page Blog s'affiche toujours
```
☐ ✅ Pas de 404 après rafraîchissement

---

#### Test D : Navigation
```
1. Clique sur "Services"
2. URL devient /fr/services
3. Clique sur "Projects"  
4. URL devient /fr/projects
```
☐ ✅ Navigation fonctionne

---

#### Test E : Changement de langue
```
1. Sur /fr/blog
2. Clique sur "EN" 
3. URL devient /en/blog
4. Contenu en anglais
```
☐ ✅ Changement de langue fonctionne

---

#### Test F : URLs anglaises
```
Va sur : maxence.design/en/services
Résultat : Page Services en anglais
```
☐ ✅ URLs anglaises fonctionnent

---

## 🎉 Résultat Final

Si **TOUS les tests** sont ✅ :

```
╔═══════════════════════════════════════╗
║                                       ║
║   ✅ DÉPLOIEMENT RÉUSSI !            ║
║                                       ║
║   Ton site est 100% fonctionnel      ║
║   avec les URLs bilingues !          ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## ❌ Problèmes Courants

### ❌ 404 après déploiement

**Cause** : Cache du navigateur ou CDN

**Solutions :**
1. Vide le cache : `Ctrl+Shift+R` (Win) ou `Cmd+Shift+R` (Mac)
2. Essaye en navigation privée
3. Attends 5-10 minutes (purge du cache CDN)
4. Vérifie sur https://vercel.com que le déploiement est "Ready"

---

### ❌ "Everything up-to-date" mais rien ne change

**Cause** : Le code est déjà poussé mais Vercel n'a pas redéployé

**Solutions :**
1. Va sur Vercel Dashboard
2. Clique sur "Redeploy" manuellement
3. Ou fais un commit vide :
   ```bash
   git commit --allow-empty -m "trigger redeploy"
   git push origin main
   ```

---

### ❌ Build échoue sur Vercel

**Cause** : Erreur de compilation

**Solutions :**
1. Va sur Vercel Dashboard
2. Clique sur le build échoué
3. Lis les logs d'erreur
4. Copie l'erreur et partage-la

---

## 📊 Statistiques de Déploiement

| Métrique | Temps |
|----------|-------|
| Build | 1-2 min |
| Déploiement | 30 sec |
| Propagation DNS | 30 sec |
| Purge cache CDN | 2-5 min |
| **TOTAL** | **3-8 min** |

---

## 🚀 Commandes Rapides

### Redéployer manuellement
```bash
git commit --allow-empty -m "redeploy"
git push origin main
```

### Vérifier les logs Vercel
```bash
vercel logs maxence.design
```

### Tester localement
```bash
npm run dev
```

---

## 📖 Prochaines Étapes

Une fois que tout fonctionne :

1. ✅ Teste tous les liens du menu
2. ✅ Vérifie le SEO (balises meta, sitemap)
3. ✅ Teste sur mobile
4. ✅ Vérifie les performances (Lighthouse)
5. ✅ Configure Google Analytics
6. ✅ Configure Google Search Console

---

## 🎯 Support

Si tu es bloqué :
1. Vérifie `/FIX_FINAL_SPA.md`
2. Vérifie `/PROBLEME_RESOLU.md`
3. Lis les logs Vercel
4. Partage l'erreur exacte

**Tu vas y arriver !** 🚀
