'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // PKCE: exchange code for session, then go to main page
    supabase.auth
      .exchangeCodeForSession(window.location.search)
      .finally(() => router.replace('/'))
  }, [router])

  return (
    <div className="bg-bg flex min-h-screen items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--t4)' }}>로그인 처리 중...</p>
    </div>
  )
}
