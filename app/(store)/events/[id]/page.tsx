import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventTicketPage from "./EventTicketPage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    select: { title: true, description: true },
  });
  if (!event) return { title: "Événement introuvable" };
  return {
    title: `${event.title} — ReadyMiix`,
    description: event.description ?? undefined,
  };
}

export default async function EventPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: params.id, active: true },
  });

  if (!event) notFound();

  return (
    <EventTicketPage
      event={{
        ...event,
        date: event.date.toISOString(),
        description: event.description,
        timeRange: event.timeRange,
        price: event.price,
        maxTickets: event.maxTickets,
      }}
    />
  );
}
