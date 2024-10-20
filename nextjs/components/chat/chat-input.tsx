"use client";

import { Plus, SendIcon, Upload } from "lucide-react";
import { SubmitButton } from "../submit-btn";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { useFormState } from "react-dom";
import { sendMessage } from "@/lib/actions/chat";
import { Message } from "@/types/chat";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import clsx from "clsx";
import { Textarea } from "../ui/textarea";
import Suggestions from "./chat-suggestions";

interface ChatInputProps {
  recipientId: string;
  enableSuggestion?: boolean;
  onSuccess?: (data: Message) => void;
}

export default function ChatInput({
  recipientId,
  onSuccess,
  enableSuggestion = false,
}: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [expand, setExpand] = useState(false);
  const [showSuggestion, setShowSuggestions] = useState(false);

  const [state, formAction] = useFormState(
    async (state: any, data: FormData) => {
      const res = await sendMessage(recipientId, data);
      if (res?.success) {
        formRef.current?.reset();
        setExpand(false);
        onSuccess?.(res.data as never);
      }
      return { ...state, ...res };
    },
    {} as any
  );

  return (
    <>
      <form className="flex gap-2 w-full" ref={formRef} action={formAction}>
        <input
          ref={fileRef}
          name="file"
          type="file"
          multiple
          className="hidden"
          onChange={() => formRef.current?.requestSubmit()}
        />
        <div
          className={clsx(
            "flex items-center space-x-4 transition-all duration-300 ease-in-out border rounded",
            {
              "w-11": !expand,
              "w-full": expand,
            }
          )}
        >
          <Button
            type="button"
            variant="default"
            className="p-3"
            onClick={() => setExpand(!expand)}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Expand</span>
          </Button>
          <div className="overflow-hidden">
            <Button
              type="button"
              onClick={() => fileRef.current?.click()}
              size="sm"
              variant="outline"
              className="rounded-full p-2"
            >
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload</span>
            </Button>
          </div>
        </div>

        <Textarea
          name="message"
          placeholder="Type your message..."
          onFocus={() => {
            setExpand(false);
            setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="flex-grow transition-all duration-300 ease-in-out min-h-[40px] max-h-[200px] resize-none overflow-y-auto h-[40px]"
          onInput={(e) => {
            const textarea = e.target as HTMLTextAreaElement;
            if (textarea.scrollHeight > textarea.clientHeight) {
              textarea.style.height = "auto";
              const newHeight = Math.min(
                Math.max(textarea.scrollHeight, 40),
                80
              );
              textarea.style.height = `${newHeight}px`;
            } else if (textarea.value === "") {
              textarea.style.height = "40px";
            }
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.target as HTMLTextAreaElement).value?.trim() !== ""
            ) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <SubmitButton pendingText="Sending...">
          <SendIcon className="w-4 h-4" />
        </SubmitButton>
      </form>
      {state.error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {enableSuggestion && (
        <div className="relative w-full">
          <div
            className={clsx(
              "absolute top-[1rem] left-0 right-0 mb-2 transition-all duration-300 ease-in-out",
              {
                "opacity-0 translate-y-4": !showSuggestion,
                "opacity-100 translate-y-0": showSuggestion,
              }
            )}
          >
            {showSuggestion && (
              <Suggestions
                recipientId={recipientId}
                onClick={(msg) => {
                  if (formRef.current?.message) {
                    // Remove leading and trailing quotation marks
                    const cleanedMsg = msg.replace(/^"|"$/g, '');
                    formRef.current.message.value = cleanedMsg;
                    formRef.current.message.dispatchEvent(
                      new Event("input", { bubbles: true })
                    );
                    formRef.current.message.focus();
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
