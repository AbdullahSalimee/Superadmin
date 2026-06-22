import { SuperAdminSidebar } from "@/components/superadmin/SuperAdminSidebar";
import { SuperAdminMobileNav } from "@/components/superadmin/SuperAdminMobileNav";

export default function SuperAdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <SuperAdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>
      <SuperAdminMobileNav />
    </div>
  );
}
