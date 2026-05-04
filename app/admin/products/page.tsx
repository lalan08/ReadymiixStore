import { prisma } from "@/lib/prisma";
import { formatPrice, parseJsonField } from "@/lib/utils";
import Link from "next/link";
import { Package, Plus, Eye, EyeOff, Pencil } from "lucide-react";

export const metadata = { title: "Produits" };
export const dynamic  = "force-dynamic";

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  light: { label: "Light",  color: "bg-[#00D2C8]/15 text-[#00D2C8] border-[#00D2C8]/30" },
  hard:  { label: "Hard",   color: "bg-[#F72585]/15 text-[#F72585] border-[#F72585]/30" },
  packs: { label: "Pack",   color: "bg-brand-gold/15 text-brand-gold border-brand-gold/30" },
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-text">Produits</h1>
          <p className="text-brand-muted text-sm mt-0.5">{products.length} produit{products.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-5 py-2.5 rounded-xl text-sm shadow-gold-sm hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl bg-brand-card border border-brand-border">
          <Package className="w-12 h-12 text-brand-muted" />
          <div className="text-center">
            <p className="font-display font-bold text-brand-text mb-1">Aucun produit</p>
            <p className="text-brand-muted text-sm">Commencez par ajouter votre premier produit.</p>
          </div>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-6 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((product) => {
            const images = parseJsonField<string[]>(product.images, []);
            const imgSrc = images[0] ?? null;
            const badge  = TYPE_BADGE[product.category.slug] ?? { label: product.category.name, color: "bg-brand-border text-brand-muted border-brand-border" };

            return (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/30 hover:bg-brand-gold/3 transition-all group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-brand-darker border border-brand-border">
                  {imgSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-brand-muted/40" />
                    </div>
                  )}
                </div>

                {/* Name + type */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-brand-text truncate">{product.name}</p>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {product.volume && <span>{product.volume} · </span>}
                    Stock : <span className={
                      product.stock === 0 ? "text-brand-error font-semibold"
                      : product.stock <= 5 ? "text-brand-warning font-semibold"
                      : "text-brand-success font-semibold"
                    }>{product.stock}</span>
                  </p>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-brand-gold">{formatPrice(product.price)}</p>
                  {product.comparePrice && (
                    <p className="text-xs text-brand-muted line-through">{formatPrice(product.comparePrice)}</p>
                  )}
                </div>

                {/* Status */}
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${
                    product.active
                      ? "text-brand-success bg-brand-success/10 border-brand-success/30"
                      : "text-brand-muted bg-brand-border/50 border-brand-border"
                  }`}>
                    {product.active ? <><Eye className="w-3 h-3" /> Visible</> : <><EyeOff className="w-3 h-3" /> Masqué</>}
                  </span>
                </div>

                {/* Edit icon */}
                <Pencil className="w-4 h-4 text-brand-muted/40 group-hover:text-brand-gold shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
