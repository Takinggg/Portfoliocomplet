import React, { useRef, useState } from 'react';
import { Project, KPI, TechItem } from '../../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Layers, BarChart2, FileText } from 'lucide-react';
import { uploadPortfolioImage, MAX_PORTFOLIO_UPLOAD_SIZE_MB } from '@/utils/storage/uploadPortfolioImage';

interface ProjectManagerProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  title?: string;
    onSaveProject?: (data: Partial<Project>, editingId?: Project['id'] | null) => Promise<void>;
    onDeleteProject?: (id: Project['id']) => Promise<void>;
    loading?: boolean;
}

type Tab = 'general' | 'story' | 'tech';
type Lang = 'fr' | 'en';

export const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, setProjects, title = "Projets", onSaveProject, onDeleteProject, loading = false }) => {
    const [editingId, setEditingId] = useState<Project['id'] | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [lang, setLang] = useState<Lang>('fr');
    const [actionLoading, setActionLoading] = useState(false);
        const [uploadingImage, setUploadingImage] = useState(false);
        const [uploadError, setUploadError] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Empty state for new project
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', title_en: '',
    client: '',
    category: 'SaaS',
    description: '', description_en: '',
    challenge: '', challenge_en: '',
    solution: '', solution_en: '',
    image: '',
    tags: [],
    link: '#',
    stats: [],
    techStack: []
  });

  // Temporary state for list inputs
  const [tempTag, setTempTag] = useState('');
  const [tempStat, setTempStat] = useState<KPI>({ label: '', value: '', change: '' });
  const [tempTech, setTempTech] = useState<TechItem>({ name: '', category: '' });

    const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(JSON.parse(JSON.stringify(project))); // Deep copy
    setIsAdding(false);
    setActiveTab('general');
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
      title: '', title_en: '',
      client: '',
      category: 'SaaS',
      description: '', description_en: '',
      image: '',
      tags: [],
      link: '#',
      stats: [],
      techStack: []
        });
        setLang('fr');
        setActiveTab('general');
  };

  // Helpers for lists
  const addTag = () => { if(tempTag) { setFormData({...formData, tags: [...(formData.tags||[]), tempTag]}); setTempTag(''); }};
  const addStat = () => { if(tempStat.label && tempStat.value) { setFormData({...formData, stats: [...(formData.stats||[]), tempStat]}); setTempStat({label:'', value:'', change:''}); }};
    const addTech = () => { if(tempTech.name) { setFormData({...formData, techStack: [...(formData.techStack||[]), tempTech]}); setTempTech({name:'', category:''}); }};

    const handleImageUploadClick = () => {
        if (!loading) {
            fileInputRef.current?.click();
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">{title}</h1>
            <p className="text-neutral-400">Pilotez votre portfolio et ses traductions.</p>
        </div>
                <button 
                        onClick={() => { if (!loading) { closeForm(); setIsAdding(true); } }}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-bold text-sm hover:bg-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={loading}
                >
                        <Plus size={18} /> Ajouter un projet
                </button>
      </div>

            {loading && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-300">
                    Synchronisation du portfolio en cours…
                </div>
            )}

      {/* FORM OVERLAY */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#151515]">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">{editingId ? 'Modifier le projet' : 'Nouveau projet'}</h2>
                        <div className="h-6 w-[1px] bg-white/10"></div>
                        {/* Language Switcher */}
                        <div className="flex bg-black rounded-lg p-1 border border-white/10">
                            <button onClick={() => setLang('fr')} className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${lang === 'fr' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>FR</button>
                            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${lang === 'en' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>EN</button>
                        </div>
                    </div>
                    <button onClick={closeForm} className="text-neutral-500 hover:text-white"><X size={24} /></button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-white/10 bg-[#0F0F0F]">
                    <button onClick={() => setActiveTab('general')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'general' ? 'border-primary text-white' : 'border-transparent text-neutral-500 hover:text-white'}`}>
                        <Layers size={16} /> Général
                    </button>
                    <button onClick={() => setActiveTab('story')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'story' ? 'border-primary text-white' : 'border-transparent text-neutral-500 hover:text-white'}`}>
                        <FileText size={16} /> Histoire ({lang})
                    </button>
                    <button onClick={() => setActiveTab('tech')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'tech' ? 'border-primary text-white' : 'border-transparent text-neutral-500 hover:text-white'}`}>
                        <BarChart2 size={16} /> Données & Tech
                    </button>
                </div>
                
                {/* CONTENT SCROLLABLE */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#0A0A0A]">
                    
                    {/* --- GENERAL TAB --- */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="field-label">Titre ({lang})</label>
                                    <input 
                                        type="text" 
                                        value={lang === 'fr' ? formData.title : formData.title_en} 
                                        onChange={e => lang === 'fr' ? setFormData({...formData, title: e.target.value}) : setFormData({...formData, title_en: e.target.value})}
                                        className="input-field"
                                        placeholder="Nom du projet"
                                    />
                                </div>
                                <div>
                                    <label className="field-label">Client</label>
                                    <input 
                                        type="text" 
                                        value={formData.client} 
                                        onChange={e => setFormData({...formData, client: e.target.value})}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="field-label">Catégorie</label>
                                    <select 
                                        value={formData.category} 
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        className="input-field"
                                    >
                                        <option>SaaS</option>
                                        <option>Fintech</option>
                                        <option>E-Commerce</option>
                                        <option>Mobile App</option>
                                        <option>Web3</option>
                                        <option>Design System</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="field-label">Lien public</label>
                                    <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="input-field" />
                                </div>
                            </div>
                            <div>
                                <label className="field-label">Visuel principal</label>
                                <div className="flex gap-2 flex-wrap">
                                    <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="input-field flex-1 min-w-[220px]" placeholder="https://..." />
                                    <button
                                        type="button"
                                        onClick={handleImageUploadClick}
                                        disabled={uploadingImage}
                                        className="px-3 py-2 bg-white/10 hover:bg-white hover:text-black rounded text-white text-xs font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {uploadingImage ? 'Import…' : 'Importer'}
                                    </button>
                                    <div className="w-12 h-12 bg-white/5 rounded border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                        {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-neutral-600"/>}
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                                    className="hidden"
                                    onChange={handleImageFileChange}
                                />
                                <p className="text-[11px] text-neutral-500 mt-2">
                                    PNG / JPG / WEBP, max {MAX_PORTFOLIO_UPLOAD_SIZE_MB}MB. Import direct stocké sur Supabase Storage.
                                </p>
                                {uploadError && <p className="text-[11px] text-red-400 mt-1">{uploadError}</p>}
                            </div>
                        </div>
                    )}

                    {/* --- STORY TAB --- */}
                    {activeTab === 'story' && (
                        <div className="space-y-6">
                            <div>
                                <label className="field-label">Description courte ({lang})</label>
                                <textarea 
                                    rows={2}
                                    value={lang === 'fr' ? formData.description : formData.description_en} 
                                    onChange={e => lang === 'fr' ? setFormData({...formData, description: e.target.value}) : setFormData({...formData, description_en: e.target.value})}
                                    className="input-field"
                                    placeholder="Résumé court pour la carte portfolio..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="field-label">Le défi ({lang})</label>
                                <textarea 
                                    rows={4}
                                    value={lang === 'fr' ? formData.challenge : formData.challenge_en} 
                                    onChange={e => lang === 'fr' ? setFormData({...formData, challenge: e.target.value}) : setFormData({...formData, challenge_en: e.target.value})}
                                    className="input-field"
                                    placeholder="Quel était le problème ?"
                                ></textarea>
                            </div>
                            <div>
                                <label className="field-label">La solution ({lang})</label>
                                <textarea 
                                    rows={4}
                                    value={lang === 'fr' ? formData.solution : formData.solution_en} 
                                    onChange={e => lang === 'fr' ? setFormData({...formData, solution: e.target.value}) : setFormData({...formData, solution_en: e.target.value})}
                                    className="input-field"
                                    placeholder="Comment avez-vous résolu le défi ?"
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {/* --- TECH TAB --- */}
                    {activeTab === 'tech' && (
                        <div className="space-y-8">
                            {/* TAGS */}
                            <div>
                                <label className="field-label">Tags rapides</label>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" value={tempTag} onChange={e => setTempTag(e.target.value)} className="input-field" placeholder="Ex : React Native" />
                                    <button onClick={addTag} className="px-4 bg-white/10 hover:bg-white hover:text-black rounded text-white transition-colors"><Plus size={18}/></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags?.map((t, i) => (
                                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs flex items-center gap-2">
                                            {t} <button onClick={() => setFormData({...formData, tags: formData.tags?.filter((_, idx) => idx !== i)})}><X size={12}/></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* STATS */}
                            <div>
                                <label className="field-label">KPIs clés</label>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <input type="text" value={tempStat.value} onChange={e => setTempStat({...tempStat, value: e.target.value})} className="input-field" placeholder="Valeur (ex : +50%)" />
                                    <input type="text" value={tempStat.label} onChange={e => setTempStat({...tempStat, label: e.target.value})} className="input-field" placeholder="Libellé (ex : Utilisateurs)" />
                                    <button onClick={addStat} className="px-4 bg-white/10 hover:bg-white hover:text-black rounded text-white transition-colors"><Plus size={18}/></button>
                                </div>
                                <div className="space-y-2">
                                    {formData.stats?.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded">
                                            <span className="text-sm font-bold text-white">{s.value} <span className="font-normal text-neutral-400">{s.label}</span></span>
                                            <button onClick={() => setFormData({...formData, stats: formData.stats?.filter((_, idx) => idx !== i)})} className="text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* TECH STACK */}
                             <div>
                                <label className="field-label">Stack technique</label>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <input type="text" value={tempTech.name} onChange={e => setTempTech({...tempTech, name: e.target.value})} className="input-field" placeholder="Nom (ex : Next.js)" />
                                    <input type="text" value={tempTech.category} onChange={e => setTempTech({...tempTech, category: e.target.value})} className="input-field" placeholder="Catégorie (ex : Framework)" />
                                    <button onClick={addTech} className="px-4 bg-white/10 hover:bg-white hover:text-black rounded text-white transition-colors"><Plus size={18}/></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.techStack?.map((t, i) => (
                                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs flex items-center gap-2">
                                            {t.name} <span className="text-neutral-600">({t.category})</span>
                                            <button onClick={() => setFormData({...formData, techStack: formData.techStack?.filter((_, idx) => idx !== i)})}><X size={12}/></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-white/10 bg-[#151515]">
                    <button 
                        onClick={handleSave}
                        disabled={actionLoading}
                        className="w-full bg-primary text-black font-bold py-3 rounded hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={18} /> {actionLoading ? 'Enregistrement…' : 'Enregistrer le projet'}
                    </button>
                </div>

            </div>
        </div>
      )}

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

      <style>{`
        .field-label {
            display: block;
            font-size: 0.75rem;
            font-family: monospace;
            color: #737373;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
        }
        .input-field {
            width: 100%;
            background-color: black;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 0.25rem;
            padding: 0.75rem;
            color: white;
            outline: none;
            transition: border-color 0.2s;
        }
        .input-field:focus {
            border-color: #CCFF00;
        }
      `}</style>
    </div>
  );
};