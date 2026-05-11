'use client';

import { useState, useEffect } from 'react';
import { UserProfile, Tab } from '@/types';
import { saveProfile, loadProfile, clearProfile, getProfileSummary } from '@/lib/profile';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import MarketBadge from '@/components/shared/MarketBadge';
import BottomNav from '@/components/shared/BottomNav';
import TodayTab from '@/components/dashboard/TodayTab';
import StocksTab from '@/components/dashboard/StocksTab';
import DailyBriefTab from '@/components/dashboard/DailyBriefTab';
import QuizTab from '@/components/dashboard/QuizTab';
import ProfileTab from '@/components/dashboard/ProfileTab';

type Theme = 'dark' | 'light';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<Tab>('home');
  const [theme, setTheme] = useState<Theme>('dark');

  // Load profile + theme from localStorage on mount
  useEffect(() => {
    const savedProfile = loadProfile();
    const savedTheme = (localStorage.getItem('mijang_theme') as Theme) ?? 'dark';

    if (savedProfile) setProfile(savedProfile);
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mijang_theme', next);
  };

  const handleOnboardingComplete = (p: UserProfile) => {
    saveProfile(p);
    setProfile(p);
  };

  const handleUpdate = (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleReset = () => {
    clearProfile();
    setProfile(null);
    setTab('home');
  };

  // Avoid hydration mismatch
  if (!mounted) return null;

  // Onboarding
  if (!profile) {
    return (
      <div className="bg-bg min-h-screen">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  const summary = getProfileSummary(profile);

  return (
    <div className="relative mx-auto min-h-screen max-w-[440px] bg-bg text-[var(--t1)]">
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-5 pt-4 pb-3"
        style={{ background: 'var(--surface-nav)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--card-border)' }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <h1 className="text-xl font-black tracking-tight">
              <span style={{ color: 'var(--t1)' }}>미장</span>
              <span className="text-accent">SCENE</span>
            </h1>
            {/* Investor type badge */}
            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ background: `${summary.color}18`, color: summary.color }}
              >
                {summary.emoji} {summary.title}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn-ghost flex h-7 w-7 items-center justify-center text-[13px]"
              aria-label="테마 전환"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <MarketBadge />
          </div>
        </div>
      </header>

      {/* Tab content */}
      <main className="px-5 pb-28 pt-5">
        {tab === 'home'     && <TodayTab      profile={profile} />}
        {tab === 'stocks'   && <StocksTab     profile={profile} />}
        {tab === 'briefing' && <DailyBriefTab profile={profile} />}
        {tab === 'quiz'     && <QuizTab />}
        {tab === 'profile'  && <ProfileTab    profile={profile} onUpdate={handleUpdate} onReset={handleReset} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
