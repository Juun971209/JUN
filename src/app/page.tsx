'use client';

import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { UserProfile, Tab } from '@/types';
import { saveProfile, loadProfile, clearProfile, getProfileSummary } from '@/lib/profile';
import { supabase, loadCloudProfile, saveCloudProfile, deleteCloudProfile } from '@/lib/supabase';
import LoginScreen from '@/components/auth/LoginScreen';
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
  const [mounted, setMounted]   = useState(false);
  const [session, setSession]   = useState<Session | null>(null);
  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [tab, setTab]           = useState<Tab>('home');
  const [theme, setTheme]       = useState<Theme>('dark');
  const [syncing, setSyncing]   = useState(false);

  // ── Auth + profile init ──────────────────────────
  useEffect(() => {
    const savedTheme = (localStorage.getItem('mijang_theme') as Theme) ?? 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        await syncProfileFromCloud(s.user.id);
      } else {
        // No login — try localStorage fallback
        const local = loadProfile();
        if (local) setProfile(local);
      }
      setMounted(true);
    });

    // Listen for auth state changes (OAuth redirect, sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s);
        if (s && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await syncProfileFromCloud(s.user.id);
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function syncProfileFromCloud(userId: string) {
    setSyncing(true);
    try {
      const cloud = await loadCloudProfile(userId);
      if (cloud) {
        setProfile(cloud);
        saveProfile(cloud); // keep localStorage in sync
      } else {
        // New user — check localStorage migration
        const local = loadProfile();
        if (local) {
          await saveCloudProfile(userId, local);
          setProfile(local);
        }
        // else → onboarding will run
      }
    } finally {
      setSyncing(false);
    }
  }

  // ── Theme toggle ─────────────────────────────────
  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mijang_theme', next);
  };

  // ── Profile handlers ──────────────────────────────
  const handleOnboardingComplete = async (p: UserProfile) => {
    saveProfile(p);
    setProfile(p);
    if (session) await saveCloudProfile(session.user.id, p);
  };

  const handleUpdate = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    saveProfile(updated);
    if (session) await saveCloudProfile(session.user.id, updated);
  };

  const handleReset = async () => {
    clearProfile();
    if (session) await deleteCloudProfile(session.user.id);
    setProfile(null);
    setTab('home');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearProfile();
    setProfile(null);
    setTab('home');
  };

  // ── Render ────────────────────────────────────────
  if (!mounted || syncing) return null;

  if (!session) {
    return (
      <div data-theme={theme}>
        <LoginScreen />
      </div>
    );
  }

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
        {tab === 'profile'  && (
          <ProfileTab
            profile={profile}
            onUpdate={handleUpdate}
            onReset={handleReset}
            onSignOut={handleSignOut}
            userEmail={session.user.email ?? (session.user.user_metadata?.name as string) ?? '카카오 사용자'}
          />
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
