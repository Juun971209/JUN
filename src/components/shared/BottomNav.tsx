import { Tab } from '@/types';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',     label: '오늘',   icon: '◉' },
  { id: 'stocks',   label: '종목',   icon: '◈' },
  { id: 'briefing', label: '브리핑', icon: '✦' },
  { id: 'quiz',     label: '퀴즈',   icon: '◇' },
  { id: 'profile',  label: 'MY',     icon: '◎' },
];

export default function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[440px] -translate-x-1/2 bg-gradient-to-t from-bg from-85% to-transparent px-5 pb-4 pt-2.5">
      <nav
        className="flex items-center justify-around rounded-2xl px-1 py-1.5"
        style={{ background: 'var(--surface-nav)', border: '1px solid var(--card-border)', backdropFilter: 'blur(20px)' }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border-none bg-transparent px-3.5 py-2 transition-all duration-200"
              style={{ opacity: active ? 1 : 0.35, fontFamily: 'inherit' }}
            >
              <span className="text-base" style={{ filter: active ? 'drop-shadow(0 0 4px rgba(78,205,196,0.5))' : 'none' }}>
                {t.icon}
              </span>
              <span className="text-[9px] font-bold" style={{ color: active ? '#4ecdc4' : 'var(--t4)' }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
