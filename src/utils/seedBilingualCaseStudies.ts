import { CaseStudy } from './freelanceConfig';

/**
 * Convert bilingual case study data to CaseStudy format (French by default)
 * This is used when seeding the database with bilingual data
 */
export function convertBilingualToCaseStudy(bilingualCs: any): CaseStudy {
  return {
    id: bilingualCs.id,
    title: typeof bilingualCs.title === 'object' ? bilingualCs.title.fr : bilingualCs.title,
    tagline: typeof bilingualCs.tagline === 'object' ? bilingualCs.tagline.fr : bilingualCs.tagline,
    description: typeof bilingualCs.description === 'object' ? bilingualCs.description.fr : bilingualCs.description,
    challenge: {
      title: typeof bilingualCs.challenge.title === 'object' ? bilingualCs.challenge.title.fr : bilingualCs.challenge.title,
      description: typeof bilingualCs.challenge.description === 'object' ? bilingualCs.challenge.description.fr : bilingualCs.challenge.description,
      painPoints: Array.isArray(bilingualCs.challenge.painPoints) 
        ? (typeof bilingualCs.challenge.painPoints[0] === 'object' 
          ? bilingualCs.challenge.painPoints.map((p: any) => p.fr) 
          : bilingualCs.challenge.painPoints)
        : (bilingualCs.challenge.painPoints?.fr || [])
    },
    solution: {
      title: typeof bilingualCs.solution.title === 'object' ? bilingualCs.solution.title.fr : bilingualCs.solution.title,
      description: typeof bilingualCs.solution.description === 'object' ? bilingualCs.solution.description.fr : bilingualCs.solution.description,
      approach: Array.isArray(bilingualCs.solution.approach)
        ? (typeof bilingualCs.solution.approach[0] === 'object'
          ? bilingualCs.solution.approach.map((a: any) => a.fr)
          : bilingualCs.solution.approach)
        : (bilingualCs.solution.approach?.fr || []),
      technologies: bilingualCs.solution.technologies || []
    },
    results: {
      title: typeof bilingualCs.results.title === 'object' ? bilingualCs.results.title.fr : bilingualCs.results.title,
      description: typeof bilingualCs.results.description === 'object' ? bilingualCs.results.description.fr : bilingualCs.results.description,
      metrics: bilingualCs.results.metrics.map((m: any) => ({
        label: typeof m.label === 'object' ? m.label.fr : m.label,
        value: m.value,
        change: m.change,
        positive: m.positive
      }))
    },
    testimonial: {
      quote: typeof bilingualCs.testimonial.quote === 'object' ? bilingualCs.testimonial.quote.fr : bilingualCs.testimonial.quote,
      author: bilingualCs.testimonial.author,
      role: typeof bilingualCs.testimonial.role === 'object' ? bilingualCs.testimonial.role.fr : bilingualCs.testimonial.role,
      company: bilingualCs.testimonial.company
    },
    process: bilingualCs.process.map((p: any) => ({
      phase: p.phase,
      title: typeof p.title === 'object' ? p.title.fr : p.title,
      description: typeof p.description === 'object' ? p.description.fr : p.description,
      duration: typeof p.duration === 'object' ? p.duration.fr : p.duration
    })),
    client: bilingualCs.client,
    industry: bilingualCs.industry,
    projectType: bilingualCs.projectType,
    duration: bilingualCs.duration,
    team: bilingualCs.team,
    technologies: bilingualCs.technologies,
    features: bilingualCs.features,
    images: bilingualCs.images,
    impact: bilingualCs.impact,
    links: bilingualCs.links,
    published: bilingualCs.published !== false,
    featured: bilingualCs.featured || false,
    createdAt: bilingualCs.createdAt || new Date().toISOString(),
    updatedAt: bilingualCs.updatedAt || new Date().toISOString()
  };
}
