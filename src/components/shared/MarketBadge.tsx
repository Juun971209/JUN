'use client';

import { useState, useEffect } from 'react';

type Status = 'open' | 'pre' | 'after' | 'closed';

function getStatus(now: Date): { status: Status; etStr: string } {
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const h = et.getHours(), m = et.getMinutes(), d = et.getDay();
  const wd = d > 0 && d < 6;
  let status: Status = 'closed';
  if (wd) {
    if ((h === 9 && m >= 30) || (h >= 10 && h < 16)) status = 'open';
    else if ((h >= 4 && h < 9) || (h === 9 && m < 30)) status = 'pre';
    else if (h >= 16 && h < 20) status = 'after';
  }
  const etStr = et.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' });
  return { status, etStr };
}

const CFG: Record<Status, { label: string; color: string }> = {
  open:   { label: '장 운영중',    color: '#2ed573' },
  pre:    { label: '프리마켓',     color: '#ffa502' },
  after:  { label: '애프터마켓',   color: '#ffa502' },
  closed: { label: '장 마감',      color: '#ff4757' },
};

export default function MarketBadge() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const { status, etStr } = getStatus(now);
  const { label, color } = CFG[status];
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{ background: `${color}12`, border: `1px solid ${color}28` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[10px] font-bold" style={{ color }}>{label}</span>
      <span className="text-[10px]" style={{ color: 'var(--t5)' }}>{etStr} ET</span>
    </div>
  );
}
