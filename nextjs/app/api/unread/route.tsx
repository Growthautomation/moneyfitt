import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user) {
      console.error(
        "client/chat-summary/getUnread: fail to fetch user",
        userError
      );
      throw userError;
    }
    const { data: messages, error } = await supabase
      .from("messages")
      .select()
      .eq("recipient", user.id)
      .eq("sender", searchParams.get("recipient") || "")
      .eq("is_read", false);
    if (error) {
      console.error(
        "client/chat-summary/getUnread: fail to fetch messages",
        error
      );
      throw error;
    }
    return NextResponse.json({ unread: messages.length ?? 0 });
  } catch (error) {
    console.error(error);
    return new NextResponse(error.message ?? "Something went wrong", {
      status: 500,
    });
  }
}
