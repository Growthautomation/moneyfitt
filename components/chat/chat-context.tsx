"use client";

import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/chat";
import { createContext, useContext } from "react";
import { Observable, share, map } from "rxjs";

const chatContext = createContext<{ obs: Observable<Message> | null }>({
  obs: null,
});

export default function ChatContextProvider({ children, userId }) {
  const supabase = createClient();

  const newMessages$ = new Observable<any>((observer) => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient=eq.${userId}`,
        },
        (payload) => {
          observer.next(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }).pipe(
    map((payload) => payload.new),
    share()
  );

  return (
    <chatContext.Provider
      value={{
        obs: newMessages$,
      }}
    >
      {children}
    </chatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(chatContext);
  return context;
}
