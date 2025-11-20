// supabase/functions/heist-scheduler/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Check for Heist phase transitions
    // Mon 09:00 -> Reveal
    // Wed 23:59 -> Voting
    // Sun 23:59 -> Execution / Complete

    // 2. Snapshot weekly stats if Monday 09:00

    return new Response(
        JSON.stringify({ message: "Heist scheduler ran successfully" }),
        { headers: { "Content-Type": "application/json" } },
    )
})
