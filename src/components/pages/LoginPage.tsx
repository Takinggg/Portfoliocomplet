import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "../../utils/supabase/client";

type Page = "home";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (page: Page) => void;
}

export default function LoginPage({ onLoginSuccess, onNavigate }: LoginPageProps) {
  const ADMIN_EMAIL = "contact@maxence.design";
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("Veuillez entrer votre mot de passe");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Use Supabase Auth Session instead of custom API
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: password,
      });

      if (error) {
        console.error("Login error:", error.message);
        
        // Message d'erreur personnalisé selon le type d'erreur
        if (error.message === "Invalid login credentials") {
          toast.error("⚠️ Compte admin non créé. Le serveur doit d'abord être déployé sur Supabase. Consultez /DEPLOYER_MAINTENANT.md", {
            duration: 8000,
          });
        } else {
          toast.error(error.message || "Mot de passe incorrect");
        }
        return;
      }

      if (data.session) {
        console.log("✅ Login successful with Supabase Session");
        toast.success("Connexion réussie !");
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#00FFC2] rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00FFC2] rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="mb-4 text-white/60 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>

        <Card className="shadow-2xl bg-black/40 backdrop-blur-xl border-[#00FFC2]/20">
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#00FFC2] to-[#00FFC2]/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-black" />
            </div>
            <CardTitle className="text-white">Connexion Dashboard</CardTitle>
            <CardDescription className="text-white/60">
              Accédez à votre espace de gestion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email administrateur</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00FFC2]/60" />
                  <Input
                    id="email"
                    type="email"
                    value={ADMIN_EMAIL}
                    disabled
                    className="pl-10 bg-white/5 border-white/10 text-white/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    className="pl-10 bg-white/5 border-white/10 text-white focus:border-[#00FFC2]/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-white/40 mt-4">
          Espace réservé à l'administrateur
        </p>
      </div>
    </div>
  );
}

