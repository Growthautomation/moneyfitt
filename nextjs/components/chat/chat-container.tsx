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
import MessageComponent from "./message";
import { useRouter, useSearchParams } from "next/navigation";
import { markAsRead } from "@/lib/actions/chat";
import { filter } from "rxjs";

interface ChatProps {
  recipentId: string;
  userId: string;
  recipentName: string;
  messages: Message[];
  showSuggestion?: boolean;
}

export default function Chat({
  recipentId,
  userId,
  recipentName,
  messages,
  showSuggestion = false,
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
        .pipe(
          filter(
            (message) =>
              message.sender === recipentId || message.sender === userId
          )
        )
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

  useEffect(() => {
    const unreads = streamingMessages
      .filter((message) => message.sender === recipentId && !message.is_read)
      .map((m) => m.id);
    if (unreads.length > 0) {
      markAsRead(unreads);
    }
  }, [streamingMessages, recipentId]);

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
        <CardTitle className="text-lg md:text-xl">
          Chat with {recipentName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          ref={scrollRef}
          className="h-[300px] md:h-[400px] pr-4 scroll-smooth"
          onScrollCapture={handleScroll}
        >
          {isPending && (
            <p className="text-sm text-center text-gray-500 my-10">
              Loading...
            </p>
          )}
          {streamingMessages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              ismine={message.sender !== recipentId}
              senderName={recipentName}
            />
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <ChatInput enableSuggestion={showSuggestion} recipientId={recipentId} />
      </CardFooter>
    </Card>
  );
}
