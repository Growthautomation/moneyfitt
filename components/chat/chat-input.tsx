"use client";

import { SendIcon } from "lucide-react";
import { SubmitButton } from "../submit-btn";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { useFormState } from "react-dom";
import { sendMessage } from "@/lib/actions/chat";
import { Message } from "@/types/chat";
import { use, useRef } from "react";

interface ChatInputProps {
  recipientId: string;
  onSuccess?: (data: Message) => void;
}

export default function ChatInput({ recipientId, onSuccess }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(
    async (state: any, data: FormData) => {
      const res = await sendMessage(recipientId, data)
      if(res?.success){
        formRef.current?.reset();
        onSuccess?.(res.data as never)
      }
      return { ...state, ...res };
    },
    {} as any
  );

  return (
    <>
      <form className="flex w-full" ref={formRef} action={formAction}>
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
