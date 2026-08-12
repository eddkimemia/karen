import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin";
import { AdminShell } from "@/components/admin/shell";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
