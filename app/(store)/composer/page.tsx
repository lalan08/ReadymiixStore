import { redirect } from "next/navigation";
import { isComposerEnabled } from "@/lib/siteConfig";
import ComposerClient from "./ComposerClient";

export const dynamic = "force-dynamic";

export default async function ComposerPage() {
  const enabled = await isComposerEnabled();
  if (!enabled) redirect("/shop");
  return <ComposerClient />;
}
