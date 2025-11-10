# 🌍 Migration du Blog Multilingue

## ✅ Ce qui a été fait

### 1. API Backend (`/supabase/functions/server/index.tsx`)

✅ **Modifié les routes blog pour supporter le multilingue :**

- `GET /blog/posts?lang=fr|en` : Retourne les articles avec les champs traduits
- `GET /blog/posts/:slug?lang=fr|en` : Retourne l'article avec les champs traduits
- `POST /blog/posts` : Supporte les champs `title_fr`, `title_en`, `excerpt_fr`, `excerpt_en`, `content_fr`, `content_en`
- `PUT /blog/posts/:id` : Met à jour avec les champs multilingues
- Rétrocompatibilité avec les anciens champs `title`, `excerpt`, `content`

### 2. Frontend - Pages Blog

✅ **Modifié `BlogPage.tsx` :**
- Envoie le paramètre `lang` dans la requête basé sur `localStorage.getItem('language')`
- Les articles affichés sont automatiquement dans la bonne langue

✅ **Modifié `BlogPostPage.tsx` :**
- Envoie le paramètre `lang` dans la requête
- L'article affiché est automatiquement dans la bonne langue

### 3. Script de Migration

✅ **Créé `/utils/migrateBlogToMultilingual.ts` :**
- Convertit automatiquement les anciens articles au nouveau format
- Copie les champs `title` → `title_fr` et `title_en`
- Copie les champs `excerpt` → `excerpt_fr` et `excerpt_en`
- Copie les champs `content` → `content_fr` et `content_en`

## 🚧 Ce qui reste à faire

### 1. Dashboard Blog - Édition Multilingue

Le `BlogTab.tsx` a été partiellement modifié mais il faut compléter l'UI :

#### Changements dans le formulaire :

```tsx
// Ajouter des onglets FR/EN au-dessus du formulaire
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

{/* Language Tabs */}
<div className="mb-4">
  <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")}>
    <TabsList className="bg-white/5">
      <TabsTrigger value="fr" className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]">
        🇫🇷 Français
      </TabsTrigger>
      <TabsTrigger value="en" className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]">
        🇬🇧 English
      </TabsTrigger>
    </TabsList>

    {/* French Content */}
    <TabsContent value="fr" className="space-y-4 mt-4">
      {/* Title FR */}
      <div>
        <Label htmlFor="title_fr" className="text-white/80">
          Titre (Français) *
        </Label>
        <Input
          id="title_fr"
          value={formData.title_fr}
          onChange={(e) => handleTitleChange(e.target.value, "fr")}
          className="bg-white/5 border-white/10 text-white"
          placeholder="Titre de l'article en français"
        />
      </div>

      {/* Excerpt FR */}
      <div>
        <Label htmlFor="excerpt_fr" className="text-white/80">
          Résumé (Français)
        </Label>
        <Textarea
          id="excerpt_fr"
          value={formData.excerpt_fr}
          onChange={(e) => setFormData({ ...formData, excerpt_fr: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
          placeholder="Court résumé en français..."
          rows={2}
        />
      </div>

      {/* Content FR */}
      <div>
        <Label className="text-white/80">Contenu (Français) *</Label>
        <RichTextEditor
          content={formData.content_fr}
          onChange={(content) => setFormData({ ...formData, content_fr: content })}
        />
      </div>
    </TabsContent>

    {/* English Content */}
    <TabsContent value="en" className="space-y-4 mt-4">
      {/* Title EN */}
      <div>
        <Label htmlFor="title_en" className="text-white/80">
          Title (English)
        </Label>
        <Input
          id="title_en"
          value={formData.title_en}
          onChange={(e) => handleTitleChange(e.target.value, "en")}
          className="bg-white/5 border-white/10 text-white"
          placeholder="Article title in English"
        />
      </div>

      {/* Excerpt EN */}
      <div>
        <Label htmlFor="excerpt_en" className="text-white/80">
          Excerpt (English)
        </Label>
        <Textarea
          id="excerpt_en"
          value={formData.excerpt_en}
          onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
          placeholder="Short summary in English..."
          rows={2}
        />
      </div>

      {/* Content EN */}
      <div>
        <Label className="text-white/80">Content (English)</Label>
        <RichTextEditor
          content={formData.content_en}
          onChange={(content) => setFormData({ ...formData, content_en: content })}
        />
      </div>
    </TabsContent>
  </Tabs>
</div>
```

#### Remplacer les anciens champs :

Dans `BlogTab.tsx` (lignes 526-617), remplacer :
- `formData.title` → `formData.title_fr` et `formData.title_en`
- `formData.excerpt` → `formData.excerpt_fr` et `formData.excerpt_en`
- `formData.content` → `formData.content_fr` et `formData.content_en`

### 2. Bouton de Migration dans le Dashboard

Ajouter un bouton dans `BlogTab.tsx` pour lancer la migration :

```tsx
import { migrateBlogToMultilingual } from "../../utils/migrateBlogToMultilingual";

// Dans le JSX, ajouter un bouton :
<Button
  onClick={async () => {
    toast.info("Migration en cours...");
    const result = await migrateBlogToMultilingual();
    if (result.success) {
      toast.success(`Migration réussie ! ${result.migrated} articles migrés`);
      fetchPosts();
    } else {
      toast.error("Erreur lors de la migration");
    }
  }}
  variant="outline"
  className="border-[#00FFC2]/30 text-[#00FFC2]"
>
  <RefreshCw className="h-4 w-4 mr-2" />
  Migrer vers multilingue
</Button>
```

## 📝 Instructions de Migration

### Étape 1 : Lancer la migration des articles existants

Dans le Dashboard, onglet Blog, cliquer sur "Migrer vers multilingue". Cela va convertir tous les anciens articles.

### Étape 2 : Traduire les articles

1. Aller dans le Dashboard > Blog
2. Cliquer sur "Modifier" sur un article
3. Utiliser les onglets 🇫🇷 Français / 🇬🇧 English
4. Compléter le contenu en anglais
5. Sauvegarder

### Étape 3 : Tester

1. Aller sur le site public
2. Changer la langue avec le sélecteur FR/EN
3. Vérifier que les articles s'affichent dans la bonne langue

## 🔑 Schéma des données

### Format multilingue complet :

```typescript
{
  id: "blog_post:xxx",
  
  // Multilingual fields
  title_fr: "Mon article",
  title_en: "My article",
  excerpt_fr: "Résumé en français",
  excerpt_en: "Summary in English",
  content_fr: "Contenu complet en français...",
  content_en: "Full content in English...",
  
  // Legacy fields (for backward compatibility)
  title: "Mon article",  // = title_fr
  excerpt: "Résumé en français",  // = excerpt_fr
  content: "Contenu complet en français...",  // = content_fr
  
  // Other fields
  slug: "mon-article",
  coverImage: "...",
  category: "development",
  tags: ["react", "typescript"],
  readTime: 5,
  status: "published",
  publishedAt: "2024-01-01T00:00:00.000Z",
  views: 0,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## 📊 Statut

| Composant | Statut | Notes |
|-----------|--------|-------|
| API Backend | ✅ Terminé | Support complet multilingue + rétrocompatibilité |
| BlogPage.tsx | ✅ Terminé | Envoie le paramètre lang |
| BlogPostPage.tsx | ✅ Terminé | Envoie le paramètre lang |
| Script Migration | ✅ Terminé | Prêt à être utilisé |
| BlogTab.tsx (état) | ✅ Terminé | FormData modifié |
| BlogTab.tsx (UI) | 🚧 À faire | Onglets FR/EN à ajouter |
| Bouton Migration | 🚧 À faire | À ajouter dans BlogTab |

## 🎯 Prochaines étapes

1. Terminer l'UI du BlogTab avec les onglets FR/EN
2. Ajouter le bouton de migration
3. Migrer les articles existants
4. Traduire le contenu en anglais
5. Tester le système complet

---

**Note :** Le système est rétrocompatible, donc les anciens articles continuent de fonctionner même sans traduction.
