"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@radix-ui/react-label";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdatePassword() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Verify the recovery token on mount
  useEffect(() => {
    if (!searchParams) {
      router.push('/sign-in');
      return;
    }

    const type = searchParams.get('type');
    if (type !== 'recovery') {
      toast({
        title: "Invalid Access",
        description: "This page can only be accessed through a password reset link.",
        variant: "destructive"
      });
      router.push('/sign-in');
    }
  }, [searchParams, router, toast]);

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      router.push('/sign-in');
    } catch (error: any) {
      console.error("Update password error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
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
        onSubmit={handleUpdatePassword}
      >
        <h1 className="text-2xl font-bold mb-6 text-[#222222]">Update Password</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#222222]">New Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              required
              minLength={6}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#222222]">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              required
              minLength={6}
              className="w-full"
            />
          </div>

          <div className="pt-4">
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-[#5C59E4] hover:bg-[#4543AB]"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 