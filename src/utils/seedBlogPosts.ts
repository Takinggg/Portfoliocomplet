import { projectId, publicAnonKey } from "./supabase/info";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: "development" | "design" | "business";
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  status: "published" | "draft";
  language: string;
  views?: number;
}

const demoBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "debuter-react-2024",
    title: "DÃ©buter avec React en 2024 : Guide Complet",
    excerpt: "Apprenez les fondamentaux de React avec les derniÃ¨res bonnes pratiques et hooks modernes.",
    content: `
      <h2>Introduction Ã  React</h2>
      <p>React est une bibliothÃ¨que JavaScript puissante pour crÃ©er des interfaces utilisateur modernes et rÃ©actives. Dans ce guide, nous allons explorer les concepts essentiels.</p>
      
      <h3>Installation et Configuration</h3>
      <p>Commencez par crÃ©er un nouveau projet avec Vite :</p>
      <pre><code class="language-bash">npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install</code></pre>
      
      <h3>Premier Composant</h3>
      <p>CrÃ©ez votre premier composant fonctionnel :</p>
      <pre><code class="language-tsx">import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}</code></pre>
      
      <h3>Hooks Essentiels</h3>
      <p>Les hooks les plus importants Ã  maÃ®triser :</p>
      <ul>
        <li><strong>useState</strong> : Gestion de l'Ã©tat local</li>
        <li><strong>useEffect</strong> : Effets de bord et lifecycle</li>
        <li><strong>useContext</strong> : Partage de donnÃ©es globales</li>
        <li><strong>useMemo</strong> : Optimisation des calculs coÃ»teux</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>React est un outil puissant qui continuera d'Ã©voluer. Restez Ã  jour avec les derniÃ¨res pratiques !</p>
    `,
    category: "development",
    tags: ["React", "JavaScript", "TypeScript", "Frontend"],
    author: "Maxence",
    publishedAt: "2024-11-01T10:00:00Z",
    readTime: 8,
    status: "published",
    language: "fr",
    views: 234,
  },
  {
    id: "2",
    slug: "design-system-moderne",
    title: "CrÃ©er un Design System Moderne avec Tailwind CSS",
    excerpt: "DÃ©couvrez comment construire un design system cohÃ©rent et maintenable avec Tailwind CSS.",
    content: `
      <h2>Qu'est-ce qu'un Design System ?</h2>
      <p>Un design system est un ensemble de composants, patterns et guidelines qui assurent la cohÃ©rence visuelle d'un produit.</p>
      
      <h3>Configuration de Tailwind CSS v4</h3>
      <p>Installez Tailwind CSS dans votre projet :</p>
      <pre><code class="language-bash">npm install tailwindcss@next @tailwindcss/postcss@next
npx tailwindcss init</code></pre>
      
      <h3>DÃ©finir votre Palette de Couleurs</h3>
      <p>CrÃ©ez des tokens de couleurs cohÃ©rents :</p>
      <pre><code class="language-css">@theme {
  --color-primary: #CCFF00;
  --color-background: #0C0C0C;
  --color-text: #F4F4F4;
  --color-accent: #DAFF40;
}</code></pre>
      
      <h3>Composants RÃ©utilisables</h3>
      <p>CrÃ©ez des composants avec des variants :</p>
      <pre><code class="language-tsx">interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children 
}: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`}>
      {children}
    </button>
  );
}</code></pre>
      
      <h3>Documentation</h3>
      <p>Documentez vos composants avec Storybook pour faciliter la collaboration.</p>
    `,
    category: "design",
    tags: ["Design System", "Tailwind CSS", "UI/UX", "Components"],
    author: "Maxence",
    publishedAt: "2024-10-28T14:30:00Z",
    readTime: 10,
    status: "published",
    language: "fr",
    views: 189,
  },
  {
    id: "3",
    slug: "tarification-freelance",
    title: "Tarification Freelance : Comment Fixer Vos Prix",
    excerpt: "Guide complet pour dÃ©finir une tarification juste et rentable pour votre activitÃ© freelance.",
    content: `
      <h2>L'Importance de Bien Se Tarifer</h2>
      <p>Fixer ses prix est l'un des dÃ©fis majeurs du freelance. Une tarification trop basse vous Ã©puise, trop haute vous fait perdre des clients.</p>
      
      <h3>Calculer Votre Taux Journalier</h3>
      <p>Formule de base pour calculer votre TJM (Taux Journalier Moyen) :</p>
      <pre><code class="language-javascript">// Charges mensuelles
const chargesFixes = 1500; // Loyer, assurances, etc.
const salaireSouhaite = 3000;
const chargesSociales = salaireSouhaite * 0.45;

// Jours travaillÃ©s
const joursAnnee = 365;
const joursFeries = 11;
const joursConges = 25;
const joursFormation = 10;
const joursProspection = 30;

const joursTravailles = joursAnnee 
  - joursFeries 
  - joursConges 
  - joursFormation 
  - joursProspection 
  - (52 * 2); // Weekends

const coutMensuel = chargesFixes + salaireSouhaite + chargesSociales;
const coutAnnuel = coutMensuel * 12;

const tjm = coutAnnuel / joursTravailles;
console.log(\`TJM minimum: \${tjm}â‚¬\`);</code></pre>
      
      <h3>Les DiffÃ©rents ModÃ¨les de Tarification</h3>
      <ul>
        <li><strong>Tarif horaire</strong> : Simple mais limite les gains</li>
        <li><strong>Forfait projet</strong> : PrÃ©visible pour le client</li>
        <li><strong>Valeur perÃ§ue</strong> : BasÃ© sur le ROI client</li>
        <li><strong>Retainer mensuel</strong> : Revenu rÃ©current stable</li>
      </ul>
      
      <h3>NÃ©gociation et Positionnement</h3>
      <p>Quelques conseils pour dÃ©fendre vos prix :</p>
      <ul>
        <li>Ne baissez jamais vos prix de plus de 10%</li>
        <li>Proposez plutÃ´t de rÃ©duire le pÃ©rimÃ¨tre</li>
        <li>Montrez votre valeur ajoutÃ©e avec des rÃ©sultats concrets</li>
        <li>Ayez plusieurs clients pour ne pas dÃ©pendre d'un seul</li>
      </ul>
      
      <h3>Augmenter Progressivement</h3>
      <p>Augmentez vos tarifs de 10-15% chaque annÃ©e ou Ã  chaque nouveau client.</p>
    `,
    category: "business",
    tags: ["Freelance", "Tarification", "Business", "Conseils"],
    author: "Maxence",
    publishedAt: "2024-10-25T09:00:00Z",
    readTime: 12,
    status: "published",
    language: "fr",
    views: 412,
  },
  {
    id: "4",
    slug: "typescript-avance",
    title: "TypeScript AvancÃ© : Types Utilitaires et GÃ©nÃ©riques",
    excerpt: "MaÃ®trisez les concepts avancÃ©s de TypeScript pour Ã©crire du code plus robuste et maintenable.",
    content: `
      <h2>Au-delÃ  des Bases</h2>
      <p>TypeScript offre des fonctionnalitÃ©s puissantes pour typer votre code de maniÃ¨re prÃ©cise et expressive.</p>
      
      <h3>Types Utilitaires Essentiels</h3>
      <pre><code class="language-typescript">// Partial : Rend toutes les propriÃ©tÃ©s optionnelles
type User = {
  id: number;
  name: string;
  email: string;
};

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// Pick : SÃ©lectionne certaines propriÃ©tÃ©s
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

// Omit : Exclut certaines propriÃ©tÃ©s
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; }

// Record : CrÃ©e un type avec des clÃ©s et valeurs
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
// { [key: string]: 'admin' | 'user' | 'guest' }</code></pre>
      
      <h3>GÃ©nÃ©riques AvancÃ©s</h3>
      <pre><code class="language-typescript">// Fonction gÃ©nÃ©rique avec contraintes
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'John' };
const name = getProperty(user, 'name'); // Type: string

// Type conditionnel
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false</code></pre>
      
      <h3>Mapped Types</h3>
      <pre><code class="language-typescript">// Rendre toutes les propriÃ©tÃ©s readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Transformer les types
type Getters<T> = {
  [P in keyof T as \`get\${Capitalize<string & P>}\`]: () => T[P];
};

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; getEmail: () => string; }</code></pre>
      
      <h3>Conclusion</h3>
      <p>TypeScript avancÃ© permet de crÃ©er des APIs type-safe et auto-documentÃ©es.</p>
    `,
    category: "development",
    tags: ["TypeScript", "Advanced", "Generics", "Types"],
    author: "Maxence",
    publishedAt: "2024-10-20T16:00:00Z",
    readTime: 15,
    status: "published",
    language: "fr",
    views: 156,
  },
  {
    id: "5",
    slug: "animations-web-performantes",
    title: "CrÃ©er des Animations Web Performantes",
    excerpt: "Techniques et bonnes pratiques pour des animations fluides Ã  60fps avec CSS et JavaScript.",
    content: `
      <h2>Performance Avant Tout</h2>
      <p>Les animations peuvent enrichir l'expÃ©rience utilisateur, mais elles doivent rester fluides.</p>
      
      <h3>PropriÃ©tÃ©s CSS Performantes</h3>
      <p>PrivilÃ©giez ces propriÃ©tÃ©s qui utilisent le GPU :</p>
      <pre><code class="language-css">/* âœ… Performant - GPU accelerated */
.element {
  transform: translateX(100px);
  opacity: 0.5;
  filter: blur(5px);
}

/* âŒ Moins performant - DÃ©clenche reflow */
.element {
  left: 100px;
  width: 200px;
  height: 100px;
}</code></pre>
      
      <h3>Animation avec Motion/Framer Motion</h3>
      <pre><code class="language-tsx">import { motion } from 'motion/react';

function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h2>Animated Card</h2>
    </motion.div>
  );
}</code></pre>
      
      <h3>Intersection Observer pour Animations au Scroll</h3>
      <pre><code class="language-typescript">const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  },
  { threshold: 0.1 }
);

elements.forEach(el => observer.observe(el));</code></pre>
      
      <h3>Optimisation</h3>
      <ul>
        <li>Utilisez <code>will-change</code> avec parcimonie</li>
        <li>PrÃ©fÃ©rez <code>transform</code> Ã  <code>left/top</code></li>
        <li>Limitez les animations simultanÃ©es</li>
        <li>Testez sur mobile (60fps target)</li>
      </ul>
    `,
    category: "design",
    tags: ["Animation", "Performance", "CSS", "Motion"],
    author: "Maxence",
    publishedAt: "2024-10-15T11:00:00Z",
    readTime: 9,
    status: "published",
    language: "fr",
    views: 203,
  },
];

export async function seedBlogPosts() {
  console.log("ðŸŒ± Seeding blog posts...");

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const post of demoBlogPosts) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/kv/set`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              key: `blog_post_${post.id}`,
              value: post,
            }),
          }
        );

        if (response.ok) {
          successCount++;
          console.log(`âœ… Created blog post: ${post.title}`);
        } else {
          errorCount++;
          const error = await response.text();
          console.error(`âŒ Failed to create post ${post.title}:`, error);
        }
      } catch (error) {
        errorCount++;
        console.error(`âŒ Error creating post ${post.title}:`, error);
      }
    }

    console.log(
      `\nâœ… Blog seeding complete: ${successCount} posts created, ${errorCount} errors`
    );
    return { success: true, created: successCount, errors: errorCount };
  } catch (error) {
    console.error("âŒ Fatal error seeding blog posts:", error);
    return { success: false, error };
  }
}
