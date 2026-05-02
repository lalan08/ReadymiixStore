"use client";

import Link from "next/link";
import { Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  productId: string;
  productSlug: string;
}

export default function ProductActions({ productId, productSlug }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Produit supprimé");
      router.refresh();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/product/${productSlug}`}
        target="_blank"
        className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors"
        title="Voir"
      >
        <Eye className="w-4 h-4" />
      </Link>
      <Link
        href={`/admin/products/${productId}/edit`}
        className="p-2 rounded-lg text-brand-muted hover:text-brand-gold hover:bg-brand-gold/5 transition-colors"
        title="Modifier"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button
        onClick={handleDelete}
        className="p-2 rounded-lg text-brand-muted hover:text-brand-error hover:bg-brand-error/5 transition-colors"
        title="Supprimer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
