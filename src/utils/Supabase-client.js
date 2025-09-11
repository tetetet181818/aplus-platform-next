"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key must be provided in environment variables"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore.getState().set({
      user: session.user,
      isAuthenticated: true,
    });
  } else {
    useAuthStore.getState().set({
      user: null,
      isAuthenticated: false,
    });
  }
});

export default supabase;
