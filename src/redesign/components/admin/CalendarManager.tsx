import React, { useMemo } from "react";
import CalendarManagement from "@/components/calendar/CalendarManagement";
import type { Appointment, Client } from "@/redesign/types";

type CalendarBookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type AppointmentWithRaw = Appointment & {
    __raw?: Record<string, any>;
};

type LegacyLead = {
    id: string | number;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    status?: string;
    source?: string;
    wantsAppointment?: boolean;
    interests?: string[];
    createdAt?: string;
    [key: string]: any;
};

interface CalendarManagerProps {
    appointments: AppointmentWithRaw[];
    clients: Client[];
    leads?: LegacyLead[];
    onRefresh: () => void;
    loading: boolean;
}

const normalizeStatus = (value?: string): CalendarBookingStatus => {
    const normalized = value?.toLowerCase() ?? "";
    if (["pending", "wait", "waiting", "en attente"].includes(normalized)) {
        return "pending";
    }
    if (["completed", "done", "terminé", "termine", "finished"].includes(normalized)) {
        return "completed";
    }
    if (["cancelled", "canceled", "annulé", "annule"].includes(normalized)) {
        return "cancelled";
    }
    return "confirmed";
};

const formatParts = (dateInput?: string, explicitTime?: string) => {
    const baseDate = dateInput ? new Date(dateInput) : new Date();
    const safeDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;

    if (explicitTime) {
        if (/^\d{2}:\d{2}/.test(explicitTime)) {
            return { date: safeDate.toISOString().split("T")[0], time: explicitTime.slice(0, 5) };
        }
        const parsedTime = new Date(explicitTime);
        if (!Number.isNaN(parsedTime.getTime())) {
            return { date: safeDate.toISOString().split("T")[0], time: parsedTime.toISOString().slice(11, 16) };
        }
    }

    return {
        date: safeDate.toISOString().split("T")[0],
        time: safeDate.toISOString().slice(11, 16),
    };
};

export const CalendarManager: React.FC<CalendarManagerProps> = ({
    appointments,
    clients,
    leads = [],
    onRefresh,
    loading,
}) => {
    const clientsById = useMemo(() => {
        return new Map(clients.map((client) => [String(client.id), client]));
    }, [clients]);

    const bookings = useMemo(() => {
        return appointments.map((apt) => {
            const raw = (apt as AppointmentWithRaw).__raw ?? {};
            const client = clientsById.get(String(apt.clientId));
            const { date, time } = formatParts(raw.date ?? raw.bookingDate ?? raw.start_time ?? apt.date, raw.time);

            return {
                id: String(raw.id ?? raw.booking_id ?? apt.id),
                name: raw.name ?? client?.name ?? apt.clientName ?? apt.title,
                email: raw.email ?? client?.email ?? "contact@client.com",
                phone: raw.phone,
                date,
                time,
                duration: raw.duration ?? apt.duration,
                status: normalizeStatus(raw.status),
                type: raw.type ?? raw.serviceType ?? apt.type,
                createdAt: raw.createdAt ?? raw.created_at ?? apt.date,
                notes: raw.notes,
            };
        });
    }, [appointments, clientsById]);

    return (
        <section className="space-y-6">
            <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">Pipeline</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-semibold text-white">Agenda connecté</h1>
                        <p className="text-sm text-white/60">
                            Synchronisé avec Supabase : rendez-vous, leads et disponibilités centralisés.
                        </p>
                    </div>
                    <button
                        onClick={onRefresh}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                    >
                        Rafraîchir les données
                    </button>
                </div>
            </header>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/70 via-black/40 to-black/60 p-2 sm:p-4 shadow-[0_20px_65px_rgba(0,0,0,0.45)]">
                <div className="rounded-2xl border border-white/5 bg-black/30 p-2 sm:p-4">
                    <CalendarManagement bookings={bookings} leads={leads} onRefresh={onRefresh} loading={loading} />
                </div>
            </div>
        </section>
    );
};