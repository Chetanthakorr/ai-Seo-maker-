export enum ModuleType {
  CONTENT_GAP = 'CONTENT_GAP',
  TECHNICAL_AUDIT = 'TECHNICAL_AUDIT',
  SERP_PLANNER = 'SERP_PLANNER',
  KEYWORD_CLUSTER = 'KEYWORD_CLUSTER',
  LOCAL_SEO = 'LOCAL_SEO',
  COMPETITOR_ANALYSIS = 'COMPETITOR_ANALYSIS'
}

export interface SEOMetrics {
  score?: number;
  keywordCount?: number;
  backlinks?: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  markdown: string;
  metrics?: SEOMetrics;
  groundingSources?: GroundingSource[];
}

export interface ModuleConfig {
  id: ModuleType;
  title: string;
  description: string;
  icon: string;
}
