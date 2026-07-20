import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const playerCount = body.playerCount || 4; // Default to 4 characters if not provided

    const prompt = `
      You are an expert murder mystery game master. Generate a compelling live-action murder mystery game scenario.
      Generate exactly:
      - 1 victim
      - 1 setting description
      - 1 title
      - Exactly ${playerCount} playable characters. Each needs a name, motive, secret, and alibi.
      - Exactly 12 logical clues that tie the characters together.
      
      CRITICAL REQUIREMENT:
      You MUST provide bilingual output for every single text field: both English (En) and Arabic (Ar).
      For clue 'type', randomly select one of: "polaroid", "torn-paper", "blood-stain", "document".

      Return ONLY a JSON object with this exact schema:
      {
        "titleEn": "String",
        "titleAr": "String",
        "settingEn": "String",
        "settingAr": "String",
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
        victimEn: "Victor Sterling, a stabbed businessman",
        victimAr: "فيكتور ستيرلينغ، رجل أعمال مطعون",
        characters: Array.from({ length: playerCount }, (_, i) => ({
          nameEn: `Suspect ${i + 1}`,
          nameAr: `المشتبه به ${i + 1}`,
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

    const game = await prisma.game.create({
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        settingEn: data.settingEn,
        settingAr: data.settingAr,
        victimEn: data.victimEn,
        victimAr: data.victimAr,
        joinCode,
        status: 'SETUP',
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

    return NextResponse.json({ success: true, game });
  } catch (error: any) {
    console.error('Error generating game:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
