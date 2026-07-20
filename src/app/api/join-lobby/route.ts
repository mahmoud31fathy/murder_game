import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { playerName, joinCode } = await req.json();

    if (!playerName || !joinCode) {
      return NextResponse.json({ success: false, error: 'Player name and join code are required' }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { joinCode: joinCode.toUpperCase() }
    });

    if (!game) {
      return NextResponse.json({ success: false, error: 'Invalid join code' }, { status: 404 });
    }

    if (game.status !== 'SETUP') {
      return NextResponse.json({ success: false, error: 'Game has already started' }, { status: 403 });
    }

    const player = await prisma.player.create({
      data: {
        gameId: game.id,
        playerName,
        isHost: false,
      }
    });

    return NextResponse.json({ success: true, game, player });
  } catch (error: any) {
    console.error('Error joining lobby:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
