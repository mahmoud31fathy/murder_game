import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const playerCount = body.playerCount || 4; // Default to 4 if not provided
    const playerNames = body.playerNames || []; // Array of strings (e.g. ["Alice", "Bob"])
    const judgeName = body.judgeName || null;
    const mode = body.mode || 'OFFLINE';

    // Figure out who the suspects are
    let suspectNames = [...playerNames];
    if (judgeName && suspectNames.includes(judgeName)) {
      suspectNames = suspectNames.filter(name => name !== judgeName);
    }
    
    // If no names were provided, we just generate random suspects.
    // If names are provided, we instruct the AI to use EXACTLY these names.
    const suspectCount = suspectNames.length > 0 ? suspectNames.length : (judgeName ? playerCount - 1 : playerCount);
    
    const realNamesInstruction = suspectNames.length > 0 
      ? `CRITICAL: You MUST use the following EXACT names for the playable characters/suspects: ${suspectNames.join(', ')}. Do not invent new names for the suspects.`
      : `Generate exactly ${suspectCount} playable characters. Each needs a name, motive, secret, and alibi.`;

    const judgeInstruction = judgeName 
      ? `NOTE: There is a separate player named "${judgeName}" who is acting as the Judge/Detective. The Judge is NOT a suspect. You can mention the Judge in the setting, but do NOT include the Judge in the characters array.`
      : ``;

    const prompt = `
      You are an expert murder mystery game master. Generate a compelling live-action murder mystery game scenario.
      Generate exactly:
      - 1 victim (give them a name)
      - 1 setting description
      - 1 title
      - A comprehensive "murder case story" (storyEn and storyAr). This story should set the scene, describe the murder, and explicitly name all the suspects at the very end. The Judge will read this story out loud to the players.
      - Exactly ${suspectCount} playable characters (suspects). Each needs a name, motive, secret, and alibi.
      - Exactly 12 logical clues that tie the characters together.
      
      ${realNamesInstruction}
      ${judgeInstruction}
      
      CRITICAL REQUIREMENT:
      You MUST provide bilingual output for every single text field: both English (En) and Arabic (Ar).
      For clue 'type', randomly select one of: "polaroid", "torn-paper", "blood-stain", "document".

      Return ONLY a JSON object with this exact schema:
      {
        "titleEn": "String",
        "titleAr": "String",
        "settingEn": "String",
        "settingAr": "String",
        "storyEn": "String",
        "storyAr": "String",
        "victimEn": "String",
        "victimAr": "String",
        "characters": [
          {
            "nameEn": "String",
            "nameAr": "String",
            "motiveEn": "String",
            "motiveAr": "String",
            "secretEn": "String",
            "secretAr": "String",
            "alibiEn": "String",
            "alibiAr": "String"
          }
        ],
        "clues": [
          {
            "descriptionEn": "String",
            "descriptionAr": "String",
            "type": "String"
          }
        ]
      }
    `;

    let data;
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Using mock bilingual data.');
      data = {
        titleEn: "Mystery at the Obsidian Gallery",
        titleAr: "لغز في معرض أوبسيديان",
        settingEn: "A dimly lit art gallery filled with modern glass sculptures.",
        settingAr: "معرض فني خافت الإضاءة مليء بالمنحوتات الزجاجية الحديثة.",
        storyEn: "Welcome to the Obsidian Gallery. A famous art dealer was found dead. The suspects are: " + suspectNames.join(', '),
        storyAr: "مرحبًا بكم في معرض أوبسيديان. تم العثور على تاجر أعمال فنية ميتًا. المشتبه بهم هم: " + suspectNames.join(', '),
        victimEn: "Victor Sterling, a stabbed businessman",
        victimAr: "فيكتور ستيرلينغ، رجل أعمال مطعون",
        characters: Array.from({ length: suspectCount }, (_, i) => ({
          nameEn: suspectNames[i] || `Suspect ${i + 1}`,
          nameAr: suspectNames[i] || `المشتبه به ${i + 1}`,
          motiveEn: "Owed money.",
          motiveAr: "مدين بالمال.",
          secretEn: "Was seen holding a weapon.",
          secretAr: "شوهد يحمل سلاحاً.",
          alibiEn: "Was in the bathroom.",
          alibiAr: "كان في الحمام."
        })),
        clues: Array.from({ length: 12 }, (_, i) => ({
          descriptionEn: `Clue #${i + 1} description.`,
          descriptionAr: `وصف الدليل رقم ${i + 1}.`,
          type: ["polaroid", "torn-paper", "blood-stain", "document"][i % 4]
        }))
      };
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let retries = 2;
      
      while (retries > 0) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            }
          });

          const text = response.text;
          if (!text) throw new Error('No response from Gemini API');
          data = JSON.parse(text);
          break; // success
        } catch (e) {
          retries--;
          if (retries === 0) throw e;
          console.warn("JSON parse failed, retrying...");
        }
      }
    }

    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // The game data creation
    const game = await prisma.game.create({
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        settingEn: data.settingEn,
        settingAr: data.settingAr,
        storyEn: data.storyEn,
        storyAr: data.storyAr,
        victimEn: data.victimEn,
        victimAr: data.victimAr,
        joinCode,
        mode,
        status: mode === 'OFFLINE' ? 'ROLE_REVEAL' : 'SETUP',
        characters: {
          create: data.characters.map((c: any) => ({
            nameEn: c.nameEn,
            nameAr: c.nameAr,
            motiveEn: c.motiveEn,
            motiveAr: c.motiveAr,
            secretEn: c.secretEn,
            secretAr: c.secretAr,
            alibiEn: c.alibiEn,
            alibiAr: c.alibiAr,
          }))
        },
        clues: {
          create: data.clues.map((c: any) => ({
            descriptionEn: c.descriptionEn,
            descriptionAr: c.descriptionAr,
            type: c.type,
            isUnlocked: false
          }))
        }
      },
      include: {
        characters: true,
        clues: true
      }
    });

    // In OFFLINE mode, the host has provided all the real names.
    // We should auto-create the Player records for them.
    if (mode === 'OFFLINE' && playerNames.length > 0) {
      for (const pName of playerNames) {
        // Find the matching character for this player
        const charMatch = game.characters.find(c => c.nameEn === pName || c.nameAr === pName);
        
        await prisma.player.create({
          data: {
            gameId: game.id,
            playerName: pName,
            isHost: pName === playerNames[0], // First name is host
            character: charMatch ? { connect: { id: charMatch.id } } : undefined
            // Note: If this player is the judge, charMatch will be undefined, which is correct
          }
        });
      }
      
      // Update the judgeId on the game if applicable
      if (judgeName) {
        const judgePlayer = await prisma.player.findFirst({
          where: { gameId: game.id, playerName: judgeName }
        });
        if (judgePlayer) {
          await prisma.game.update({
            where: { id: game.id },
            data: { judgeId: judgePlayer.id }
          });
        }
      }
    }

    return NextResponse.json({ success: true, game });
  } catch (error: any) {
    console.error('Error generating game:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
