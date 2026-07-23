import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const content = await readContent();
  return <AdminDashboard initial={content} />;
}
