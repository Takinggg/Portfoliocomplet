export type ArchitectureIcon = "smartphone" | "cloud" | "database" | "server" | "shield" | "layers";

export type ArchitectureAccent = "blue" | "purple" | "green" | "orange" | "pink" | "teal";

export interface CaseStudyArchitectureNode {
  id: string;
  layer: string;
  layer_en?: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  connector?: string;
  connector_en?: string;
  icon?: ArchitectureIcon;
  accent?: ArchitectureAccent;
}

export interface CaseStudyArchitecture {
  status?: string;
  status_en?: string;
  latency?: string;
  latency_en?: string;
  nodes: CaseStudyArchitectureNode[];
}
