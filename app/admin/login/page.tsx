import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLoginPage from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }
  return <AdminLoginPage />;
}
