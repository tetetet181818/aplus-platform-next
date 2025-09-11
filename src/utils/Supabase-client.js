"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl && !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in env vars");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export default supabase;
