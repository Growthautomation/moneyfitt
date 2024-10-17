"use client";

import { getUnread } from "@/lib/actions/chat";
import { clsx } from "clsx";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useChatContext } from "../chat/chat-context";
import { filter } from "rxjs";

export default function ListItem({
  href,
  displayName,
  selectedClientId,
  clientId,
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { obs } = useChatContext();
  useEffect(() => {
    getUnread(clientId).then((unread) => {
      setUnreadCount(unread);
    });
    // eslint-disable-next-line
  }, [clientId, selectedClientId]);

  useEffect(() => {
    if (obs) {
      const subscription = obs
        .pipe(filter((msg) => msg.sender === clientId))
        .subscribe({
          next: (payload) => {
            setUnreadCount((prev) => prev + 1);
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
    <Link
      className={clsx(
        "flex items-center justify-between p-3 cursor-pointer hover:bg-gray-300 rounded",
        { "bg-gray-200": clientId === selectedClientId }
      )}
      href={href}
    >
      <div className="flex items-center ">
        <User className="w-8 h-8 mr-2 text-gray-500" />
        <span>{displayName}</span>
      </div>
      {unreadCount && clientId !== selectedClientId ? (
        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-red-500 text-white">
          {unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
