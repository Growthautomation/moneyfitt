"use client";
import clsx from "clsx";
import { User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
              const displayName = client?.name ? client.name : `anonymous`;
              return (
                <Link
                  key={client.id}
                  className={clsx(
                    "flex items-center p-3 cursor-pointer hover:bg-gray-300 rounded",
                    { "bg-gray-200": param?.id === client.id }
                  )}
                  href={`${process.env.NEXT_PUBLIC_ORIGIN}/advisor/chat/${client.id}`}
                >
                  <User className="w-8 h-8 mr-2 text-gray-500" />
                  <span>{displayName}</span>
                </Link>
              );
            })
        : null}
    </div>
  );
}
