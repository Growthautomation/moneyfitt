// Trigger: Database Webhook - matching-notification

/* Example payload
request {
  type: "INSERT",
  table: "matchings",
  record: {
    id: 70,
    enabled: true,
    client_id: "b7520fe2-35cd-4801-bcc2-31414f966641",
    advisor_id: "616b0d93-6584-4a7e-b1fa-c17ef7f5919a",
    created_at: "2024-10-11T06:50:47.212952+00:00",
    need_score: 1,
    total_score: 2,
    personal_score: 1,
    advisor_visibility: []
  },
  schema: "public",
  old_record: null
}
*/

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Database } from "../database.types.ts";
import { newMatchTemplate } from "../templates/new-match.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FE_HOST = Deno.env.get("FE_HOST");

const handler = async (_request: Request): Promise<Response> => {
  const payload = await _request.json();
  assert(payload.type === "INSERT", "invalid record type");
  assert(payload.table === "matchings", "invalid table name");
  const supabase = createClient<Database>(
    SUPABASE_URL || "",
    SUPABASE_KEY || "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.admin.getUserById(
    payload.record.advisor_id
  );

  if (error) {
    console.error(error);
    new Response(
      JSON.stringify({
        message: "Could not retrieve user",
        detail: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "match@moneyfitt.co",
      to: user?.email,
      subject: "New match",
      html: newMatchTemplate(FE_HOST || ''),
    }),
  });

  const data = await res.json();
  console.log(data)

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

Deno.serve(handler);
