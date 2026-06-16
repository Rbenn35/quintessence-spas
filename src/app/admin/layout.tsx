import { isAdmin } from "@/lib/auth";
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
  return (
    <div className="flex min-h-screen flex-col bg-bg md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
