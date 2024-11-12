// @ts-ignore: Deno types
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

// Declare Deno namespace for TypeScript
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Constants for Mailerlite groups
const MAILERLITE_API_KEY = Deno.env.get("MAILERLITE_API_KEY");
const PLATFORM_SIGNUP_GROUPID = "135887753665578487"; // User App Signups group
const ADVISOR_GROUPID = "136046658905441756"; // Advisor group ID

// Add utility function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add retry function for database check
async function checkAdvisorWithRetry(supabaseClient: any, userId: string, maxRetries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Checking advisor status - attempt ${attempt} of ${maxRetries}`);
    
    const { data: advisorData, error: advisorError } = await supabaseClient
      .from('advisor')
      .select('id')
      .eq('id', userId)
      .single();

    if (advisorError) {
      console.log(`Attempt ${attempt} - Error checking advisor table:`, advisorError);
    }

    if (advisorData) {
      console.log("Found advisor record:", advisorData);
      return true;
    }

    if (attempt < maxRetries) {
      const delayMs = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
      console.log(`No advisor record found yet, waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
    }
  }

  console.log("No advisor record found after all retries");
  return false;
}

const handler = async (_request: Request): Promise<Response> => {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log("Environment check:", {
      hasMailerliteKey: !!MAILERLITE_API_KEY,
      hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
      hasServiceRoleKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    });

    // Validate environment variables
    if (!MAILERLITE_API_KEY) {
      throw new Error("MAILERLITE_API_KEY is not configured");
    }
    if (!Deno.env.get('SUPABASE_URL')) {
      throw new Error("SUPABASE_URL is not configured");
    }
    if (!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
    }

    console.log("Starting webhook handler...");
    const payload = await _request.json();
    console.log("Received payload:", JSON.stringify(payload, null, 2));
    
    // Validate webhook payload
    if (!payload) {
      throw new Error("No payload received");
    }

    if (payload.type !== "INSERT" || payload.table !== "users") {
      throw new Error(`Invalid webhook payload - Type: ${payload.type}, Table: ${payload.table}`);
    }

    // Extract user data with fallbacks
    const email = payload.record?.email;
    const name = payload.record?.raw_user_meta_data?.name || 
                payload.record?.raw_user_meta_data?.full_name || 
                email?.split('@')[0];

    if (!email || !name) {
      throw new Error(`Missing required user data - Email: ${email}, Name: ${name}, Full payload: ${JSON.stringify(payload.record)}`);
    }

    // Create Supabase client
    console.log("Creating Supabase client...");
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    );

    // First create/update subscriber in Mailerlite
    console.log("Creating/updating Mailerlite subscriber...");
    const subscriberResponse = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        fields: {
          name: name,
        },
        groups: [PLATFORM_SIGNUP_GROUPID]
      }),
    });

    const subscriberResponseText = await subscriberResponse.text();
    console.log("Raw Mailerlite Response:", subscriberResponseText);

    if (!subscriberResponse.ok) {
      throw new Error(`Failed to create Mailerlite subscriber: ${subscriberResponse.status} - ${subscriberResponseText}`);
    }

    const subscriberData = JSON.parse(subscriberResponseText);
    console.log("Parsed Mailerlite subscriber response:", JSON.stringify(subscriberData, null, 2));

    if (!subscriberData.data?.id) {
      throw new Error("Failed to get subscriber ID from Mailerlite response");
    }

    // Check if user exists in advisors table with retry
    console.log("Checking user type with retry mechanism...");
    try {
      const isAdvisor = await checkAdvisorWithRetry(supabaseClient, payload.record.id);

      // Add to appropriate group based on user type
      if (isAdvisor) {
        console.log("User is an advisor, adding to advisor group...");
        const advisorGroupResponse = await fetch(
          `https://connect.mailerlite.com/api/subscribers/${subscriberData.data.id}/groups/${ADVISOR_GROUPID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${MAILERLITE_API_KEY}`,
            }
          }
        );

        const groupResponseText = await advisorGroupResponse.text();
        console.log("Advisor group addition response:", groupResponseText);

        if (!advisorGroupResponse.ok) {
          throw new Error(`Failed to add to advisor group: ${advisorGroupResponse.status} - ${groupResponseText}`);
        }

        console.log("Successfully added to advisor group");
      } else {
        console.log("User is not an advisor after all retries");
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      throw dbError;
    }

    console.log("Webhook handler completed successfully");
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in webhook handler:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        stack: error.stack,
        timestamp: new Date().toISOString() 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
