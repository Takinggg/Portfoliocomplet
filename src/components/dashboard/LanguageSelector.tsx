import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "../../utils/i18n/useTranslation";

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-white/60" />
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage('fr')}
          className={
            language === 'fr'
              ? 'bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }
        >
          FR
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage('en')}
          className={
            language === 'en'
              ? 'bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }
        >
          EN
        </Button>
      </div>
    </div>
  );
}
