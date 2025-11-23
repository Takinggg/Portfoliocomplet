import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Download,
  Plus,
  Clock,
  User,
  Repeat,
  Trash2
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { createClient } from "../../utils/supabase/client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  addHours,
  setHours,
  setMinutes
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import ical from 'ical-generator';
import { projectId } from "../../utils/supabase/info";

type ViewMode = 'month' | 'week' | 'day';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  service: string;
  status: string;
  message?: string;
  createdAt: string;
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
    count?: number;
  };
}

interface CalendarViewProps {
  bookings: Booking[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  onCreateBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
  onEditBooking?: (booking: Booking) => void;
  onDeleteBooking?: (id: string) => Promise<void>;
}

interface PendingChange {
  bookingId: string;
  oldDate: string;
  newDate: string;
  booking: Booking;
}

export function CalendarView({ bookings, onUpdateBooking, onCreateBooking, onEditBooking, onDeleteBooking }: CalendarViewProps) {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  console.log('ðŸ“… CalendarView rendered with', bookings.length, 'bookings');

  // Appliquer les changements en attente aux bookings affichÃ©s
  const displayedBookings = useMemo(() => {
    return bookings.map(booking => {
      const change = pendingChanges.find(c => c.bookingId === booking.id);
      if (change) {
        return { ...booking, date: change.newDate };
      }
      return booking;
    });
  }, [bookings, pendingChanges]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Navigation
  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, -1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, -1));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // GÃ©nÃ©rer les jours Ã  afficher selon le mode
  const days = useMemo(() => {
    console.log('ðŸ“… Generating calendar days for:', viewMode, 'current date:', currentDate);
    
    if (viewMode === 'month') {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
      const days = [];
      let day = start;
      
      while (day <= end) {
        days.push(day);
        day = addDays(day, 1);
      }
      
      console.log('ðŸ“… Generated', days.length, 'days for month view');
      return days;
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const days = [];
      
      for (let i = 0; i < 7; i++) {
        days.push(addDays(start, i));
      }
      
      console.log('ðŸ“… Generated', days.length, 'days for week view');
      return days;
    } else {
      console.log('ðŸ“… Generated 1 day for day view');
      return [currentDate];
    }
  }, [currentDate, viewMode]);

  // RÃ©cupÃ©rer les bookings pour un jour donnÃ©
  const getBookingsForDay = (day: Date) => {
    return displayedBookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      return isSameDay(bookingDate, day);
    }).sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
  };

  // Drag and Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const bookingId = active.id as string;
    const overId = over.id as string;
    
    // VÃ©rifier si c'est un drop dans la corbeille
    if (overId === 'trash-zone') {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking && onDeleteBooking) {
        if (confirm(`Supprimer le rendez-vous avec ${booking.name} le ${format(parseISO(booking.date), 'dd/MM/yyyy', { locale: fr })} Ã  ${booking.time} ?`)) {
          await onDeleteBooking(bookingId);
          toast.success('Rendez-vous supprimÃ©');
        }
      }
      setActiveId(null);
      return;
    }
    
    const newDate = overId;
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking && newDate !== booking.date) {
      // Ajouter aux changements en attente au lieu de sauvegarder immÃ©diatement
      setPendingChanges(prev => {
        const existing = prev.find(c => c.bookingId === bookingId);
        if (existing) {
          return prev.map(c => 
            c.bookingId === bookingId ? { ...c, newDate } : c
          );
        }
        return [...prev, { bookingId, oldDate: booking.date, newDate, booking }];
      });
      toast.info('Modification en attente - Cliquez sur Sauvegarder');
    }

    setActiveId(null);
  };

  // Sauvegarder tous les changements en attente
  const handleSaveChanges = async () => {
    if (pendingChanges.length === 0) return;

    setIsSaving(true);
    try {
      // Sauvegarder chaque changement sÃ©quentiellement
      for (const change of pendingChanges) {
        // Validation: s'assurer que le booking existe
        if (!change.bookingId || !change.booking) {
          console.error('âŒ Booking invalide, ignorÃ©:', change);
          continue;
        }
        
        console.log('ðŸ’¾ Mise Ã  jour booking:', {
          id: change.bookingId,
          from: change.oldDate,
          to: change.newDate
        });
        
        await onUpdateBooking(change.bookingId, { date: change.newDate });
        
        // Envoyer email de confirmation
        await sendBookingUpdateEmail(change);
      }

      // Vider les changements en attente AVANT le toast
      setPendingChanges([]);
      
      toast.success(`${pendingChanges.length} rendez-vous dÃ©placÃ©${pendingChanges.length > 1 ? 's' : ''} avec succÃ¨s !`);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Annuler les changements
  const handleCancelChanges = () => {
    setPendingChanges([]);
    toast.info('Modifications annulÃ©es');
  };

  // Fonction pour envoyer l'email de confirmation
  const sendBookingUpdateEmail = async (change: PendingChange) => {
    try {
      const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('âŒ Pas de session');
        return;
      }
      
      // Utiliser le mÃªme format que BookingCalendar
      const payload = {
        to: change.booking.email,
        name: change.booking.name,
        date: change.newDate,
        time: change.booking.time,
        service: change.booking.service || 'Rendez-vous',
        status: 'confirmed',
        message: `Votre rendez-vous a Ã©tÃ© dÃ©placÃ© au ${format(parseISO(change.newDate), 'dd/MM/yyyy', { locale: fr })} Ã  ${change.booking.time}.`
      };
      
      console.log('ðŸ“§ Envoi email de confirmation (nouvelle date)...');
      console.log('ðŸ“ Payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(`${API_URL}/emails/booking-confirmation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('âŒ Erreur envoi email:', errorText);
        toast.error('Erreur envoi email');
      } else {
        const result = await response.json();
        console.log('âœ… Email envoyÃ© avec succÃ¨s:', result);
      }
    } catch (error) {
      console.error('âŒ Erreur envoi email:', error);
      toast.error('Erreur envoi email');
    }
  };

  // Export iCal
  const handleExportICS = () => {
    try {
      const calendar = ical({ name: 'Mes Rendez-vous' });

      displayedBookings.forEach(booking => {
        const [hours, minutes] = booking.time.split(':').map(Number);
        const bookingDate = parseISO(booking.date);
        const startDate = setMinutes(setHours(bookingDate, hours), minutes);
        const endDate = addHours(startDate, 1);

        calendar.createEvent({
          start: startDate,
          end: endDate,
          summary: `${booking.service} - ${booking.name}`,
          description: booking.message || '',
          location: 'maxence.design',
          organizer: {
            name: 'FOULON Maxence',
            email: 'contact@maxence.design'
          },
          attendees: [{
            name: booking.name,
            email: booking.email,
            rsvp: true
          }]
        });
      });

      const blob = new Blob([calendar.toString()], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rendez-vous-${format(new Date(), 'yyyy-MM-dd')}.ics`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Calendrier exportÃ© !');
    } catch (error) {
      console.error('Erreur export ICS:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const activeBooking = activeId ? bookings.find(b => b.id === activeId) : null;

  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#CCFF00]" />
            Calendrier
          </h2>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePrevious}
              className="text-white/60 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToday}
              className="text-white/60 hover:text-[#CCFF00]"
            >
              Aujourd'hui
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleNext}
              className="text-white/60 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <h3 className="text-xl font-semibold text-white">
            {viewMode === 'month' && format(currentDate, 'MMMM yyyy', { locale: fr })}
            {viewMode === 'week' && `Semaine du ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMMM', { locale: fr })}`}
            {viewMode === 'day' && format(currentDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Boutons Sauvegarder/Annuler si changements en attente */}
          {pendingChanges.length > 0 && (
            <div className="flex items-center gap-2 mr-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <span className="text-sm text-yellow-400 font-medium">
                {pendingChanges.length} modification{pendingChanges.length > 1 ? 's' : ''} en attente
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelChanges}
                disabled={isSaving}
                className="text-white/60 hover:text-red-400"
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          )}

          {/* Mode switcher */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              onClick={() => setViewMode('month')}
              className={viewMode === 'month' ? 'bg-[#CCFF00] text-black' : 'text-white/60'}
            >
              Mois
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? 'bg-[#CCFF00] text-black' : 'text-white/60'}
            >
              Semaine
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              onClick={() => setViewMode('day')}
              className={viewMode === 'day' ? 'bg-[#CCFF00] text-black' : 'text-white/60'}
            >
              Jour
            </Button>
          </div>

          {/* Export */}
          <Button
            size="sm"
            onClick={handleExportICS}
            className="bg-[#CCFF00]/10 text-[#CCFF00] hover:bg-[#CCFF00]/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export .ics
          </Button>
        </div>
      </div>

      {/* Calendrier avec drag-and-drop */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          {viewMode === 'month' && (
            <MonthView days={days} currentDate={currentDate} getBookingsForDay={getBookingsForDay} onEditBooking={onEditBooking} />
          )}
          
          {viewMode === 'week' && (
            <WeekView days={days} getBookingsForDay={getBookingsForDay} onEditBooking={onEditBooking} />
          )}
          
          {viewMode === 'day' && (
            <DayView day={currentDate} bookings={getBookingsForDay(currentDate)} onEditBooking={onEditBooking} />
          )}

          {/* Zone de corbeille */}
          <TrashZone isActive={!!activeId} />
        </div>

        <DragOverlay>
          {activeBooking && (
            <BookingCard booking={activeBooking} isDragging />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Composant zone de corbeille
function TrashZone({ isActive }: { isActive: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed
        transition-all duration-300
        ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        ${isOver 
          ? 'bg-red-500/20 border-red-500 scale-105' 
          : 'bg-white/5 border-white/20'
        }
      `}
    >
      <Trash2 className={`w-6 h-6 ${isOver ? 'text-red-500' : 'text-white/40'}`} />
      <span className={`text-sm font-medium ${isOver ? 'text-red-500' : 'text-white/40'}`}>
        {isOver ? 'RelÃ¢cher pour supprimer' : 'Glisser ici pour supprimer'}
      </span>
    </div>
  );
}

// Composant pour afficher un booking
function BookingCard({ booking, isDragging = false, onClick }: { 
  booking: Booking; 
  isDragging?: boolean;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingState } = useDraggable({
    id: booking.id,
    data: booking
  });

  const statusColors = {
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`
        p-2 rounded-lg border text-xs
        ${statusColors[booking.status as keyof typeof statusColors] || 'bg-white/5 border-white/10'}
        ${isDraggingState ? 'opacity-50' : 'hover:scale-105'}
        ${isDragging ? 'shadow-2xl rotate-3' : ''}
        transition-all cursor-move
      `}
    >
      <div className="flex items-center gap-1 mb-1">
        <Clock className="w-3 h-3" />
        <span className="font-semibold">{booking.time}</span>
        {booking.recurrence && <Repeat className="w-3 h-3 ml-auto" />}
      </div>
      <div className="flex items-center gap-1">
        <User className="w-3 h-3" />
        <span className="truncate">{booking.name}</span>
      </div>
      <div className="text-white/40 truncate mt-1">{booking.service}</div>
    </div>
  );
}

// Vue Mois
function MonthView({ days, currentDate, getBookingsForDay, onEditBooking }: any) {
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      {/* En-tÃªtes jours de la semaine */}
      <div className="grid grid-cols-7 border-b border-white/10">
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-white/60">
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7">
        {days.map((day: Date, index: number) => (
          <DayCell 
            key={index}
            day={day}
            currentDate={currentDate}
            bookings={getBookingsForDay(day)}
            onEditBooking={onEditBooking}
          />
        ))}
      </div>
    </div>
  );
}

// Cellule de jour pour le drop
function DayCell({ day, currentDate, bookings, onEditBooking }: { day: Date; currentDate: Date; bookings: Booking[]; onEditBooking?: (booking: Booking) => void }) {
  const dateId = format(day, 'yyyy-MM-dd');
  const { setNodeRef, isOver } = useDroppable({
    id: dateId,
  });

  const isCurrentMonth = isSameMonth(day, currentDate);
  const isToday = isSameDay(day, new Date());

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[120px] p-2 border-r border-b border-white/10
        ${!isCurrentMonth ? 'bg-white/[0.02]' : ''}
        ${isToday ? 'bg-[#CCFF00]/5' : ''}
        ${isOver ? 'bg-[#CCFF00]/10 ring-2 ring-[#CCFF00]/50' : ''}
        transition-all
      `}
    >
      <div className={`
        text-sm font-semibold mb-2
        ${!isCurrentMonth ? 'text-white/30' : 'text-white/80'}
        ${isToday ? 'text-[#CCFF00]' : ''}
      `}>
        {format(day, 'd')}
      </div>
      
      <div className="space-y-1">
        {bookings.slice(0, 3).map((booking: Booking) => (
          <BookingCard 
            key={booking.id} 
            booking={booking}
            onClick={() => onEditBooking?.(booking)}
          />
        ))}
        {bookings.length > 3 && (
          <div className="text-xs text-white/40 text-center">
            +{bookings.length - 3} autre{bookings.length - 3 > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

// Vue Semaine
function WeekView({ days, getBookingsForDay, onEditBooking }: any) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="grid grid-cols-8">
        {/* Colonne des heures */}
        <div className="border-r border-white/10">
          <div className="h-12 border-b border-white/10" /> {/* Header spacer */}
          {hours.map(hour => (
            <div key={hour} className="h-16 border-b border-white/10 p-2 text-xs text-white/40">
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Colonnes des jours */}
        {days.map((day: Date) => {
          const dayBookings = getBookingsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div key={day.toString()} className="border-r border-white/10">
              {/* Header jour */}
              <div className={`
                h-12 border-b border-white/10 p-2 text-center
                ${isToday ? 'bg-[#CCFF00]/10' : ''}
              `}>
                <div className="text-xs text-white/60">{format(day, 'EEE', { locale: fr })}</div>
                <div className={`text-sm font-semibold ${isToday ? 'text-[#CCFF00]' : 'text-white'}`}>
                  {format(day, 'd')}
                </div>
              </div>

              {/* Heures */}
              <div className="relative">
                {hours.map(hour => (
                  <div key={hour} className="h-16 border-b border-white/10" />
                ))}
                
                {/* Bookings positionnÃ©s */}
                {dayBookings.map((booking: Booking) => {
                  const [hours, minutes] = booking.time.split(':').map(Number);
                  const top = hours * 64 + (minutes / 60) * 64;
                  
                  return (
                    <div
                      key={booking.id}
                      style={{ top: `${top}px` }}
                      className="absolute left-1 right-1 h-14"
                    >
                      <BookingCard 
                        booking={booking}
                        onClick={() => onEditBooking?.(booking)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Vue Jour
function DayView({ day, bookings, onEditBooking }: { day: Date; bookings: Booking[]; onEditBooking?: (booking: Booking) => void }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="grid grid-cols-1">
        {hours.map(hour => {
          const hourBookings = bookings.filter(b => {
            const [h] = b.time.split(':').map(Number);
            return h === hour;
          });

          return (
            <div key={hour} className="flex border-b border-white/10 min-h-[80px]">
              {/* Heure */}
              <div className="w-20 p-4 border-r border-white/10 text-white/40 font-semibold">
                {hour.toString().padStart(2, '0')}:00
              </div>

              {/* Bookings */}
              <div className="flex-1 p-2 space-y-2">
                {hourBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking}
                    onClick={() => onEditBooking?.(booking)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
