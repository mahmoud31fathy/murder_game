import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { hostName, mode } = await req.json();

    if (!hostName) {
      return NextResponse.json({ success: false, error: 'Host name is required' }, { status: 400 });
    }

    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const game = await prisma.game.create({
      data: {
        joinCode,
        mode: mode || 'ONLINE',
        status: 'SETUP',
      }
    });

    const player = await prisma.player.create({
      data: {
        gameId: game.id,
        playerName: hostName,
        isHost: true,
      }
    });

    return NextResponse.json({ success: true, game, player });
  } catch (error: any) {
    console.error('Error creating lobby:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
