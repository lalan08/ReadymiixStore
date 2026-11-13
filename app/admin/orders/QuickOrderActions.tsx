"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ChefHat, PackageCheck, X, Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  currentStatus: string;
}

const ACTIONS = [
  {
    id:       "PROCESSING",
    label:    "Prête",
    icon:     ChefHat,
    color:    "text-brand-purple-light border-brand-purple/40 hover:bg-brand-purple/10",
    showOn:   ["PENDING", "CONFIRMED"],
  },
  {
    id:       "DELIVERED",
    label:    "Récupérée",
    icon:     PackageCheck,
    color:    "text-brand-success border-brand-success/40 hover:bg-brand-success/10",
    showOn:   ["PROCESSING", "CONFIRMED", "PENDING"],
  },
  {
    id:       "CANCELLED",
    label:    "Annuler",
    icon:     X,
    color:    "text-brand-error border-brand-error/40 hover:bg-brand-error/10",
    showOn:   ["PENDING", "CONFIRMED", "PROCESSING"],
  },
];

export default function QuickOrderActions({ orderId, currentStatus }: Props) {
  const router  = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Erreur");
      router.refresh();
    } catch {
      toast.error("Impossible de mettre à jour");
    } finally {
      setLoading(null);
    }
  }

  const visible = ACTIONS.filter(a => a.showOn.includes(currentStatus));
  if (visible.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {visible.map(action => (
        <button
          key={action.id}
          onClick={() => updateStatus(action.id)}
          disabled={loading !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 cursor-pointer ${action.color}`}
        >
          {loading === action.id
            ? <Loader2 className="w-3 h-3 animate-spin" />
            : <action.icon className="w-3 h-3" />
          }
          {action.label}
        </button>
      ))}
    </div>
  );
}
