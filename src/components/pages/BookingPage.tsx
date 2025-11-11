import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar as CalendarIcon, Clock, Video, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { useLanguage } from "../../utils/i18n/LanguageContext";

// Generate available time slots (every 15 minutes from 9:00 to 18:00)
const generateDaySlots = () => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 17 && minute > 45) break; // Stop at 17:45
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }
  }
  return slots;
};

// Mock data: availabilities by date with 15-minute slots (in production, this would come from API/database)
const availabilitiesByDate: Record<string, string[]> = {
  // Format: 'YYYY-MM-DD': ['09:00', '09:15', '09:30', ...]
  '2025-11-05': generateDaySlots(),
  '2025-11-06': generateDaySlots(),
  '2025-11-07': generateDaySlots(),
  '2025-11-10': generateDaySlots(),
  '2025-11-11': generateDaySlots(),
  '2025-11-12': generateDaySlots(),
  '2025-11-13': generateDaySlots(),
  '2025-11-14': generateDaySlots(),
  '2025-11-17': generateDaySlots(),
  '2025-11-18': generateDaySlots(),
  '2025-11-19': generateDaySlots(),
  '2025-11-20': generateDaySlots(),
  '2025-11-21': generateDaySlots(),
  '2025-11-24': generateDaySlots(),
  '2025-11-25': generateDaySlots(),
  '2025-11-26': generateDaySlots(),
  '2025-11-27': generateDaySlots(),
  '2025-11-28': generateDaySlots(),
};

export default function BookingPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<15 | 30 | 60>(30); // Default 30min
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  // Get available slots for the selected date, filtered by duration
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.toISOString().split('T')[0];
    const allSlots = availabilitiesByDate[dateKey] || [];
    
    // Filter slots based on duration - need consecutive slots available
    const slotsNeeded = duration / 15; // 15min=1, 30min=2, 60min=4
    const validSlots: string[] = [];
    
    for (let i = 0; i <= allSlots.length - slotsNeeded; i++) {
      const currentSlot = allSlots[i];
      let isValid = true;
      
      // Check if consecutive slots are available
      for (let j = 1; j < slotsNeeded; j++) {
        const currentTime = currentSlot.split(':');
        const currentMinutes = parseInt(currentTime[0]) * 60 + parseInt(currentTime[1]);
        const expectedMinutes = currentMinutes + (j * 15);
        const expectedHour = Math.floor(expectedMinutes / 60);
        const expectedMin = expectedMinutes % 60;
        const expectedSlot = `${expectedHour.toString().padStart(2, '0')}:${expectedMin.toString().padStart(2, '0')}`;
        
        if (!allSlots.includes(expectedSlot)) {
          isValid = false;
          break;
        }
      }
      
      if (isValid) {
        validSlots.push(currentSlot);
      }
    }
    
    return validSlots;
  }, [selectedDate, duration]);

  // Check if a date has availabilities based on selected duration
  const getAvailabilityCount = (date: Date): number => {
    const dateKey = date.toISOString().split('T')[0];
    const allSlots = availabilitiesByDate[dateKey] || [];
    
    const slotsNeeded = duration / 15;
    let validSlotsCount = 0;
    
    for (let i = 0; i <= allSlots.length - slotsNeeded; i++) {
      const currentSlot = allSlots[i];
      let isValid = true;
      
      for (let j = 1; j < slotsNeeded; j++) {
        const currentTime = currentSlot.split(':');
        const currentMinutes = parseInt(currentTime[0]) * 60 + parseInt(currentTime[1]);
        const expectedMinutes = currentMinutes + (j * 15);
        const expectedHour = Math.floor(expectedMinutes / 60);
        const expectedMin = expectedMinutes % 60;
        const expectedSlot = `${expectedHour.toString().padStart(2, '0')}:${expectedMin.toString().padStart(2, '0')}`;
        
        if (!allSlots.includes(expectedSlot)) {
          isValid = false;
          break;
        }
      }
      
      if (isValid) {
        validSlotsCount++;
      }
    }
    
    return validSlotsCount;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !bookingData.name || !bookingData.email) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email.trim())) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Save booking to database
      const bookingResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            date: dateStr,
            time: selectedTime,
            duration: duration,
            notes: bookingData.notes,
            status: "confirmed",
          }),
        }
      );

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking");
      }

      // Send confirmation email
      try {
        const emailPayload = {
          email: bookingData.email.trim(),
          name: bookingData.name,
          date: dateStr,
          time: selectedTime,
          duration: duration,
        };
        
        console.log("📧 Sending booking confirmation email:", emailPayload);
        
        const emailResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/booking-confirmation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify(emailPayload),
          }
        );

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error("❌ Failed to send booking confirmation:", errorData);
          toast.error("Le rendez-vous est créé mais l'email de confirmation n'a pas pu être envoyé");
        } else {
          const emailData = await emailResponse.json();
          console.log("✅ Booking confirmation email sent:", emailData);
        }
      } catch (emailError) {
        console.error("❌ Error sending confirmation email:", emailError);
        // Don't block the flow if email fails
      }

      toast.success("Rendez-vous confirmé ! Vous allez recevoir un email de confirmation.");
      setStep(3);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#0C0C0C] via-neutral-950 to-[#0C0C0C] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 255, 194, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 255, 194, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge variant="secondary" className="mb-4 bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/30">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Book an appointment' : 'Prise de rendez-vous'}
          </Badge>
          <h1 className="mb-6">{language === 'en' ? 'Book a free call' : 'Réserver un appel gratuit'}</h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Schedule a 30-minute discovery call to discuss your project.'
              : 'Planifiez un appel découverte de 30 minutes pour discuter de votre projet.'}
          </p>
        </div>
      </section>

      {/* Booking Flow */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4">
              {[
                { num: 1, label: language === 'en' ? "Date & Time" : "Date & Heure" },
                { num: 2, label: language === 'en' ? "Information" : "Informations" },
                { num: 3, label: language === 'en' ? "Confirmation" : "Confirmation" }
              ].map((s) => (
                <div key={s.num} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= s.num ? "bg-[#00FFC2] text-black" : "bg-neutral-800 text-neutral-500"
                  }`}>
                    {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                  </div>
                  <span className={`ml-2 text-sm hidden sm:inline ${
                    step >= s.num ? "text-[#00FFC2]" : "text-neutral-500"
                  }`}>
                    {s.label}
                  </span>
                  {s.num < 3 && (
                    <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                      step > s.num ? "bg-[#00FFC2]" : "bg-neutral-800"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Date & Time Selection */}
          {step === 1 && (
            <div className="space-y-8">
              {/* Duration Selection */}
              <Card className="bg-neutral-950/50 border-neutral-800 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">{language === 'en' ? 'Appointment duration' : 'Durée du rendez-vous'}</CardTitle>
                  <p className="text-sm text-neutral-400 mt-2">
                    {language === 'en' ? 'Select your desired call duration' : 'Sélectionnez la durée souhaitée pour votre appel'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 15, label: "15 minutes", description: language === 'en' ? "Quick consultation" : "Consultation rapide" },
                      { value: 30, label: "30 minutes", description: language === 'en' ? "Discovery call" : "Appel découverte" },
                      { value: 60, label: language === 'en' ? "1 hour" : "1 heure", description: language === 'en' ? "In-depth consultation" : "Consultation approfondie" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setDuration(opt.value as 15 | 30 | 60);
                          setSelectedTime(""); // Reset time when duration changes
                        }}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 text-left
                          ${duration === opt.value 
                            ? 'border-[#00FFC2] bg-[#00FFC2]/5' 
                            : 'border-neutral-700 hover:border-neutral-600'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                            ${duration === opt.value 
                              ? 'border-[#00FFC2]' 
                              : 'border-neutral-600'
                            }
                          `}>
                            {duration === opt.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#00FFC2]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${duration === opt.value ? 'text-[#00FFC2]' : 'text-white'}`}>
                              {opt.label}
                            </div>
                            <div className="text-xs text-neutral-400 mt-1">
                              {opt.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-neutral-950/50 border-neutral-800 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">{language === 'en' ? 'Choose a date' : 'Choisissez une date'}</CardTitle>
                    <p className="text-sm text-neutral-400 mt-2 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#00FFC2]"></span>
                      {language === 'en' 
                        ? `The number indicates available slots for ${duration}min`
                        : `Le nombre indique les créneaux disponibles pour ${duration}min`}
                    </p>
                  </CardHeader>
                <CardContent>
                  {/* Custom Calendar with Availability Display */}
                  <div className="bg-black/90 border border-neutral-700 rounded-md p-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate || new Date());
                          newDate.setMonth(newDate.getMonth() - 1);
                          setSelectedDate(newDate);
                        }}
                        className="text-white hover:bg-neutral-800"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="text-white">
                        {(selectedDate || new Date()).toLocaleDateString('fr-FR', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate || new Date());
                          newDate.setMonth(newDate.getMonth() + 1);
                          setSelectedDate(newDate);
                        }}
                        className="text-white hover:bg-neutral-800"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                        <div key={day} className="text-center text-xs text-neutral-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {(() => {
                        const currentMonth = (selectedDate || new Date()).getMonth();
                        const currentYear = (selectedDate || new Date()).getFullYear();
                        const firstDay = new Date(currentYear, currentMonth, 1);
                        const lastDay = new Date(currentYear, currentMonth + 1, 0);
                        const startDay = firstDay.getDay();
                        const days = [];
                        
                        // Empty cells before first day
                        for (let i = 0; i < startDay; i++) {
                          days.push(<div key={`empty-${i}`} className="aspect-square" />);
                        }
                        
                        // Calendar days
                        for (let day = 1; day <= lastDay.getDate(); day++) {
                          const date = new Date(currentYear, currentMonth, day);
                          const slotsCount = getAvailabilityCount(date);
                          
                          // Proper date comparison without time
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const compareDate = new Date(date);
                          compareDate.setHours(0, 0, 0, 0);
                          
                          const isToday = compareDate.getTime() === today.getTime();
                          const isPast = compareDate < today;
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          const isSelected = selectedDate?.toDateString() === date.toDateString();
                          const isDisabled = isPast || isWeekend;
                          
                          days.push(
                            <button
                              key={day}
                              onClick={() => {
                                if (!isDisabled) {
                                  setSelectedDate(date);
                                  setSelectedTime("");
                                }
                              }}
                              disabled={isDisabled}
                              className={`
                                aspect-square rounded-md flex flex-col items-center justify-center
                                transition-all duration-200 relative
                                ${isDisabled 
                                  ? 'text-neutral-700 cursor-not-allowed opacity-40' 
                                  : 'text-white hover:bg-neutral-800 cursor-pointer'
                                }
                                ${isSelected 
                                  ? 'bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90' 
                                  : slotsCount > 0 
                                    ? 'border border-neutral-700 hover:border-[#00FFC2]/40' 
                                    : ''
                                }
                                ${isToday && !isSelected ? 'border border-neutral-600' : ''}
                              `}
                            >
                              <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>
                                {day}
                              </span>
                              {slotsCount > 0 && (
                                <span className={`text-[10px] ${isSelected ? 'text-black' : 'text-[#00FFC2]'} font-semibold mt-0.5`}>
                                  {slotsCount} dispo
                                </span>
                              )}
                            </button>
                          );
                        }
                        
                        return days;
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950/50 border-neutral-800 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">{language === 'en' ? 'Choose a time' : 'Choisissez un horaire'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-400 mb-4">
                        {language === 'en' ? (
                          `${availableSlots.length} available slots on ${selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}`
                        ) : (
                          `${availableSlots.length} créneaux disponibles le ${selectedDate.toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}`
                        )}
                      </p>
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={selectedTime === slot ? "default" : "outline"}
                              onClick={() => setSelectedTime(slot)}
                              className={selectedTime === slot 
                                ? "w-full bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90" 
                                : "w-full border-neutral-800 hover:border-[#00FFC2]/40 bg-black/80 text-white"
                              }
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              {slot}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-neutral-500 mb-2">Aucun créneau disponible pour cette date</p>
                          <p className="text-sm text-neutral-600">Veuillez sélectionner une autre date</p>
                        </div>
                      )}

                      {selectedTime && (
                        <div className="mt-6 p-4 bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-lg">
                          <div className="flex items-center text-[#00FFC2] mb-2">
                            <Video className="h-5 w-5 mr-2" />
                            <span>Appel visio Google Meet</span>
                          </div>
                          <p className="text-sm text-neutral-400">
                            Rendez-vous de {duration} minutes prévu le {selectedDate.toLocaleDateString('fr-FR')} à {selectedTime}
                          </p>
                        </div>
                      )}

                      <Button
                        size="lg"
                        className="w-full mt-6 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                        onClick={() => setStep(2)}
                        disabled={!selectedTime}
                      >
                        Continuer
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 text-neutral-700 mx-auto mb-4" />
                      <p className="text-neutral-500 mb-2">Sélectionnez d'abord une date</p>
                      <p className="text-sm text-neutral-600">Les dates disponibles sont marquées d'un point vert</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <Card className="max-w-2xl mx-auto bg-neutral-950/50 border-neutral-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Vos informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-lg">
                  <p className="text-sm text-neutral-400">
                    Rendez-vous sélectionné : <span className="text-[#00FFC2]">
                      {selectedDate?.toLocaleDateString('fr-FR')} à {selectedTime}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nom complet *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Téléphone (optionnel)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Parlez-moi de votre projet (optionnel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Décrivez votre projet ou votre besoin d'automatisation..."
                    rows={4}
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="flex-1 border-neutral-700 hover:bg-neutral-900"
                  >
                    Retour
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                  >
                    Confirmer le rendez-vous
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card className="max-w-2xl mx-auto text-center bg-neutral-950/50 border-neutral-800 backdrop-blur-xl">
              <CardContent className="pt-12 pb-12">
                <div className="w-20 h-20 bg-[#00FFC2]/20 border-2 border-[#00FFC2] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-[#00FFC2]" />
                </div>
                <h2 className="mb-4 text-white">Rendez-vous confirmé ! 🎉</h2>
                <p className="text-neutral-400 mb-8">
                  Votre rendez-vous a été enregistré. Vous allez recevoir un email de confirmation 
                  avec le lien de visioconférence à l'adresse <span className="text-[#00FFC2]">{bookingData.email}</span>.
                </p>
                
                <div className="bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <CalendarIcon className="h-6 w-6 text-[#00FFC2] mr-2" />
                    <h3 className="text-white">Détails du rendez-vous</h3>
                  </div>
                  <div className="space-y-2 text-left max-w-sm mx-auto">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Date :</span>
                      <span className="text-white">{selectedDate?.toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Heure :</span>
                      <span className="text-white">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Durée :</span>
                      <span className="text-white">{duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Format :</span>
                      <span className="text-white">Visioconférence</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-500 mb-6">
                  Un rappel vous sera envoyé 24h avant le rendez-vous.
                </p>

                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/'}
                  className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                >
                  Retour à l'accueil
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
