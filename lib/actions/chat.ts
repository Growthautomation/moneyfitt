"use server";

import { createClient } from "../supabase/server";


export const sendMessage = async (recipient: string, formData: FormData) => {
  try {
    const supabase = createClient();
    const message = formData.get("message");

    if (typeof message !== 'string' || typeof recipient !== 'string') {
      throw new Error('Invalid message or recipient');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Authentication failed');
    }

    const { data, error } = await supabase.from("messages").insert({
      message,
      recipient,
      sender: user.id,
    }).select();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, error: error.message };
  }
};