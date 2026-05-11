import { DailyBriefData } from '@/types';

export const BRIEF_MOCK: DailyBriefData = {
  date: '2026-05-09',
  updatedAt: '2026-05-09T13:31:00.000Z', // 09:31 ET
  sentiment: {
    level: 'bullish',
    label: '강세',
    emoji: '🐂',
    desc: 'AI 실적 서프라이즈와 연준 금리 동결 기대감으로 기술주 중심 상승 흐름이 이어지고 있어요.',
  },
  indices: [
    { label: 'S&P 500',  value: '6,852',  change: '+0.29%', up: true  },
    { label: '나스닥',   value: '22,140', change: '+0.44%', up: true  },
    { label: '다우',     value: '42,654', change: '+0.11%', up: true  },
    { label: 'VIX',      value: '14.2',   change: '-5.1%',  up: false },
    { label: '달러지수', value: '101.3',  change: '-0.3%',  up: false },
    { label: '10Y 금리', value: '4.42%',  change: '+0.02%', up: true  },
  ],
  sectorPerf: [
    { key: 'semiconductor', label: '반도체',  change: '+2.3%', up: true  },
    { key: 'ai',            label: 'AI',      change: '+1.8%', up: true  },
    { key: 'ev',            label: '전기차',  change: '+1.1%', up: true  },
    { key: 'bigtech',       label: '빅테크',  change: '+0.9%', up: true  },
    { key: 'finance',       label: '금융',    change: '+0.4%', up: true  },
    { key: 'consumer',      label: '소비재',  change: '+0.2%', up: true  },
    { key: 'healthcare',    label: '헬스케어',change: '-0.6%', up: false },
    { key: 'energy',        label: '에너지',  change: '-0.8%', up: false },
  ],
  events: [
    { date: '5/12', day: '월', event: '미국 CPI 발표',        type: 'macro',    importance: 'high'   },
    { date: '5/14', day: '수', event: 'NVDA 애널리스트 데이', type: 'earnings', importance: 'high'   },
    { date: '5/15', day: '목', event: '미국 소매판매 지표',   type: 'macro',    importance: 'medium' },
    { date: '5/15', day: '목', event: 'AMAT 실적 발표',       type: 'earnings', importance: 'medium' },
    { date: '5/16', day: '금', event: '미시간 소비심리 지수', type: 'macro',    importance: 'medium' },
    { date: '5/26', day: '월', event: '메모리얼 데이 (휴장)', type: 'holiday',  importance: 'high'   },
  ],
};
