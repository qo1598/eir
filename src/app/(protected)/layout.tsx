// src/app/(protected)/layout.tsx

import { AppHeader } from "@/components/common/AppHeader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
