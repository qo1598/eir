import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/common/AppHeader";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("research_user_name");

  if (!authCookie) {
    redirect("/login");
  }

  return (
    <>
      <AppHeader />
      <main className="flex-grow bg-slate-50/50">
        {children}
      </main>
      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 AI·디지털 공문 큐레이션. All rights reserved.</p>
      </footer>
    </>
  );
}
