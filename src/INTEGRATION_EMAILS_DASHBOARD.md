# 🔧 Intégration Emails dans le Dashboard

## ✅ Fichiers Créés

1. **`/components/dashboard/EmailSettings.tsx`** - Interface de gestion des emails
2. **`/components/dashboard/DashboardRouter.tsx`** - Router pour la vue emails  
3. **`/components/dashboard/DashboardLayout.tsx`** - Layout avec navigation latérale
4. **`/supabase/functions/server/email_service.tsx`** - Service d'envoi d'emails

## 📋 Étapes d'Intégration dans DashboardPage.tsx

### Option 1 : Intégration Simple (Recommandée)

Ajouter un case dans le rendu des vues du Dashboard :

1. **Trouver la section qui rend les différentes vues** (probablement un switch/if ou des composants conditionnels)

2. **Ajouter cette condition** :

```typescript
// Dans la fonction de rendu principale
if (currentView === "emails") {
  return <EmailSettings />;
}
```

3. **Ou si utilisation de Tabs** :

```typescript
<TabsContent value="emails">
  <EmailSettings />
</TabsContent>
```

### Option 2 : Utilisation du DashboardLayout Complet

Si vous voulez refondre complètement le dashboard avec le nouveau layout :

```typescript
import DashboardLayout from "../dashboard/DashboardLayout";
import EmailSettings from "../dashboard/EmailSettings";

export default function DashboardPage({ onLogout, onNavigate }: DashboardPageProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  
  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <OverviewView {...props} />;
      case "leads":
        return <LeadsView {...props} />;
      case "clients":
        return <ClientsView {...props} />;
      case "projects":
        return <ProjectsView {...props} />;
      case "invoices":
        return <InvoicesView {...props} />;
      case "calendar":
        return <CalendarView {...props} />;
      case "emails":
        return <EmailSettings />;
      case "settings":
        return <SettingsView {...props} />;
      default:
        return <OverviewView {...props} />;
    }
  };

  return (
    <DashboardLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
```

## 🎯 Navigation

Le menu "Emails" est déjà configuré dans `DashboardLayout.tsx` avec :
- **Icône** : Mail (lucide-react)
- **Label** : "Emails"
- **View ID** : "emails"

## ✅ Fonctionnalités Emails

Une fois intégré, l'utilisateur pourra :

1. **Voir les templates configurés** (5 types d'emails)
2. **Envoyer manuellement les rappels de RDV** (pour demain)
3. **Envoyer les relances de factures** impayées
4. **Consulter la configuration** Resend

## 🔄 Emails Automatiques Déjà Actifs

Ces emails sont **déjà envoyés automatiquement** sans intervention :
- ✅ Confirmation contact (formulaire)
- ✅ Confirmation réservation RDV

## 📍 Localisation du Code

Le code d'intégration se trouve dans :
- **Ligne ~146** : `export default function DashboardPage`
- Chercher où `currentView` est utilisé pour le rendu
- Ajouter le case pour "emails"

## 🧪 Test

Après intégration :
1. Se connecter au dashboard
2. Cliquer sur "Emails" dans le menu latéral
3. Voir l'interface de gestion des emails
4. Tester "Envoyer les rappels" et "Envoyer les relances"

---

**Besoin d'aide ?** Consultez `/GUIDE_EMAILS_AUTOMATIQUES.md` pour la documentation complète.
