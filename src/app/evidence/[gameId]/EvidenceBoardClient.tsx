"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import PassAndPlayFlow from "@/components/PassAndPlayFlow";
import LanguageToggle from "@/components/LanguageToggle";

export default function EvidenceBoardClient({ game, playerId }: { game: any, playerId?: string }) {
  const { language } = useLanguage();

  const title = language === 'ar' ? game.titleAr : game.titleEn;
  const setting = language === 'ar' ? game.settingAr : game.settingEn;
  const victim = language === 'ar' ? game.victimAr : game.victimEn;

  const getClueStyle = (index: number) => {
    const rot = [-2, -1, 1, 2, -3, 3][index % 6];
    if (index % 4 === 0) return { type: 'polaroid', rot };
    if (index % 4 === 1) return { type: 'torn-paper', rot };
    if (index % 4 === 2) return { type: 'blood-stain', rot };
    return { type: 'map-clip', rot };
  };

  return (
    <>
      <div className="grain-overlay"></div>
      <PassAndPlayFlow 
        gameId={game.id} 
        characters={game.characters} 
        gameMode={game.mode} 
        playerId={playerId} 
        players={game.players} 
        storyEn={game.storyEn}
        storyAr={game.storyAr}
      />
      
      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-gutter h-16">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
          <h1 className="font-headline-sm text-headline-sm-mobile md:text-headline-sm text-primary uppercase tracking-widest">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <button className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* Main Board Content */}
      <main className="pt-24 pb-32 max-w-[1200px] mx-auto px-gutter min-h-screen">
        <header className="mb-12">
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">Evidence Board</h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">
            Classified findings from {setting}. Cross-reference items to build your timeline. Victim: {victim}.
          </p>
        </header>

        {/* Bento Feed of Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-evidence-gap items-start">
          {game.clues.map((clue: any, index: number) => {
            const style = getClueStyle(index);
            const desc = language === 'ar' ? clue.descriptionAr : clue.descriptionEn;

            if (style.type === 'polaroid') {
              return (
                <article key={clue.id} className={`transform rotate-${style.rot > 0 ? style.rot : `[-${Math.abs(style.rot)}deg]`} group relative bg-[#f2efe9] p-4 pt-6 pb-12 evidence-shadow transition-transform hover:rotate-0 hover:scale-105 duration-300`} style={{transform: `rotate(${style.rot}deg)`}}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-primary/20 backdrop-blur-sm border border-white/20 transform -rotate-2"></div>
                  <div className="relative overflow-hidden aspect-square mb-4 bg-zinc-800">
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center opacity-60">
                       <span className="material-symbols-outlined text-4xl text-zinc-500">photo_camera</span>
                    </div>
                    <div className="absolute inset-0 border-inset border-2 border-black/10"></div>
                  </div>
                  <p className="font-label-caps text-black/70 text-center uppercase tracking-tighter">Item #{String(index + 1).padStart(3, '0')} - Evidence</p>
                  <p className="text-xs text-black/80 mt-2 font-body-md text-center">{desc}</p>
                </article>
              );
            }

            if (style.type === 'torn-paper') {
              return (
                <article key={clue.id} className={`group relative bg-on-surface text-background p-8 torn-paper evidence-shadow min-h-[300px] flex flex-col justify-between`} style={{transform: `rotate(${style.rot}deg)`}}>
                  <div className="absolute top-2 right-4 stamp-classified px-2 py-1 font-bold text-lg">TOP SECRET</div>
                  <div className="space-y-4">
                    <span className="font-label-caps text-xs opacity-50">DATE: LOGGED</span>
                    <p className="font-headline-sm italic leading-relaxed">
                      "{desc}"
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-background/20">
                    <p className="font-label-caps uppercase text-xs">Note from Detective V.</p>
                  </div>
                </article>
              );
            }

            if (style.type === 'blood-stain') {
              return (
                <article key={clue.id} className={`group relative bg-on-surface text-background p-10 evidence-shadow blood-stain`} style={{transform: `rotate(${style.rot}deg)`}}>
                  <div className="absolute -top-4 left-10 w-8 h-10 bg-zinc-300 opacity-80 -rotate-12 flex items-center justify-center text-background font-bold text-xl">{index + 1}</div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <span className="material-symbols-outlined text-primary-container">warning</span>
                      <span className="font-label-caps text-[10px] opacity-40">EVIDENCE BAG #{700 + index}</span>
                    </div>
                    <p className="font-headline-sm font-bold text-xl leading-tight">
                      {desc}
                    </p>
                  </div>
                  <div className="mt-12 flex justify-end">
                    <div className="w-12 h-12 rounded-full border-4 border-primary-container/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary-container/20"></div>
                    </div>
                  </div>
                </article>
              );
            }

            // map-clip
            return (
              <article key={clue.id} className={`group relative glass-card p-4 evidence-shadow min-h-[350px]`} style={{transform: `rotate(${style.rot}deg)`}}>
                <div className="w-full h-48 mb-4 relative overflow-hidden bg-zinc-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay"></div>
                  <span className="material-symbols-outlined text-6xl text-white/10">map</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-headline-sm text-headline-sm text-primary">Field Intelligence</h4>
                  <p className="text-xs font-body-md text-on-surface-variant">{desc}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 bg-primary-container text-on-primary-container text-[10px] font-label-caps rounded">SPOILER</span>
                  <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-label-caps rounded">SCENE</span>
                </div>
              </article>
            );
          })}
        </div>
        
        {/* Suspect Quick Links */}
        <div className="mt-16">
           <h3 className="font-headline-sm text-primary mb-4 border-b border-white/10 pb-2">The Suspects</h3>
           <div className="flex flex-wrap gap-4">
             {game.characters.map((char: any) => {
               const charName = language === 'ar' ? char.nameAr : char.nameEn;
               return (
                 <Link key={char.id} href={`/character/${char.id}`} className="glass-panel px-4 py-2 hover:bg-white/5 transition-colors font-label-caps text-on-surface-variant hover:text-white">
                   {charName}
                 </Link>
               );
             })}
           </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface-container/60 backdrop-blur-lg border-t border-white/10 flex justify-around items-center h-20 px-4 pb-safe shadow-2xl">
        <Link href="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-white/5 transition-colors p-2 rounded-lg">
          <span className="material-symbols-outlined">groups</span>
          <span className="font-label-caps text-[10px] mt-1">Lobby</span>
        </Link>
        <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-50 p-2 rounded-lg cursor-not-allowed">
          <span className="material-symbols-outlined">person_search</span>
          <span className="font-label-caps text-[10px] mt-1">Dashboard</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-2 transition-all active:scale-95">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          <span className="font-label-caps text-[10px] mt-1">Evidence</span>
        </div>
      </nav>
    </>
  );
}
