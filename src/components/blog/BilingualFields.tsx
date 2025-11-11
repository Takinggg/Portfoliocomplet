import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { X, Plus } from "lucide-react";

interface BilingualFieldsProps {
  formData: {
    slug_fr: string;
    slug_en: string;
    tags_fr: string[];
    tags_en: string[];
    category_fr: string;
    category_en: string;
    seo_description_fr: string;
    seo_description_en: string;
  };
  onUpdate: (updates: Partial<BilingualFieldsProps['formData']>) => void;
}

export function BilingualFields({ formData, onUpdate }: BilingualFieldsProps) {
  const [tagInputFr, setTagInputFr] = useState("");
  const [tagInputEn, setTagInputEn] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const addTag = (lang: 'fr' | 'en') => {
    const tagInput = lang === 'fr' ? tagInputFr : tagInputEn;
    const currentTags = lang === 'fr' ? formData.tags_fr : formData.tags_en;
    const setTagInput = lang === 'fr' ? setTagInputFr : setTagInputEn;

    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      onUpdate({
        [lang === 'fr' ? 'tags_fr' : 'tags_en']: [...currentTags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const removeTag = (lang: 'fr' | 'en', tagToRemove: string) => {
    const currentTags = lang === 'fr' ? formData.tags_fr : formData.tags_en;
    onUpdate({
      [lang === 'fr' ? 'tags_fr' : 'tags_en']: currentTags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="fr" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
          <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
        </TabsList>

        <TabsContent value="fr" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug_fr" className="text-white/80">
              Slug (URL française)
            </Label>
            <Input
              id="slug_fr"
              value={formData.slug_fr}
              onChange={(e) => onUpdate({ slug_fr: e.target.value })}
              placeholder="mon-article-en-francais"
              className="bg-gray-800/50 border-gray-600 text-white"
            />
            <p className="text-xs text-white/60">
              URL: /fr/blog/{formData.slug_fr || "mon-article"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_fr" className="text-white/80">
              Catégorie (français)
            </Label>
            <Input
              id="category_fr"
              value={formData.category_fr}
              onChange={(e) => onUpdate({ category_fr: e.target.value })}
              placeholder="développement web"
              className="bg-gray-800/50 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Tags (français)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInputFr}
                onChange={(e) => setTagInputFr(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag('fr')}
                placeholder="Nouveau tag..."
                className="bg-gray-800/50 border-gray-600 text-white flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addTag('fr')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags_fr.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-600/20 text-purple-300 border-purple-600/30"
                >
                  {tag}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400"
                    onClick={() => removeTag('fr', tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_description_fr" className="text-white/80">
              Description SEO (français)
            </Label>
            <Input
              id="seo_description_fr"
              value={formData.seo_description_fr}
              onChange={(e) => onUpdate({ seo_description_fr: e.target.value })}
              placeholder="Description pour les moteurs de recherche..."
              className="bg-gray-800/50 border-gray-600 text-white"
            />
          </div>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug_en" className="text-white/80">
              Slug (English URL)
            </Label>
            <Input
              id="slug_en"
              value={formData.slug_en}
              onChange={(e) => onUpdate({ slug_en: e.target.value })}
              placeholder="my-english-article"
              className="bg-gray-800/50 border-gray-600 text-white"
            />
            <p className="text-xs text-white/60">
              URL: /en/blog/{formData.slug_en || "my-article"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_en" className="text-white/80">
              Category (English)
            </Label>
            <Input
              id="category_en"
              value={formData.category_en}
              onChange={(e) => onUpdate({ category_en: e.target.value })}
              placeholder="web development"
              className="bg-gray-800/50 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Tags (English)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInputEn}
                onChange={(e) => setTagInputEn(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag('en')}
                placeholder="New tag..."
                className="bg-gray-800/50 border-gray-600 text-white flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addTag('en')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags_en.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-blue-600/20 text-blue-300 border-blue-600/30"
                >
                  {tag}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400"
                    onClick={() => removeTag('en', tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_description_en" className="text-white/80">
              SEO Description (English)
            </Label>
            <Input
              id="seo_description_en"
              value={formData.seo_description_en}
              onChange={(e) => onUpdate({ seo_description_en: e.target.value })}
              placeholder="Description for search engines..."
              className="bg-gray-800/50 border-gray-600 text-white"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
        <h4 className="text-white font-medium mb-2">🔍 Aperçu URLs</h4>
        <div className="space-y-1 text-sm">
          <div className="text-white/70">
            🇫🇷 <span className="text-purple-400">/fr/blog/{formData.slug_fr || "article"}</span>
          </div>
          <div className="text-white/70">
            🇬🇧 <span className="text-blue-400">/en/blog/{formData.slug_en || "article"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}