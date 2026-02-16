import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
	// don't throw on server builds; warn so devs notice
	if (typeof window !== 'undefined') console.warn('supabase client: missing keys')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
