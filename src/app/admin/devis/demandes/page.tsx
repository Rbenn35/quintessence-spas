import { redirect } from "next/navigation";

// La liste des demandes est désormais l'onglet Devis par défaut.
export default function AdminDevisRequestsRedirect() {
  redirect("/admin/devis");
}
