"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";

interface Character {
  id: string;
  nameEn: string;
  nameAr: string;
  secretMotiveEn: string;
  secretMotiveAr: string;
  secretAlibiEn: string;
  secretAlibiAr: string;
}

interface PassAndPlayFlowProps {
  gameId: string;
  characters: Character[];
}

export default function PassAndPlayFlow({ gameId, characters }: PassAndPlayFlowProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [revealState, setRevealState] = useState<"pass" | "reveal" | "done">("pass");
  const [isHolding, setIsHolding] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Check if this game's flow has already been completed in this session
    const completed = localStorage.getItem(`pass-flow-done-${gameId}`);
    if (completed) {
      setRevealState("done");
    }
  }, [gameId]);

  if (revealState === "done") return null;

  const currentCharacter = characters[currentPlayerIndex];
  const charName = language === 'ar' ? currentCharacter.nameAr : currentCharacter.nameEn;
  const motive = language === 'ar' ? currentCharacter.secretMotiveAr : currentCharacter.secretMotiveEn;
  const alibi = language === 'ar' ? currentCharacter.secretAlibiAr : currentCharacter.secretAlibiEn;

  const handleNext = () => {
    if (currentPlayerIndex < characters.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
      setRevealState("pass");
      setIsHolding(false);
    } else {
      setRevealState("done");
      localStorage.setItem(`pass-flow-done-${gameId}`, "true");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center px-gutter">
      <div className="absolute inset-0 grain-overlay"></div>
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {revealState === "pass" && (
          <div className="text-center space-y-8 fade-in">
            <span className="material-symbols-outlined text-6xl text-primary animate-pulse">
              screen_share
            </span>
            <div className="space-y-4">
              <p className="font-label-caps text-on-surface-variant tracking-[0.2em] uppercase">
                {t('character.pass_device')}
              </p>
              <h2 className="font-display-lg text-primary text-4xl">
                {charName}
              </h2>
            </div>
            
            <button 
              onClick={() => setRevealState("reveal")}
              className="mt-12 w-full py-4 border border-primary text-primary font-label-caps tracking-widest hover:bg-primary/10 transition-colors"
            >
              {t('character.i_am')} {charName}
            </button>
          </div>
        )}

        {revealState === "reveal" && (
          <div className="w-full space-y-8 fade-in">
            <div className="text-center mb-8 border-b border-white/10 pb-6">
              <h2 className="font-display-lg text-primary text-3xl mb-2">{charName}</h2>
              <p className="font-label-caps text-on-surface-variant text-xs text-red-400">
                {t('character.threat_level')}
              </p>
            </div>

            <div className={`transition-all duration-300 ${isHolding ? 'opacity-100 blur-none' : 'opacity-30 blur-sm select-none'}`}>
              <div className="bg-surface-container p-6 border-l-4 border-primary mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 stamp-classified opacity-20 transform rotate-12 scale-150 -mt-4 -mr-4 pointer-events-none">TOP SECRET</div>
                <h3 className="font-label-caps text-primary mb-2 opacity-70">{t('character.hidden_motive')}</h3>
                <p className="font-body-lg text-on-surface leading-relaxed">
                  {motive}
                </p>
              </div>

              <div className="bg-surface-container p-6 border-l-4 border-on-surface-variant relative overflow-hidden">
                <h3 className="font-label-caps text-on-surface-variant mb-2 opacity-70">{t('character.secret_alibi')}</h3>
                <p className="font-body-lg text-on-surface leading-relaxed italic">
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
                onClick={handleNext}
                className="w-full py-3 text-sm border-b border-transparent text-on-surface-variant hover:text-white hover:border-white/30 transition-all font-label-caps"
              >
                Hide & Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
