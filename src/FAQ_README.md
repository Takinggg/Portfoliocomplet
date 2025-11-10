# 📚 Système FAQ - Guide d'utilisation

## 🎯 Quick Start (3 étapes)

1. **Login** → `/dashboard` (ou `/login`)
2. **Onglet FAQ** → Cliquer sur le bouton gradient **🟣 violet-rose**
3. **Done !** → 6 catégories + 37 questions créées ✅

**Le bouton apparaît :** En haut à droite OU au centre si page vide

## Vue d'ensemble

Le système FAQ est complet avec:
- **37 questions** professionnelles réparties en **6 catégories**
- **Bouton d'initialisation** visible dans le dashboard (gradient violet-rose 🟣)
- Interface de gestion complète dans le dashboard
- Page publique `/faq` avec recherche et filtres
- Seed automatique en 1 clic

## 🎯 Catégories (6 total - 37 questions)

### 1. **Services** (8 questions) 🎨
   - Quels services proposez-vous ?
   - Travaillez-vous avec des technologies spécifiques ?
   - Proposez-vous de la maintenance après livraison ?
   - Pouvez-vous reprendre un projet existant ?
   - Travaillez-vous seul ou en équipe ?
   - Pouvez-vous créer une application mobile ?
   - Proposez-vous des formations ?
   - Faites-vous du design ou seulement du développement ?

### 2. **Tarifs & Paiement** (6 questions) 💰
   - Comment sont calculés vos tarifs ?
   - Quels sont vos délais de paiement ?
   - Proposez-vous des forfaits ou packages ?
   - Quel est votre tarif journalier (TJM) ?
   - Les frais d'hébergement sont-ils inclus ?
   - Proposez-vous des réductions pour startups ou associations ?

### 3. **Processus & Délais** (6 questions) ⏱️
   - Combien de temps dure un projet en moyenne ?
   - Comment se déroule un projet avec vous ?
   - Combien de révisions sont incluses ?
   - Que se passe-t-il si le projet prend du retard ?
   - Puis-je voir l'avancement du projet en temps réel ?
   - Comment se déroule la livraison finale ?

### 4. **Communication** (5 questions) 💬
   - Comment communiquons-nous pendant le projet ?
   - Sous quels délais répondez-vous aux messages ?
   - Travaillez-vous à distance ou en présentiel ?
   - Quelle est votre disponibilité horaire ?
   - Comment se passe le premier contact ?

### 5. **Technique** (7 questions) 🛠️
   - Mon site sera-t-il responsive et mobile-friendly ?
   - Le site sera-t-il optimisé pour le SEO ?
   - Puis-je modifier le site moi-même après livraison ?
   - Quelles sont les performances garanties ?
   - Mon site sera-t-il accessible (WCAG) ?
   - Proposez-vous l'intégration d'APIs tierces ?
   - Le code source sera-t-il documenté ?

### 6. **Légal & Sécurité** (5 questions) 🔒
   - Mes données et mon projet sont-ils sécurisés ?
   - Qui possède les droits sur le code et le design ?
   - Signons-nous un contrat ?
   - Êtes-vous assuré en responsabilité civile professionnelle ?
   - Comment sont traitées les données personnelles (RGPD) ?

## 🚀 Initialisation rapide

### Option 1 : Via le Dashboard (Recommandé) 🎯

1. Connectez-vous au dashboard à `/dashboard` (ou `/login`)
2. Allez dans l'onglet **Contenu > FAQ**
3. **Le bouton d'initialisation apparaît si aucune donnée n'existe :**
   - 🟣 **En haut à droite** → Bouton gradient violet-rose : "Initialiser FAQ (6 cat. + 37 Q)"
   - 🟣 **Au centre de la page** → Gros bouton avec détails complets (si totalement vide)
4. Cliquez sur le bouton gradient violet → rose
5. ✅ Les 6 catégories et 37 questions sont créées instantanément !

**🎨 Visuel :** Le bouton est un magnifique gradient violet → rose avec une ombre, impossible à rater !

### Option 2 : Via la console navigateur

1. Ouvrez la console développeur (`F12`)
2. Assurez-vous d'être connecté au dashboard
3. Exécutez :
```javascript
await window.seedFAQData()
```
4. Résultat :
```
📦 Creating FAQ categories...
✅ Created category: Services
✅ Created category: Tarifs & Paiement
✅ Created category: Processus & Délais
✅ Created category: Communication
✅ Created category: Technique
✅ Created category: Légal & Sécurité
📋 Creating FAQ questions...
✅ Created question: Quels services proposez-vous ?
... (37 questions créées)
🎉 FAQ SEEDING COMPLETED!
✅ Created 6 categories
✅ Created 37 questions
```

## 📊 Statistiques

| Catégorie | Nombre de questions | Mots-clés moyens |
|-----------|---------------------|------------------|
| Services | 8 | 6-7 |
| Tarifs & Paiement | 6 | 5-7 |
| Processus & Délais | 6 | 5-6 |
| Communication | 5 | 4-6 |
| Technique | 7 | 5-7 |
| Légal & Sécurité | 5 | 5-6 |
| **TOTAL** | **37** | **~200 mots-clés** |

**📈 Coverage complet :**
- ✅ Toutes les questions classiques d'un freelance
- ✅ Informations sur services, tarifs, processus
- ✅ Aspects légaux et sécurité couverts
- ✅ Questions techniques détaillées
- ✅ Communication et disponibilité

## 📋 Gestion dans le Dashboard

### Onglet Questions
- **Recherche** : Recherchez dans les questions et réponses
- **Filtres** : Filtrez par catégorie
- **Actions** :
  - ➕ Nouvelle question
  - ✏️ Modifier une question
  - 🗑️ Supprimer une question
  - 👁️ Prévisualiser (expand/collapse)
  - 📝 Statut brouillon/publié

### Onglet Catégories
- Voir toutes les catégories avec le nombre de questions
- Créer/Modifier/Supprimer des catégories
- Personnaliser icône et couleur

## 🌐 Page publique

Accessible à `/faq` :
- Design minimaliste style Linear/Vercel
- Recherche en temps réel
- Filtrage par catégorie
- Animations fluides avec Motion
- SEO optimisé
- Responsive mobile-first

### Fonctionnalités
- **Hero animé** avec background flou
- **Barre de recherche** avec compteur de résultats
- **Filtres catégories** en chips cliquables
- **Accordéon** pour questions/réponses
- **CTA final** pour contact et réservation
- **Fallback data** si base vide (utilise des données par défaut)

## 🔧 Architecture technique

### Backend (Supabase Edge Function)
Routes API dans `/supabase/functions/server/index.tsx` :

```
GET    /faq-categories           # Toutes les catégories
POST   /faq-categories           # Créer catégorie (auth)
PUT    /faq-categories/:id       # Modifier catégorie (auth)
DELETE /faq-categories/:id       # Supprimer catégorie (auth)

GET    /faq-questions            # Toutes les questions (auth)
GET    /faq-questions/published  # Questions publiées (public)
POST   /faq-questions            # Créer question (auth)
PUT    /faq-questions/:id        # Modifier question (auth)
DELETE /faq-questions/:id        # Supprimer question (auth)
```

### Frontend
- **Dashboard** : `/components/dashboard/FAQTab.tsx`
- **Page publique** : `/components/pages/FAQPage.tsx`
- **Seed function** : `/utils/seedFAQ.ts`

### Stockage
Données stockées dans le KV store Supabase avec préfixes :
- `faq_category:{timestamp}` pour les catégories
- `faq_question:{timestamp}` pour les questions

## 📝 Personnalisation

### Ajouter une nouvelle question via le dashboard
1. Cliquez sur **"Nouvelle question"**
2. Remplissez :
   - Question *
   - Réponse *
   - Catégorie *
   - Mots-clés (séparés par des virgules)
   - Statut publié/brouillon
3. Cliquez sur **"Créer"**

### Modifier les questions par défaut
Éditez `/utils/seedFAQ.ts` dans le tableau `questions` :
```typescript
{
  question: "Votre question ?",
  answer: "Votre réponse détaillée...",
  categoryId: categoryMap["Nom de la catégorie"],
  keywords: ["mot1", "mot2", "mot3"],
  isPublished: true
}
```

### Ajouter une catégorie par défaut
Éditez `/utils/seedFAQ.ts` dans le tableau `categories` :
```typescript
{
  name: "Nouvelle catégorie",
  icon: "IconName",  // De lucide-react
  color: "text-color-400"
}
```

## 🎨 Personnalisation du design

### Couleurs
Les couleurs sont définies dans le système :
- Primaire : `#00FFC2` (turquoise)
- Fond : `#0C0C0C` (noir)
- Texte : `#F4F4F4` (blanc cassé)

### Icônes disponibles
- HelpCircle, Sparkles, MessageSquare, Code
- DollarSign, Clock, Shield, Zap
- Et toutes les icônes de `lucide-react`

## 🐛 Debug

### Le bouton "Initialiser FAQ" n'apparaît pas ?
**Causes possibles :**
1. **Vous avez déjà des données** → Le bouton apparaît UNIQUEMENT si `categories.length === 0` OU `questions.length === 0`
2. **Solution** : Si vous voulez réinitialiser, supprimez d'abord les catégories/questions existantes
3. **Vérification** : Regardez le compteur en haut : "X catégories • Y questions"
4. **Alternative** : Le bouton apparaît aussi dans le header (en haut à droite) si au moins une des deux listes est vide

**Position du bouton :**
- 🟣 **Header** (en haut à droite) : Si `categories === 0` OU `questions === 0`
- 🟣 **Centre page Questions** : Si `questions === 0`
- 🟣 **Centre page Catégories** : Si `categories === 0`

### Les questions ne s'affichent pas ?
1. Vérifiez la console navigateur pour les erreurs API
2. Assurez-vous d'être connecté pour seed les données
3. Vérifiez que l'API backend est accessible
4. Regardez les logs de la fonction Supabase

### La fonction seed ne fonctionne pas ?
1. Assurez-vous d'être authentifié : `await supabase.auth.getSession()`
2. Vérifiez les tokens dans le header Authorization
3. Consultez les logs dans la console : `window.seedFAQData()` affiche chaque étape
4. Vérifiez que le message de seed s'affiche dans la console au démarrage (cadre violet)

### Fallback data vs Database
- La page publique `/faq` affiche toujours les **37 questions fallback** en cas d'erreur ou si la base est vide
- Ces 37 questions sont identiques à celles du seed pour cohérence
- Pour utiliser vos propres données personnalisables, exécutez la fonction seed ou créez-les manuellement
- Une fois les données en base, elles remplacent automatiquement le fallback

## ✅ Checklist de validation

### Setup initial
- [ ] Dashboard accessible à `/dashboard` (ou `/login` puis onglet Dashboard)
- [ ] Onglet **Contenu > FAQ** visible
- [ ] Bouton **"Initialiser FAQ"** visible (gradient violet-rose 🟣)
  - Si pas visible → vérifier qu'il n'y a pas déjà des données
  - Position : en haut à droite OU au centre si page vide
- [ ] Seed exécuté avec succès : toast vert "✅ 6 catégories et 37 questions créées !"
- [ ] Les 6 catégories sont créées
- [ ] Les 37 questions sont créées

### Page publique
- [ ] Page publique `/faq` accessible
- [ ] Toutes les questions s'affichent par catégorie
- [ ] Recherche fonctionne correctement
- [ ] Filtres par catégorie fonctionnent
- [ ] Accordéons s'ouvrent/ferment correctement
- [ ] Design responsive sur mobile

### Dashboard - Gestion
- [ ] Création manuelle de question fonctionne
- [ ] Modification de question fonctionne
- [ ] Suppression de question fonctionne
- [ ] Création de catégorie fonctionne
- [ ] Publication/dépublication fonctionne

### CTAs & Navigation
- [ ] CTA "Me contacter" redirige vers `/contact`
- [ ] CTA "Réserver un appel" redirige vers `/booking`

## 🎨 Guide visuel rapide

### Où trouver le bouton d'initialisation ?

**📍 Position 1 : Header (en haut à droite)**
```
┌─────────────────────────────────────────────────────┐
│ Gestion FAQ                    🟣 Initialiser FAQ   │
│ 0 catégories • 0 questions      ➕ Nouvelle cat.   │
│                                  ➕ Nouvelle Q      │
└─────────────────────────────────────────────────────┘
```

**📍 Position 2 : Centre de page (si vide)**
```
┌─────────────────────────────────────────────────────┐
│                                                      │
│                      ❓                              │
│              Aucune question FAQ                     │
│                                                      │
│         🟣 Initialiser FAQ (6 cat. + 37 Q)          │
│              [GROS BOUTON VIOLET]                   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Après l'initialisation
```
✅ 6 catégories créées
✅ 37 questions créées  
✅ Page /faq opérationnelle
✅ Données personnalisables dans le dashboard
```

## 🚀 Prochaines évolutions possibles

- [ ] Export FAQ en PDF
- [ ] Analytics : questions les plus consultées
- [ ] Traduction multilingue
- [ ] Système de vote (helpful/not helpful)
- [ ] Widget FAQ intégrable dans d'autres pages
- [ ] AI search avec embedding sémantique

---

**💡 Astuce :** Toutes les modifications faites dans le dashboard sont instantanées et visibles sur la page publique `/faq`.

---

**💡 Astuce** : Les données FAQ sont parfaites pour le SEO ! Chaque question/réponse améliore le référencement de votre site sur les requêtes spécifiques.
