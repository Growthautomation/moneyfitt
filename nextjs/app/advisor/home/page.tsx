import { redirect } from "next/navigation";

export default async function AgentHome() {
  return redirect('/advisor/chat')
}
