import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const checkExisting = requestUrl.searchParams.get("checkExisting");
  const origin = process.env.NEXT_PUBLIC_ORIGIN;

  if (code) {
    const supabase = createClient();
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return NextResponse.redirect(`${origin}/sign-in?state=login&error=${error.message}`);
    }

    // If checking existing (not signing up after onboarding)
    if (checkExisting === "true" && data?.user) {
      // Check if this user has a client record
      const { data: client } = await supabase
        .from("client")
        .select()
        .eq("id", data.user.id)
        .single();

      if (!client) {
        // No client record found - sign out and redirect with message
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/sign-in?state=login&error=no_account`
        );
      }
    }
  }

  // If we get here, either:
  // 1. They have a client record and are logging in
  // 2. They completed onboarding and are signing up - client will be created in redirect page
  return NextResponse.redirect(`${origin}/redirect`);
}
