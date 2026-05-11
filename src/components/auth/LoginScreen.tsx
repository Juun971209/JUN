'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      {/* Logo */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-black tracking-tight">
          <span style={{ color: 'var(--t1)' }}>미장</span>
          <span className="text-accent">SCENE</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--t5)' }}>나만의 미국 주식 매니저</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl p-8"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <p className="mb-1 text-base font-bold" style={{ color: 'var(--t1)' }}>시작하기</p>
        <p className="mb-6 text-xs" style={{ color: 'var(--t5)' }}>
          로그인하면 어느 기기에서든 내 투자 성향이 유지돼요
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-opacity disabled:opacity-60"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            color: 'var(--t1)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {/* Google icon */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          {loading ? '연결 중...' : 'Google로 계속하기'}
        </button>
      </div>

      <p className="mt-6 text-center text-[11px]" style={{ color: 'var(--t5)' }}>
        로그인 시 개인 데이터는 암호화되어 안전하게 저장돼요
      </p>
    </div>
  )
}
