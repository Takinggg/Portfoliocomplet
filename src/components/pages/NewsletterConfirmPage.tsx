import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { Button } from "../ui/button";
import { useTranslation } from "../../utils/i18n/useTranslation";

interface NewsletterConfirmPageProps {
  token: string;
  onNavigate: (page: string) => void;
}

export function NewsletterConfirmPage({ token, onNavigate }: NewsletterConfirmPageProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "already_confirmed">("loading");
  const [email, setEmail] = useState<string>("");
  const { t } = useTranslation();
  const confirmTexts = (t as any)?.newsletter?.confirmPage ?? {};

  useEffect(() => {
    confirmSubscription();
  }, [token]);

  const confirmSubscription = async () => {
    if (!token) {
      setStatus("error");
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/confirm/${token}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEmail(data.email || "");
        
        if (data.alreadyConfirmed) {
          setStatus("already_confirmed");
        } else if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error confirming subscription:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {status === "loading" && (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-[#CCFF00] animate-spin" />
            </div>
            <div>
              <h1 className="text-white mb-3">{confirmTexts.loading?.title}</h1>
              <p className="text-white/60">{confirmTexts.loading?.subtitle}</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto rounded-full bg-[#CCFF00]/10 flex items-center justify-center"
            >
              <CheckCircle2 className="h-8 w-8 text-[#CCFF00]" />
            </motion.div>
            <div>
              <h1 className="text-white mb-3">{confirmTexts.success?.title}</h1>
              <p className="text-white/60 mb-6">
                {confirmTexts.success?.description}
                {email && confirmTexts.success?.emailNotice && (
                  <span>{` ${confirmTexts.success.emailNotice} ${email}`}</span>
                )}
              </p>
              <div className="space-y-3">
                <p className="text-white/40 text-sm">{confirmTexts.success?.listTitle}</p>
                <ul className="text-white/60 text-sm space-y-2 text-left max-w-xs mx-auto">
                  {(confirmTexts.success?.items || []).map((item: string, index: number) => (
                    <li className="flex items-start gap-2" key={`${item}-${index}`}>
                      <span className="text-[#CCFF00] mt-1">â€¢</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate("home")}
              className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
            >
              {confirmTexts.success?.button}
            </Button>
          </div>
        )}

        {status === "already_confirmed" && (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
              <Mail className="h-8 w-8 text-white/40" />
            </div>
            <div>
              <h1 className="text-white mb-3">{confirmTexts.already?.title}</h1>
              <p className="text-white/60 mb-6">{confirmTexts.already?.description}</p>
            </div>
            <Button 
              onClick={() => onNavigate("home")}
              className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
            >
              {confirmTexts.success?.button}
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-white mb-3">{confirmTexts.error?.title}</h1>
              <p className="text-white/60 mb-6">{confirmTexts.error?.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => onNavigate("home")}
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5"
              >
                {confirmTexts.error?.back}
              </Button>
              <Button 
                onClick={() => onNavigate("contact")}
                className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
              >
                {confirmTexts.error?.contact}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
