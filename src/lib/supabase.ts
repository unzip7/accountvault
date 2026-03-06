import { createClient } from '@supabase/supabase-js'

// Client public (côté client + serveur)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin uniquement côté serveur (API routes)
export function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin ne peut pas être utilisé côté client')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}