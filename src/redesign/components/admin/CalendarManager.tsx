import React, { useState, useMemo, useEffect } from 'react';
import { Appointment, Client } from '../../types';
import { Clock, Video, MapPin, Plus, X, Save, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface CalendarManagerProps {
  appointments: Appointment[];
  clients: Client[];
  onAddAppointment: (apt: any) => void;
    onDeleteAppointment?: (id: Appointment["id"]) => void;
}

const getWeekStart = (date: Date) => {
    const normalized = new Date(date);
    const day = normalized.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // align to Monday
    normalized.setDate(normalized.getDate() + diff);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

export const CalendarManager: React.FC<CalendarManagerProps> = ({ appointments, clients, onAddAppointment, onDeleteAppointment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApt, setNewApt] = useState({ clientId: '', title: '', date: '', time: '', duration: '60', type: 'discovery' });
    const [hasAlignedWeek, setHasAlignedWeek] = useState(false);
  
    // Week Navigation State - align with current week by default
    const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()));

    // When appointments load from Supabase, align the view to the nearest upcoming slot once
    useEffect(() => {
        if (hasAlignedWeek) return;
        if (!appointments.length) return;
        const sorted = [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const upcoming = sorted.find((apt) => new Date(apt.date).getTime() >= Date.now()) ?? sorted[sorted.length - 1];
        if (upcoming) {
            setCurrentWeekStart(getWeekStart(new Date(upcoming.date)));
            setHasAlignedWeek(true);
        }
    }, [appointments, hasAlignedWeek]);

  const weekDates = useMemo(() => {
      const dates = [];
      for(let i=0; i<5; i++) {
          const d = new Date(currentWeekStart);
          d.setDate(currentWeekStart.getDate() + i);
          dates.push(d);
      }
      return dates;
  }, [currentWeekStart]);

  const changeWeek = (delta: number) => {
      const newDate = new Date(currentWeekStart);
      newDate.setDate(currentWeekStart.getDate() + (delta * 7));
      setCurrentWeekStart(newDate);
  };

    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
    const client = clients.find(c => String(c.id) === newApt.clientId);
      if (client && newApt.date && newApt.time) {
          onAddAppointment({
              clientId: client.id,
              clientName: client.name,
              title: newApt.title,
              date: `${newApt.date}T${newApt.time}:00`, 
              duration: parseInt(newApt.duration),
              type: newApt.type
          });
          setIsModalOpen(false);
          setNewApt({ clientId: '', title: '', date: '', time: '', duration: '60', type: 'discovery' });
      }
  };

  const handleDelete = (id: Appointment["id"], e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDeleteAppointment && confirm('Annuler ce rendez-vous ?')) {
          onDeleteAppointment(id);
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Agenda</h1>
            <p className="text-neutral-400">Planifiez vos rendez-vous et livraisons.</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex items-center bg-black border border-white/10 rounded-lg p-1">
                  <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-white/10 rounded text-white"><ChevronLeft size={16}/></button>
                  <span className="px-4 text-sm font-mono font-bold text-white">{currentWeekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short'})} - {weekDates[4].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short'})}</span>
                  <button onClick={() => changeWeek(1)} className="p-2 hover:bg-white/10 rounded text-white"><ChevronRight size={16}/></button>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg text-sm hover:bg-white transition-colors"
              >
                  <Plus size={16} /> Programmer un rendez-vous
              </button>
          </div>
      </div>

      <div className="bg-[#0F0F0F] border border-white/5 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-6 border-b border-white/5 bg-[#151515]">
              <div className="p-4 border-r border-white/5"></div>
              {days.map((day, i) => (
                  <div key={day} className="p-4 text-center border-r border-white/5 last:border-0">
                      <div className="text-sm font-bold text-white uppercase">{day}</div>
                      <div className="text-xs text-neutral-500 font-mono">{weekDates[i].getDate()}</div>
                  </div>
              ))}
          </div>
          
          {/* Grid */}
          <div className="relative h-[600px] overflow-y-auto">
              {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-6 h-24 border-b border-white/5 last:border-0">
                      <div className="p-4 border-r border-white/5 text-xs text-neutral-500 font-mono text-right">{hour}:00</div>
                      {weekDates.map((date, i) => (
                          <div key={i} className="border-r border-white/5 last:border-0 relative group hover:bg-white/5 transition-colors">
                              {/* Filter appointments for this specific date and hour */}
                              {appointments.filter(a => {
                                  const d = new Date(a.date);
                                  return d.getDate() === date.getDate() && 
                                         d.getMonth() === date.getMonth() && 
                                         d.getFullYear() === date.getFullYear() && 
                                         d.getHours() === hour;
                              }).map(apt => (
                                  <div key={apt.id} className="absolute inset-1 bg-primary/20 border border-primary/50 rounded p-2 flex flex-col justify-between hover:z-10 cursor-pointer hover:scale-105 transition-transform group/apt">
                                      <div className="flex justify-between items-start">
                                          <span className="text-[10px] font-bold text-primary truncate">{apt.title}</span>
                                          <button onClick={(e) => handleDelete(apt.id, e)} className="text-primary hover:text-white opacity-0 group-hover/apt:opacity-100 transition-opacity"><Trash2 size={10}/></button>
                                      </div>
                                      <div className="flex items-center gap-1 text-[10px] text-neutral-300">
                                          <Clock size={10} /> {apt.duration}m
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ))}
                  </div>
              ))}
          </div>
      </div>

       {/* BOOKING MODAL */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">Programmer un rendez-vous</h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                       <select
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={newApt.clientId} onChange={e => setNewApt({...newApt, clientId: e.target.value})} required
                                            >
                                                    <option value="">Choisir un client</option>
                          {clients.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                      </select>
                      <input 
                                                placeholder="Titre du rendez-vous" 
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={newApt.title} onChange={e => setNewApt({...newApt, title: e.target.value})} required 
                      />
                      <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="date"
                            className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                            value={newApt.date} onChange={e => setNewApt({...newApt, date: e.target.value})} required 
                          />
                           <input 
                            type="time"
                            className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                            value={newApt.time} onChange={e => setNewApt({...newApt, time: e.target.value})} required 
                          />
                      </div>
                       <select
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={newApt.type} onChange={e => setNewApt({...newApt, type: e.target.value as any})}
                      >
                          <option value="discovery">Appel découverte</option>
                          <option value="review">Revue de sprint</option>
                          <option value="delivery">Livraison</option>
                      </select>

                      <button type="submit" className="w-full py-3 bg-primary text-black font-bold rounded hover:bg-white transition-colors flex items-center justify-center gap-2">
                          <Save size={18} /> Planifier
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};