export type Experience        = 'none' | 'under1' | '1to3' | 'over3';
export type UsStartedAt      = 'never' | 'under6m' | '6mto2y' | 'over2y';
export type Goal             = 'retirement' | 'shortterm' | 'learning';
export type BudgetRange      = 'under10' | '10to50' | '50to200' | 'over200';
export type MaxConcentration = '5' | '10' | '20' | 'unlimited';
export type FxSensitivity    = 'none' | 'some' | 'high';
export type InfoStyle        = 'financial' | 'news' | 'community' | 'recommendation';
export type SectorKey        = 'ai' | 'semiconductor' | 'bigtech' | 'healthcare' | 'finance' | 'consumer' | 'energy' | 'ev';
export type RiskLevel        = 'low' | 'medium' | 'high';
export type RiskAppetite     = 'very_conservative' | 'conservative' | 'neutral' | 'aggressive' | 'very_aggressive';
export type InvestmentHorizon = 'under1' | '1to3' | '3to10' | 'over10';
export type MaxLoss          = 'minus10' | 'minus20' | 'minus30' | 'minus50';
export type Tab = 'home' | 'stocks' | 'briefing' | 'quiz' | 'profile';

export interface UserProfile {
  experience: Experience;
  usStartedAt: UsStartedAt;
  goal: Goal;
  investmentHorizon: InvestmentHorizon;
  budget: BudgetRange;
  maxConcentration: MaxConcentration;
  riskAppetite: RiskAppetite;
  maxLoss: MaxLoss;
  dividendVsGrowth: number;
  fxSensitivity: FxSensitivity;
  infoStyle: InfoStyle;
  sectors: SectorKey[];
  holdings: string[];
  completedAt: string;
}

export interface OnboardingOption {
  value: string;
  label: string;
  sub?: string;
  icon: string;
}

export interface OnboardingStepDef {
  key: string;
  question: string;
  subtitle: string;
  type: 'single' | 'multi' | 'ticker-select' | 'slider-5' | 'slider-100';
  options: OnboardingOption[];
  optional?: boolean;
  sliderLabels?: string[];
  sliderEndLabels?: [string, string];
}

export interface EnrichedStock {
  ticker: string;
  name: string;
  logo: string;
  sector: SectorKey;
  sectorLabel: string;
  price: string;
  change: string;
  ytd: string;
  riskLevel: RiskLevel;
  dividend: string | null;
  oneLiner: string;
  goalFit: Goal[];
  horizonFit: InvestmentHorizon[];
  budgetFit: BudgetRange[];
  beginnerFriendly: boolean;
  matchMsg: Partial<Record<Goal, string>>;
  noMatchMsg: Partial<Record<Goal, string>>;
}

export interface EntrySignal {
  level: 'good' | 'caution' | 'bad';
  label: string;
  reason: string;
  newsId?: number;
}

export interface ScoredStock {
  stock: EnrichedStock;
  score: number;
  isMatch: boolean;
  reason: string;
  matchFactors: string[];
  entrySignal: EntrySignal;
}

export interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  sectorKeys: SectorKey[];
  isMacro: boolean;
  impact: 'high' | 'medium' | 'low';
  ticker: string | null;
  change: string | null;
  time: string;
  emoji: string;
}

export interface TodayPoint {
  icon: string;
  title: string;
  body: string;
  urgency: 'high' | 'medium' | 'low';
}

export type QuizCategory = 'basics' | 'chart' | 'macro' | 'risk' | 'tax';

export interface QuizQuestion {
  id: number;
  category: QuizCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  relatedTickers?: string[];
}

export interface QuizStats {
  streak: number;
  lastDate: string;
  totalCorrect: number;
  totalAnswered: number;
}

export interface DailyBriefData {
  date: string;
  updatedAt: string;
  sentiment: { level: 'bullish' | 'neutral' | 'bearish'; label: string; emoji: string; desc: string };
  indices: { label: string; value: string; change: string; up: boolean }[];
  sectorPerf: { key: SectorKey; label: string; change: string; up: boolean }[];
  events: { date: string; day: string; event: string; type: 'holiday' | 'earnings' | 'macro'; importance: 'high' | 'medium' | 'low' }[];
}
