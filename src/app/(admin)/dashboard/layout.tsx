import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardWrapper from "@/app/(admin)/dashboard/_components/DashboardWrapper";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getUser();

  if (!session || !user) {
    return redirect("/login");
  }

  return <DashboardWrapper user={user}>{children}</DashboardWrapper>;
}
