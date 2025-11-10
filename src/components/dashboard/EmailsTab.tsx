/**
 * Composant EmailsTab - Vue Emails pour le Dashboard
 * 
 * Ce composant peut être importé et utilisé directement dans DashboardPage
 * comme n'importe quelle autre vue (Leads, Clients, Projects, etc.)
 */

import EmailSettings from "./EmailSettings";

export default function EmailsTab() {
  return <EmailSettings />;
}

/**
 * UTILISATION DANS DASHBOARDPAGE:
 * 
 * 1. Import :
 *    import EmailsTab from "../dashboard/EmailsTab";
 * 
 * 2. Ajouter dans le rendu conditionnel :
 *    {currentView === "emails" && <EmailsTab />}
 * 
 * 3. Ou dans un TabsContent :
 *    <TabsContent value="emails">
 *      <EmailsTab />
 *    </TabsContent>
 */
