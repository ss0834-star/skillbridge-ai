export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Resume {
  id: number;
  filename: string;
  extracted_text?: string;
  created_at: string;
}

export interface JobDescription {
  id: number;
  company_name?: string;
  role_title?: string;
  description: string;
  created_at: string;
}

export interface AnalysisResult {
  id: number;
  company_name?: string;
  role_title?: string;
  final_fit_score?: number;
  ats_score?: number;
  skill_match_score?: number;
  semantic_match_score?: number;
  project_relevance_score?: number;
  experience_depth_score?: number;
  interview_readiness_score?: number;
  matched_skills?: string[];
  missing_skills?: string[];
  improved_bullets?: Array<{ original: string; improved: string; why: string }>;
  summary?: string;
  recommendations?: Array<{ type: string; title: string; description: string; priority: string }>;
  created_at: string;
}

export interface CompanyTemplate {
  id: number;
  company_name: string;
  role_family: string;
  required_skills: string[];
  preferred_skills: string[];
  project_expectations: string[];
  interview_focus: string[];
  logo_color?: string;
  industry?: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  answer_hint?: string;
}

export interface ProjectSuggestion {
  id: number;
  title: string;
  tech_stack?: string[];
  description: string;
  resume_bullet?: string;
  difficulty: string;
}

export interface DashboardSummary {
  total_analyses: number;
  avg_fit_score: number;
  top_company?: string;
  missing_skills_count: number;
  recent_analyses: AnalysisResult[];
  score_trend: Array<{ date: string; score: number; company: string }>;
}
