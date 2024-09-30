"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SendIcon, EditIcon, UserCircle, Bot, ArrowLeft } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import ChatContainer from "./chat-container";
import { SubmitButton } from "../submit-btn";
import { sendMessage } from "@/lib/actions/chat";
import { useFormState } from "react-dom";
import ChatInput from "./chat-input";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Message } from "@/types/chat";
import { useChatContext } from "./chat-context";
import { filter } from "rxjs/operators";
import clsx from "clsx";
import MessageComponent from "./message";
import { useRouter, useSearchParams } from "next/navigation";

interface ChatProps {
  recipentId: string;
  recipentName: string;
  messages: Message[];
}

export default function Chat({
  recipentId,
  recipentName,
  messages,
}: ChatProps) {
  // const router = useRouter()
  // const [messages, setMessages] = useState<Message[]>([]);
  // const [input, setInput] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [editableBubbles, setEditableBubbles] = useState([
  //   'What financial products are suitable for me?',
  //   'How can I start investing in Singapore?',
  //   'Tell me about insurance options in Singapore.'
  // ]);
  // const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);

  // const generatePrompts = useCallback(async () => {
  //   setIsLoadingPrompts(true);
  //   setEditableBubbles(['', '', '']); // Clear prompts while loading

  //   try {
  //     const response = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ messages, generatePrompts: true }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setEditableBubbles(data.suggestedPrompts || ['', '', '']);
  //   } catch (error) {
  //     console.error('Error in generatePrompts:', error);
  //     setEditableBubbles(['Error loading prompts', 'Please try again', '']);
  //   } finally {
  //     setIsLoadingPrompts(false);
  //   }
  // }, [messages, setEditableBubbles]); // Include both messages and setEditableBubbles as dependencies

  // const sendMessage = useCallback(async (text: string) => {
  //   setIsLoading(true);
  //   setError(null);
  //   const newMessage: Message = {
  //     id: Date.now(),
  //     text,
  //     sender: 'user',
  //     timestamp: new Date()
  //   };
  //   setMessages(prevMessages => [...prevMessages, newMessage]);
  //   setInput('');

  //   try {
  //     const response = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ messages: [...messages, newMessage] }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     const advisorMessage: Message = {
  //       id: Date.now(),
  //       text: data.message,
  //       sender: 'advisor',
  //       timestamp: new Date()
  //     };
  //     setMessages(prevMessages => [...prevMessages, advisorMessage]);

  //     // After receiving the advisor's response, generate new prompts
  //     generatePrompts();
  //   } catch (error) {
  //     console.error('Error in sendMessage:', error);
  //     setError('Failed to get advisor response. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [generatePrompts, messages, setMessages, setInput, setIsLoading, setError]); // Add all state setters as dependencies

  // useEffect(() => {
  //   // Generate initial prompts when the component mounts
  //   generatePrompts();
  // }, [generatePrompts]);

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (input.trim() && !isLoading) {
  //     sendMessage(input.trim());
  //   }
  // }

  // const handleBubbleClick = (text: string) => {
  //   sendMessage(text);
  // }

  // const handleBubbleEdit = (index: number, newText: string) => {
  //   const newBubbles = [...editableBubbles];
  //   newBubbles[index] = newText;
  //   setEditableBubbles(newBubbles);
  // }

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
          {isPending && <p className="text-sm text-center text-gray-500 my-10">Loading...</p>}
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
                    {new Date(message.created_at).toLocaleTimeString()}
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
          recipientId={recipentId}
          onSuccess={(msg) => setStreamingMessages((prev) => [...prev, msg])}
        />
      </CardFooter>
    </Card>
  );
}
