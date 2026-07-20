import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get('gameId');

  if (!gameId) return NextResponse.json({ error: 'Missing gameId' }, { status: 400 });

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { player: true }
        }
      }
    });

    if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 404 });

    return NextResponse.json({ success: true, game });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
