"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ORDER_STATUS_LABELS } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const STATUS_LIST = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdate({ orderId, currentStatus }: Props) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Erreur");
      toast.success(`Statut mis à jour : ${ORDER_STATUS_LABELS[newStatus] ?? newStatus}`);
      router.refresh();
    } catch {
      toast.error("Impossible de mettre à jour le statut");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 className="w-3.5 h-3.5 text-brand-gold animate-spin" />}
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={loading}
        className="text-xs bg-brand-card border border-brand-border rounded-lg px-2.5 py-1.5 text-brand-text focus:outline-none focus:border-brand-gold/50 disabled:opacity-50"
      >
        {STATUS_LIST.map((s) => (
          <option key={s} value={s}>{ORDER_STATUS_LABELS[s] ?? s}</option>
        ))}
      </select>
    </div>
  );
}
