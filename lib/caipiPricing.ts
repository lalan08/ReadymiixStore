export const CAIPI_FLAVORS: { id: string; label: string }[] = [
  { id: "classique", label: "Classique citron vert" },
  { id: "fruitee", label: "Fruitée" },
];

export const CAIPI_SIZES: { id: string; label: string }[] = [
  { id: "500ml", label: "500 ml" },
  { id: "700ml", label: "700 ml" },
  { id: "1litre", label: "1 litre" },
];

export const CAIPI_PREPARATIONS: { id: string; label: string }[] = [
  { id: "douce", label: "Douce" },
  { id: "corsee", label: "Corsée" },
];

export const CAIPI_SUPPLEMENTS: { id: string; label: string; price: number }[] = [
  { id: "bonbons", label: "Bonbons", price: 1 },
  { id: "sirop", label: "Sirop", price: 2 },
];

const PRICING: Record<string, Record<string, number>> = {
  classique: { "500ml": 10, "700ml": 12, "1litre": 18 },
  fruitee:   { "500ml": 12, "700ml": 14, "1litre": 20 },
};

export function getCaipiPrice(flavorId: string, sizeId: string): number {
  return PRICING[flavorId]?.[sizeId] ?? 0;
}
