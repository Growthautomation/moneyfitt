"use client";
import { clsx } from "clsx";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useChatContext } from "../chat/chat-context";
import { revalidate } from "@/lib/actions/cache";
import useSWR from "swr";

export default function ListItem({
  href,
  displayName,
  selectedClientId,
  clientId,
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { obs } = useChatContext();
  const data = useSWR(`/api/unread/?recipient=${clientId}`, (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.unread))
  );

  useEffect(() => {
    if (obs) {
      const subscription = obs.subscribe({
        next: (payload) => {
          if (payload.sender === clientId) {
            setUnreadCount((prev) => prev + 1);
          }
          // Revalidate for all messages
          revalidate("/advisor/chat/[id]");
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
        "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
        "hover:bg-[#D6D5F8] hover:text-[#5C59E4]",
        {
          "bg-[#D6D5F8] text-[#5C59E4]": clientId === selectedClientId,
          "text-[#222222]": clientId !== selectedClientId,
        }
      )}
      href={href}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#ECF0F3] flex items-center justify-center">
          <User className="w-5 h-5 text-[#9CABC2]" />
        </div>
        <span className="font-medium">{displayName}</span>
      </div>
      {unreadCount && clientId !== selectedClientId ? (
        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-[#5C59E4] text-white text-sm font-bold">
          {unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
