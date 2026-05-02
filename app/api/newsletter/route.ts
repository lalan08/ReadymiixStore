import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let email: string | undefined;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = body.email;
    } else {
      const form = await req.formData();
      email = form.get("email")?.toString();
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    await prisma.newsletter.upsert({
      where:  { email },
      update: { active: true },
      create: { email },
    });

    return NextResponse.json({ success: true, message: "Inscription réussie !" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
