"use client";

import { useChatContext } from "@/components/chat/chat-context";
import { Badge } from "@/components/ui/badge";
import { getUnread } from "@/lib/actions/chat";
import { useEffect, useState } from "react";
import { filter } from "rxjs";

export default function Unread({ sender }) {
  const [unread, setUnread] = useState(0);
  const { obs } = useChatContext();

  useEffect(() => {
    getUnread(sender).then((unread) => {
      setUnread(unread);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender]);

  // message streaming
  useEffect(() => {
    if (obs) {
      const subscription = obs
        .pipe(filter((msg) => msg.sender === sender))
        .subscribe({
          next: (payload) => {
            setUnread((prev) => prev + 1);
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

  return (
    <div className="relative w-full">
      {unread ? (
        <Badge className="absolute top-[-1rem] right-[-1rem] bg-red-500 border-none rounded-full p-0 w-8 h-8 flex items-center justify-center text-white hover:bg-red-500">
          {unread}
        </Badge>
      ) : null}
    </div>
  );
}
