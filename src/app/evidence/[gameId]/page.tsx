import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EvidenceBoardClient from "./EvidenceBoardClient";

interface EvidencePageProps {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EvidenceBoard({ params, searchParams }: EvidencePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const playerId = typeof resolvedSearchParams.playerId === 'string' ? resolvedSearchParams.playerId : undefined;

  const game = await prisma.game.findUnique({
    where: { id: resolvedParams.gameId },
    include: { clues: true, characters: true, players: true },
  });

  if (!game) {
    notFound();
  }

  return <EvidenceBoardClient game={game} playerId={playerId} />;
}
