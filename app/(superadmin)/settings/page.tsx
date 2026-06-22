import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Platform-level account & configuration" />
      <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader
            title="Super Admin account"
            subtitle="Platform-wide credential, not tied to any single academy"
          />
          <div className="space-y-3 px-5 pb-5">
            <div className="flex items-center gap-3 rounded-lg border border-[var(--border-hover)] bg-[var(--surface-2)] p-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-4 w-4 text-[var(--text)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Shared Super Admin password</p>
                <p className="text-xs text-[var(--text-faint)]">superadmin@platform · ••••••••</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                Demo
              </Badge>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Open items" subtitle="Flagged for client confirmation in the addendum" />
          <div className="space-y-2.5 px-5 pb-5">
            {[
              "Hard delete vs. soft delete for academies — currently implemented as soft-delete by default.",
              "Single shared Super Admin password vs. individual named accounts for an internal team.",
              "Platform Revenue currently reflects academy fee collections, not platform licensing revenue.",
              "Whether Super Admin actions while impersonating an academy should be separately audit-logged.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-xs text-[var(--text-dim)]">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-faint)]" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
