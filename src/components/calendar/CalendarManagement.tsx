import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Plus,
  Edit,
  Trash,
  Check,
  X,
  Video,
  Phone,
  Users,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  CalendarDays,
  Settings,
  Mail,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { LeadDetailDialog } from "../dashboard/LeadDetailDialog";

interface CalendarBooking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  duration?: number | string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  type?: "call" | "video" | "meeting";
  createdAt: string;
  // Additional properties for Lead compatibility
  message?: string;
  wantsAppointment?: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "CalendarBooking" | "event" | "blocked";
  color?: string;
  description?: string;
  status?: string;
  createdAt: string;
}

interface Availability {
  id: string;
  date: string;
  slots: string[];
  isBlocked: boolean;
  reason?: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  interests?: string[];
  wantsAppointment?: boolean;
  createdAt: string;
}

interface CalendarManagementProps {
  bookings: CalendarBooking[];
  leads?: Lead[];
  onRefresh: () => void;
  loading: boolean;
}

export default function CalendarManagement({ bookings, leads = [], onRefresh, loading }: CalendarManagementProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Debug: Log leads
  useEffect(() => {
    console.log("📊 CalendarManagement - Leads reçus:", leads);
    console.log("📊 CalendarManagement - Bookings reçus:", bookings);
  }, [leads, bookings]);

  // Fetch events and availabilities
  useEffect(() => {
    fetchEvents();
    fetchAvailabilities();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/events`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/availabilities`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setAvailabilities(data.availabilities || []);
      }
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date): (CalendarBooking | CalendarEvent | Lead)[] => {
    const dateStr = date.toISOString().split('T')[0];
    
    const bookingsForDate = bookings.filter(b => {
      const bookingDate = new Date(b.date).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });

    const eventsForDate = events.filter(e => {
      const eventDate = new Date(e.date).toISOString().split('T')[0];
      return eventDate === dateStr;
    });

    const leadsForDate = (leads || []).filter(l => {
      const leadDate = new Date(l.createdAt).toISOString().split('T')[0];
      return leadDate === dateStr;
    });

    return [...bookingsForDate, ...eventsForDate, ...leadsForDate];
  };

  // Check if date has availability
  const getAvailabilityForDate = (date: Date): Availability | null => {
    const dateStr = date.toISOString().split('T')[0];
    return availabilities.find(a => a.date === dateStr) || null;
  };

  // Update CalendarBooking status
  const updateBookingStatus = async (bookingId: string, status: CalendarBooking["status"]) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast.success("Statut mis à jour");
        onRefresh();
      }
    } catch (error) {
      console.error("Error updating CalendarBooking:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Delete CalendarBooking
  const deleteBooking = async (bookingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      if (response.ok) {
        toast.success("Rendez-vous supprimé");
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting CalendarBooking:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Create availability
  const createAvailability = async (date: Date, slots: string[], isBlocked: boolean, reason?: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/availabilities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            date: date.toISOString().split('T')[0],
            slots,
            isBlocked,
            reason
          }),
        }
      );

      if (response.ok) {
        toast.success(isBlocked ? "Journée bloquée" : "Disponibilité ajoutée");
        fetchAvailabilities();
        setShowAvailabilityDialog(false);
      }
    } catch (error) {
      console.error("Error creating availability:", error);
      toast.error("Erreur lors de la création");
    }
  };

  // Create event
  const createEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      if (response.ok) {
        toast.success("Événement créé");
        fetchEvents();
        setShowEventDialog(false);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Erreur lors de la création");
    }
  };

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((CalendarBooking) => {
      const matchesSearch = 
        CalendarBooking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        CalendarBooking.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || CalendarBooking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Get upcoming bookings
  const upcomingBookings = useMemo(() => {
    const now = new Date();
    return filteredBookings
      .filter(b => {
        const bookingDate = new Date(`${b.date}T${b.time}`);
        return bookingDate > now && b.status !== "cancelled";
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [filteredBookings]);

  const getStatusLabel = (status: CalendarBooking["status"]) => {
    const labels = {
      pending: "En attente",
      confirmed: "Confirmé",
      completed: "Terminé",
      cancelled: "Annulé"
    };
    return labels[status];
  };

  const getStatusColor = (status: CalendarBooking["status"]) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-400",
      confirmed: "bg-[#00FFC2]/10 text-[#00FFC2]",
      completed: "bg-green-500/10 text-green-400",
      cancelled: "bg-red-500/10 text-red-400"
    };
    return colors[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Calendrier & Rendez-vous</h2>
          <p className="text-white/60 text-sm">
            {upcomingBookings.length} rendez-vous à venir
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowEventDialog(true)}
            className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
          <Button
            onClick={() => setShowAvailabilityDialog(true)}
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Disponibilités
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          {
            label: "Nouveaux Leads",
            value: (leads || []).filter(l => l.status === "new").length,
            icon: Mail,
            color: "#A855F7"
          },
          {
            label: "En attente",
            value: bookings.filter(b => b.status === "pending").length,
            icon: Clock,
            color: "#FFB800"
          },
          {
            label: "Confirmés",
            value: bookings.filter(b => b.status === "confirmed").length,
            icon: Check,
            color: "#00FFC2"
          },
          {
            label: "Terminés",
            value: bookings.filter(b => b.status === "completed").length,
            icon: CalendarDays,
            color: "#4CAF50"
          },
          {
            label: "Annulés",
            value: bookings.filter(b => b.status === "cancelled").length,
            icon: X,
            color: "#FF6B6B"
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60 mb-1">{stat.label}</p>
                      <p className="text-2xl">{stat.value}</p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardHeader className="border-b border-[#00FFC2]/10">
            <div className="flex items-center justify-between mb-3">
              <CardTitle>Calendrier</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}
                  className="text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center min-w-[180px]">
                  <h3 className="text-white">
                    {currentDate.toLocaleDateString('fr-FR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}
                  className="text-white hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 pb-3 border-b border-white/5">
              <p className="text-xs text-white/40">Légende:</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs text-white/60">Leads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00FFC2]" />
                <span className="text-xs text-white/60">RDV confirmés</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-xs text-white/60">RDV en attente</span>
              </div>
            </div>
            
            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                <div key={day} className="text-center text-xs text-white/60 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {(() => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const startDay = firstDay.getDay();
                const days = [];
                
                // Empty cells before first day
                for (let i = 0; i < startDay; i++) {
                  days.push(<div key={`empty-${i}`} className="aspect-square" />);
                }
                
                // Calendar days
                for (let day = 1; day <= lastDay.getDate(); day++) {
                  const date = new Date(year, month, day);
                  const eventsForDay = getEventsForDate(date);
                  const availability = getAvailabilityForDate(date);
                  
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const compareDate = new Date(date);
                  compareDate.setHours(0, 0, 0, 0);
                  
                  const isToday = compareDate.getTime() === today.getTime();
                  const isPast = compareDate < today;
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  
                  days.push(
                    <button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        aspect-square rounded-lg p-1 flex flex-col items-center justify-start
                        transition-all duration-200 relative
                        ${isPast && !isToday 
                          ? 'text-white/30 cursor-default' 
                          : 'text-white hover:bg-white/10 cursor-pointer'
                        }
                        ${isSelected 
                          ? 'bg-[#00FFC2]/20 border-2 border-[#00FFC2]' 
                          : 'border border-white/5'
                        }
                        ${isToday && !isSelected ? 'border-2 border-white/30' : ''}
                        ${availability?.isBlocked ? 'bg-red-500/10' : ''}
                      `}
                    >
                      <span className={`text-xs mb-1 ${isSelected ? 'font-bold' : ''}`}>
                        {day}
                      </span>
                      
                      {/* Event indicators */}
                      {eventsForDay.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 justify-center">
                          {eventsForDay.slice(0, 3).map((event, idx) => {
                            let color = 'bg-blue-500';
                            
                            // Determine color based on event type
                            if ('time' in event && 'duration' in event) {
                              // CalendarBooking
                              color = event.status === 'confirmed' 
                                ? 'bg-[#00FFC2]' 
                                : event.status === 'pending'
                                ? 'bg-yellow-500'
                                : event.status === 'completed'
                                ? 'bg-green-500'
                                : 'bg-red-500';
                            } else if ('message' in event) {
                              // Lead
                              color = 'bg-purple-500';
                            } else {
                              // Calendar event
                              color = 'bg-blue-500';
                            }
                            
                            return (
                              <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full ${color}`}
                              />
                            );
                          })}
                          {eventsForDay.length > 3 && (
                            <span className="text-[8px] text-white/60">
                              +{eventsForDay.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                }
                
                return days;
              })()}
            </div>

            {/* Selected Date Events */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <h4 className="text-sm text-white/60 mb-3">
                  Événements du {selectedDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p className="text-sm text-white/40 text-center py-4">
                      Aucun événement ce jour
                    </p>
                  ) : (
                    getEventsForDate(selectedDate).map((event, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          // If it's a lead, open the lead detail dialog
                          if ('message' in event && 'email' in event && !('time' in event)) {
                            setSelectedLead(event as Lead);
                            setShowLeadDetail(true);
                          }
                          // If it's a CalendarBooking, could open CalendarBooking details
                          else if ('time' in event && 'duration' in event) {
                            setSelectedBooking(event as CalendarBooking);
                          }
                        }}
                        className={`p-3 bg-white/5 rounded-lg border border-white/5 hover:border-[#00FFC2]/30 transition-all ${
                          ('message' in event || 'time' in event) ? 'cursor-pointer' : ''
                        }`}
                      >
                        {'time' in event && 'duration' in event ? (
                          // CalendarBooking (has time and duration fields)
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CalendarIcon className="h-3 w-3 text-[#00FFC2]" />
                                <p className="text-sm font-medium">{event.name}</p>
                              </div>
                              <p className="text-xs text-white/60">{event.time} - {event.duration}min</p>
                              {event.email && (
                                <p className="text-xs text-white/50 mt-1">{event.email}</p>
                              )}
                            </div>
                            <Badge className={getStatusColor(event.status)}>
                              {getStatusLabel(event.status)}
                            </Badge>
                          </div>
                        ) : 'title' in event ? (
                          // Calendar Event
                          <div>
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-white/60">
                              {event.startTime} - {event.endTime}
                            </p>
                          </div>
                        ) : (
                          // Lead (contact form submission)
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-purple-400" />
                                <p className="text-sm font-medium">{event.name}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[#00FFC2] hover:bg-[#00FFC2]/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLead(event as Lead);
                                  setShowLeadDetail(true);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-white/60 mb-1">Lead: {event.email}</p>
                            <p className="text-xs text-white/50 line-clamp-2">{event.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-purple-500/10 text-purple-400 text-xs">
                                {'status' in event && event.status === 'new' ? 'Nouveau' : 'Lead'}
                              </Badge>
                              {event.wantsAppointment && (
                                <Badge className="bg-orange-500/10 text-orange-400 text-xs">
                                  RDV demandé
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardHeader className="border-b border-[#00FFC2]/10">
            <CardTitle className="flex items-center justify-between">
              <span>Nouveaux Leads</span>
              <Badge className="bg-purple-500/10 text-purple-400 border-0">
                {(leads || []).filter(l => l.status === 'new').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center text-white/40 py-8">Chargement...</div>
              ) : !leads || leads.length === 0 ? (
                <div className="text-center text-white/40 py-8">
                  <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Aucun lead</p>
                </div>
              ) : (
                (leads || [])
                  .filter(l => l.status === 'new' || l.status === 'contacted')
                  .slice(0, 10)
                  .map((lead, index) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadDetail(true);
                      }}
                      className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="h-3 w-3 text-purple-400" />
                            <h4 className="font-medium text-sm">{lead.name}</h4>
                          </div>
                          <p className="text-xs text-white/60 mb-1">{lead.email}</p>
                          {lead.phone && (
                            <p className="text-xs text-white/60 mb-2">{lead.phone}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-[#00FFC2] hover:bg-[#00FFC2]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                            setShowLeadDetail(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-xs text-white/50 line-clamp-2 mb-2">
                        {lead.message}
                      </p>

                      <div className="flex items-center gap-1 flex-wrap mb-2">
                        <Badge className={`text-xs ${
                          lead.status === 'new' 
                            ? 'bg-purple-500/10 text-purple-400' 
                            : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {lead.status === 'new' ? 'Nouveau' : 'Contacté'}
                        </Badge>
                        {lead.wantsAppointment && (
                          <Badge className="bg-orange-500/10 text-orange-400 text-xs">
                            RDV demandé
                          </Badge>
                        )}
                        {lead.interests && lead.interests.length > 0 && (
                          <Badge className="bg-white/10 text-white/70 text-xs">
                            {lead.interests[0]}
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-white/40">
                        {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardHeader className="border-b border-[#00FFC2]/10">
            <CardTitle className="flex items-center justify-between">
              <span>Prochains RDV</span>
              <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
                {upcomingBookings.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center text-white/40 py-8">Chargement...</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center text-white/40 py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Aucun rendez-vous à venir</p>
                </div>
              ) : (
                upcomingBookings.map((CalendarBooking, index) => (
                  <motion.div
                    key={CalendarBooking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#00FFC2]/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{CalendarBooking.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(CalendarBooking.status)}`}>
                            {getStatusLabel(CalendarBooking.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/60 mb-1">{CalendarBooking.email}</p>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(CalendarBooking.date).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <span>{CalendarBooking.time}</span>
                          <span>•</span>
                          <span>{CalendarBooking.duration}min</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                      {CalendarBooking.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(CalendarBooking.id, "confirmed")}
                          className="flex-1 bg-[#00FFC2]/10 text-[#00FFC2] hover:bg-[#00FFC2]/20 h-8 text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Confirmer
                        </Button>
                      )}
                      {CalendarBooking.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(CalendarBooking.id, "completed")}
                          className="flex-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 h-8 text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Terminer
                        </Button>
                      )}
                      {(CalendarBooking.status === "pending" || CalendarBooking.status === "confirmed") && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(CalendarBooking.id, "cancelled")}
                          variant="outline"
                          className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10 h-8 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Annuler
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => deleteBooking(CalendarBooking.id)}
                        variant="outline"
                        className="border-white/10 text-white/60 hover:bg-white/5 h-8 px-2"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Leads List */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardHeader className="border-b border-[#00FFC2]/10">
          <CardTitle className="flex items-center justify-between">
            <span>Tous les Leads</span>
            <Badge className="bg-purple-500/10 text-purple-400 border-0">
              {(leads || []).filter(l => !l.wantsAppointment).length} leads
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Rechercher un lead..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          {/* Leads Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center text-white/40 py-12">Chargement...</div>
            ) : !leads || leads.length === 0 ? (
              <div className="col-span-full text-center text-white/40 py-12">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Aucun lead trouvé</p>
              </div>
            ) : (
              (leads || [])
                .filter(lead => !lead.wantsAppointment) // Exclure les leads avec RDV demandé
                .filter(lead => 
                  searchQuery === "" ||
                  lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  lead.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowLeadDetail(true);
                    }}
                    className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="h-4 w-4 text-purple-400" />
                          <h4 className="font-medium">{lead.name}</h4>
                        </div>
                        <p className="text-sm text-white/60">{lead.email}</p>
                        {lead.phone && (
                          <p className="text-sm text-white/60 mt-1">{lead.phone}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#00FFC2] hover:bg-[#00FFC2]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                          setShowLeadDetail(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-white/50 line-clamp-2 mb-3">
                      {lead.message}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-xs ${
                        lead.status === 'new' 
                          ? 'bg-purple-500/10 text-purple-400' 
                          : lead.status === 'contacted'
                          ? 'bg-blue-500/10 text-blue-400'
                          : lead.status === 'converted'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {lead.status === 'new' ? 'Nouveau' : 
                         lead.status === 'contacted' ? 'Contacté' :
                         lead.status === 'converted' ? 'Converti' : 'Qualifié'}
                      </Badge>
                      {lead.wantsAppointment && (
                        <Badge className="bg-orange-500/10 text-orange-400 text-xs">
                          RDV demandé
                        </Badge>
                      )}
                      {lead.interests && lead.interests.length > 0 && (
                        <Badge className="bg-white/10 text-white/70 text-xs">
                          {lead.interests[0]}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-white/40 mt-3 pt-3 border-t border-white/5">
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Appointments (Bookings + Leads with RDV) */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardHeader className="border-b border-[#00FFC2]/10">
          <CardTitle className="flex items-center justify-between">
            <span>Tous les Rendez-vous</span>
            <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
              {filteredBookings.length + (leads || []).filter(l => l.wantsAppointment).length} RDV
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Rechercher un rendez-vous..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          {/* Appointments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center text-white/40 py-12">Chargement...</div>
            ) : filteredBookings.length === 0 && (leads || []).filter(l => l.wantsAppointment).length === 0 ? (
              <div className="col-span-full text-center text-white/40 py-12">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Aucun rendez-vous trouvé</p>
              </div>
            ) : (
              <>
                {/* Leads with RDV demandé */}
                {(leads || [])
                  .filter(lead => lead.wantsAppointment)
                  .filter(lead => 
                    searchQuery === "" ||
                    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((lead, index) => (
                    <motion.div
                      key={`lead-${lead.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadDetail(true);
                      }}
                      className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="h-4 w-4 text-orange-400" />
                            <h4 className="font-medium">{lead.name}</h4>
                          </div>
                          <p className="text-sm text-white/60">{lead.email}</p>
                          {lead.phone && (
                            <p className="text-sm text-white/60 mt-1">{lead.phone}</p>
                          )}
                        </div>
                        <Badge className="bg-orange-500/10 text-orange-400">
                          RDV demandé
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-white/50 line-clamp-2 mb-3">
                        {lead.message}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-xs ${
                          lead.status === 'new' 
                            ? 'bg-purple-500/10 text-purple-400' 
                            : lead.status === 'contacted'
                            ? 'bg-blue-500/10 text-blue-400'
                            : lead.status === 'converted'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-white/10 text-white/70'
                        }`}>
                          {lead.status === 'new' ? 'Nouveau' : 
                           lead.status === 'contacted' ? 'Contacté' :
                           lead.status === 'converted' ? 'Converti' : 'Qualifié'}
                        </Badge>
                        {lead.interests && lead.interests.length > 0 && (
                          <Badge className="bg-white/10 text-white/70 text-xs">
                            {lead.interests[0]}
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-white/40 mt-3 pt-3 border-t border-white/5">
                        {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </motion.div>
                  ))}

                {/* Actual Bookings */}
                {filteredBookings.map((CalendarBooking, index) => (
                  <motion.div
                    key={`CalendarBooking-${CalendarBooking.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ((leads || []).filter(l => l.wantsAppointment).length + index) * 0.02 }}
                    className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00FFC2]/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{CalendarBooking.name}</h4>
                        <p className="text-sm text-white/60">{CalendarBooking.email}</p>
                      </div>
                      <Badge className={getStatusColor(CalendarBooking.status)}>
                        {getStatusLabel(CalendarBooking.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(CalendarBooking.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{CalendarBooking.time} ({CalendarBooking.duration}min)</span>
                      </div>
                      {CalendarBooking.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{CalendarBooking.phone}</span>
                        </div>
                      )}
                    </div>

                    {CalendarBooking.notes && (
                      <p className="text-xs text-white/40 mt-3 pt-3 border-t border-white/5 line-clamp-2">
                        {CalendarBooking.notes}
                      </p>
                    )}
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
          <DialogHeader>
            <DialogTitle className="text-white">Créer un événement</DialogTitle>
            <DialogDescription className="text-white/60">
              Ajoutez un événement personnalisé à votre calendrier
            </DialogDescription>
          </DialogHeader>
          <EventForm onCreate={createEvent} onClose={() => setShowEventDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
          <DialogHeader>
            <DialogTitle className="text-white">Gérer les disponibilités</DialogTitle>
            <DialogDescription className="text-white/60">
              Définissez vos créneaux disponibles ou bloquez une journée
            </DialogDescription>
          </DialogHeader>
          <AvailabilityForm onCreate={createAvailability} onClose={() => setShowAvailabilityDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Lead Detail Dialog */}
      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          open={showLeadDetail}
          onOpenChange={setShowLeadDetail}
          onRefresh={onRefresh}
        />
      )}
    </motion.div>
  );
}

// Event Form Component
function EventForm({ onCreate, onClose }: any) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    type: "event" as "CalendarBooking" | "event" | "blocked",
    description: "",
    color: "#00FFC2"
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.date) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }
    onCreate(formData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Titre *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Titre de l'événement"
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Date *</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Type</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
              <SelectItem value="event">Événement</SelectItem>
              <SelectItem value="blocked">Bloqué</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Heure de début</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Heure de fin</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description de l'événement..."
          rows={3}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1 border-white/10 text-white hover:bg-white/5"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
        >
          Créer l'événement
        </Button>
      </div>
    </div>
  );
}

// Availability Form Component
function AvailabilityForm({ onCreate, onClose }: any) {
  const [formData, setFormData] = useState({
    date: "",
    isBlocked: false,
    reason: "",
    startTime: "09:00",
    endTime: "18:00"
  });

  const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 15) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }

    return slots;
  };

  const handleSubmit = () => {
    if (!formData.date) {
      toast.error("Veuillez sélectionner une date");
      return;
    }

    const slots = formData.isBlocked 
      ? [] 
      : generateTimeSlots(formData.startTime, formData.endTime);

    onCreate(
      new Date(formData.date),
      slots,
      formData.isBlocked,
      formData.reason
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Date *</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="flex items-center space-x-2 p-4 bg-white/5 rounded-lg">
        <input
          type="checkbox"
          id="blocked"
          checked={formData.isBlocked}
          onChange={(e) => setFormData({ ...formData, isBlocked: e.target.checked })}
          className="w-4 h-4 rounded border-white/20 bg-white/5"
        />
        <Label htmlFor="blocked" className="text-white cursor-pointer">
          Bloquer cette journée (pas de disponibilités)
        </Label>
      </div>

      {formData.isBlocked ? (
        <div className="space-y-2">
          <Label className="text-white">Raison du blocage</Label>
          <Input
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Ex: Congés, formation..."
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">De</Label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">À</Label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1 border-white/10 text-white hover:bg-white/5"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
        >
          {formData.isBlocked ? "Bloquer la journée" : "Ajouter les disponibilités"}
        </Button>
      </div>
    </div>
  );
}

