import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { gameId, judgeId } = await req.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true }
    });

    if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    if (game.status !== 'SETUP') return NextResponse.json({ error: 'Game already started' }, { status: 400 });

    const playerNames = game.players.map(p => p.playerName);
    const judge = game.players.find(p => p.id === judgeId);
    const judgeName = judge ? judge.playerName : null;

    let suspectNames = [...playerNames];
    if (judgeName) {
      suspectNames = suspectNames.filter(name => name !== judgeName);
    }
    const suspectCount = suspectNames.length;

    if (suspectCount < 2) {
      return NextResponse.json({ error: 'Need at least 2 suspects (3 players if one is judge).' }, { status: 400 });
    }

    const realNamesInstruction = `CRITICAL: You MUST use the following EXACT names for the playable characters/suspects: ${suspectNames.join(', ')}. Do not invent new names for the suspects.`;
    const judgeInstruction = judgeName ? `NOTE: There is a separate player named "${judgeName}" who is acting as the Judge/Detective. The Judge is NOT a suspect. You can mention the Judge in the setting, but do NOT include the Judge in the characters array.` : ``;

    const prompt = `
      You are an expert murder mystery game master. Generate a compelling live-action murder mystery game scenario.
      Generate exactly:
      - 1 victim (give them a name)
      - 1 setting description
      - 1 title
      - Exactly ${suspectCount} playable characters (suspects). Each needs a name, motive, secret, and alibi.
      - Exactly 12 logical clues that tie the characters together.
      
      ${realNamesInstruction}
      ${judgeInstruction}
      
      CRITICAL REQUIREMENT:
      You MUST provide bilingual output for every single text field: both English (En) and Arabic (Ar).
      For clue 'type', randomly select one of: "polaroid", "torn-paper", "blood-stain", "document".

      Return ONLY a JSON object with this exact schema:
      {
        "titleEn": "String", "titleAr": "String", "settingEn": "String", "settingAr": "String", "victimEn": "String", "victimAr": "String",
        "characters": [ { "nameEn": "String", "nameAr": "String", "motiveEn": "String", "motiveAr": "String", "secretEn": "String", "secretAr": "String", "alibiEn": "String", "alibiAr": "String" } ],
        "clues": [ { "descriptionEn": "String", "descriptionAr": "String", "type": "String" } ]
      }
    `;

    let data;
    if (!process.env.GEMINI_API_KEY) {
      data = {
        titleEn: "Mystery at the Obsidian Gallery", titleAr: "لغز في معرض أوبسيديان", settingEn: "A dimly lit art gallery.", settingAr: "معرض فني خافت الإضاءة.", victimEn: "Victor Sterling", victimAr: "فيكتور ستيرلينغ",
        characters: suspectNames.map((n, i) => ({
          nameEn: n, nameAr: n, motiveEn: "Owed money.", motiveAr: "مدين بالمال.", secretEn: "Was seen holding a weapon.", secretAr: "شوهد يحمل سلاحاً.", alibiEn: "Was in the bathroom.", alibiAr: "كان في الحمام."
        })),
        clues: Array.from({ length: 12 }, (_, i) => ({ descriptionEn: `Clue #${i + 1}`, descriptionAr: `الدليل #${i + 1}`, type: "document" }))
      };
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      data = JSON.parse(response.text || "{}");
    }

    // Update game and create characters/clues
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        titleEn: data.titleEn, titleAr: data.titleAr, settingEn: data.settingEn, settingAr: data.settingAr, victimEn: data.victimEn, victimAr: data.victimAr,
        status: 'ROLE_REVEAL',
        judgeId: judgeId || null,
        characters: {
          create: data.characters.map((c: any) => ({
            nameEn: c.nameEn, nameAr: c.nameAr, motiveEn: c.motiveEn, motiveAr: c.motiveAr, secretEn: c.secretEn, secretAr: c.secretAr, alibiEn: c.alibiEn, alibiAr: c.alibiAr,
          }))
        },
        clues: {
          create: data.clues.map((c: any) => ({
            descriptionEn: c.descriptionEn, descriptionAr: c.descriptionAr, type: c.type, isUnlocked: false
          }))
        }
      },
      include: { characters: true }
    });

    // Link players to their characters
    for (const player of game.players) {
      const charMatch = updatedGame.characters.find(c => c.nameEn === player.playerName || c.nameAr === player.playerName);
      if (charMatch) {
        await prisma.player.update({
          where: { id: player.id },
          data: { character: { connect: { id: charMatch.id } } }
        });
      }
    }

    return NextResponse.json({ success: true, game: updatedGame });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
