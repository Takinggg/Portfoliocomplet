import React, { useRef, useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Layers, BarChart2, FileText } from 'lucide-react';
import { Project, KPI, TechItem } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadPortfolioImage, MAX_PORTFOLIO_UPLOAD_SIZE_MB } from '@/utils/storage/uploadPortfolioImage';

interface ProjectManagerProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  title?: string;
    onSaveProject?: (data: Partial<Project>, editingId?: Project['id'] | null) => Promise<void>;
    onDeleteProject?: (id: Project['id']) => Promise<void>;
    loading?: boolean;
}

type Tab = 'general' | 'story' | 'tech' | 'media';
type Lang = 'fr' | 'en';
type FeedbackFields = NonNullable<Project['feedback']>;

export const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, setProjects, title = "Projets", onSaveProject, onDeleteProject, loading = false }) => {
    const [editingId, setEditingId] = useState<Project['id'] | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [lang, setLang] = useState<Lang>('fr');
    const [actionLoading, setActionLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryFileInputRef = useRef<HTMLInputElement>(null);
    const isDialogOpen = isAdding || editingId !== null;
  
  // Empty state for new project
  const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        title_en: '',
        client: '',
        category: 'SaaS',
        description: '',
        description_en: '',
        challenge: '',
        challenge_en: '',
        solution: '',
        solution_en: '',
        timeline: '',
        timeline_en: '',
        role: '',
        role_en: '',
        agency: '',
        agency_en: '',
        image: '',
                tags: [],
                gallery: [],
                deliverables: [],
                deliverables_en: [],
        link: '#',
        stats: [],
        techStack: []
  });

  // Temporary state for list inputs
  const [tempTag, setTempTag] = useState('');
  const [tempStat, setTempStat] = useState<KPI>({ label: '', value: '', change: '' });
  const [tempTech, setTempTech] = useState<TechItem>({ name: '', category: '' });
        const [tempDeliverables, setTempDeliverables] = useState<Record<Lang, string>>({ fr: '', en: '' });
    const [tempGalleryUrl, setTempGalleryUrl] = useState('');
    const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);

    const handleEdit = (project: Project) => {
    setEditingId(project.id);
    const draftProject = JSON.parse(JSON.stringify(project));
    if (!draftProject.gallery) {
        draftProject.gallery = [];
    }
    setFormData(draftProject); // Deep copy
    setIsAdding(false);
    setActiveTab('general');
                setTempDeliverables({ fr: '', en: '' });
  };

    const handleDelete = async (id: Project['id']) => {
        if (!confirm('Supprimer ce projet ?')) {
            return;
        }

        if (onDeleteProject) {
            try {
                setActionLoading(true);
                await onDeleteProject(id);
            } catch (error) {
                console.error('Suppression projet échouée', error);
                alert((error as Error)?.message || 'Impossible de supprimer le projet.');
            } finally {
                setActionLoading(false);
            }
            return;
        }

        setProjects(prev => prev.filter(p => p.id !== id));
  };

    const handleSave = async () => {
        if (onSaveProject) {
            try {
                setActionLoading(true);
                await onSaveProject(formData as Project, editingId);
                closeForm();
            } catch (error) {
                console.error('Sauvegarde projet échouée', error);
                alert((error as Error)?.message || "Impossible d'enregistrer le projet.");
            } finally {
                setActionLoading(false);
            }
            return;
        }

        if (editingId !== null) {
            setProjects(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } as Project : p));
        } else {
            const numericIds = projects
                .map(p => (typeof p.id === 'number' ? p.id : Number.parseInt(String(p.id), 10)))
                .filter(id => Number.isFinite(id)) as number[];
            const newId = (numericIds.length ? Math.max(...numericIds) : 0) + 1;
            const newProject = { ...formData, id: newId } as Project;
            setProjects(prev => [...prev, newProject]);
        }
        closeForm();
  };

  const closeForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
    title: '',
    title_en: '',
    client: '',
    category: 'SaaS',
    description: '',
    description_en: '',
    challenge: '',
    challenge_en: '',
    solution: '',
    solution_en: '',
    timeline: '',
    timeline_en: '',
    role: '',
    role_en: '',
    agency: '',
    agency_en: '',
    image: '',
        tags: [],
        gallery: [],
        deliverables: [],
        deliverables_en: [],
    link: '#',
    stats: [],
    techStack: [],
    feedback: undefined,
      });
        setLang('fr');
        setActiveTab('general');
            setTempDeliverables({ fr: '', en: '' });
                setTempGalleryUrl('');
                setGalleryUploadError(null);
                setUploadingGalleryImage(false);
          setUploadError(null);
  };

  // Helpers for lists
  const addTag = () => { if(tempTag) { setFormData({...formData, tags: [...(formData.tags||[]), tempTag]}); setTempTag(''); }};
  const addStat = () => { if(tempStat.label && tempStat.value) { setFormData({...formData, stats: [...(formData.stats||[]), tempStat]}); setTempStat({label:'', value:'', change:''}); }};
    const addTech = () => { if(tempTech.name) { setFormData({...formData, techStack: [...(formData.techStack||[]), tempTech]}); setTempTech({name:'', category:''}); }};
    const addGalleryUrl = () => {
        if(tempGalleryUrl.trim()) {
            setFormData(prev => ({...prev, gallery: [...(prev.gallery || []), tempGalleryUrl.trim()]}));
            setTempGalleryUrl('');
        }
    };
    const removeGalleryItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery?.filter((_, idx) => idx !== index) || []
        }));
    };

    const addDeliverable = (targetLang: Lang) => {
        const value = tempDeliverables[targetLang].trim();
        if (!value) {
            return;
        }
        setFormData((prev) => {
            if (targetLang === 'fr') {
                return { ...prev, deliverables: [...(prev.deliverables ?? []), value] };
            }
            return { ...prev, deliverables_en: [...(prev.deliverables_en ?? []), value] };
        });
        setTempDeliverables((prev) => ({ ...prev, [targetLang]: '' }));
    };

    const removeDeliverable = (targetLang: Lang, index: number) => {
        setFormData((prev) => {
            if (targetLang === 'fr') {
                const next = (prev.deliverables ?? []).filter((_, idx) => idx !== index);
                return { ...prev, deliverables: next };
            }
            const next = (prev.deliverables_en ?? []).filter((_, idx) => idx !== index);
            return { ...prev, deliverables_en: next };
        });
    };

    const ensureFeedbackBase = (feedback?: Project['feedback']): FeedbackFields => ({
        quote: feedback?.quote ?? '',
        author: feedback?.author ?? '',
        quote_en: feedback?.quote_en,
        role: feedback?.role,
        role_en: feedback?.role_en,
    });

    const setFeedbackField = (field: keyof FeedbackFields, value: string) => {
        setFormData((prev) => ({
            ...prev,
            feedback: {
                ...ensureFeedbackBase(prev.feedback),
                [field]: value,
            },
        }));
    };

    const handleImageUploadClick = () => {
        if (!loading) {
            fileInputRef.current?.click();
        }
    };
    const handleGalleryUploadClick = () => {
        if (!loading) {
            galleryFileInputRef.current?.click();
        }
    };

    const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) {
            return;
        }
        try {
            setUploadError(null);
            setUploadingImage(true);
            const { publicUrl } = await uploadPortfolioImage(file);
            if (!publicUrl) {
                throw new Error('Upload réussi mais URL introuvable');
            }
            setFormData((prev) => ({ ...prev, image: publicUrl }));
        } catch (error) {
            console.error('Upload image échoué', error);
            setUploadError((error as Error)?.message || "Impossible de téléverser l'image");
        } finally {
            setUploadingImage(false);
        }
    };
    const handleGalleryFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) {
            return;
        }
        try {
            setGalleryUploadError(null);
            setUploadingGalleryImage(true);
            const { publicUrl } = await uploadPortfolioImage(file);
            if (!publicUrl) {
                throw new Error('Upload réussi mais URL introuvable');
            }
            setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), publicUrl] }));
        } catch (error) {
            console.error('Upload média échoué', error);
            setGalleryUploadError((error as Error)?.message || "Impossible de téléverser ce média");
        } finally {
            setUploadingGalleryImage(false);
        }
    };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
                <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">{title}</h1>
                        <p className="text-neutral-400">Pilotez votre portfolio et ses traductions.</p>
                </div>
                <Button
                    type="button"
                    onClick={() => {
                        if (!loading) {
                            closeForm();
                            setIsAdding(true);
                        }
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white text-black hover:bg-[#CCFF00]"
                >
                    <Plus size={18} /> Ajouter un projet
                </Button>
      </div>

            {loading && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-300">
                    Synchronisation du portfolio en cours…
                </div>
            )}

            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeForm();
                    }
                }}
            >
                <DialogContent className="bg-[#0C0C0C] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier le projet' : 'Nouveau projet'}</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Centralisez les contenus FR / EN et les métriques de vos cartes portfolio.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-6">
                        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-white">Traductions synchronisées</p>
                                <p className="text-xs text-white/60">Français obligatoire, anglais recommandé sur le site public.</p>
                            </div>
                            <Tabs value={lang} onValueChange={(value) => setLang(value as Lang)} className="w-full sm:w-auto">
                                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                                    <TabsTrigger value="fr" className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C] text-xs font-semibold uppercase tracking-widest">
                                        🇫🇷 Français
                                    </TabsTrigger>
                                    <TabsTrigger value="en" className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C] text-xs font-semibold uppercase tracking-widest">
                                        🇬🇧 English
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-white/5">
                                <TabsTrigger value="general" className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]">
                                    <Layers className="h-3.5 w-3.5" /> Général
                                </TabsTrigger>
                                <TabsTrigger value="story" className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]">
                                    <FileText className="h-3.5 w-3.5" /> Histoire ({lang.toUpperCase()})
                                </TabsTrigger>
                                <TabsTrigger value="tech" className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]">
                                    <BarChart2 className="h-3.5 w-3.5" /> Données & Tech
                                </TabsTrigger>
                                <TabsTrigger value="media" className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]">
                                    <ImageIcon className="h-3.5 w-3.5" /> Média
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6 pt-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-xs uppercase text-white/60">Titre ({lang.toUpperCase()})</Label>
                                        <Input
                                            value={lang === 'fr' ? formData.title ?? '' : formData.title_en ?? ''}
                                            onChange={(e) =>
                                                lang === 'fr'
                                                    ? setFormData({ ...formData, title: e.target.value })
                                                    : setFormData({ ...formData, title_en: e.target.value })
                                            }
                                            placeholder={lang === 'fr' ? 'Nom du projet' : 'Project name'}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs uppercase text-white/60">Client</Label>
                                        <Input
                                            value={formData.client ?? ''}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            placeholder="Nom du client"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-xs uppercase text-white/60">Catégorie</Label>
                                        <select
                                            value={formData.category || 'SaaS'}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus-visible:ring-2 focus-visible:ring-[#CCFF00]"
                                        >
                                            <option value="SaaS">SaaS</option>
                                            <option value="Fintech">Fintech</option>
                                            <option value="E-Commerce">E-Commerce</option>
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="Web3">Web3</option>
                                            <option value="Design System">Design System</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-xs uppercase text-white/60">Lien public</Label>
                                        <Input
                                            value={formData.link ?? ''}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                            placeholder="https://..."
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-xs uppercase text-white/60">Planning ({lang.toUpperCase()})</Label>
                                        <Input
                                            value={lang === 'fr' ? formData.timeline ?? '' : formData.timeline_en ?? ''}
                                            onChange={(e) =>
                                                lang === 'fr'
                                                    ? setFormData({ ...formData, timeline: e.target.value })
                                                    : setFormData({ ...formData, timeline_en: e.target.value })
                                            }
                                            placeholder={lang === 'fr' ? 'Ex : 4 semaines' : 'E.g. 4 weeks'}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs uppercase text-white/60">Rôle ({lang.toUpperCase()})</Label>
                                        <Input
                                            value={lang === 'fr' ? formData.role ?? '' : formData.role_en ?? ''}
                                            onChange={(e) =>
                                                lang === 'fr'
                                                    ? setFormData({ ...formData, role: e.target.value })
                                                    : setFormData({ ...formData, role_en: e.target.value })
                                            }
                                            placeholder={lang === 'fr' ? 'Direction artistique' : 'Art Direction'}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-xs uppercase text-white/60">Cadre / Agence ({lang.toUpperCase()})</Label>
                                        <Input
                                            value={lang === 'fr' ? formData.agency ?? '' : formData.agency_en ?? ''}
                                            onChange={(e) =>
                                                lang === 'fr'
                                                    ? setFormData({ ...formData, agency: e.target.value })
                                                    : setFormData({ ...formData, agency_en: e.target.value })
                                            }
                                            placeholder={lang === 'fr' ? 'Ex : Freelance' : 'E.g. Freelance partner'}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs uppercase text-white/60">Visuel principal</Label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Input
                                            value={formData.image ?? ''}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://..."
                                            className="min-w-[220px] flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleImageUploadClick}
                                            disabled={uploadingImage}
                                            className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-black disabled:cursor-not-allowed"
                                        >
                                            {uploadingImage ? 'Import…' : 'Importer'}
                                        </Button>
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-white/10 bg-white/5">
                                            {formData.image ? (
                                                <img src={formData.image} alt={formData.title || 'Aperçu projet'} className="h-full w-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-5 w-5 text-white/40" />
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                                        className="hidden"
                                        onChange={handleImageFileChange}
                                    />
                                    <p className="text-[11px] text-white/40">
                                        PNG / JPG / WEBP, max {MAX_PORTFOLIO_UPLOAD_SIZE_MB}MB. Upload direct vers Supabase Storage.
                                    </p>
                                    {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}
                                </div>
                            </TabsContent>

                            <TabsContent value="story" className="space-y-5 pt-4">
                                <div>
                                    <Label className="text-xs uppercase text-white/60">Description courte ({lang.toUpperCase()})</Label>
                                    <Textarea
                                        rows={3}
                                        value={lang === 'fr' ? formData.description ?? '' : formData.description_en ?? ''}
                                        onChange={(e) =>
                                            lang === 'fr'
                                                ? setFormData({ ...formData, description: e.target.value })
                                                : setFormData({ ...formData, description_en: e.target.value })
                                        }
                                        placeholder="Résumé court pour la carte portfolio"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase text-white/60">Le défi ({lang.toUpperCase()})</Label>
                                    <Textarea
                                        rows={4}
                                        value={lang === 'fr' ? formData.challenge ?? '' : formData.challenge_en ?? ''}
                                        onChange={(e) =>
                                            lang === 'fr'
                                                ? setFormData({ ...formData, challenge: e.target.value })
                                                : setFormData({ ...formData, challenge_en: e.target.value })
                                        }
                                        placeholder="Quel était le problème client ?"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase text-white/60">La solution ({lang.toUpperCase()})</Label>
                                    <Textarea
                                        rows={4}
                                        value={lang === 'fr' ? formData.solution ?? '' : formData.solution_en ?? ''}
                                        onChange={(e) =>
                                            lang === 'fr'
                                                ? setFormData({ ...formData, solution: e.target.value })
                                                : setFormData({ ...formData, solution_en: e.target.value })
                                        }
                                        placeholder="Comment avez-vous résolu ce défi ?"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    />
                                </div>

                                <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Livrables ({lang.toUpperCase()})</p>
                                        <p className="text-xs text-white/60">Une puce par livrable, traduit si nécessaire.</p>
                                    </div>
                                    <div className="flex flex-col gap-2 md:flex-row">
                                        <Input
                                            value={tempDeliverables[lang]}
                                            onChange={(e) => setTempDeliverables((prev) => ({ ...prev, [lang]: e.target.value }))}
                                            placeholder={lang === 'fr' ? 'Design system' : 'Design system'}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => addDeliverable(lang)}
                                            className="bg-white/10 text-white hover:bg-white hover:text-black"
                                            disabled={!tempDeliverables[lang].trim()}
                                        >
                                            <Plus className="h-4 w-4" /> Ajouter
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(lang === 'fr' ? formData.deliverables ?? [] : formData.deliverables_en ?? []).map((item, index) => (
                                            <Badge key={`${item}-${index}`} className="flex items-center gap-2 bg-white/10 text-white">
                                                <span>{item}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDeliverable(lang, index)}
                                                    className="text-white/60 hover:text-red-400"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {!(lang === 'fr' ? formData.deliverables : formData.deliverables_en)?.length && (
                                            <p className="text-xs text-white/40">Ajoutez 2 à 4 livrables clés.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Citation client ({lang.toUpperCase()})</p>
                                        <p className="text-xs text-white/60">Affichez un bloc témoignage facultatif.</p>
                                    </div>
                                    <Textarea
                                        rows={4}
                                        value={lang === 'fr' ? formData.feedback?.quote ?? '' : formData.feedback?.quote_en ?? ''}
                                        onChange={(e) =>
                                            lang === 'fr'
                                                ? setFeedbackField('quote', e.target.value)
                                                : setFeedbackField('quote_en', e.target.value)
                                        }
                                        placeholder={lang === 'fr' ? '“Une collaboration hors norme…”' : '“An outstanding collaboration…”'}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label className="text-xs uppercase text-white/60">Auteur</Label>
                                            <Input
                                                value={formData.feedback?.author ?? ''}
                                                onChange={(e) => setFeedbackField('author', e.target.value)}
                                                placeholder="Nom du client"
                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs uppercase text-white/60">Rôle auteur ({lang.toUpperCase()})</Label>
                                            <Input
                                                value={lang === 'fr' ? formData.feedback?.role ?? '' : formData.feedback?.role_en ?? ''}
                                                onChange={(e) =>
                                                    lang === 'fr'
                                                        ? setFeedbackField('role', e.target.value)
                                                        : setFeedbackField('role_en', e.target.value)
                                                }
                                                placeholder={lang === 'fr' ? 'CEO Client' : 'Client CEO'}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="tech" className="space-y-6 pt-4">
                                <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Tags rapides</p>
                                        <p className="text-xs text-white/60">Aident à filtrer les projets dans le dashboard.</p>
                                    </div>
                                    <div className="flex flex-col gap-2 md:flex-row">
                                        <Input
                                            value={tempTag}
                                            onChange={(e) => setTempTag(e.target.value)}
                                            placeholder="Ex : React Native"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                        <Button type="button" onClick={addTag} className="bg-white/10 text-white hover:bg-white hover:text-black">
                                            <Plus className="h-4 w-4" /> Ajouter
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags?.map((t, i) => (
                                            <Badge key={`${t}-${i}`} className="flex items-center gap-2 bg-white/10 text-white">
                                                <span>{t}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, tags: formData.tags?.filter((_, idx) => idx !== i) })}
                                                    className="ml-2 text-white/60 hover:text-red-400"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {!formData.tags?.length && <p className="text-xs text-white/40">Aucun tag n'a encore été ajouté.</p>}
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                        <BarChart2 className="h-4 w-4" /> KPIs clés
                                    </div>
                                    <div className="grid gap-2 md:grid-cols-3">
                                        <Input
                                            value={tempStat.value}
                                            onChange={(e) => setTempStat({ ...tempStat, value: e.target.value })}
                                            placeholder="Valeur (ex : +50%)"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                        <Input
                                            value={tempStat.label}
                                            onChange={(e) => setTempStat({ ...tempStat, label: e.target.value })}
                                            placeholder="Libellé (ex : Utilisateurs)"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                        <Button type="button" onClick={addStat} className="bg-white/10 text-white hover:bg-white hover:text-black">
                                            <Plus className="h-4 w-4" /> Ajouter
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.stats?.map((s, i) => (
                                            <div key={`${s.label}-${i}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{s.value}</p>
                                                    <p className="text-xs text-white/60">{s.label}</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setFormData({ ...formData, stats: formData.stats?.filter((_, idx) => idx !== i) })}
                                                    className="text-red-400 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {!formData.stats?.length && <p className="text-xs text-white/40">Ajoutez des métriques pour crédibiliser le projet.</p>}
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                        <Layers className="h-4 w-4" /> Stack technique
                                    </div>
                                    <div className="grid gap-2 md:grid-cols-3">
                                        <Input
                                            value={tempTech.name}
                                            onChange={(e) => setTempTech({ ...tempTech, name: e.target.value })}
                                            placeholder="Nom (ex : Next.js)"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                        <Input
                                            value={tempTech.category}
                                            onChange={(e) => setTempTech({ ...tempTech, category: e.target.value })}
                                            placeholder="Catégorie (ex : Framework)"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                        <Button type="button" onClick={addTech} className="bg-white/10 text-white hover:bg-white hover:text-black">
                                            <Plus className="h-4 w-4" /> Ajouter
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.techStack?.map((t, i) => (
                                            <Badge key={`${t.name}-${i}`} className="flex items-center gap-2 bg-white/10 text-white">
                                                <span>{t.name}</span>
                                                {t.category && <span className="ml-1 text-[11px] text-white/50">({t.category})</span>}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, techStack: formData.techStack?.filter((_, idx) => idx !== i) })}
                                                    className="ml-2 text-white/60 hover:text-red-400"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {!formData.techStack?.length && <p className="text-xs text-white/40">Aucun élément dans la stack pour le moment.</p>}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-6 pt-4">
                                <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Galerie d'images</p>
                                        <p className="text-xs text-white/60">Ajoutez plusieurs visuels pour les pages projets et les carrousels.</p>
                                    </div>
                                    <div className="flex flex-col gap-2 md:flex-row">
                                        <Input
                                            value={tempGalleryUrl}
                                            onChange={(e) => setTempGalleryUrl(e.target.value)}
                                            placeholder="https://cdn.../image.webp"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                        />
                                        <Button type="button" onClick={addGalleryUrl} className="bg-white/10 text-white hover:bg-white hover:text-black">
                                            <Plus className="h-4 w-4" /> Ajouter l'URL
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {formData.gallery?.map((url, index) => (
                                            <div key={`${url}-${index}`} className="group relative h-28 w-40 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                                <img src={url} alt={`media-${index}`} className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryItem(index)}
                                                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {!formData.gallery?.length && <p className="text-xs text-white/40">Aucun média pour l'instant.</p>}
                                    </div>
                                </div>

                                <div className="space-y-2 rounded-xl border border-dashed border-white/20 bg-white/[0.01] p-4 text-center">
                                    <p className="text-sm font-semibold text-white">Uploader depuis votre ordinateur</p>
                                    <p className="text-xs text-white/50">PNG / JPG / WEBP / GIF / AVIF, max {MAX_PORTFOLIO_UPLOAD_SIZE_MB}MB</p>
                                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleGalleryUploadClick}
                                            disabled={uploadingGalleryImage}
                                            className="border-white/30 bg-transparent text-white hover:bg-white hover:text-black"
                                        >
                                            {uploadingGalleryImage ? 'Import…' : 'Importer un fichier'}
                                        </Button>
                                        <Button type="button" variant="ghost" className="text-white/70 hover:text-white" onClick={() => setActiveTab('general')}>
                                            Voir l'image principale
                                        </Button>
                                    </div>
                                    <input
                                        ref={galleryFileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                                        className="hidden"
                                        onChange={handleGalleryFileChange}
                                    />
                                    {galleryUploadError && <p className="text-xs text-red-400">{galleryUploadError}</p>}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-white/60">
                                {editingId ? 'Met immédiatement à jour le projet existant.' : 'Ajoute un nouveau projet à la page portfolio.'}
                            </p>
                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={closeForm}
                                    disabled={actionLoading}
                                    className="text-white/70 hover:text-white"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={actionLoading}
                                    className="bg-[#CCFF00] text-[#0B0B0B] hover:bg-white"
                                >
                                    <Save className="h-4 w-4" /> {actionLoading ? 'Enregistrement…' : 'Enregistrer le projet'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

      {/* LIST */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map(project => (
            <div key={project.id} className="bg-[#0F0F0F] border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded bg-neutral-800 overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold">{project.title}</h3>
                            {project.title_en && <span className="text-[10px] bg-white/10 px-1 rounded text-neutral-400">EN</span>}
                        </div>
                        <p className="text-xs text-neutral-500">{project.client} • {project.category}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(project)} className="p-2 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-500/10 rounded text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50" disabled={actionLoading}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};