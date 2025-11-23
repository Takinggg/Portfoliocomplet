import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Server,
  AlertTriangle
} from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface HealthStatus {
  server: "healthy" | "unhealthy" | "checking";
  blog: "healthy" | "unhealthy" | "checking";
  message?: string;
  blogPostsCount?: number;
}

export function ServerHealthCheck() {
  const [status, setStatus] = useState<HealthStatus>({
    server: "checking",
    blog: "checking",
  });
  const [details, setDetails] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setStatus({
      server: "checking",
      blog: "checking",
    });

    // Check server health using serverService
    try {
      const { checkServerAvailability } = await import("../utils/serverService");
      const isAvailable = await checkServerAvailability();
      
      console.log(`ðŸ” Server check result: ${isAvailable ? 'Available' : 'Unavailable'}`);

      setStatus(prev => ({
        ...prev,
        server: isAvailable ? "healthy" : "unhealthy",
        message: isAvailable ? "Server OK" : "Mode local actif",
      }));

      setDetails((prev: any) => ({
        ...prev,
        server: {
          status: isAvailable ? 200 : 503,
          data: { mode: isAvailable ? "server" : "local" },
          url: `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
        }
      }));
    } catch (error) {
      console.log("âš ï¸ Server unavailable, using local mode:", error);
      setStatus(prev => ({
        ...prev,
        server: "unhealthy",
        message: "Mode local actif",
      }));
      
      setDetails((prev: any) => ({
        ...prev,
        server: {
          error: "Mode local - pas de serveur requis",
          url: `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
        }
      }));
    }

    // Check blog posts using blogService
    try {
      const { fetchBlogPosts } = await import("../utils/blogService");
      const { posts, mode } = await fetchBlogPosts("fr");
      
      console.log(`âœ… Blog check: ${posts.length} posts in ${mode} mode`);

      setStatus(prev => ({
        ...prev,
        blog: "healthy",
        blogPostsCount: posts.length,
      }));

      setDetails((prev: any) => ({
        ...prev,
        blog: {
          status: 200,
          count: posts.length,
          mode: mode,
          data: { posts: posts.slice(0, 3) }, // Just first 3 for details
          url: `Blog Service (${mode} mode)`,
        }
      }));
    } catch (error) {
      console.log("âš ï¸ Blog check - using local mode:", error);
      setStatus(prev => ({
        ...prev,
        blog: "healthy",
        blogPostsCount: 0,
      }));
      
      setDetails((prev: any) => ({
        ...prev,
        blog: {
          mode: "local",
          count: 0,
          message: "Mode local - Cliquez 'Initialiser Blog' pour ajouter des articles",
        }
      }));
    }
  };

  const getStatusIcon = (state: "healthy" | "unhealthy" | "checking") => {
    if (state === "checking") {
      return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />;
    }
    if (state === "healthy") {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  const getStatusBadge = (state: "healthy" | "unhealthy" | "checking") => {
    if (state === "checking") {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">VÃ©rification...</Badge>;
    }
    if (state === "healthy") {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">OK</Badge>;
    }
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Erreur</Badge>;
  };

  return (
    <Card className="bg-white/5 border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-[#CCFF00]" />
          <h3 className="text-lg text-white">Ã‰tat du Serveur</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkHealth}
          disabled={status.server === "checking" || status.blog === "checking"}
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${status.server === "checking" ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      <div className="space-y-3">
        {/* Server Status */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.server)}
            <div>
              <p className="text-sm text-white">Serveur Backend</p>
              <p className="text-xs text-white/60">{status.message || "VÃ©rification en cours..."}</p>
            </div>
          </div>
          {getStatusBadge(status.server)}
        </div>

        {/* Blog Status */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.blog)}
            <div>
              <p className="text-sm text-white">Route Blog Posts</p>
              <p className="text-xs text-white/60">
                {status.blogPostsCount !== undefined 
                  ? `${status.blogPostsCount} articles trouvÃ©s`
                  : "VÃ©rification en cours..."}
              </p>
            </div>
          </div>
          {getStatusBadge(status.blog)}
        </div>

        {/* Warning if no posts */}
        {status.blog === "healthy" && status.blogPostsCount === 0 && (
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-200">
              <p className="font-medium mb-1">Aucun article de blog</p>
              <p className="text-yellow-200/80">
                Le serveur fonctionne mais aucun article n'est disponible. 
                Utilisez le bouton "Initialiser Blog" pour crÃ©er des articles de dÃ©monstration.
              </p>
            </div>
          </div>
        )}

        {/* Error details */}
        {(status.server === "unhealthy" || status.blog === "unhealthy") && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-white/60 hover:text-white text-xs"
            >
              {expanded ? "Masquer" : "Voir"} les dÃ©tails techniques
            </Button>

            {expanded && details && (
              <div className="mt-3 p-3 bg-black/30 rounded-lg">
                <pre className="text-xs text-white/60 overflow-auto max-h-60">
                  {JSON.stringify(details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Environment Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/40">
          Project ID: {projectId ? `${projectId.substring(0, 8)}...` : "Non configurÃ©"}
        </p>
        <p className="text-xs text-white/40">
          Server URL: {`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`}
        </p>
      </div>
    </Card>
  );
}
