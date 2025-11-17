import { Mail, Trash2, ArrowRight, Phone, Tag } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { motion } from "motion/react";
import { ReactNode } from "react";

export type PipelineStatus = "lead" | "client" | "quote" | "invoice" | "booking";

type ActionTone = "neutral" | "info" | "success" | "warning";

export interface PipelineItemAction {
  key: string;
  icon: ReactNode;
  label: string;
  tone?: ActionTone;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface PipelineItemProps {
  title: string;
  email?: string;
  subtitle?: string;
  amount?: number;
  status: PipelineStatus;
  tags?: string[];
  itemsCount?: number;
  actions?: PipelineItemAction[];
  onEmail?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onOpen?: () => void;
}

const statusStyles: Record<PipelineStatus, { badge: string; label: string; stage: string; followUp: string }> = {
  lead: {
    badge: "bg-blue-500/10 text-blue-300",
    label: "Lead",
    stage: "À qualifier",
    followUp: "Relancer cette semaine",
  },
  client: {
    badge: "bg-emerald-500/10 text-emerald-300",
    label: "Client",
    stage: "Relation active",
    followUp: "Préparer prochaine mission",
  },
  quote: {
    badge: "bg-yellow-500/10 text-yellow-300",
    label: "Devis",
    stage: "En négo",
    followUp: "Attente de validation",
  },
  invoice: {
    badge: "bg-orange-500/10 text-orange-300",
    label: "Facture",
    stage: "Paiement",
    followUp: "Suivi compta",
  },
  booking: {
    badge: "bg-purple-500/10 text-purple-300",
    label: "RDV",
    stage: "À confirmer",
    followUp: "Notifier le client",
  },
};

const actionToneClasses: Record<ActionTone, string> = {
  neutral: "border-white/10 text-white/70 hover:text-white hover:bg-white/5",
  info: "border-blue-500/30 text-blue-300 hover:bg-blue-500/10",
  success: "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10",
  warning: "border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10",
};

export function PipelineItem({
  title,
  email,
  subtitle,
  amount,
  status,
  tags = [],
  itemsCount,
  actions = [],
  onEmail,
  onDelete,
  onOpen,
}: PipelineItemProps) {
  const meta = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onOpen?.()}
      className="cursor-pointer rounded-3xl border border-white/5 bg-black/50 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,.4)] transition hover:border-white/10"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-lg font-semibold">
            {title.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <Badge variant="secondary" className={`${meta.badge} border-0`}>
                {meta.label}
              </Badge>
              {typeof itemsCount === "number" && (
                <span className="text-xs text-neutral-500">{itemsCount} éléments</span>
              )}
            </div>
            <p className="text-sm text-neutral-400">
              {subtitle || email || "—"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-right">
          <p className="text-2xl font-semibold">{amount ? `${amount.toLocaleString()}€` : "—"}</p>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {meta.stage}
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {meta.followUp}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start lg:self-center">
          {actions.map((action) => (
            <Button
              key={action.key}
              variant="ghost"
              size="icon"
              className={`rounded-2xl border ${actionToneClasses[action.tone || "neutral"]}`}
              title={action.label}
              onClick={(event) => {
                event.stopPropagation();
                action.onClick(event);
              }}
            >
              {action.icon}
            </Button>
          ))}
          {onEmail && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl border border-white/5 text-white/70 hover:text-white"
              title="Envoyer un email"
              onClick={(event) => {
                event.stopPropagation();
                onEmail(event);
              }}
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl border border-red-500/20 text-red-300 hover:text-red-200"
              title="Supprimer"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(event);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {onOpen && (
            <Button
              size="icon"
              className="rounded-2xl bg-mint text-black hover:bg-mint/90"
              title="Ouvrir les détails"
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
