// Trigger: Database Webhook - matching-notification

/* Example payload
request: {
  type: "INSERT",
  table: "users",
  record: {
    id: "157bb702-76ea-4a5f-92e8-bfc82f6bf0d9",
    aud: "authenticated",
    role: "",
    email: "ye@growthautomation.ai",
    phone: null,
    created_at: "2024-10-23T07:48:38.674598+00:00",
    deleted_at: null,
    invited_at: null,
    updated_at: "2024-10-23T07:48:38.674598+00:00",
    instance_id: "00000000-0000-0000-0000-000000000000",
    is_sso_user: false,
    banned_until: null,
    confirmed_at: null,
    email_change: "",
    is_anonymous: false,
    phone_change: "",
    is_super_admin: null,
    recovery_token: "",
    last_sign_in_at: null,
    recovery_sent_at: null,
    raw_app_meta_data: { provider: "google", providers: [ "google" ] },
    confirmation_token: "",
    email_confirmed_at: null,
    encrypted_password: "",
    phone_change_token: "",
    phone_confirmed_at: null,
    raw_user_meta_data: {
      iss: "https://accounts.google.com",
      sub: "117387600910763333232",
      name: "Ye Aung",
      email: "ye@growthautomation.ai",
      full_name: "Ye Aung",
      provider_id: "117387600910763333232",
      custom_claims: { hd: "growthautomation.ai" },
      email_verified: true,
      phone_verified: false
    },
    confirmation_sent_at: null,
    email_change_sent_at: null,
    phone_change_sent_at: null,
    email_change_token_new: "",
    reauthentication_token: "",
    reauthentication_sent_at: null,
    email_change_token_current: "",
    email_change_confirm_status: 0
  },
  schema: "auth",
  old_record: null
}
*/

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const MAILERLITE_API_KEY = Deno.env.get("MAILERLITE_API_KEY");
const PLATFORM_SIGNUP_GROUPID = "135887753665578487"

const handler = async (_request: Request): Promise<Response> => {
  const payload = await _request.json();
  assert(payload.type === "INSERT", "invalid record type");
  assert(payload.table === "users", "invalid table name");

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
        email: payload.record.email,
        fields: {
            name: payload.record.raw_user_meta_data.full_name,
        },
        groups: [PLATFORM_SIGNUP_GROUPID]
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
