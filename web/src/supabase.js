import { createClient } from '@supabase/supabase-js'

// .env.local 에 적은 값을 읽음
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 값이 없으면 supabase 는 null. 앱에서 설정 안내를 보여줌
export const isConfigured = Boolean(url && anonKey)
export const supabase = isConfigured ? createClient(url, anonKey) : null
