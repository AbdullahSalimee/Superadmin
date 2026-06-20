"use client";
import { Check } from "lucide-react";
import type { NotificationRow } from "@/lib/queries/types";
import { resolveNotification } from "@/lib/queries/academy-tests";
import { shortId, fmtDate } from "@/lib/format";

export default function NotificationsModule({
  notifications, setNotifications,
}: {
  notifications: NotificationRow[];
  setNotifications: (fn: (p: NotificationRow[]) => NotificationRow[]) => void;
}) {
  const resolve = async (n: NotificationRow) => {
    await resolveNotification(n.id);
    setNotifications((p) => p.map((x) => (x.id === n.id ? { ...x, is_resolved: true } : x)));
  };

  return (
    <table className="tbl">
      <thead>
        <tr>
          <th className="mono">id</th>
          <th className="mono">type</th>
          <th className="mono">message</th>
          <th className="mono">created_at</th>
          <th className="mono">status</th>
          <th className="mono"></th>
        </tr>
      </thead>
      <tbody>
        {notifications.map((n) => (
          <tr key={n.id}>
            <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{shortId(n.id)}</td>
            <td className="mono" style={{ fontSize: 11 }}>{n.type}</td>
            <td  style={{ fontSize: 12.5 }}>{n.message}</td>
            <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{fmtDate(n.created_at)}</td>
            <td >
              <span className={`badge badge-${n.is_resolved ? "active" : "suspended"}`}>{n.is_resolved ? "resolved" : "open"}</span>
            </td>
            <td >
              {!n.is_resolved && (
                <button className="btn btn-ghost btn-sm" onClick={() => resolve(n)}><Check size={11} /> resolve</button>
              )}
            </td>
          </tr>
        ))}
        {notifications.length === 0 && (
          <tr><td colSpan={6} className="mono" style={{ textAlign: "center", color: "var(--t3)", padding: 24 }}>no rows</td></tr>
        )}
      </tbody>
    </table>
  );
}
