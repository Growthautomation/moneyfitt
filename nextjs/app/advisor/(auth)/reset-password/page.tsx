"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

// Define the schema for form validation
const passwordSchema = z.object({
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Infer the type from the schema
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ResetPassword() {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = (data: PasswordFormData) => {
    console.log(data.confirmPassword);
  };

  // need to handle invalid email link error
  // http://localhost:3000/advisor/reset-password?error=access_denied&error_code=403&error_description=Email+link+is+invalid+or+has+expired#error=access_denied&error_code=403&error_description=Email+link+is+invalid+or+has+expired

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-96 mx-auto mt-20 border p-10 rounded-lg">
      <div className="grid gap-4">
        <h4 className="font-medium leading-none">Change Password</h4>
        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" {...register("newPassword")} />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit">Update Password</Button>
        {submitMessage && <p className="text-green-500 text-sm">{submitMessage}</p>}
      </div>
    </form>
  );
}