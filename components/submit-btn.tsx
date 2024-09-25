"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";;

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  formAction,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        type="submit"
        aria-disabled={pending}
        formAction={formAction}
        {...props}
      >
        {pending ? pendingText : children}
      </Button>
      
    </>
  );
}
