import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function ImpersonationBanner({ academyName }: { academyName: string }) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-blue-600 px-4 py-2 text-white sm:px-6">
      <div className="flex items-center gap-2 text-xs font-medium sm:text-sm">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="truncate">
          Viewing as Super Admin — <span className="font-semibold">{academyName}</span>
        </span>
      </div>
      <Link
        href="/"
        className="flex shrink-0 items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-white/25"
      >
        <ArrowLeft className="h-3 w-3" />
        <span className="hidden sm:inline">Exit to Platform Dashboard</span>
        <span className="sm:hidden">Exit</span>
      </Link>
    </div>
  );
}
