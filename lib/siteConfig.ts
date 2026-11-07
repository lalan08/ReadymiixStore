import { prisma } from "@/lib/prisma";

export async function getSiteConfigMap(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteConfig.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

// Composer is enabled by default; only an explicit "false" disables it.
export async function isComposerEnabled(): Promise<boolean> {
  const cfg = await getSiteConfigMap();
  return cfg.composer_enabled !== "false";
}
