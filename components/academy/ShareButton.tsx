"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ShareButton({ label = "Share" }: { label?: string }) {
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    // Demo: in production this renders the module to PNG via html2canvas and
    // invokes the Web Share API / wa.me deep link, per base PRD 5.4.4 / 12.1.
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  return (
    <Button size="sm" variant="outline" onClick={handleShare}>
      {shared ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Share2 className="h-3.5 w-3.5" />}
      {shared ? "Shared to WhatsApp" : label}
    </Button>
  );
}
