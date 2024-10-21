"use client";
import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export default function ChangePassword() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleClick = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const {
        data: { user },
        error: useErr,
      } = await supabase.auth.getUser();
      if (useErr) {
        throw useErr.message;
      }
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        user?.email || "",
        {
          redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/advisor/reset-password`,
        }
      );

      if (resetErr) {
        throw resetErr.message;
      }

      toast({
        title: "Password Reset Initiated",
        description:
          "A secure link to reset your password has been sent to your registered email address. Please check your inbox and follow the instructions.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: e,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button disabled={loading} variant="outline" onClick={handleClick}>
      {loading ? "Processing..." : "Change Password"}
    </Button>
  );
}
