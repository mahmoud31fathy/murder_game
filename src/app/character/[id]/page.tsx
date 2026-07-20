import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientDossier from "./ClientDossier";

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const character = await prisma.character.findUnique({
    where: { id: resolvedParams.id },
    include: { game: true },
  });

  if (!character) {
    notFound();
  }

  return (
    <>
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 grain-overlay"></div>
      </div>
      <ClientDossier character={character} />
    </>
  );
}
