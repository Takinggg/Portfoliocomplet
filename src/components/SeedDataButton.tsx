import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Sparkles, Check, AlertCircle, Star } from "lucide-react";
import { seedDemoData } from "../utils/seedDemoData";
import { seedTestimonials } from "../utils/seedTestimonials";
import { toast } from "sonner@2.0.3";

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
        toast.success("✨ Données de démonstration ajoutées avec succès !");
      } else {
        toast.error("Erreur lors de l'ajout des données");
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Erreur lors de l'ajout des données");
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
        toast.success(`✨ ${result.created} témoignages ajoutés avec succès !`);
      } else {
        toast.error("Erreur lors de l'ajout des témoignages");
      }
    } catch (error) {
      console.error("Error seeding testimonials:", error);
      toast.error("Erreur lors de l'ajout des témoignages");
    } finally {
      setIsSeedingTestimonials(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-[#00FFC2]/5 to-transparent border-[#00FFC2]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#00FFC2]" />
            Données de démonstration
          </CardTitle>
          <CardDescription className="text-white/60">
            Initialisez votre CRM avec des données de test pour explorer toutes les fonctionnalités
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSeeded ? (
            <div className="flex items-center gap-2 text-green-400">
              <Check className="h-5 w-5" />
              <span>Données ajoutées avec succès</span>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-[#00FFC2]/10 border border-[#00FFC2]/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-[#00FFC2] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-white/80">
                    <p className="font-medium text-[#00FFC2] mb-1">Ce qui sera ajouté :</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• 5 leads de démonstration</li>
                      <li>• 3 projets portfolio épinglés</li>
                      <li>• 2 factures exemples</li>
                      <li>• 5 réservations calendrier</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ajouter les données de démo
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
            Témoignages clients
          </CardTitle>
          <CardDescription className="text-white/60">
            Ajoutez 8 témoignages clients authentiques avec des notes 5 étoiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testimonialsSeeded ? (
            <div className="flex items-center gap-2 text-green-400">
              <Check className="h-5 w-5" />
              <span>Témoignages ajoutés avec succès</span>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-white/80">
                    <p className="font-medium text-yellow-500 mb-1">Ce qui sera ajouté :</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• 8 témoignages clients variés</li>
                      <li>• Notes 5 étoiles authentiques</li>
                      <li>• Différents types de projets</li>
                      <li>• 3 témoignages mis en avant</li>
                      <li>• Profils LinkedIn pour certains</li>
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
                    Ajouter les témoignages
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
