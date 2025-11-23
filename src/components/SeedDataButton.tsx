import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Sparkles, Check, AlertCircle, Star } from "lucide-react";
import { seedDemoData } from "../utils/seedDemoData";
import { seedTestimonials } from "../utils/seedTestimonials";
import { toast } from "sonner";

export function SeedDataButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [isSeedingTestimonials, setIsSeedingTestimonials] = useState(false);
  const [testimonialsSeeded, setTestimonialsSeeded] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const success = await seedDemoData();
      if (success) {
        setIsSeeded(true);
        toast.success("âœ¨ DonnÃ©es de dÃ©monstration ajoutÃ©es avec succÃ¨s !");
      } else {
        toast.error("Erreur lors de l'ajout des donnÃ©es");
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Erreur lors de l'ajout des donnÃ©es");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedTestimonials = async () => {
    setIsSeedingTestimonials(true);
    try {
      const result = await seedTestimonials();
      if (result.success) {
        setTestimonialsSeeded(true);
        toast.success(`âœ¨ ${result.created} tÃ©moignages ajoutÃ©s avec succÃ¨s !`);
      } else {
        toast.error("Erreur lors de l'ajout des tÃ©moignages");
      }
    } catch (error) {
      console.error("Error seeding testimonials:", error);
      toast.error("Erreur lors de l'ajout des tÃ©moignages");
    } finally {
      setIsSeedingTestimonials(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-[#CCFF00]/5 to-transparent border-[#CCFF00]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#CCFF00]" />
            DonnÃ©es de dÃ©monstration
          </CardTitle>
          <CardDescription className="text-white/60">
            Initialisez votre CRM avec des donnÃ©es de test pour explorer toutes les fonctionnalitÃ©s
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSeeded ? (
            <div className="flex items-center gap-2 text-green-400">
              <Check className="h-5 w-5" />
              <span>DonnÃ©es ajoutÃ©es avec succÃ¨s</span>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-white/80">
                    <p className="font-medium text-[#CCFF00] mb-1">Ce qui sera ajoutÃ© :</p>
                    <ul className="space-y-1 text-white/70">
                      <li>â€¢ 5 leads de dÃ©monstration</li>
                      <li>â€¢ 3 projets portfolio Ã©pinglÃ©s</li>
                      <li>â€¢ 2 factures exemples</li>
                      <li>â€¢ 5 rÃ©servations calendrier</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ajouter les donnÃ©es de dÃ©mo
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500/5 to-transparent border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            TÃ©moignages clients
          </CardTitle>
          <CardDescription className="text-white/60">
            Ajoutez 8 tÃ©moignages clients authentiques avec des notes 5 Ã©toiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testimonialsSeeded ? (
            <div className="flex items-center gap-2 text-green-400">
              <Check className="h-5 w-5" />
              <span>TÃ©moignages ajoutÃ©s avec succÃ¨s</span>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-white/80">
                    <p className="font-medium text-yellow-500 mb-1">Ce qui sera ajoutÃ© :</p>
                    <ul className="space-y-1 text-white/70">
                      <li>â€¢ 8 tÃ©moignages clients variÃ©s</li>
                      <li>â€¢ Notes 5 Ã©toiles authentiques</li>
                      <li>â€¢ DiffÃ©rents types de projets</li>
                      <li>â€¢ 3 tÃ©moignages mis en avant</li>
                      <li>â€¢ Profils LinkedIn pour certains</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSeedTestimonials}
                disabled={isSeedingTestimonials}
                className="w-full bg-yellow-500 text-black hover:bg-yellow-500/90"
              >
                {isSeedingTestimonials ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Ajouter les tÃ©moignages
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

