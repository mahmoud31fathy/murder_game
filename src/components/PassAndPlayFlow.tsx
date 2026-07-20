"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";

interface Character {
  id: string;
  nameEn: string;
  nameAr: string;
  motiveEn: string;
  motiveAr: string;
  secretEn: string;
  secretAr: string;
  alibiEn: string;
  alibiAr: string;
}

interface PassAndPlayFlowProps {
  gameId: string;
  characters: Character[];
  gameMode?: string;
  playerId?: string;
  players?: any[];
  storyEn?: string | null;
  storyAr?: string | null;
}

export default function PassAndPlayFlow({ gameId, characters, gameMode, playerId, players, storyEn, storyAr }: PassAndPlayFlowProps) {
  const [revealState, setRevealState] = useState<"pass" | "reveal" | "done">("pass");
  const [isHolding, setIsHolding] = useState(false);
  const [expandedChar, setExpandedChar] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const isOnline = gameMode === 'ONLINE';

  useEffect(() => {
    // Check if this game's flow has already been completed in this session
    const storageKey = isOnline ? `pass-flow-done-${gameId}-${playerId}` : `pass-flow-done-${gameId}`;
    const completed = localStorage.getItem(storageKey);
    
    if (completed) {
      setRevealState("done");
    } else if (isOnline || !isOnline) {
      // In both modes, we skip the pass screen now (offline is judge master screen)
      setRevealState("reveal");
    }
  }, [gameId, isOnline, playerId]);

  if (revealState === "done") return null;

  const storageKey = isOnline ? `pass-flow-done-${gameId}-${playerId}` : `pass-flow-done-${gameId}`;

  const handleFinish = () => {
    setRevealState("done");
    localStorage.setItem(storageKey, "true");
  };

  if (!isOnline) {
    // OFFLINE MODE: Judge Master Screen
    const story = language === 'ar' ? storyAr : storyEn;
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl overflow-y-auto pt-16 pb-32 px-gutter">
        <div className="fixed inset-0 grain-overlay pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center fade-in">
          <div className="text-center mb-8 border-b border-white/10 pb-6 w-full mt-8">
            <h2 className="font-display-lg text-primary text-3xl mb-2">{t("lobby.judgePlaceholder") || "Judge Master Screen"}</h2>
            <p className="font-label-caps text-on-surface-variant text-xs text-red-400">
              {t('character.threat_level') || "CONFIDENTIAL - EYES ONLY"}
            </p>
          </div>

          {/* Murder Case Story */}
          {story && (
            <div className="bg-surface-container-highest p-6 mb-8 border-l-4 border-red-500 relative overflow-hidden w-full text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>
               <h3 className="font-label-caps text-red-400 mb-4 opacity-80 uppercase tracking-widest border-b border-white/10 pb-2">
                 The Case Story
               </h3>
               <p className="font-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">
                 {story}
               </p>
            </div>
          )}

          <h3 className="font-headline-sm text-primary mb-4 w-full text-center">The Suspects</h3>
          
          <div className="w-full space-y-4">
            {characters.map((char) => {
              const charName = language === 'ar' ? char.nameAr : char.nameEn;
              const motiveStr = language === 'ar' ? char.motiveAr : char.motiveEn;
              const secretStr = language === 'ar' ? char.secretAr : char.secretEn;
              const secretLabel = language === 'ar' ? 'السر' : 'Secret';
              const motive = `${motiveStr}\n\n${secretLabel}: ${secretStr}`;
              const alibi = language === 'ar' ? char.alibiAr : char.alibiEn;
              const isExpanded = expandedChar === char.id;

              return (
                <div key={char.id} className="bg-surface-container border border-white/10 rounded-lg overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setExpandedChar(isExpanded ? null : char.id)}
                    className="w-full px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <span className="font-headline-sm text-xl text-on-surface">{charName}</span>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>
                      expand_more
                    </span>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-black/20 text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                      <div className="mb-4">
                        <h4 className="font-label-caps text-primary mb-1 opacity-70">{t('character.hidden_motive')}</h4>
                        <p className="font-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">{motive}</p>
                      </div>
                      <div>
                        <h4 className="font-label-caps text-on-surface-variant mb-1 opacity-70">{t('character.secret_alibi')}</h4>
                        <p className="font-body-lg text-on-surface leading-relaxed italic whitespace-pre-wrap">{alibi}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            onClick={handleFinish}
            className="mt-12 w-full py-4 bg-primary text-background font-label-caps tracking-widest rounded-md hover:brightness-110 transition-all font-bold"
          >
            {language === 'ar' ? 'بدء التحقيق' : 'Start Investigation'}
          </button>
        </div>
      </div>
    );
  }

  // ONLINE MODE: Original Reveal Flow
  let currentCharacter = characters[0];
  if (isOnline && playerId && players) {
    const player = players.find(p => p.id === playerId);
    if (player && player.characterId) {
      const charMatch = characters.find(c => c.id === player.characterId);
      if (charMatch) {
        currentCharacter = charMatch;
      }
    }
  }

  if (!currentCharacter) {
    setRevealState("done");
    return null;
  }

  const charName = language === 'ar' ? currentCharacter.nameAr : currentCharacter.nameEn;
  const motiveStr = language === 'ar' ? currentCharacter.motiveAr : currentCharacter.motiveEn;
  const secretStr = language === 'ar' ? currentCharacter.secretAr : currentCharacter.secretEn;
  const secretLabel = language === 'ar' ? 'السر' : 'Secret';
  const motive = `${motiveStr}\n\n${secretLabel}: ${secretStr}`;
  const alibi = language === 'ar' ? currentCharacter.alibiAr : currentCharacter.alibiEn;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center px-gutter">
      <div className="absolute inset-0 grain-overlay"></div>
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {revealState === "reveal" && (
          <div className="w-full space-y-8 fade-in">
            <div className="text-center mb-8 border-b border-white/10 pb-6">
              <h2 className="font-display-lg text-primary text-3xl mb-2">{charName}</h2>
              <p className="font-label-caps text-on-surface-variant text-xs text-red-400">
                {t('character.threat_level')}
              </p>
            </div>

            <div className={`transition-all duration-300 ${isHolding ? 'opacity-100 blur-none' : 'opacity-30 blur-sm select-none'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <div className="bg-surface-container p-6 border-l-4 border-primary mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 stamp-classified opacity-20 transform rotate-12 scale-150 -mt-4 -mr-4 pointer-events-none">TOP SECRET</div>
                <h3 className="font-label-caps text-primary mb-2 opacity-70">{t('character.hidden_motive')}</h3>
                <p className="font-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">
                  {motive}
                </p>
              </div>

              <div className="bg-surface-container p-6 border-l-4 border-on-surface-variant relative overflow-hidden">
                <h3 className="font-label-caps text-on-surface-variant mb-2 opacity-70">{t('character.secret_alibi')}</h3>
                <p className="font-body-lg text-on-surface leading-relaxed italic whitespace-pre-wrap">
                  {alibi}
                </p>
              </div>
            </div>

            <div className="pt-8 w-full flex flex-col gap-4">
              <button 
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className={`w-full py-4 font-label-caps tracking-widest transition-colors ${
                  isHolding 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-surface-container-highest text-on-surface hover:bg-white/10'
                }`}
              >
                {t('character.hold_reveal')}
              </button>

              <button 
                onClick={handleFinish}
                className="w-full py-3 text-sm border-b border-transparent text-on-surface-variant hover:text-white hover:border-white/30 transition-all font-label-caps"
              >
                Continue to Evidence
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
