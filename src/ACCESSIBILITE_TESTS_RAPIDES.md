# ♿ Tests d'Accessibilité Rapides - À Faire MAINTENANT

## 🚀 5 Tests en 5 Minutes

### 1. Test Clavier (1 min)
```
1. Ouvre le site
2. NE TOUCHE PAS la souris
3. Appuie sur Tab plusieurs fois
```

**✅ Tu dois voir** :
- Ring **mint (#00FFC2)** autour de chaque élément au focus
- Ordre logique : Logo → Nav → Contenu → Footer
- Skip link apparaît en premier : "Aller au contenu principal"

**❌ Problème si** :
- Pas de ring visible
- Tu ne peux pas accéder à un bouton/lien
- L'ordre est bizarre

---

### 2. Test Skip Navigation (30 sec)
```
1. Ouvre la page d'accueil
2. Appuie sur Tab UNE FOIS
3. Tu vois "Aller au contenu principal"
4. Appuie sur Entrée
```

**✅ Tu dois voir** :
- Le focus saute directement au contenu principal
- Bye bye la navigation !

---

### 3. Test Contraste (1 min)
```
1. Ouvre Chrome DevTools (F12)
2. Lighthouse → Accessibility → Analyze
3. Attends 10 secondes
```

**✅ Score attendu** : **95-100/100**

**Détails** :
- Blanc sur noir : 21:1 ✅
- Mint sur noir : 11.8:1 ✅
- Texte secondaire : 9.7:1 ✅

---

### 4. Test Zoom (1 min)
```
1. Appuie sur Ctrl/Cmd + "+" 4 fois (zoom 200%)
2. Navigue sur le site
```

**✅ Tu dois pouvoir** :
- Lire tout le texte
- Cliquer sur tous les boutons
- PAS de scroll horizontal

---

### 5. Test Screen Reader (2 min - optionnel)

**Sur Windows avec NVDA** :
```
1. Télécharge NVDA : https://www.nvaccess.org/
2. Installe et lance
3. Ouvre le site
4. Utilise les flèches
```

**Sur Mac avec VoiceOver** :
```
1. Cmd + F5 (active VoiceOver)
2. Ctrl + Option + Flèches pour naviguer
3. Ctrl + Option + Espace pour cliquer
```

**✅ Tu dois entendre** :
- Tous les titres annoncés
- Tous les boutons ont un nom
- Les images ont des descriptions
- "Navigation principale", "Contenu principal"

---

## 🎯 Checklist Rapide

Vérifie en 30 secondes :

- [ ] **F12 → Elements → Inspect** un bouton → Onglet **Accessibility**
  - Doit avoir un **Name** (pas vide)
  - Doit avoir un **Role** (button, link, etc.)

- [ ] **Tab** sur toute la page
  - Tous les éléments ont un **focus visible** (ring mint)

- [ ] Cherche `<img` dans le code (Ctrl+F)
  - Tous doivent avoir `alt="..."`

- [ ] Cherche `<input` dans le code
  - Tous doivent avoir un `<label>` ou `aria-label`

---

## 🐛 Problèmes Courants & Solutions

### Problème : Focus pas visible
**Solution** :
```tsx
// Ajoute className avec focus:
className="... focus:ring-4 focus:ring-mint/50 focus:outline-none"
```

### Problème : Image sans alt
**Solution** :
```tsx
// Image importante
<img src="..." alt="Description de l'image" />

// Image décorative
<img src="..." alt="" aria-hidden="true" />
```

### Problème : Bouton sans label
**Solution** :
```tsx
// Si icône uniquement
<button aria-label="Fermer le menu">
  <X />
</button>

// Ou avec screen reader text
<button>
  <X />
  <span className="sr-only">Fermer le menu</span>
</button>
```

### Problème : Modal sans ARIA
**Solution** :
```tsx
import { getModalAriaProps } from './utils/a11y/ariaLabels';

<div {...getModalAriaProps('modal-title', 'modal-desc')}>
  <h2 id="modal-title">Titre</h2>
  <p id="modal-desc">Description</p>
</div>
```

---

## ⚡ Quick Fixes

### Améliorer un bouton
```tsx
// AVANT ❌
<button onClick={handleClick}>
  <Icon />
</button>

// APRÈS ✅
<button 
  onClick={handleClick}
  aria-label="Fermer"
  className="focus:ring-4 focus:ring-mint/50"
>
  <Icon />
  <span className="sr-only">Fermer</span>
</button>
```

### Améliorer un lien
```tsx
// AVANT ❌
<a href="/contact">Contact</a>

// APRÈS ✅
<a 
  href="/contact"
  className="focus:ring-4 focus:ring-mint/50 focus:outline-none"
>
  Contact
</a>
```

### Améliorer un input
```tsx
// AVANT ❌
<input type="email" placeholder="Email" />

// APRÈS ✅
<label htmlFor="email" className="sr-only">
  Adresse email
</label>
<input 
  id="email"
  type="email" 
  placeholder="Email"
  aria-required="true"
  className="focus:ring-2 focus:ring-mint focus:border-mint"
/>
```

---

## 📊 Résultat Attendu

Après ces tests, tu devrais avoir :

| Test | Score | Status |
|------|-------|--------|
| Navigation clavier | 100% accessible | ✅ |
| Skip navigation | Fonctionne | ✅ |
| Contraste Lighthouse | 95-100/100 | ✅ |
| Zoom 200% | Utilisable | ✅ |
| Screen reader | Tout lisible | ✅ |

---

## 🎯 Action Immédiate

**TESTE MAINTENANT** :

1. Ouvre le site
2. Appuie sur **Tab**
3. Tu dois voir un **ring mint** autour du premier élément
4. Continue Tab → Tout doit être accessible

**C'est bon ?** ✅ Ton site est accessible !
**Problème ?** ❌ Regarde `/ACCESSIBILITE_GUIDE_COMPLET.md`

---

**Date** : 7 Novembre 2024  
**Temps de test** : 5 minutes  
**Objectif** : Vérifier que tout est OK
