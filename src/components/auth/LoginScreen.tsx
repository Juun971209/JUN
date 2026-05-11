'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)

  const handleKakaoLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
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
          onClick={handleKakaoLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-opacity disabled:opacity-60"
          style={{
            background: '#FEE500',
            border: 'none',
            color: '#000000',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {/* Kakao icon */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#000000" d="M9 0C4.029 0 0 3.134 0 7c0 2.496 1.659 4.685 4.166 5.932L3.1 17.1a.3.3 0 0 0 .46.327L9.1 13.98c-.033 0-.066.002-.1.002-4.971 0-9-3.134-9-7s4.029-7 9-7 9 3.134 9 7-4.029 7-9 7"/>
          </svg>
          {loading ? '연결 중...' : '카카오로 계속하기'}
        </button>
      </div>

      <p className="mt-6 text-center text-[11px]" style={{ color: 'var(--t5)' }}>
        로그인 시 개인 데이터는 암호화되어 안전하게 저장돼요
      </p>
    </div>
  )
}
