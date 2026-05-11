import {
  UserProfile, Experience, Goal, BudgetRange,
  RiskAppetite, InvestmentHorizon, MaxLoss,
  InfoStyle, UsStartedAt, MaxConcentration, FxSensitivity,
} from '@/types';

const STORAGE_KEY = 'mijang_profile_v3';

// ── Persistence ───────────────────────────────────

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<UserProfile>;
    if (!p.experience || !p.goal || !p.budget || !p.sectors) return null;
    // Migrate: fill missing fields with defaults for older saved profiles
    return {
      experience: p.experience,
      goal: p.goal,
      budget: p.budget,
      sectors: p.sectors,
      holdings: p.holdings ?? [],
      riskAppetite: p.riskAppetite ?? 'neutral',
      investmentHorizon: p.investmentHorizon ?? '1to3',
      maxLoss: p.maxLoss ?? 'minus20',
      infoStyle: p.infoStyle ?? 'news',
      usStartedAt: p.usStartedAt ?? 'under6m',
      maxConcentration: p.maxConcentration ?? '10',
      dividendVsGrowth: p.dividendVsGrowth ?? 50,
      fxSensitivity: p.fxSensitivity ?? 'some',
      completedAt: p.completedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Display labels ────────────────────────────────

export const EXPERIENCE_LABEL: Record<Experience, string> = {
  none: '처음이에요', under1: '1년 미만', '1to3': '1~3년', over3: '3년 이상',
};

export const GOAL_LABEL: Record<Goal, string> = {
  retirement: '노후 대비', shortterm: '단기 수익', learning: '공부·입문',
};

export const BUDGET_LABEL: Record<BudgetRange, string> = {
  under10: '10만원 미만', '10to50': '10~50만원',
  '50to200': '50~200만원', over200: '200만원 이상',
};

export const RISK_APPETITE_LABEL: Record<RiskAppetite, string> = {
  very_conservative: '매우 보수적', conservative: '보수적', neutral: '중립적',
  aggressive: '공격적', very_aggressive: '매우 공격적',
};

export const INVESTMENT_HORIZON_LABEL: Record<InvestmentHorizon, string> = {
  under1: '1년 이내', '1to3': '1~3년', '3to10': '3~10년', over10: '10년 이상',
};

export const MAX_LOSS_LABEL: Record<MaxLoss, string> = {
  minus10: '-10%까지', minus20: '-20%까지', minus30: '-30%까지', minus50: '-50%도 OK',
};

export const INFO_STYLE_LABEL: Record<InfoStyle, string> = {
  financial: '재무제표 분석', news: '경제 뉴스',
  community: '커뮤니티·유튜브', recommendation: '지인·전문가 추천',
};

export const US_STARTED_AT_LABEL: Record<UsStartedAt, string> = {
  never: '아직 안 해봤어요', under6m: '6개월 미만',
  '6mto2y': '6개월~2년', over2y: '2년 이상',
};

export const MAX_CONCENTRATION_LABEL: Record<MaxConcentration, string> = {
  '5': '5% 이하', '10': '10% 이하', '20': '20% 이하', unlimited: '제한 없음',
};

export const FX_SENSITIVITY_LABEL: Record<FxSensitivity, string> = {
  none: '신경 안 써요', some: '어느 정도요', high: '매우 민감해요',
};

export const SECTOR_LABEL: Record<string, string> = {
  ai: 'AI', semiconductor: '반도체', bigtech: '빅테크',
  healthcare: '헬스케어', finance: '금융', consumer: '소비재',
  energy: '에너지', ev: '전기차',
};

// ── Profile summary ───────────────────────────────

export interface ProfileSummary {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  tips: string[];
}

export function getProfileSummary(profile: UserProfile): ProfileSummary {
  const { goal, riskAppetite, investmentHorizon } = profile;

  if (goal === 'retirement' || riskAppetite === 'conservative') {
    return {
      emoji: '🏖️',
      title: '안정형 장기투자자',
      subtitle: '꾸준한 복리로 안전하게 노후 자산을 쌓아가는 스타일이에요.',
      color: '#45b7d1',
      tips: [
        'VOO, SCHD 같은 ETF를 코어 자산으로 가져가세요',
        '매달 자동 적립식(DCA)이 가장 잘 맞는 전략이에요',
        '단기 변동에 흔들리지 않는 멘탈이 장기 수익의 핵심이에요',
      ],
    };
  }
  if (goal === 'shortterm' || riskAppetite === 'aggressive') {
    return {
      emoji: '⚡',
      title: '성장 추구형 투자자',
      subtitle: '단기 모멘텀과 실적 시즌을 적극 활용하는 스타일이에요.',
      color: '#ffa502',
      tips: [
        '실적 발표 전후 변동성을 잘 활용하세요',
        '손절 라인(-10~-15%)을 미리 정해두는 게 중요해요',
        '한 종목 집중 투자는 전체의 20% 이하로 제한하세요',
      ],
    };
  }
  return {
    emoji: '📚',
    title: '탐색형 입문 투자자',
    subtitle: '배우면서 소액으로 시작하는 현명한 접근이에요.',
    color: '#4ecdc4',
    tips: [
      'VOO부터 시작해서 미국 시장 전반을 경험해보세요',
      '잃어도 괜찮은 소액으로 개별 종목을 경험해보세요',
      '뉴스와 실적 발표를 꾸준히 읽는 습관이 가장 중요해요',
    ],
  };
}
