import { prisma } from "@/lib/prisma";
import { formatPrice, parseJsonField } from "@/lib/utils";
import Link from "next/link";
import { Package, Plus, Eye, EyeOff } from "lucide-react";
import ProductActions from "./ProductActions";

export const metadata = { title: "Gestion des produits" };
export const dynamic  = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">Produits</h1>
          <p className="text-brand-muted text-sm mt-0.5">{products.length} produit{products.length > 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-5 py-2.5 rounded-xl text-sm shadow-gold-sm hover:shadow-gold transition-all"
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
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-6 py-2.5 rounded-xl text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    Produit
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide hidden md:table-cell">
                    Catégorie
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    Prix
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide hidden sm:table-cell">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide hidden lg:table-cell">
                    Statut
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {products.map((product) => {
                  const images = parseJsonField<string[]>(product.images, []);
                  return (
                    <tr key={product.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg shrink-0 bg-brand-border overflow-hidden"
                            style={{
                              backgroundImage: images[0] ? `url(${images[0]})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {!images[0] && (
                              <div className="w-full h-full bg-gradient-brand opacity-30" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-brand-text">{product.name}</p>
                            {product.volume && (
                              <p className="text-xs text-brand-muted">{product.volume}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-brand-muted">
                        {product.category.name}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-brand-gold">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                          <span className="text-xs text-brand-muted line-through ml-1.5">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span
                          className={`text-xs font-semibold ${
                            product.stock === 0
                              ? "text-brand-error"
                              : product.stock <= 5
                              ? "text-brand-warning"
                              : "text-brand-success"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                            product.active
                              ? "text-brand-success bg-brand-success/10 border-brand-success/30"
                              : "text-brand-muted bg-brand-border border-brand-border"
                          }`}
                        >
                          {product.active ? (
                            <><Eye className="w-3 h-3" /> Visible</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Masqué</>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <ProductActions productId={product.id} productSlug={product.slug} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
