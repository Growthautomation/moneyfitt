"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function ForgetPassword() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { toast } = useToast();

  const handleForgetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        event.currentTarget.email.value,
        { redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/callback` }
      );
      if (error) {
        throw error;
      }
      setSuccess(true);
    } catch (error) {
      console.error("Forget password error:", error);
      toast({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="mx-auto w-[30rem] p-5 border rounded mt-7"
      onSubmit={handleForgetPassword}
    >
      <h1 className="my-4">Forget Password?</h1>
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" name="email" />
      {success && (
        <div className="border bg-green-100 rounded text-sm p-3 text-green-500 my-3">
          We sent an password reset link to your email. You can click and login
        </div>
      )}
      <div className="py-5 text-right">
        <Button disabled={loading} type="submit">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
