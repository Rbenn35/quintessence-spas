import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllMessages } from "@/lib/store";
import { MessagesList } from "./MessagesList";

export const dynamic = "force-dynamic";

export default async function AdminMessages() {
  if (!(await isAdmin())) redirect("/admin/login");
  const messages = await getAllMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-muted">
            {messages.length} message{messages.length > 1 ? "s" : ""}
            {unread > 0 && (
              <span className="ml-2 rounded-full bg-terra px-2 py-0.5 text-xs font-semibold text-white">
                {unread} non lu{unread > 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-8">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-line bg-cream p-10 text-center text-muted">
            Aucun message pour le moment. Les demandes envoyées via le
            formulaire de contact apparaîtront ici.
          </div>
        ) : (
          <MessagesList messages={messages} />
        )}
      </div>
    </div>
  );
}
