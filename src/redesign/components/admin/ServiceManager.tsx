import React, { useState } from 'react';
import { ServicePack } from '../../types';
import { Edit2, Save, X, Globe } from 'lucide-react';

interface ServiceManagerProps {
  services: ServicePack[];
  setServices: React.Dispatch<React.SetStateAction<ServicePack[]>>;
}

type Lang = 'fr' | 'en';

export const ServiceManager: React.FC<ServiceManagerProps> = ({ services, setServices }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('fr');
  
  const handleUpdate = (id: string, field: keyof ServicePack, value: any) => {
      setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleFeatureUpdate = (id: string, index: number, value: string) => {
      setServices(prev => prev.map(s => {
          if (s.id === id) {
              // Determine which array to update based on lang
              const featuresKey = lang === 'fr' ? 'features' : 'features_en';
              const currentFeatures = s[featuresKey] || [];
              
              // Ensure array exists and is big enough (copy fr to en if undefined)
              let newFeatures = [...currentFeatures];
              if (newFeatures.length === 0 && lang === 'en' && s.features.length > 0) {
                  newFeatures = [...s.features]; // fallback copy
              }
              
              newFeatures[index] = value;
              return { ...s, [featuresKey]: newFeatures };
          }
          return s;
      }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Offres & tarifs</h1>
            <p className="text-neutral-400">Gérez vos packs de services.</p>
        </div>
        <div className="flex bg-black rounded-lg p-1 border border-white/10">
             <button onClick={() => setLang('fr')} className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${lang === 'fr' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>FR</button>
             <button onClick={() => setLang('en')} className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${lang === 'en' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>EN</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map(service => (
              <div key={service.id} className={`bg-[#0F0F0F] border rounded-xl p-6 flex flex-col ${editingId === service.id ? 'border-primary' : 'border-white/5'}`}>
                  
                  <div className="flex justify-between items-start mb-6">
                      <div className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-neutral-500 uppercase">{service.id}</div>
                      <button 
                        onClick={() => setEditingId(editingId === service.id ? null : service.id)}
                        className={`p-2 rounded transition-colors ${editingId === service.id ? 'bg-primary text-black' : 'bg-white/5 text-white'}`}
                      >
                          {editingId === service.id ? <Save size={16} /> : <Edit2 size={16} />}
                      </button>
                  </div>

                  <div className="space-y-4 flex-grow">
                      <div>
                          <label className="text-xs text-neutral-500 uppercase">Titre ({lang})</label>
                          {editingId === service.id ? (
                              <input 
                                type="text" 
                                value={lang === 'fr' ? service.title : (service.title_en || service.title)} 
                                onChange={(e) => handleUpdate(service.id, lang === 'fr' ? 'title' : 'title_en', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded p-2 text-white text-lg font-bold"
                              />
                          ) : (
                              <h3 className="text-xl font-display font-bold text-white">{lang === 'fr' ? service.title : (service.title_en || service.title)}</h3>
                          )}
                      </div>

                      <div>
                          <label className="text-xs text-neutral-500 uppercase">Tarif ({lang})</label>
                           {editingId === service.id ? (
                              <input 
                                type="text" 
                                value={lang === 'fr' ? service.price : (service.price_en || service.price)} 
                                onChange={(e) => handleUpdate(service.id, lang === 'fr' ? 'price' : 'price_en', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded p-2 text-white"
                              />
                          ) : (
                              <div className="text-2xl font-light text-neutral-300">{lang === 'fr' ? service.price : (service.price_en || service.price)}</div>
                          )}
                      </div>

                       <div>
                          <label className="text-xs text-neutral-500 uppercase">Description ({lang})</label>
                           {editingId === service.id ? (
                              <textarea 
                                value={lang === 'fr' ? service.description : (service.description_en || service.description)} 
                                rows={2}
                                onChange={(e) => handleUpdate(service.id, lang === 'fr' ? 'description' : 'description_en', e.target.value)}
                                className="w-full bg-black border border-white/20 rounded p-2 text-sm text-neutral-300"
                              />
                          ) : (
                              <p className="text-sm text-neutral-500">{lang === 'fr' ? service.description : (service.description_en || service.description)}</p>
                          )}
                      </div>

                      <div>
                           <label className="text-xs text-neutral-500 uppercase mb-2 block">Bénéfices ({lang})</label>
                           <ul className="space-y-2">
                               {(lang === 'fr' ? service.features : (service.features_en || service.features)).map((feature, idx) => (
                                   <li key={idx} className="flex gap-2">
                                       <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                                       {editingId === service.id ? (
                                           <input 
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureUpdate(service.id, idx, e.target.value)}
                                            className="w-full bg-black border border-white/20 rounded p-1 text-xs text-neutral-300"
                                           />
                                       ) : (
                                           <span className="text-sm text-neutral-300">{feature}</span>
                                       )}
                                   </li>
                               ))}
                           </ul>
                      </div>
                  </div>

              </div>
          ))}
      </div>
    </div>
  );
};