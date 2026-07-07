/**
 * Supabase admin client (service role — backend only, never expose to frontend).
 */

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { env } from '../config/env.js';

// Node.js 20 needs a WebSocket polyfill for @supabase/supabase-js
if (!globalThis.WebSocket) {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: ReturnType<typeof createClient<any>> | null = null;

export function getSupabase() {
  if (!client) {
    client = createClient(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
