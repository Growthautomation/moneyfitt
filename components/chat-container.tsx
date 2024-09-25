"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, UserCircle } from "lucide-react";
import { useState } from "react";

interface ChatContainerProps {
  messages: {
    id: number;
    message: string;
    created_at: string;
    sender: string;
    recipiant: string;
  }[];
}

export default function ChatContainer({ messages }: ChatContainerProps) {
  const [streamingMessages, setStreamingMessages] = useState(messages);

  return (
    <ScrollArea className="h-[400px] pr-4">
      {streamingMessages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="flex items-center mb-1">
            {message.sender === "user" ? (
              <UserCircle className="w-4 h-4 mr-2" />
            ) : (
              <Bot className="w-4 h-4 mr-2" />
            )}
            <span className="text-xs font-semibold">
              {message.sender === "user" ? "You" : "Financial Advisor"}
            </span>
            <span className="text-xs ml-2 text-gray-500">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex">
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {message.message}
            </span>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
