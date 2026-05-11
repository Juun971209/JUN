import { QuizQuestion } from '@/types';

export const QUIZ_POOL: QuizQuestion[] = [
  /* ── 기초 용어 ─────────────────────────────────── */
  { id:1, category:'basics', difficulty:'easy', question:"'불마켓(Bull Market)'은 무엇인가요?", options:['주가가 계속 오르는 시장','주가가 계속 내리는 시장','거래량이 없는 시장','외국인만 참여하는 시장'], answer:0, explanation:'황소(Bull)가 뿔로 위를 찌르듯, 주가가 상승하는 시장이에요. 반대로 곰(Bear)이 앞발로 아래를 내려치는 베어마켓은 하락장이에요.', relatedTickers:['VOO','QQQ'] },
  { id:2, category:'basics', difficulty:'easy', question:"'P/E 비율'이 낮다는 건 무엇을 의미하나요?", options:['회사가 곧 망할 수 있다','주가 대비 이익이 많아 저평가일 수 있다','배당금이 적다','주가가 가장 높다'], answer:1, explanation:'P/E = 주가 ÷ 주당순이익이에요. 낮을수록 "번 돈에 비해 주가가 싸다"는 뜻이에요. 다만 낮은 이유가 있을 수 있으니 항상 원인을 확인하세요.', relatedTickers:['MSFT','GOOGL'] },
  { id:3, category:'basics', difficulty:'easy', question:"'ETF'는 무엇인가요?", options:['특정 회사의 채권','여러 주식을 묶어놓은 펀드','단기 대출 상품','부동산 투자 신탁'], answer:1, explanation:'ETF는 여러 종목을 하나로 묶은 "주식 묶음 세트"예요. VOO를 사면 미국 상위 500개 기업에 동시 투자하는 효과가 있어요.', relatedTickers:['VOO','QQQ','SMH'] },
  { id:4, category:'basics', difficulty:'easy', question:"'시가총액'이 크다는 건 무슨 뜻인가요?", options:['주가가 비싸다','거래량이 많다','회사 전체 가치가 크다','빚이 많다'], answer:2, explanation:'시가총액 = 주가 × 총 주식 수예요. 애플 시가총액이 3조 달러라는 건, 애플 주식을 전부 사려면 3조 달러가 필요하다는 뜻이에요.', relatedTickers:['AAPL','MSFT','NVDA'] },
  { id:5, category:'basics', difficulty:'medium', question:"'배당수익률' 3%의 의미는?", options:['주가가 3% 올랐다','1년에 주가의 3%를 배당으로 받는다','3년마다 배당을 준다','배당 성장률이 3%다'], answer:1, explanation:'배당수익률 = 연간 배당금 ÷ 현재 주가. 3%면 100만 원짜리 주식에서 1년에 3만 원의 배당을 받는다는 의미예요.', relatedTickers:['JNJ','SCHD','CVX'] },
  { id:6, category:'basics', difficulty:'medium', question:"'EPS(주당순이익)'가 높다는 건?", options:['주가가 높다','주식 1주당 벌어들이는 이익이 크다','배당이 많다','부채가 적다'], answer:1, explanation:'EPS = 순이익 ÷ 총 발행 주식 수예요. EPS가 높을수록 주주 1인당 돌아오는 이익이 많은 건강한 기업이에요.', relatedTickers:['NVDA','AAPL','META'] },
  { id:7, category:'basics', difficulty:'hard', question:"'프리마켓(Pre-market)'이란?", options:['정규 장 이전에 거래되는 시간','점심 시간 거래','야간 특별 거래','옵션 전용 시간'], answer:0, explanation:'미국 주식 정규장은 ET 기준 오전 9:30~4:00이에요. 프리마켓은 4:00~9:30, 애프터마켓은 4:00~8:00 PM이에요. 실적 발표는 주로 이 시간에 나와요.', relatedTickers:['NVDA','AAPL'] },
  /* ── 차트·기술분석 ──────────────────────────────── */
  { id:8, category:'chart', difficulty:'easy', question:"'이동평균선 20일선'이 의미하는 것은?", options:['오늘 포함 20일 거래의 평균 주가','20일 동안의 최고가','20번 매수한 평균 단가','20명의 평균 거래량'], answer:0, explanation:'이동평균선은 일정 기간의 평균 주가를 연결한 선이에요. 20일선이 주가 아래에 있으면 단기 상승 추세, 위에 있으면 하락 추세의 신호일 수 있어요.', relatedTickers:[] },
  { id:9, category:'chart', difficulty:'medium', question:"'골든크로스'는 무엇인가요?", options:['주가가 신고점을 경신할 때','단기 이동평균선이 장기선을 위로 돌파할 때','거래량이 급증할 때','외국인이 대거 매수할 때'], answer:1, explanation:'단기(예: 50일선)가 장기(예: 200일선)를 위로 뚫고 올라오는 것을 골든크로스라고 해요. 일반적으로 상승 신호로 해석해요.', relatedTickers:[] },
  { id:10, category:'chart', difficulty:'medium', question:"RSI(상대강도지수) 70 이상은?", options:['저평가 신호','과매수 구간, 조정 가능성','강한 상승 신호','거래량 급감 신호'], answer:1, explanation:'RSI는 0~100 사이 값으로, 70 이상은 "너무 많이 올랐다"는 과매수 신호, 30 이하는 과매도 신호예요. 항상 다른 지표와 함께 봐야 해요.', relatedTickers:['NVDA','TSLA'] },
  { id:11, category:'chart', difficulty:'hard', question:"'데드캣 바운스'란?", options:['하락장에서의 단기 반등 후 재하락','급등 후 일시적 하락','배당락일 후 반등','공매도 커버로 인한 반등'], answer:0, explanation:'크게 떨어진 주가가 잠깐 반등하지만 이후 다시 하락하는 패턴이에요. 높이서 떨어진 죽은 고양이도 한 번은 튄다는 데서 유래했어요.', relatedTickers:['UNH','RIVN'] },
  { id:12, category:'chart', difficulty:'hard', question:"'MACD'에서 시그널선 상향 돌파는?", options:['매도 신호','매수 신호','중립 신호','거래 중단 신호'], answer:1, explanation:'MACD(이동평균 수렴·발산)선이 시그널선을 위로 돌파할 때를 골든크로스로 보고 매수 신호로 해석해요. 하향 돌파는 매도 신호예요.', relatedTickers:[] },
  /* ── 매크로 ────────────────────────────────────── */
  { id:13, category:'macro', difficulty:'easy', question:"연준(Fed)이 금리를 올리면 주식시장은?", options:['항상 오른다','대체로 하락 압력을 받는다','변화 없다','채권만 영향받는다'], answer:1, explanation:'금리가 오르면 기업의 대출 비용이 커지고, 안전한 채권 이자가 높아져 주식의 매력이 줄어요. 특히 성장주(빅테크, AI)에 타격이 커요.', relatedTickers:['QQQ','BND'] },
  { id:14, category:'macro', difficulty:'medium', question:"'CPI(소비자물가지수)' 상승은?", options:['경기 침체 신호','인플레이션 심화, 금리 인하 지연 가능성','주식시장에 호재','달러 약세 신호'], answer:1, explanation:'CPI가 오르면 인플레이션이 심하다는 신호예요. 연준이 금리를 더 오래 높게 유지할 가능성이 커지면서 주식시장, 특히 성장주에 부담이 돼요.', relatedTickers:['BND','VOO'] },
  { id:15, category:'macro', difficulty:'medium', question:"달러인덱스(DXY)가 강세면 미국 기업에 미치는 영향은?", options:['해외 매출이 달러로 환산하면 줄어든다','해외 매출이 늘어난다','무역흑자가 커진다','영향이 없다'], answer:0, explanation:'달러가 강해지면 해외에서 번 돈을 달러로 환산할 때 금액이 줄어요. 해외 매출 비중이 높은 애플, 마이크로소프트 같은 글로벌 기업에 부담이 돼요.', relatedTickers:['AAPL','MSFT','AMZN'] },
  { id:16, category:'macro', difficulty:'hard', question:"'수익률 곡선 역전(Yield Curve Inversion)'이 뜻하는 것은?", options:['단기 금리가 장기 금리보다 높아지는 현상','주식시장 급등 신호','연준의 금리 인하 신호','달러 약세 신호'], answer:0, explanation:'보통 장기 채권 금리가 단기보다 높지만, 역전되면 경기 침체 가능성의 신호로 해석해요. 역사적으로 역전 이후 12~18개월 내 침체가 왔어요.', relatedTickers:['BND'] },
  { id:17, category:'macro', difficulty:'hard', question:"'QE(양적완화)'가 주식시장에 미치는 영향은?", options:['주가를 낮춘다','주가를 높이는 경향이 있다','채권만 영향받는다','영향이 없다'], answer:1, explanation:'연준이 채권을 사서 시장에 돈을 푸는 QE는 금리를 낮추고 시중에 유동성을 공급해요. 이 돈이 주식시장으로 흘러들어 주가를 높이는 경향이 있어요.', relatedTickers:['QQQ','VOO'] },
  /* ── 리스크 관리 ─────────────────────────────────── */
  { id:18, category:'risk', difficulty:'easy', question:"'분산투자'를 해야 하는 가장 큰 이유는?", options:['수익을 극대화하기 위해','한 종목이 망해도 전체 자산 손실을 줄이기 위해','세금을 줄이기 위해','거래 수수료를 낮추기 위해'], answer:1, explanation:'"계란을 한 바구니에 담지 말라"는 말처럼, 여러 종목·섹터·자산에 분산하면 한 곳이 망해도 전체 손실을 줄일 수 있어요.', relatedTickers:['VOO','QQQ','BND'] },
  { id:19, category:'risk', difficulty:'medium', question:"'손절매'를 설정하는 가장 좋은 시점은?", options:['주가가 폭락한 후','투자 전 매수 전에 미리','수익이 났을 때','연간 세금 신고 전'], answer:1, explanation:'손절 라인은 매수 전에 미리 정해야 해요. 예를 들어 "매수가 대비 -10% 시 무조건 판다"는 규칙을 미리 세우면 감정적 판단을 줄일 수 있어요.', relatedTickers:['TSLA','RIVN','PLTR'] },
  { id:20, category:'risk', difficulty:'medium', question:"'변동성(Volatility)'이 높은 주식의 특징은?", options:['안정적으로 오른다','주가가 크게 오르내린다','배당이 많다','거래량이 적다'], answer:1, explanation:'변동성이 높은 주식은 단기간에 크게 오르거나 내릴 수 있어요. 테슬라, 리비안 같은 성장주·전기차주가 대표적이에요. 수익 기회도 크지만 손실 위험도 커요.', relatedTickers:['TSLA','RIVN','PLTR','NVDA'] },
  { id:21, category:'risk', difficulty:'hard', question:"'베타(Beta) 1.5'인 주식은?", options:['시장보다 1.5배 안정적이다','시장이 1% 오를 때 1.5% 오르는 경향이 있다','배당이 1.5%다','1년에 1.5% 성장한다'], answer:1, explanation:'베타는 주식이 시장(S&P 500) 대비 얼마나 움직이는지 나타내요. 1.5면 시장이 10% 오를 때 약 15%, 10% 내릴 때 약 15% 내려가는 경향이에요.', relatedTickers:['NVDA','TSLA'] },
  { id:22, category:'risk', difficulty:'hard', question:"'리밸런싱(Rebalancing)'이 필요한 이유는?", options:['세금을 줄이기 위해','목표 자산 비중을 유지해 리스크를 관리하기 위해','수익을 극대화하기 위해','거래량을 늘리기 위해'], answer:1, explanation:'주식이 많이 오르면 포트폴리오에서 비중이 커져요. 리밸런싱으로 목표 비중(예: 주식 60%, 채권 40%)을 유지해 자동으로 "비싸게 팔고 싸게 사는" 효과를 볼 수 있어요.', relatedTickers:['VOO','BND'] },
  /* ── 세금·실무 ──────────────────────────────────── */
  { id:23, category:'tax', difficulty:'easy', question:"미국 주식 배당금에 부과되는 한국 세율은?", options:['0%','15%','22%','30%'], answer:1, explanation:'미국에서 배당금의 15%를 원천징수해요. 한국의 금융소득 세율(22%)이 더 높지만, 미국 원천세 15%를 공제받아 나머지 7%만 추가 납부하면 돼요.', relatedTickers:['JNJ','SCHD','AAPL'] },
  { id:24, category:'tax', difficulty:'medium', question:"미국 주식 매매 차익에 대한 한국 세금은?", options:['없다','양도소득세로 22% (국내 상장 해외 ETF는 다름)','배당세와 동일하게 15%','거래세만 부과된다'], answer:1, explanation:'미국 주식 직접 투자 시 연 250만 원 초과 이익에 대해 22% 양도소득세가 부과돼요. 국내 상장 해외 ETF는 세율이 달라요. 손실과 이익을 통산할 수 있어요.', relatedTickers:['VOO','QQQ'] },
  { id:25, category:'tax', difficulty:'medium', question:"'달러 평균법(DCA)'이란?", options:['환율이 낮을 때만 투자하는 전략','정기적으로 일정 금액을 꾸준히 투자하는 전략','한 번에 큰 금액을 투자하는 전략','매주 평균 환율을 계산하는 것'], answer:1, explanation:'DCA(Dollar Cost Averaging)는 매달 일정 금액을 자동으로 투자해요. 고점에 몰빵하는 위험을 줄이고, 하락 시엔 더 많은 주식을 살 수 있어요. 장기 투자에 가장 적합해요.', relatedTickers:['VOO','SCHD'] },
  { id:26, category:'tax', difficulty:'hard', question:"'배당락일(Ex-Dividend Date)'에 주식을 사면?", options:['이번 분기 배당을 받는다','이번 분기 배당을 받지 못한다','다음 분기 배당을 미리 받는다','배당이 2배가 된다'], answer:1, explanation:'배당락일 당일 또는 이후 매수하면 이번 배당을 못 받아요. 배당을 받으려면 배당락일 하루 전에 주식을 보유하고 있어야 해요.', relatedTickers:['JNJ','AAPL','SCHD'] },
  { id:27, category:'tax', difficulty:'hard', question:"연간 금융소득이 2,000만 원을 초과하면?", options:['세금이 면제된다','종합과세 대상이 된다','양도소득세만 적용된다','미국 세금만 내면 된다'], answer:1, explanation:'금융소득(이자·배당) 합산이 연 2,000만 원을 초과하면 종합소득세 신고 대상이 돼요. 다른 소득과 합산해 세금을 내야 하므로 고소득자는 절세 전략이 중요해요.', relatedTickers:['SCHD','VYM'] },
];

export const QUIZ_CATEGORIES = [
  { id: 'basics' as const, label: '기초 용어', icon: '📖', color: '#4ecdc4' },
  { id: 'chart'  as const, label: '차트·기술',  icon: '📈', color: '#45b7d1' },
  { id: 'macro'  as const, label: '매크로',     icon: '🌍', color: '#ffa502' },
  { id: 'risk'   as const, label: '리스크',     icon: '⚠️', color: '#ff4757' },
  { id: 'tax'    as const, label: '세금·실무',  icon: '💼', color: '#2ed573' },
];
