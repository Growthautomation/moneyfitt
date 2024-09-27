"use server";

import { createClient } from "../supabase/server";

export const sendMessage = async (recipient: string, formData: FormData) => {
  try {
    const supabase = createClient();
    const message = formData.get("message");

    if (typeof message !== "string" || typeof recipient !== "string") {
      throw new Error("Invalid message or recipient");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Authentication failed");
    }

    const insertPayload = {
      message,
      recipient,
      sender: user.id,
      files: [] as (string | undefined)[],
    };

    const file = formData.get("file");

    if (file instanceof File && file?.size > 0) {
      supabase.storage.from("client-files");
      const promises = await Promise.all(
        formData.getAll("file").map((f: File) =>
          supabase.storage
            .from("client-files")
            .upload(`${user.id}/${f.name}`, f, {
              cacheControl: "3600",
              upsert: true,
            })
        )
      );

      if (promises.some((p) => p.error)) {
        console.log(promises);
        throw new Error("Failed to upload files");
      }

      insertPayload.files = promises.map((p) => p.data?.path);
    }

    const { data, error } = await supabase
      .from("messages")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: error.message };
  }
};

// ((bucket_id = 'client-files'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text))
