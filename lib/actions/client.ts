"use server"

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export async function createUserClient(data: any) {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user) {
        return {
            success: false,
            error: error?.message
        }
    }
    const { error: insertError } = await supabase.from("client").insert({
        id: user.id,
        name: data.name,
        email: user.email
    });

    if (insertError) {
        console.log(insertError);
        return {
            success: false,
            error: insertError.message
        }
    }

    return redirect("/home");

}