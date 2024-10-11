"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatInput from "./chat-input";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Message } from "@/types/chat";
import { useChatContext } from "./chat-context";
import { filter } from "rxjs/operators";
import clsx from "clsx";
import MessageComponent from "./message";
import { useRouter, useSearchParams } from "next/navigation";
import { Bot, UserCircle } from "lucide-react";

interface ChatProps {
  recipentId: string;
  recipentName: string;
  messages: Message[];
  showSuggestion?: boolean;
}

export default function Chat({
  recipentId,
  recipentName,
  messages,
  showSuggestion = false
}: ChatProps) {
  const [streamingMessages, setStreamingMessages] = useState(messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { obs } = useChatContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // message streaming
  useEffect(() => {
    if (obs) {
      const subscription = obs
        .pipe(filter((message) => message.sender === recipentId))
        .subscribe({
          next: (payload) => {
            setStreamingMessages((prev) => [...prev, payload]);
          },
          error: (error) => {
            console.error("Error in chat context subscription:", error);
          },
        });

      return () => {
        subscription.unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obs]);

  // autoscroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer instanceof HTMLElement) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [streamingMessages]);

  // update messages when new messages are received
  useEffect(() => {
    setStreamingMessages(messages);
  }, [messages]);

  // fetch old messages
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if ((e.target as HTMLDivElement).scrollTop < 10) {
        const currentOffset = parseInt(searchParams?.get("offset") || "0");
        const newOffset = currentOffset + streamingMessages.length;

        // Create a new URLSearchParams object
        const newSearchParams = new URLSearchParams(searchParams?.toString());
        newSearchParams.set("offset", newOffset.toString());

        // Use router.push to update the URL
        startTransition(() => router.push(`?${newSearchParams.toString()}`));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with {recipentName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          ref={scrollRef}
          className="h-[400px] pr-4 scroll-smooth"
          onScrollCapture={handleScroll}
        >
          {isPending && (
            <p className="text-sm text-center text-gray-500 my-10">
              Loading...
            </p>
          )}
          {streamingMessages.map((message) => (
            <div key={message.id} className="mb-4">
              <div
                className={clsx("flex", {
                  "justify-end": message.sender !== recipentId,
                })}
              >
                <div
                  className={clsx("flex items-center gap-1 mb-1", {
                    "flex-row-reverse": message.sender !== recipentId,
                  })}
                >
                  {message.sender !== recipentId ? (
                    <UserCircle className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  <span className="text-xs font-semibold">
                    {message.sender !== recipentId ? "You" : recipentName}
                  </span>
                  <span className="text-xs ml-2 text-gray-500">
                    {new Date(message.created_at!).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <MessageComponent
                message={message}
                ismine={message.sender !== recipentId}
              />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <ChatInput
          enableSuggestion={showSuggestion}
          recipientId={recipentId}
          onSuccess={(msg) => setStreamingMessages((prev) => [...prev, msg])}
        />
      </CardFooter>
    </Card>
  );
}
