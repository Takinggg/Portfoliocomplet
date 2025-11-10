# 🌍 Guide d'Intégration du Sélecteur de Langue dans le Dashboard

## Option 1 : Intégration dans DashboardLayout (Recommandé)

### Localisation du fichier
`/components/dashboard/DashboardLayout.tsx`

### Code à ajouter

```tsx
import { LanguageSelector } from './LanguageSelector';

// Dans le composant DashboardLayout, ajouter dans le header :
<header className="border-b border-white/10 bg-[#0C0C0C]/95 backdrop-blur-sm sticky top-0 z-50">
  <div className="flex items-center justify-between px-6 py-4">
    <h1 className="text-xl font-semibold text-white">Dashboard</h1>
    
    <div className="flex items-center gap-4">
      {/* Nouveau : Sélecteur de langue */}
      <LanguageSelector />
      
      {/* Bouton de déconnexion existant */}
      <Button onClick={onLogout} variant="ghost">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  </div>
</header>
```

## Option 2 : Intégration dans DashboardPage

### Localisation du fichier
`/components/pages/DashboardPage.tsx`

### Code à ajouter

```tsx
import { LanguageSelector } from '../dashboard/LanguageSelector';

// Dans le header du dashboard :
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
    <p className="text-white/60">Bienvenue sur votre tableau de bord</p>
  </div>
  
  <div className="flex items-center gap-4">
    {/* Nouveau : Sélecteur de langue */}
    <LanguageSelector />
    
    <Button onClick={onLogout} variant="outline">
      <LogOut className="h-4 w-4 mr-2" />
      Déconnexion
    </Button>
  </div>
</div>
```

## Option 3 : Intégration dans la Navigation Principale

### Si vous voulez que le sélecteur soit visible partout

```tsx
// Dans /components/layout/Navigation.tsx
import { LanguageSelector } from '../dashboard/LanguageSelector';

// Ajouter dans le header principal :
<div className="flex items-center gap-4">
  <LanguageSelector />
  
  {/* Autres boutons de navigation */}
  <Button onClick={() => onNavigate('login')}>Login</Button>
</div>
```

## 🎨 Personnalisation du Style

Le composant LanguageSelector est déjà stylisé pour correspondre à votre design :
- Couleur active : `#00FFC2` (mint)
- Couleur inactive : `white/60`
- Hover : transitions fluides
- Background : cohérent avec le dashboard

### Variantes de style

#### Version compacte (icône uniquement)
```tsx
<div className="flex gap-1">
  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
    FR
  </Button>
  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
    EN
  </Button>
</div>
```

#### Version avec dropdown
```tsx
<Select value={language} onValueChange={setLanguage}>
  <SelectTrigger className="w-20">
    <Globe className="h-4 w-4 mr-2" />
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="fr">FR</SelectItem>
    <SelectItem value="en">EN</SelectItem>
  </SelectContent>
</Select>
```

## 🔄 Utilisation des Traductions dans le Dashboard

Une fois le sélecteur intégré, utilisez les traductions :

```tsx
import { useTranslation } from '../../utils/i18n/useTranslation';

function DashboardTab() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('dashboard.navigation.overview')}</h2>
      <p>{t('dashboard.stats.totalLeads')}</p>
      <Button>{t('dashboard.actions.create')}</Button>
    </div>
  );
}
```

## 📋 Traductions Disponibles

### Navigation
- `dashboard.navigation.overview`
- `dashboard.navigation.leads`
- `dashboard.navigation.clients`
- `dashboard.navigation.projects`
- etc.

### Statuts
- `dashboard.status.new`
- `dashboard.status.active`
- `dashboard.status.completed`
- etc.

### Actions
- `dashboard.actions.create`
- `dashboard.actions.edit`
- `dashboard.actions.delete`
- etc.

### Messages
- `dashboard.messages.saveSuccess`
- `dashboard.messages.deleteConfirm`
- etc.

## ✅ Checklist d'Intégration

- [ ] Importer LanguageSelector
- [ ] Ajouter dans le header du dashboard
- [ ] Tester le changement de langue
- [ ] Vérifier que tous les textes se mettent à jour
- [ ] Tester la persistance (rechargement de page)
- [ ] Vérifier le style responsive

## 🎯 Résultat Attendu

Après intégration :
1. Les boutons FR/EN sont visibles dans le header
2. Cliquer change la langue immédiatement
3. Tous les textes du dashboard se mettent à jour
4. La préférence est sauvegardée
5. Les pages d'études de cas affichent le bon contenu

## 🚀 Test Rapide

```typescript
// Dans la console du navigateur :
console.log('Langue actuelle:', localStorage.getItem('language'));

// Changer manuellement :
localStorage.setItem('language', 'en');
location.reload();
```

## 📝 Notes

- Le composant utilise le contexte de langue global
- Aucune prop nécessaire
- Synchronisation automatique avec toute l'app
- Style cohérent avec la palette du projet

Voilà ! Le sélecteur de langue est prêt à être intégré où vous le souhaitez. 🎉
