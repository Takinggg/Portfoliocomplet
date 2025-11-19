# 🚀 Quick Start - Page Services

## Pour tester la nouvelle page Services

### 1. Lancer le serveur de développement
```powershell
npm run dev
```

### 2. Naviguer vers la page Services
Ouvrir dans votre navigateur : `http://localhost:5173/services`

Ou depuis la navigation : cliquer sur "Services" dans le menu

### 3. Points à tester

#### Hero Section
- ✅ Animation de l'orb flottant
- ✅ Deux CTAs fonctionnels
- ✅ Image cover (si disponible, sinon elle se cache automatiquement)

#### Packages (3 cards)
- ✅ Hover effects sur les cards
- ✅ Click "En savoir plus" → ouvre modal
- ✅ Modal affiche détails complets
- ✅ Badge "Recommandé" sur pack Pro
- ✅ Click "Réserver audit" → navigation vers booking

#### Triple Engine Demo
- ✅ Hover sur chaque bloc (UI, Code, Workflow)
- ✅ Changement dynamique du contenu en bas

#### FAQ
- ✅ Click pour expand/collapse
- ✅ Animations smooth

#### Formulaire Contact
- ✅ Remplir tous les champs
- ✅ Submit → animation de succès
- ✅ Message "Merci" s'affiche
- ⚠️ **Note** : Actuellement en mode simulation. Voir `ServiceContactForm.tsx` ligne 24-40 pour intégrer le backend

#### Sticky CTA Bar
- ✅ Apparaît en bas de l'écran
- ✅ Deux CTAs fonctionnels
- ✅ Bouton fermeture (X)
- ✅ Responsive mobile

#### Responsive
- ✅ Tester sur mobile (DevTools)
- ✅ Tester sur tablet
- ✅ Vérifier tous les breakpoints

### 4. Build pour production
```powershell
npm run build
```

Vérifier qu'il n'y a pas d'erreurs.

### 5. Preview du build
```powershell
npm run preview
```

Tester la version optimisée production.

## 🔧 Troubleshooting

### Si erreur de compilation
```powershell
# Nettoyer node_modules et reinstaller
rm -rf node_modules package-lock.json
npm install
```

### Si l'image cover ne s'affiche pas
C'est normal si le path `/mnt/data/6ec5a395-...png` n'existe pas.
Le fallback cache automatiquement l'image.

Pour ajouter une vraie image :
1. Placer l'image dans `/public/images/services-cover.png`
2. Changer le src dans `ServicesPage.tsx` ligne 547 :
```tsx
src="/images/services-cover.png"
```

### Si le formulaire ne fonctionne pas
Le formulaire est en mode simulation. Pour l'activer :
1. Ouvrir `src/components/services/ServiceContactForm.tsx`
2. Implémenter la logique backend aux lignes 24-40
3. Voir SERVICES_PAGE_DOCUMENTATION.md section "Intégrations à faire"

## 📝 Checklist rapide

Avant de considérer la page prête pour production :

- [ ] Image cover ajoutée (ou désactivée proprement)
- [ ] Backend form intégré (Supabase + Email + Notif)
- [ ] Analytics events configurés
- [ ] Tests sur vrais devices mobiles
- [ ] Lighthouse score vérifié
- [ ] Tous les liens internes fonctionnent
- [ ] SEO meta tags vérifiés

## 🎨 Personnalisation rapide

### Changer les prix des packs
Fichier : `src/components/pages/ServicesPage.tsx`
Lignes : 62-162 (définition des packages)

### Modifier les case studies
Fichier : `src/components/pages/ServicesPage.tsx`
Lignes : 200-273

### Ajouter/modifier services détaillés
Fichier : `src/components/pages/ServicesPage.tsx`
Lignes : 276-372

### Modifier la FAQ
Fichier : `src/components/pages/ServicesPage.tsx`
Lignes : 375-437

## 🚢 Déploiement

Une fois tous les tests OK :

### Option 1 : Vercel/Netlify (automatique)
```powershell
git add .
git commit -m "feat: Page Services premium rework complete"
git push origin main
```

Le déploiement se fera automatiquement.

### Option 2 : Manuel
```powershell
npm run build
# Uploader le dossier /dist sur votre hébergeur
```

---

✅ **Tout est prêt !** La page Services est production-ready après l'intégration du backend form.
