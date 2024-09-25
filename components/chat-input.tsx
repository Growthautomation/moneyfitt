"use client";

import { SendIcon } from "lucide-react";
import { SubmitButton } from "./submit-btn";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { useFormState } from "react-dom";
import { sendMessage } from "@/lib/actions/chat";

interface ChatInputProps {
  recipient: string;
}

export default function ChatInput({ recipient }: ChatInputProps) {
  const [state, formAction] = useFormState(
    (state: any, data: FormData) => sendMessage(recipient, data),
    {} as any
  );

  return (
    <>
      <form className="flex w-full" action={formAction}>
        <Input
          type="text"
          name="message"
          placeholder="Type your message..."
          className="flex-grow"
        />
        <SubmitButton pendingText="Sending..." className="ml-2">
          <SendIcon className="w-4 h-4" />
        </SubmitButton>
      </form>
      {state.error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
