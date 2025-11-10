import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { BookOpen, Loader2, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { seedBlogPostsBilingual } from "../utils/seedBlogPostsBilingual";
import { initializeBlog, BlogServiceMode } from "../utils/blogService";

export function SeedBlogButton() {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [mode, setMode] = useState<BlogServiceMode>("checking");

  useEffect(() => {
    // Détecte automatiquement le mode
    checkMode();
  }, []);

  const checkMode = async () => {
    const result = await initializeBlog();
    setMode(result.mode);
  };

  const handleSeed = async () => {
    setLoading(true);
    
    // Essaie d'abord le serveur, sinon fallback local
    const initResult = await initializeBlog();
    
    if (initResult.mode === "local") {
      // Mode local - articles déjà créés par initializeBlog
      toast.success(
        `✅ ${initResult.count} articles créés en mode local !`,
        {
          description: "Les articles sont stockés dans votre navigateur",
          duration: 5000,
          action: {
            label: "Rafraîchir",
            onClick: () => window.location.reload(),
          },
        }
      );
      
      setSeeded(true);
      setTimeout(() => window.location.reload(), 3000);
      setLoading(false);
      return;
    }

    // Mode serveur - utilise le système bilingue
    toast.info("Initialisation des articles de blog bilingues (FR + EN) sur le serveur...");

    try {
      const result = await seedBlogPostsBilingual();
      
      if (result.success) {
        setSeeded(true);
        toast.success(
          `✅ ${result.created} articles de blog créés avec succès (FR + EN) !`,
          {
            description: "Rafraîchissez la page pour voir les articles dans les deux langues",
            duration: 5000,
            action: {
              label: "Rafraîchir",
              onClick: () => window.location.reload(),
            },
          }
        );
        
        // Auto-refresh after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error("Erreur lors de l'initialisation des articles");
      }
    } catch (error) {
      console.error("Error seeding blog:", error);
      toast.error("Erreur lors de l'initialisation");
    } finally {
      setLoading(false);
    }
  };

  if (seeded) {
    return (
      <Button
        variant="outline"
        disabled
        className="border-green-500/50 text-green-400"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Articles initialisés
      </Button>
    );
  }

  const buttonText = mode === "local" 
    ? "Initialiser Blog (Mode Local)" 
    : "Initialiser Blog (10 articles FR+EN)";
  
  const buttonIcon = mode === "local" ? WifiOff : Wifi;
  const ButtonIcon = buttonIcon;

  return (
    <Button
      onClick={handleSeed}
      disabled={loading}
      variant="outline"
      className="border-[#00FFC2]/30 text-[#00FFC2] hover:bg-[#00FFC2]/10"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Initialisation...
        </>
      ) : (
        <>
          <BookOpen className="h-4 w-4 mr-2" />
          {buttonText}
          {mode !== "checking" && (
            <ButtonIcon className="h-3 w-3 ml-2 opacity-60" />
          )}
        </>
      )}
    </Button>
  );
}
