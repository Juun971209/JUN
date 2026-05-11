import { createClient } from '@supabase/supabase-js'
import { UserProfile } from '@/types'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseUrl = rawUrl.startsWith('http') ? rawUrl.replace(/\/+$/, '').split('/rest/')[0] : 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Profile CRUD ──────────────────────────────────

export async function loadCloudProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('data')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data.data as UserProfile
}

export async function saveCloudProfile(userId: string, profile: UserProfile): Promise<void> {
  await supabase
    .from('profiles')
    .upsert({ id: userId, data: profile, updated_at: new Date().toISOString() })
}

export async function deleteCloudProfile(userId: string): Promise<void> {
  await supabase.from('profiles').delete().eq('id', userId)
}
