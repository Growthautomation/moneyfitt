import { User } from "lucide-react";
import Link from "next/link";

export default function ChatList({ clients }) {
  return (
    <div className="flex-shrink-0 w-64 overflow-y-auto">
      {clients.map((client) => (
        <Link
          key={client.id}
          className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
          href={`/agent/home?clientId=${client.id}`}
        >
          <User className="w-8 h-8 mr-2 text-gray-500" />
          <span>{client.name}</span>
        </Link>
      ))}
    </div>
  );
}
