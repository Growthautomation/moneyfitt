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
        {
          redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/update-password?type=recovery`,
        }
      );
      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          toast({ 
            title: "Too Many Attempts", 
            description: "Please wait for a while before requesting another password reset email.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }
      setSuccess(true);
    } catch (error) {
      console.error("Forget password error:", error);
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form
        className="w-full max-w-[30rem] p-8 border rounded-lg shadow-sm"
        onSubmit={handleForgetPassword}
      >
        <h1 className="text-2xl font-bold mb-6 text-[#222222]">Reset Password</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#222222]">Email</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email"
              required
              className="w-full"
            />
          </div>

          {success && (
            <div className="border bg-[#D6D5F8] rounded text-sm p-4 text-[#2E2C72]">
              We&apos;ve sent a password reset link to your email. Please check your inbox and follow the instructions.
            </div>
          )}

          <div className="text-sm text-[#9CABC2] mt-2">
            Note: For security reasons, you can only request a password reset 3 times per hour.
          </div>

          <div className="pt-4">
            <Button 
              disabled={loading} 
              type="submit"
              className="w-full bg-[#5C59E4] hover:bg-[#4543AB]"
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
