import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/core/config/env'

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn('Supabase credentials are missing in environment variables.')
}

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY)
