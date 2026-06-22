import { Badge } from "@/components/ui/Badge";
import type { AcademyStatus } from "@/types";

export function AcademyStatusBadge({ status }: { status: AcademyStatus }) {
  if (status === "active") return <Badge variant="green">Active</Badge>;
  if (status === "trial") return <Badge variant="blue">Trial</Badge>;
  return <Badge variant="red">Suspended</Badge>;
}
