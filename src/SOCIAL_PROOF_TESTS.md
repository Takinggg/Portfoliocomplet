# 🧪 Social Proof - Tests Rapides

## ✅ Checklist de vérification complète

### 1. SocialShare Buttons

#### Test 1.1 : Boutons visibles
- [ ] Ouvrir `/blog/:slug` (n'importe quel article)
- [ ] Vérifier présence de **2 sections** de boutons :
  - Section 1 : Après le titre et tags
  - Section 2 : Avant le CTA "Besoin d'aide"
- [ ] Vérifier affichage de 4 boutons :
  - 🐦 Twitter (cyan)
  - 💼 LinkedIn (blue)
  - 📘 Facebook (blue)
  - 🔗 Copier (mint)

#### Test 1.2 : Partage Twitter
- [ ] Cliquer sur bouton Twitter
- [ ] Vérifier ouverture popup Twitter
- [ ] Vérifier URL correcte dans le tweet
- [ ] Vérifier titre de l'article présent
- [ ] Vérifier hashtags présents (si applicable)
- [ ] Fermer la popup

#### Test 1.3 : Partage LinkedIn
- [ ] Cliquer sur bouton LinkedIn
- [ ] Vérifier ouverture popup LinkedIn
- [ ] Vérifier URL correcte
- [ ] Fermer la popup

#### Test 1.4 : Partage Facebook
- [ ] Cliquer sur bouton Facebook
- [ ] Vérifier ouverture popup Facebook
- [ ] Vérifier URL correcte
- [ ] Fermer la popup

#### Test 1.5 : Copie de lien
- [ ] Cliquer sur bouton "Copier"
- [ ] Vérifier changement visuel : "Copié !" en vert
- [ ] Vérifier retour à "Copier" après 2 secondes
- [ ] Coller dans notepad → URL correcte ?

#### Test 1.6 : Animations
- [ ] Hover sur chaque bouton
- [ ] Vérifier scale 1.05 + slide up (y: -2)
- [ ] Vérifier changement couleur border
- [ ] Vérifier transition fluide

#### Test 1.7 : Responsive
- [ ] Tester sur mobile (< 640px)
- [ ] Vérifier stack vertical des boutons
- [ ] Vérifier lisibilité des labels
- [ ] Vérifier zones cliquables suffisantes (44x44px min)

---

### 2. ViewCounter (Compteur de vues)

#### Test 2.1 : Badge dans BlogPostCard
- [ ] Ouvrir `/blog` (liste des articles)
- [ ] Vérifier présence badge 👁️ sur chaque article
- [ ] Vérifier format : "👁️ 234" ou "👁️ 1.2k"
- [ ] Vérifier affichage dans les 3 variantes :
  - Default card (grande)
  - Compact card (petite)
  - Featured card (mise en avant)

#### Test 2.2 : Badge dans BlogPostPage
- [ ] Ouvrir un article de blog
- [ ] Vérifier badge 👁️ dans la zone meta (après tags)
- [ ] Vérifier style : rounded-full, bg-neutral-900/50

#### Test 2.3 : Incrémentation automatique
- [ ] Ouvrir un article (note le nombre de vues)
- [ ] Rafraîchir la page (F5)
- [ ] Vérifier nombre de vues +1
- [ ] Rafraîchir 3-4 fois supplémentaires
- [ ] Vérifier incrémentation continue

#### Test 2.4 : Animation du compteur
- [ ] Utiliser variant="default" si disponible
- [ ] Observer animation spring du 0 vers valeur finale
- [ ] Vérifier fluidité (pas de saccades)
- [ ] Durée ~1 seconde environ

#### Test 2.5 : Formatage des nombres
- [ ] Vérifier < 1000 → nombre complet (ex: 234)
- [ ] Vérifier >= 1000 → format "k" (ex: 1.2k)
- [ ] Vérifier >= 1000000 → format "M" (ex: 2.5M)

#### Test 2.6 : Tendance (si activée)
- [ ] Vérifier icône 📈 TrendingUp
- [ ] Vérifier pourcentage affiché (ex: +15%)
- [ ] Vérifier couleur mint si positif
- [ ] Vérifier couleur red si négatif

---

### 3. TrustBadges

#### Test 3.1 : Footer badges
- [ ] Scroller jusqu'au footer
- [ ] Vérifier présence de 4 badges compacts :
  - ⭐ 4.9/5 - Note moyenne
  - 🏆 50+ - Projets réussis
  - ✅ 100% - Clients satisfaits
  - 🛡️ 5 ans - D'expérience
- [ ] Vérifier style : rounded-full, inline badges

#### Test 3.2 : Animations badges
- [ ] Hover sur chaque badge
- [ ] Vérifier absence d'animation (compact variant)
- [ ] Vérifier lisibilité des icônes
- [ ] Vérifier alignement correct

#### Test 3.3 : Responsive badges
- [ ] Tester sur mobile (< 768px)
- [ ] Vérifier wrap des badges (2 lignes si nécessaire)
- [ ] Vérifier espacement gap-4 correct
- [ ] Vérifier pas de débordement

#### Test 3.4 : Couleurs personnalisées
- [ ] Vérifier couleur or (#FFD700) pour 4.9/5
- [ ] Vérifier couleur mint (#00FFC2) pour 50+
- [ ] Vérifier couleur turquoise (#00D9A6) pour 100%
- [ ] Vérifier couleur vert (#00B38A) pour 5 ans

#### Test 3.5 : TrustpilotBadge (si utilisé)
- [ ] Vérifier 5 étoiles vertes (#00B67A)
- [ ] Vérifier texte "Excellent"
- [ ] Vérifier "4.9 sur Trustpilot"
- [ ] Vérifier hover scale 1.05

#### Test 3.6 : GoogleReviewsBadge (si utilisé)
- [ ] Vérifier 5 étoiles jaunes (#FBBC04)
- [ ] Vérifier "5.0"
- [ ] Vérifier "Google Reviews"
- [ ] Vérifier hover scale 1.05

---

### 4. ReadingTime

#### Test 4.1 : Affichage dans cards
- [ ] Ouvrir `/blog`
- [ ] Vérifier présence 🕐 sur chaque article
- [ ] Vérifier format : "X min" ou "X min de lecture"
- [ ] Vérifier cohérence (articles longs > minutes)

#### Test 4.2 : Affichage dans article
- [ ] Ouvrir un article
- [ ] Vérifier présence 🕐 dans meta header
- [ ] Vérifier format : "5 min de lecture"
- [ ] Vérifier cohérence avec longueur de l'article

#### Test 4.3 : Calcul automatique
- [ ] Créer un nouvel article court (100 mots)
- [ ] Vérifier temps ≈ 1 min
- [ ] Créer un article long (2000 mots)
- [ ] Vérifier temps ≈ 10 min
- [ ] Formule : mots / 200 (wpm)

---

## 🎯 Tests d'intégration

### Test INT-1 : BlogPostPage complète
- [ ] Ouvrir un article de blog
- [ ] Vérifier présence simultanée de :
  - [ ] ReadingTime dans header
  - [ ] ViewCounter badge dans header
  - [ ] SocialShare buttons (section 1)
  - [ ] SocialShare buttons (section 2)
- [ ] Vérifier aucun conflit visuel
- [ ] Vérifier alignements corrects

### Test INT-2 : BlogPostCard complète
- [ ] Ouvrir `/blog`
- [ ] Vérifier sur chaque card :
  - [ ] ReadingTime affiché
  - [ ] ViewCounter affiché (si views > 0)
  - [ ] Pas de chevauchement
  - [ ] Alignement horizontal correct

### Test INT-3 : Footer complet
- [ ] Scroller au footer
- [ ] Vérifier présence de :
  - [ ] TrustBadges
  - [ ] Newsletter form
  - [ ] Social icons
  - [ ] Copyright
- [ ] Vérifier espacements corrects
- [ ] Vérifier ordre logique

---

## 📊 Tests Analytics

### Test ANA-1 : Tracking social share
- [ ] Ouvrir console développeur
- [ ] Onglet Network, filtrer "analytics" ou "ga4"
- [ ] Cliquer sur bouton Twitter
- [ ] Vérifier envoi événement :
  ```
  event: social_share
  platform: Twitter
  content_type: blog
  ```
- [ ] Répéter pour LinkedIn, Facebook, Copy Link

### Test ANA-2 : Tracking page view
- [ ] Ouvrir un article
- [ ] Vérifier appel POST à `/blog/posts/:slug/view`
- [ ] Vérifier status 200 OK
- [ ] Vérifier incrémentation dans DB (optional)

---

## ♿ Tests Accessibilité

### Test A11Y-1 : Navigation clavier
- [ ] Utiliser Tab pour naviguer
- [ ] Vérifier focus visible sur :
  - [ ] Boutons social share
  - [ ] TrustBadges (si cliquables)
- [ ] Vérifier ordre logique de tabulation

### Test A11Y-2 : ARIA labels
- [ ] Inspecter boutons social share
- [ ] Vérifier aria-label="Partager sur Twitter"
- [ ] Vérifier aria-label="Partager sur LinkedIn"
- [ ] Vérifier aria-label="Copier le lien"

### Test A11Y-3 : Contraste couleurs
- [ ] Utiliser outil contraste (ex: WAVE, axe DevTools)
- [ ] Vérifier mint (#00FFC2) sur noir : Ratio > 7:1 ✅
- [ ] Vérifier blanc (#F4F4F4) sur noir : Ratio > 15:1 ✅
- [ ] Vérifier tous badges : Ratio > 4.5:1

### Test A11Y-4 : Screen reader
- [ ] Activer screen reader (NVDA, JAWS, VoiceOver)
- [ ] Naviguer vers social buttons
- [ ] Vérifier annonce correcte : "Partager sur Twitter, bouton"
- [ ] Vérifier annonce ViewCounter : "1234 vues"
- [ ] Vérifier annonce ReadingTime : "5 minutes de lecture"

---

## 📱 Tests Responsive

### Test RES-1 : Mobile (375px)
- [ ] Ouvrir DevTools, mode responsive 375px
- [ ] Vérifier SocialShare :
  - [ ] Stack vertical des boutons
  - [ ] Labels visibles
  - [ ] Boutons cliquables (min 44x44px)
- [ ] Vérifier TrustBadges :
  - [ ] 2 colonnes max
  - [ ] Wrap correct
  - [ ] Pas de débordement

### Test RES-2 : Tablet (768px)
- [ ] Mode responsive 768px
- [ ] Vérifier SocialShare :
  - [ ] Horizontal OK
  - [ ] Pas de wrap
- [ ] Vérifier TrustBadges :
  - [ ] 4 colonnes ou 2 lignes
  - [ ] Espacements corrects

### Test RES-3 : Desktop (1920px)
- [ ] Mode responsive 1920px
- [ ] Vérifier tout s'affiche correctement
- [ ] Vérifier pas trop d'espace vide
- [ ] Vérifier centrage des éléments

---

## ⚡ Tests Performance

### Test PERF-1 : Temps de chargement
- [ ] Ouvrir Network tab
- [ ] Charger article de blog
- [ ] Vérifier composants chargent < 100ms
- [ ] Vérifier pas de requests inutiles

### Test PERF-2 : Animations fluides
- [ ] Hover rapidement sur plusieurs badges
- [ ] Vérifier pas de lag
- [ ] Vérifier 60fps constant
- [ ] Utiliser Performance tab si nécessaire

### Test PERF-3 : ViewCounter animation
- [ ] Charger article avec nombreuses vues (10k+)
- [ ] Observer animation du compteur
- [ ] Vérifier fluidité (spring animation)
- [ ] Vérifier pas de freeze UI

---

## 🐛 Tests Edge Cases

### Test EDGE-1 : Vues = 0
- [ ] Article avec 0 vues
- [ ] Vérifier badge ViewCounter caché
- [ ] Ou vérifier affichage "0 vues" si design le permet

### Test EDGE-2 : Très nombreuses vues
- [ ] Simuler 1,500,000 vues
- [ ] Vérifier format "1.5M"
- [ ] Vérifier pas de débordement UI
- [ ] Vérifier animation reste fluide

### Test EDGE-3 : Article sans tags
- [ ] Article sans aucun tag
- [ ] Vérifier pas d'erreur console
- [ ] Vérifier layout reste correct
- [ ] Vérifier social share fonctionne (hashtags vides)

### Test EDGE-4 : Titre très long
- [ ] Article avec titre de 200 caractères
- [ ] Partager sur Twitter
- [ ] Vérifier troncature si nécessaire
- [ ] Vérifier pas d'erreur

### Test EDGE-5 : URL spéciale
- [ ] Article avec slug contenant caractères spéciaux
- [ ] Vérifier encodage URL correct
- [ ] Vérifier partage fonctionne
- [ ] Vérifier copie lien correcte

---

## ✅ Résumé des tests

### Tests obligatoires (Must-have)
- [x] Social share buttons visibles et fonctionnels
- [x] ViewCounter s'incrémente automatiquement
- [x] ReadingTime affiché correctement
- [x] TrustBadges présents dans footer
- [x] Responsive mobile OK
- [x] Accessibilité basique (labels, contraste)

### Tests recommandés (Should-have)
- [ ] Analytics tracking fonctionne
- [ ] Animations fluides 60fps
- [ ] Navigation clavier complète
- [ ] Screen reader compatible
- [ ] Edge cases gérés

### Tests optionnels (Nice-to-have)
- [ ] Performance < 100ms
- [ ] SEO meta tags social share
- [ ] Open Graph images
- [ ] Twitter Cards

---

## 🚀 Commandes rapides

### Test rapide complet (2 minutes)
```bash
# 1. Social Share
Ouvrir article → Cliquer Twitter → Popup OK ✅
Cliquer Copier → Toast "Copié" ✅

# 2. ViewCounter
Rafraîchir 3x → Vues +3 ✅

# 3. TrustBadges
Scroller footer → 4 badges visibles ✅

# 4. ReadingTime
Vérifier "X min" sur cards ✅
```

### Debug rapide
```javascript
// Console DevTools
// Vérifier ViewCounter
document.querySelector('[class*="Eye"]').textContent

// Vérifier SocialShare
document.querySelectorAll('[aria-label*="Partager"]').length // = 4

// Vérifier TrustBadges
document.querySelectorAll('footer [class*="badge"]').length // >= 4
```

---

## 📝 Rapport de bugs (Template)

```markdown
### Bug : [Titre court]

**Composant :** SocialShare | ViewCounter | TrustBadges | ReadingTime
**Priorité :** 🔴 Critique | 🟠 Haute | 🟡 Moyenne | 🟢 Basse

**Steps to reproduce :**
1. Ouvrir...
2. Cliquer...
3. Observer...

**Résultat attendu :**
...

**Résultat actuel :**
...

**Screenshot :**
[Ajouter capture d'écran]

**Browser :** Chrome 120 | Firefox 121 | Safari 17
**Device :** Desktop | Mobile | Tablet
**Screen size :** 375px | 768px | 1920px
```

---

**Dernière mise à jour : 7 novembre 2024**
**Status : ✅ Tous les composants testables**
