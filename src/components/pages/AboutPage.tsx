import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { contentService, BlogPost, CaseStudy } from "../../services/contentService";
import { 
  ArrowRight, Download, Mail, 
  Palette, Code2, Brain, Workflow, 
  Target, Zap, Search, Eye,
  Github, Linkedin, Twitter,
  ExternalLink
} from "lucide-react";

type Page = "contact" | "blog" | "projects" | "case-studies";

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const { t } = useTranslation();
  const [pinnedBlogs, setPinnedBlogs] = useState<BlogPost[]>([]);
  const [pinnedCaseStudies, setPinnedCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogs, caseStudies] = await Promise.all([
          contentService.getBlogPosts("published"),
          contentService.getCaseStudies()
        ]);

        // Filter for pinned/featured items
        // Assuming 'featured' or 'isPinned' property exists, otherwise take latest
        const featuredBlogs = blogs.filter((b: any) => b.featured || b.isPinned).slice(0, 2);
        const featuredCaseStudies = caseStudies.filter((c: any) => c.featured || c.isPinned).slice(0, 2);

        // Fallback to latest if no featured items found
        setPinnedBlogs(featuredBlogs.length > 0 ? featuredBlogs : blogs.slice(0, 2));
        setPinnedCaseStudies(featuredCaseStudies.length > 0 ? featuredCaseStudies : caseStudies.slice(0, 2));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const skills = [
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Conception d'interfaces intuitives et esthétiques, Design Systems, Prototypage (Figma)."
    },
    {
      icon: Code2,
      title: "Full Stack Dev",
      description: "Développement d'applications robustes et scalables (React, Node.js, Next.js, Supabase)."
    },
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      description: "Intégration de LLMs, APIs IA et création d'agents intelligents pour booster la productivité."
    },
    {
      icon: Workflow,
      title: "Automatisation",
      description: "Optimisation de workflows et processus métier (n8n, Zapier, Scripts custom)."
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Centré Utilisateur",
      description: "Chaque décision est guidée par l'expérience finale pour garantir impact et satisfaction."
    },
    {
      icon: Zap,
      title: "Efficacité",
      description: "Livrer vite et bien. Une approche pragmatique orientée résultats."
    },
    {
      icon: Search,
      title: "Curiosité",
      description: "Une veille technologique constante pour proposer les solutions les plus innovantes."
    },
    {
      icon: Eye,
      title: "Transparence",
      description: "Communication fluide et honnête tout au long du projet."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pt-20">
      {/* 1. INTRODUCTION */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mint/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
              </span>
              <span className="text-sm text-mint font-medium">Disponible pour nouveaux projets</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Designer. <br />
              Développeur. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-white">
                Créateur de solutions.
              </span>
            </h1>

            <p className="text-xl text-neutral-400 mb-8 leading-relaxed max-w-xl">
              Je conçois des expériences digitales performantes, élégantes et intelligentes pour propulser votre business.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={() => onNavigate("contact")}
                className="bg-mint text-black hover:bg-mint/90 h-14 px-8 rounded-xl text-base font-bold"
              >
                <Mail className="mr-2 h-5 w-5" />
                Me contacter
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-neutral-800 hover:bg-neutral-900 h-14 px-8 rounded-xl text-base"
              >
                <Download className="mr-2 h-5 w-5" />
                Télécharger CV
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/50">
              {/* Placeholder for Photo */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto bg-neutral-800 rounded-full mb-4 flex items-center justify-center border border-neutral-700">
                    <span className="text-4xl font-bold text-neutral-600">MF</span>
                  </div>
                  <p className="text-neutral-500 text-sm">Photo de Maxence Foulon</p>
                </div>
              </div>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-neutral-900/90 backdrop-blur-xl border border-mint/20 p-6 rounded-2xl shadow-xl max-w-xs"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="text-3xl font-bold text-mint">3+</div>
                <div className="text-sm text-neutral-400 leading-tight">Années<br/>d'expérience</div>
              </div>
              <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-mint w-3/4 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. QUI JE SUIS */}
      <section className="py-24 px-6 bg-neutral-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">À propos de moi</h2>
            <div className="text-lg md:text-xl text-neutral-400 leading-relaxed space-y-6 text-justify md:text-center">
              <p>
                Je suis <span className="text-white font-semibold">Maxence Foulon</span>, UI/UX Designer et développeur full stack spécialisé en intelligence artificielle. À 22 ans, j'ai déjà accompagné de nombreuses startups et entreprises dans la transformation de leurs idées en produits digitaux concrets.
              </p>
              <p>
                Mon approche est hybride : je combine la sensibilité esthétique du design avec la rigueur technique du développement. Cela me permet de créer des interfaces qui ne sont pas seulement belles, mais aussi fonctionnelles, rapides et techniquement irréprochables.
              </p>
              <p>
                Passionné par l'automatisation et l'IA, je cherche constamment à optimiser les processus pour permettre à mes clients de se concentrer sur ce qui compte vraiment : leur croissance.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CE QUE JE FAIS (Compétences) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mes Expertises</h2>
            <p className="text-neutral-400">Une palette de compétences complète pour vos projets digitaux</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800 hover:border-mint/30 hover:bg-neutral-900/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-mint/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <skill.icon className="h-6 w-6 text-mint" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-mint transition-colors">{skill.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MA VISION (Valeurs) */}
      <section className="py-24 px-6 bg-neutral-950/30 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ma Vision & Valeurs</h2>
              <p className="text-neutral-400 text-lg mb-8">
                Je ne me contente pas de livrer du code ou des maquettes. Je m'engage à apporter de la valeur ajoutée à chaque étape du projet.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                        <value.icon className="h-4 w-4 text-mint" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{value.title}</h4>
                      <p className="text-sm text-neutral-400">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-full bg-gradient-to-br from-mint/20 to-transparent blur-3xl absolute inset-0" />
              <div className="relative bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12">
                <div className="text-6xl font-serif text-mint/20 absolute top-6 left-6">"</div>
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-center relative z-10">
                  La technologie n'est qu'un outil. Le véritable objectif est de créer des solutions qui simplifient la vie et amplifient le potentiel humain.
                </blockquote>
                <div className="mt-8 text-center">
                  <div className="font-bold text-white">Maxence Foulon</div>
                  <div className="text-sm text-mint">Founder & Lead Developer</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. PINNED CONTENT (Blogs & Case Studies) */}
      {(pinnedBlogs.length > 0 || pinnedCaseStudies.length > 0) && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">À la une</h2>
              <p className="text-neutral-400">Sélection de mes derniers travaux et articles</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pinned Case Studies */}
              {pinnedCaseStudies.map((study, index) => (
                <motion.div
                  key={`study-${study.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => onNavigate("case-studies")} // Or specific detail page
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-neutral-800 group-hover:border-mint/30 transition-all">
                    {study.coverImage ? (
                      <img src={study.coverImage} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <Target className="h-12 w-12 text-neutral-700" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-white">
                      Étude de cas
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-mint transition-colors">{study.title}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-2">{study.description}</p>
                </motion.div>
              ))}

              {/* Pinned Blogs */}
              {pinnedBlogs.map((blog, index) => (
                <motion.div
                  key={`blog-${blog.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index + 2) * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => onNavigate("blog")} // Or specific detail page
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-neutral-800 group-hover:border-mint/30 transition-all">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <Code2 className="h-12 w-12 text-neutral-700" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-white">
                      Article
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-mint transition-colors">{blog.title_fr}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-2">{blog.excerpt_fr}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. CTA FINAL */}
      <section className="py-24 px-6 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à lancer votre projet ?
            </h2>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
              Discutons de vos besoins et voyons comment nous pouvons collaborer pour atteindre vos objectifs.
            </p>
            <Button 
              size="lg" 
              onClick={() => onNavigate("contact")}
              className="bg-mint text-black hover:bg-mint/90 h-16 px-12 rounded-full text-lg font-bold shadow-lg shadow-mint/20 hover:shadow-mint/40 transition-all"
            >
              Travaillons ensemble
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
