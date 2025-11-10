# 🚨 Fix _redirects : Dossier → Fichier

## 🎯 Problème

Tu as créé `_redirects` comme un **DOSSIER** :

```
❌ /public/_redirects/              (dossier)
       ├── Code-component-70-504.tsx
       └── Code-component-70-521.tsx
```

Vercel a besoin d'un **FICHIER** :

```
✅ /public/_redirects               (fichier texte)
   Contenu : /*    /index.html   200
```

---

## 🚀 Solution Rapide

### Avec Terminal (1 minute)

```bash
rm -rf public/_redirects
echo "/*    /index.html   200" > public/_redirects
git add public/_redirects vercel.json
git commit -m "fix: Create _redirects as file not folder"
git push
```

**Terminé !** Vercel redéploie en 2-3 min.

---

### Sans Terminal (5 minutes)

1. Va sur GitHub → ton repo → `/public/`
2. Supprime le **dossier** `_redirects/` (tous les fichiers dedans)
3. Crée un **fichier** `_redirects` (bouton "Create new file")
4. Contenu : `/*    /index.html   200`
5. Commit

**Terminé !** Vercel redéploie en 2-3 min.

---

## 📚 Guides Détaillés

Besoin de plus d'explications ? Choisis ton guide :

| Guide | Description | Temps |
|-------|-------------|-------|
| **[START_HERE_FIX_REDIRECTS.md](./START_HERE_FIX_REDIRECTS.md)** | 🎯 Point de départ (choix de guide) | 3 min |
| **[COPIE_CES_3_COMMANDES.txt](./COPIE_CES_3_COMMANDES.txt)** | ⚡ 3 commandes terminal | 1 min |
| **[GITHUB_ACTION_VISUELLE.md](./GITHUB_ACTION_VISUELLE.md)** | 🖱️ Guide visuel GitHub | 5 min |
| **[FICHIER_VS_DOSSIER_VISUEL.md](./FICHIER_VS_DOSSIER_VISUEL.md)** | 📚 Explications détaillées | 10 min |
| **[QUEL_GUIDE_CHOISIR.md](./QUEL_GUIDE_CHOISIR.md)** | 🧭 Aide au choix | 2 min |

---

## ✅ Vérification

Après le fix, vérifie :

- [ ] Sur GitHub : `_redirects` a l'icône 📄 (fichier), pas 📁 (dossier)
- [ ] Contenu : `/*    /index.html   200`
- [ ] Vercel déployé (2-3 min)
- [ ] ✅ https://www.maxence.design/fr fonctionne
- [ ] ✅ https://www.maxence.design/en fonctionne
- [ ] ✅ F5 (actualisation) → Pas de 404

---

## 🎓 Pourquoi ?

Vercel cherche un **fichier** nommé `_redirects` pour appliquer les règles de redirection SPA.

Si c'est un **dossier**, Vercel l'ignore complètement → 404 sur /fr et /en.

---

## 🆘 Besoin d'Aide ?

1. **Perdu ?** → [START_HERE_FIX_REDIRECTS.md](./START_HERE_FIX_REDIRECTS.md)
2. **Terminal ?** → [COPIE_CES_3_COMMANDES.txt](./COPIE_CES_3_COMMANDES.txt)
3. **Interface ?** → [GITHUB_ACTION_VISUELLE.md](./GITHUB_ACTION_VISUELLE.md)
4. **Comprendre ?** → [FICHIER_VS_DOSSIER_VISUEL.md](./FICHIER_VS_DOSSIER_VISUEL.md)

---

**BON COURAGE ! TU ES À 3 MINUTES DE LA SOLUTION ! 🚀**
