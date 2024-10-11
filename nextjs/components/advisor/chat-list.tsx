import clsx from "clsx";
import { User } from "lucide-react";
import Link from "next/link";

export default function ChatList({ clients, selectedClientId }) {
  return (
    <div className="flex-shrink-0 w-64 overflow-y-auto">
      {clients
        .sort((a, b) => (Number(b["name"] != null) - Number(a["name"] != null)))
        .map((client, index) => {
          const displayName = client?.name ? client.name : `annonomous`;
          return (
            <Link
              key={client.id}
              className={clsx(
                "flex items-center p-3 cursor-pointer hover:bg-gray-300 rounded",
                { "bg-gray-200": selectedClientId === client.id }
              )}
              href={`${process.env.NEXT_PUBLIC_ORIGIN}/advisor/home?clientId=${client.id}`}
            >
              <User className="w-8 h-8 mr-2 text-gray-500" />
              <span>{displayName}</span>
            </Link>
          );
        })}
    </div>
  );
}
