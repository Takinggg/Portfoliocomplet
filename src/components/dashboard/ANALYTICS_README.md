# Analytics Tab - Guide d'utilisation

## Bouton Actualiser

### Fonctionnalités

Le bouton **Actualiser** permet de rafraîchir toutes les données du dashboard en temps réel.

### Comportements

1. **Clic sur le bouton**
   - Lance une requête pour récupérer les dernières données
   - Affiche une animation de rotation sur l'icône
   - Change le texte en "Actualisation..."
   - Désactive le bouton pendant le processus

2. **Pendant l'actualisation**
   - Icône RefreshCw en rotation continue
   - Indicateur visuel avec point vert pulsant
   - Message "Actualisation des données en cours..."
   - Bouton désactivé pour éviter les clics multiples

3. **Après l'actualisation**
   - Toast de confirmation "Données actualisées avec succès !"
   - Réanimation des KPIs avec effet de bounce
   - Mise à jour de l'horodatage "Mis à jour {temps}"
   - Bouton réactivé

### États de l'horodatage

- **À l'instant** : < 1 minute
- **Il y a X min** : < 1 heure
- **Il y a Xh** : < 24 heures
- **HH:MM** : > 24 heures

### Animations

1. **Bouton hover** 
   - Scale 1.02
   - Rotation 180° de l'icône
   - Couleur de bordure vers #00FFC2

2. **Bouton tap**
   - Scale 0.98

3. **KPIs refresh**
   - Réanimation de tous les KPIs
   - Effet de rebond sur les valeurs

### Props

```typescript
interface AnalyticsTabProps {
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  quotes: Quote[];
  onRefresh?: () => void;      // Fonction de rafraîchissement
  loading?: boolean;            // État de chargement global
}
```

### Gestion d'erreurs

En cas d'erreur lors de l'actualisation :
- Toast d'erreur "Erreur lors de l'actualisation"
- Log console avec les détails de l'erreur
- Bouton réactivé automatiquement

### Code exemple

```tsx
<AnalyticsTab 
  leads={leads}
  clients={clients}
  projects={projects}
  invoices={invoices}
  quotes={quotes}
  onRefresh={fetchAllData}  // Fonction qui recharge toutes les données
  loading={loading}
/>
```

## Design System

### Couleurs

- **Bouton normal** : `bg-white/5` avec border `white/10`
- **Bouton hover** : `bg-[#00FFC2]/10` avec border `[#00FFC2]/40`
- **Icône** : White → `#00FFC2` au hover
- **Point pulsant** : `#00FFC2`

### Responsive

- **Mobile** : Bouton pleine largeur
- **Desktop** : Bouton largeur automatique

### Accessibilité

- État disabled clairement visible
- Feedback visuel immédiat (animation)
- Messages textuels descriptifs
- Toast pour confirmation
