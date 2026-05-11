import { NewsItem } from '@/types';

export const NEWS: NewsItem[] = [
  { id:1, headline:'NVDA, 5/28 실적발표 앞두고 AI 수요 기대감 ↑', summary:'엔비디아가 이번 주 실적을 발표해요. 시장은 데이터센터 매출이 또 한 번 예상을 뛰어넘을 거라 기대하고 있어요. 반도체·AI 섹터 전체에 영향을 줄 수 있는 이벤트예요.', sectorKeys:['semiconductor','ai'], isMacro:false, impact:'high', ticker:'NVDA', change:'+4.2%', time:'2시간 전', emoji:'🚀' },
  { id:2, headline:'연준, 당분간 금리 동결 유지 시사', summary:'미국 중앙은행이 "인플레이션이 목표치에 도달할 때까지 금리를 내리지 않겠다"고 했어요. 금리가 높으면 성장주보다 배당주·채권이 상대적으로 유리해져요.', sectorKeys:['finance'], isMacro:true, impact:'high', ticker:null, change:null, time:'3시간 전', emoji:'🏦' },
  { id:3, headline:'테슬라 로보택시, 6월 오스틴 시범운행 확정', summary:'운전자 없는 자율주행 택시가 6월부터 텍사스에서 운행을 시작해요. 성공하면 테슬라가 자동차 회사에서 AI 로봇 회사로 변신하는 전환점이 될 수 있어요.', sectorKeys:['ev','ai'], isMacro:false, impact:'high', ticker:'TSLA', change:'+1.8%', time:'5시간 전', emoji:'🤖' },
  { id:4, headline:'MS·OpenAI 계약 갱신, Azure 우선 공급 확정', summary:'Microsoft가 OpenAI에 대한 독점 클라우드 공급 계약을 연장했어요. Azure의 AI 인프라 경쟁력이 더욱 강화될 전망이에요.', sectorKeys:['bigtech','ai'], isMacro:false, impact:'high', ticker:'MSFT', change:'+1.1%', time:'6시간 전', emoji:'💻' },
  { id:5, headline:'JP모건 실적 서프라이즈, EPS 예상치 12% 상회', summary:'JP모건이 시장 예상을 크게 웃도는 실적을 발표했어요. 고금리 장기화가 은행 순이자마진(NIM)에 긍정적으로 작용한 덕분이에요.', sectorKeys:['finance'], isMacro:false, impact:'medium', ticker:'JPM', change:'+2.8%', time:'7시간 전', emoji:'🏦' },
  { id:6, headline:'유가 하락, 사우디 증산 검토에 에너지 섹터 압박', summary:'사우디아라비아가 원유 생산량 확대를 검토한다는 소식에 국제유가가 하락했어요. 에너지 기업의 수익성에 부정적인 영향을 줄 수 있어요.', sectorKeys:['energy'], isMacro:false, impact:'medium', ticker:'XOM', change:'-1.2%', time:'8시간 전', emoji:'⚡' },
  { id:7, headline:'미국 소비자 지수 예상 하회, 경기 둔화 우려', summary:'미국인들의 소비 심리가 예상보다 나빠졌어요. 소비가 줄면 아마존, 코스트코 같은 소비재 기업 실적에 직접 영향을 줄 수 있어요.', sectorKeys:['consumer'], isMacro:true, impact:'medium', ticker:null, change:null, time:'10시간 전', emoji:'🛍️' },
  { id:8, headline:'UnitedHealth, DOJ 조사 확대…헬스케어 약세', summary:'미국 최대 건강보험사에 대한 정부 조사가 확대되면서 헬스케어 섹터 전반에 불안감이 번지고 있어요. JNJ, LLY 등도 동반 약세예요.', sectorKeys:['healthcare'], isMacro:false, impact:'high', ticker:'UNH', change:'-2.1%', time:'12시간 전', emoji:'⚠️' },
  { id:9, headline:'AMD, 새로운 AI GPU MI350 발표…NVDA 대항마', summary:'AMD가 엔비디아의 H100을 겨냥한 고성능 AI GPU를 발표했어요. 가격 경쟁력을 무기로 대형 클라우드 사의 관심을 끌고 있어요.', sectorKeys:['semiconductor','ai'], isMacro:false, impact:'high', ticker:'AMD', change:'+5.2%', time:'1시간 전', emoji:'💾' },
  { id:10, headline:'애플, AI 기능 확대 업데이트 iOS 19 발표', summary:'애플이 iOS 19에서 Siri를 대폭 업그레이드하고 Claude·ChatGPT 연동 기능을 추가했어요. AI 후발주자라는 오명을 벗을 수 있을지 주목돼요.', sectorKeys:['bigtech','ai'], isMacro:false, impact:'medium', ticker:'AAPL', change:'+1.4%', time:'4시간 전', emoji:'🍎' },
  { id:11, headline:'일라이 릴리, GLP-1 비만약 새 적응증 FDA 승인', summary:'릴리의 비만 치료제가 심혈관 질환 예방 효과로 FDA 추가 승인을 받았어요. 적용 대상이 넓어지면서 처방이 더욱 늘어날 전망이에요.', sectorKeys:['healthcare'], isMacro:false, impact:'high', ticker:'LLY', change:'+3.7%', time:'3시간 전', emoji:'💊' },
  { id:12, headline:'메타, Llama 4 공개…오픈소스 AI 판도 바꿀까', summary:'메타가 최신 오픈소스 LLM을 공개했어요. 기업들이 ChatGPT 대신 Llama를 자체 AI에 활용할 가능성이 높아지면서 메타의 AI 생태계 영향력이 확대돼요.', sectorKeys:['ai','bigtech'], isMacro:false, impact:'medium', ticker:'META', change:'+2.3%', time:'9시간 전', emoji:'🤖' },
  { id:13, headline:'RIVN, 아마존 납품 전기 밴 생산 차질 공식화', summary:'리비안이 아마존에 납품하는 전기 배달 밴의 생산 목표를 하향 조정했어요. 배터리 공급망 이슈가 지속되면서 주가가 추가 하락 중이에요.', sectorKeys:['ev'], isMacro:false, impact:'high', ticker:'RIVN', change:'-3.2%', time:'11시간 전', emoji:'🚗' },
  { id:14, headline:'퀄컴, 스냅드래곤 X 엘리트 PC 판매 호조 발표', summary:'퀄컴의 AI PC용 칩이 마이크로소프트 코파일럿+ PC에 탑재돼 판매가 급증하고 있어요. ARM 기반 PC 전환 트렌드의 수혜자로 주목받고 있어요.', sectorKeys:['semiconductor','bigtech'], isMacro:false, impact:'medium', ticker:'QCOM', change:'+2.8%', time:'6시간 전', emoji:'💻' },
  { id:15, headline:'PCE 물가지수 예상 상회…금리 인하 더 늦어지나', summary:'연준이 선호하는 인플레이션 지표가 예상보다 높게 나왔어요. 금리 인하 시점이 더 뒤로 밀리면서 성장주에 단기 압박이 올 수 있어요.', sectorKeys:['finance'], isMacro:true, impact:'high', ticker:null, change:null, time:'13시간 전', emoji:'📊' },
  { id:16, headline:'구글, 제미나이 1.5 Pro 업데이트…MS Copilot 정면 도전', summary:'구글이 기업용 AI 어시스턴트를 대폭 강화했어요. 마이크로소프트 코파일럿의 독점적 지위에 도전장을 내밀었어요.', sectorKeys:['ai','bigtech'], isMacro:false, impact:'medium', ticker:'GOOGL', change:'+1.6%', time:'8시간 전', emoji:'🔍' },
  { id:17, headline:'뱅크오브아메리카, 신용카드 연체율 상승 경고', summary:'BOA가 소비자 신용카드 연체율이 오르고 있다고 발표했어요. 소비자 재정 건전성이 악화되면서 소비재 섹터와 금융 섹터 전반에 경고음이 울리고 있어요.', sectorKeys:['finance','consumer'], isMacro:true, impact:'medium', ticker:'BAC', change:'-1.8%', time:'14시간 전', emoji:'💳' },
  { id:18, headline:'코스트코, 회원권 갱신율 역대 최고치 기록', summary:'코스트코의 멤버십 갱신율이 93%로 역대 최고치를 기록했어요. 경기가 나빠도 코스트코 회원권을 포기하지 않는다는 걸 다시 한 번 증명했어요.', sectorKeys:['consumer'], isMacro:false, impact:'medium', ticker:'COST', change:'+1.9%', time:'15시간 전', emoji:'🏪' },
  { id:19, headline:'팔란티어, 미 국방부 AI 계약 5억 달러 규모 수주', summary:'팔란티어가 대형 국방부 AI 계약을 수주했어요. 정부 계약의 안정성과 AI 소프트웨어 성장이 결합되면서 올해 가장 강한 AI 소프트웨어 종목 중 하나예요.', sectorKeys:['ai'], isMacro:false, impact:'high', ticker:'PLTR', change:'+7.4%', time:'1시간 전', emoji:'🛡️' },
  { id:20, headline:'넷플릭스, 광고 티어 가입자 4천만 돌파 발표', summary:'넷플릭스의 광고 포함 저가 요금제 가입자가 4천만을 넘었어요. 광고 매출이 새로운 성장 엔진으로 자리잡으면서 마진 개선이 기대돼요.', sectorKeys:['bigtech'], isMacro:false, impact:'medium', ticker:'NFLX', change:'+2.1%', time:'5시간 전', emoji:'🎬' },
  { id:21, headline:'엑손모빌, 자사주 매입 규모 확대 발표', summary:'엑손이 연간 자사주 매입 규모를 늘리고 배당도 인상할 계획이라고 발표했어요. 현금 창출 능력이 충분하다는 자신감의 표현으로 해석돼요.', sectorKeys:['energy'], isMacro:false, impact:'medium', ticker:'XOM', change:'+0.8%', time:'16시간 전', emoji:'⛽' },
  { id:22, headline:'비자, 글로벌 결제 거래량 8% 증가 발표', summary:'비자의 분기 결제 처리 건수가 전년 대비 8% 늘었어요. 글로벌 소비 회복과 디지털 결제 전환이 맞물리면서 안정적인 성장을 이어가고 있어요.', sectorKeys:['finance'], isMacro:false, impact:'medium', ticker:'V', change:'+1.3%', time:'18시간 전', emoji:'💳' },
];

export const MARKET_INDICES = [
  { label: 'S&P 500', value: '6,852', change: '+0.29%', up: true },
  { label: '나스닥',  value: '22,140', change: '+0.44%', up: true },
  { label: '다우',   value: '42,850', change: '-0.12%', up: false },
];

export const WEEKLY_EVENTS = [
  { day:'월', date:'5/26', event:'메모리얼 데이 (미국 휴장)', type:'holiday' as const, importance:'low' as const },
  { day:'화', date:'5/27', event:'NVDA 실적 발표 (After-hours)', type:'earnings' as const, importance:'high' as const },
  { day:'수', date:'5/28', event:'GDP 2차 잠정치 발표', type:'macro' as const, importance:'medium' as const },
  { day:'목', date:'5/29', event:'연준 의사록 공개', type:'macro' as const, importance:'high' as const },
  { day:'금', date:'5/30', event:'PCE 물가지수 발표', type:'macro' as const, importance:'high' as const },
];
