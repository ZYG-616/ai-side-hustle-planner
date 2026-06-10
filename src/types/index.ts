export interface UserInput {
  ageGroup: string;
  role: string;
  weeklyHours: number;
  timeSlots: string[];
  personalities: string[];
  skills: string[];
  customDescription: string;
  targetEarnings: string; // Target earnings description (e.g., "$100/week" or "500元/周")
  constraints: string[];
  recommendCount: number;
}

export interface Platform {
  name: string;
  url: string;
  desc: string;
}

export interface SideHustle {
  id: string;
  title: string;
  category: string;
  matchScore: number; // 0 to 100
  reason: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | '简单' | '中等' | '困难';
  estimatedIncome: string;
  prepTime: string;
  pros: string[];
  cons: string[];
  requiredSkills: string[];
  requiredEquipment: string[];
  actionPlan: string[];
  platforms: Platform[];
  scamWarning: string;
}

export interface ApiConfig {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ApiSettings {
  configs: ApiConfig[];
  activeConfigId: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: number;
  input: UserInput;
  recommendations: SideHustle[];
}
