import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    if (password !== expectedPassword) {
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
