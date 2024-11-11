// Trigger: pg_cron - every 15 minutes

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../database.types.ts";
import { getUnreadEmail } from "../templates/unread.ts";
import { searchAdvisorAndClient } from "./search.ts";
import { generateUnsubscribeToken } from "../utils/generateUnsubscribeToken.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FE_HOST = Deno.env.get("FE_HOST");

const handler = async (_request: Request): Promise<Response> => {
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

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("is_read", false);

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

  const grouped = messages?.reduce((p, v) => {
    if (p[v.recipient]) {
      p[v.recipient].push(v);
    } else {
      p[v.recipient] = [v];
    }
    return p;
  }, {} as { [key: string]: Database["public"]["Tables"]["messages"]["Row"][] });

  for (const recipient in grouped) {
    const { data: prev } = await supabase
      .from("communications")
      .select("*")
      .eq("user_id", recipient)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (
      prev &&
      Array.isArray((prev.meta as { message_ids?: string[] })?.message_ids) &&
      grouped[recipient].every((v) =>
        (prev.meta as { message_ids?: string[] })?.message_ids?.includes(v.id)
      )
    ) {
      continue;
    }

    // Check if user has unsubscribed using the client table
    const { data: clientData, error: clientError } = await supabase
      .from("client")
      .select("unsubscribed")
      .eq("id", recipient)
      .single();

    if (clientError) {
      console.error("Error checking client unsubscribe status:", clientError);
      continue;
    }

    if (clientData?.unsubscribed) {
      console.log(`Client ${recipient} has unsubscribed. Skipping email.`);
      continue;
    }

    const sender = await searchAdvisorAndClient(
      supabase,
      grouped[recipient][0].sender
    );

    // Generate unsubscribe token
    const unsubscribeToken = await generateUnsubscribeToken(recipient);

    const message = getUnreadEmail(
      sender?.full_name || "unknown",
      sender?.source === "client"
        ? `${FE_HOST}/advisor/chat/${recipient}`
        : `${FE_HOST}/chat/${sender?.id}`,
      recipient,
      unsubscribeToken
    );

    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(recipient);
    if(!user) {
      console.error("User not found");
      continue;
    }

    console.log("sending email to", user?.email);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "new-messages@moneyfitt.co",
        to: user?.email,
        subject: "Unread messages",
        html: message,
      }),
    });
    if (!res.ok) {
      console.error(res.statusText);
      continue;
    }
    const { error: insertErr } = await supabase.from("communications").insert({
      user_id: recipient,
      message,
      meta: {
        message_ids: grouped[recipient].map((v) => v.id),
      },
    });
    if (insertErr) {
      console.error(insertErr);
    }
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

Deno.serve(handler);
