import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  Check,
  X,
  Edit,
  AlertCircle,
  Phone,
  User
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";
import { projectId } from "../../utils/supabase/info";

interface BookingCalendarProps {
  bookings: any[];
  onRefresh: () => void;
  onEditBooking: (booking: any) => void;
}

export function BookingCalendar({ bookings, onRefresh, onEditBooking }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const supabase = createClient();

  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent pour remplir
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Jours du mois suivant pour compléter
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  // Trouver les bookings pour une date donnée
  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.date === dateStr);
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Actions sur les bookings
  const handleConfirmBooking = async (booking: any) => {
    if (!confirm(`Confirmer le rendez-vous avec ${booking.name} ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Validation des données
      if (!booking.email || !booking.name || !booking.date || !booking.time) {
        console.error('Booking data incomplete:', booking);
        alert('Erreur: Données du rendez-vous incomplètes');
        return;
      }

      // 1. Mettre à jour le statut
      const updateRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings/${booking.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...booking, status: 'confirmed' })
        }
      );

      if (!updateRes.ok) throw new Error('Erreur mise à jour');

      // 2. Envoyer l'email de confirmation
      console.log('Sending confirmation email with data:', {
        to: booking.email,
        name: booking.name,
        date: booking.date,
        time: booking.time,
        service: booking.service || 'N/A',
        status: 'confirmed'
      });

      const emailRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/booking-confirmation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: booking.email,
            name: booking.name,
            date: booking.date,
            time: booking.time,
            service: booking.service || 'Rendez-vous',
            status: 'confirmed',
            message: `Votre rendez-vous du ${new Date(booking.date).toLocaleDateString('fr-FR')} à ${booking.time} est confirmé.`
          })
        }
      );

      if (!emailRes.ok) {
        const errorData = await emailRes.json();
        console.error('Email API error:', errorData);
        throw new Error(`Email error: ${errorData.error || 'Unknown error'}`);
      }

      if (emailRes.ok) {
        // Notification de succès
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-xl text-white px-6 py-4 rounded-lg shadow-2xl border border-green-400/20 animate-slide-in-right';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="font-semibold">Rendez-vous confirmé !</p>
              <p class="text-sm text-green-100">Email de confirmation envoyé à ${booking.email}</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);

        onRefresh();
      }
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleCancelBooking = async (booking: any) => {
    const reason = prompt(`Annuler le rendez-vous avec ${booking.name} ?\n\nRaison de l'annulation (optionnel) :`);
    if (reason === null) return; // User clicked cancel

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Validation des données
      if (!booking.email || !booking.name || !booking.date || !booking.time) {
        console.error('Booking data incomplete:', booking);
        alert('Erreur: Données du rendez-vous incomplètes');
        return;
      }

      // 1. Mettre à jour le statut
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings/${booking.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...booking, status: 'cancelled' })
        }
      );

      // 2. Envoyer l'email d'annulation
      console.log('Sending cancellation email with data:', {
        to: booking.email,
        name: booking.name,
        date: booking.date,
        time: booking.time,
        service: booking.service || 'N/A',
        status: 'cancelled',
        message: reason || 'Votre rendez-vous a été annulé.'
      });

      const emailRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/booking-confirmation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: booking.email,
            name: booking.name,
            date: booking.date,
            time: booking.time,
            service: booking.service || 'Rendez-vous',
            status: 'cancelled',
            message: reason || 'Votre rendez-vous a été annulé.'
          })
        }
      );

      console.log('Email response status:', emailRes.status);
      const emailResult = await emailRes.json();
      console.log('Email response:', emailResult);

      if (!emailRes.ok) {
        console.error('Email API error:', emailResult);
        throw new Error(`Email error: ${emailResult.error || 'Unknown error'}`);
      }

      console.log('✅ Cancellation email sent successfully!');

      // Notification de succès
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-red-500/90 backdrop-blur-xl text-white px-6 py-4 rounded-lg shadow-2xl border border-red-400/20';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <div>
            <p class="font-semibold">Rendez-vous annulé</p>
            <p class="text-sm text-red-100">Email d'annulation envoyé à ${booking.email}</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);

      onRefresh();
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    }
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
            Calendrier des Rendez-vous
          </h2>
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            {bookings.length} RDV
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            Aujourd'hui
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold text-white min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-white/60 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map(({ date, isCurrentMonth }, index) => {
            const dayBookings = getBookingsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <motion.div
                key={index}
                className={`
                  min-h-[120px] p-2 rounded-lg border transition-all cursor-pointer
                  ${isCurrentMonth ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5'}
                  ${isToday ? 'ring-2 ring-purple-500/50 bg-purple-500/10' : ''}
                  hover:bg-white/10 hover:border-white/20
                `}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentMonth ? 'text-white' : 'text-white/40'
                } ${isToday ? 'text-purple-400 font-bold' : ''}`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayBookings.map((booking, idx) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        text-xs p-2 rounded border cursor-pointer group relative
                        ${booking.status === 'confirmed' ? 'bg-green-500/20 border-green-500/30 text-green-300' : ''}
                        ${booking.status === 'cancelled' ? 'bg-red-500/20 border-red-500/30 text-red-300' : ''}
                        ${booking.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' : ''}
                        hover:scale-105 transition-transform
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(booking);
                      }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{booking.time}</span>
                      </div>
                      <div className="truncate">{booking.name}</div>
                      {booking.service && (
                        <div className="text-[10px] opacity-70 truncate">{booking.service}</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0C0C0C] border border-white/10 rounded-xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  Détails du Rendez-vous
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-white">
                  <User className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Client</div>
                    <div className="font-medium">{selectedBooking.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-white">
                  <Mail className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Email</div>
                    <div className="font-medium">{selectedBooking.email}</div>
                  </div>
                </div>

                {selectedBooking.phone && (
                  <div className="flex items-center gap-3 text-white">
                    <Phone className="w-5 h-5 text-white/60" />
                    <div>
                      <div className="text-sm text-white/60">Téléphone</div>
                      <div className="font-medium">{selectedBooking.phone}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-white">
                  <CalendarIcon className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Date & Heure</div>
                    <div className="font-medium">
                      {new Date(selectedBooking.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} à {selectedBooking.time}
                    </div>
                  </div>
                </div>

                {selectedBooking.service && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="text-sm text-white/60 mb-1">Service</div>
                    <div className="text-white font-medium">{selectedBooking.service}</div>
                  </div>
                )}

                {selectedBooking.message && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="text-sm text-white/60 mb-1">Message</div>
                    <div className="text-white">{selectedBooking.message}</div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="text-sm text-white/60">Statut:</div>
                  <Badge className={`
                    ${selectedBooking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                    ${selectedBooking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                    ${selectedBooking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                  `}>
                    {selectedBooking.status === 'confirmed' ? '✅ Confirmé' : ''}
                    {selectedBooking.status === 'cancelled' ? '❌ Annulé' : ''}
                    {selectedBooking.status === 'pending' ? '⏳ En attente' : ''}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleConfirmBooking(selectedBooking)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirmer
                    </Button>
                    <Button
                      onClick={() => handleCancelBooking(selectedBooking)}
                      variant="outline"
                      className="flex-1 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </>
                )}
                
                {selectedBooking.status === 'confirmed' && (
                  <Button
                    onClick={() => handleCancelBooking(selectedBooking)}
                    variant="outline"
                    className="flex-1 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler ce RDV
                  </Button>
                )}
                
                {selectedBooking.status === 'cancelled' && (
                  <Button
                    onClick={() => handleConfirmBooking(selectedBooking)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Réactiver
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setSelectedBooking(null);
                    onEditBooking(selectedBooking);
                  }}
                  variant="outline"
                  className="flex-1 bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
