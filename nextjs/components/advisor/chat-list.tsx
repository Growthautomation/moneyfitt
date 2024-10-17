"use client";
import { useParams } from "next/navigation";
import ListItem from "./chat-list-item";

export default function ChatList({ clients }) {
  const param = useParams<{ id?: string }>();
  return (
    <div className="bg-gray-100 flex-shrink-0 w-64 overflow-y-auto rounded p-2">
      {!clients.length && (
        <div className="mt-10">You have no client at the moment</div>
      )}
      {clients.length
        ? clients
            .sort(
              (a, b) => Number(b["name"] != null) - Number(a["name"] != null)
            )
            .map((client, index) => {
              const displayName = client?.name ? client.name : `annonomous`;
              return (
                <ListItem
                  key={client.id}
                  href={`${process.env.NEXT_PUBLIC_ORIGIN}/advisor/chat/${client.id}`}
                  displayName={displayName}
                  selectedClientId={param?.id}
                  clientId={client.id}
                />
              );
            })
        : null}
    </div>
  );
}
