import { isAdmin } from "@/lib/auth";
import { getAllMessages } from "@/lib/store";
import { AdminSidebar } from "./AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Page de connexion : pas de barre latérale.
  if (!(await isAdmin())) {
    return <>{children}</>;
  }
  const unreadMessages = (await getAllMessages()).filter((m) => !m.read).length;
  return (
    <div className="flex min-h-screen flex-col bg-bg md:flex-row">
      <AdminSidebar unreadMessages={unreadMessages} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
