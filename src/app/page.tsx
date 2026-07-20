"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";

export default function Lobby() {
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState(["8", "", "", ""]);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const router = useRouter();
  const { t, language } = useLanguage();

  const handleGenerateGame = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-game", { method: "POST", body: JSON.stringify({ playerCount: 4 }) });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API returned ${res.status}: ${text}`);
      }
      const data = await res.json();
      if (data.success) {
        router.push(`/evidence/${data.game.id}`);
      } else {
        alert("Failed to generate game: " + data.error);
      }
    } catch (e: any) {
      console.error(e);
      alert("An error occurred: " + e.message);
    }
    setLoading(false);
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newCode = [...accessCode];
    newCode[index] = value;
    setAccessCode(newCode);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !accessCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        <div className="absolute inset-0 grain-overlay"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-gutter h-16">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">timer</span>
          <h1 className="font-headline-sm text-headline-sm-mobile md:text-headline-sm text-primary uppercase tracking-widest">{t('lobby.title')}</h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <button className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-32 px-gutter max-w-[1200px] mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block px-3 py-1 bg-primary-container text-on-primary-container font-label-caps text-label-caps mb-4 rounded-sm tracking-widest">
            CRIME SCENE LOBBY
          </div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface uppercase tracking-tight">
            Case File <span className="text-primary italic">#0482</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto opacity-80">
            A masterpiece stolen. A curator missing. The lights are out, and the suspects are gathered in the foyer.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <section className="md:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-lg relative overflow-hidden">
              <div className="absolute -top-4 -right-4 stamp-rotate opacity-20 select-none">
                <div className="border-4 border-amber-600 text-amber-600 px-4 py-1 font-label-caps text-headline-sm uppercase tracking-tighter">CLASSIFIED</div>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-6 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">key</span>
                Enter Access Code
              </h3>
              <div className="flex gap-4 justify-between mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    className="w-16 h-20 text-center bg-white/5 border-b-2 border-white/20 font-display-lg text-display-lg-mobile focus:border-primary focus:outline-none transition-all rounded-t-sm"
                    maxLength={1}
                    type="text"
                    placeholder="•"
                    value={accessCode[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>
              <button 
                onClick={handleGenerateGame}
                disabled={loading}
                className="w-full py-4 bg-primary-container text-white font-label-caps text-label-caps tracking-widest hover:brightness-125 transition-all active:scale-[0.98] rounded-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "GENERATING CASE..." : "VALIDATE CREDENTIALS"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="hidden md:block transform -rotate-1 origin-top-left">
              <div className="bg-zinc-100 p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.4)] text-zinc-900 font-label-caps text-xs">
                <div className="border-b border-zinc-300 pb-2 mb-2 flex justify-between">
                  <span>NOTE TO SELF</span>
                  <span>11:42 PM</span>
                </div>
                <p className="leading-relaxed">Don't trust the Curator. I saw him with the master key near the North Wing just before the power cut. Keep your eyes on the shadows.</p>
                <div className="mt-4 flex gap-2">
                  <div className="w-2 h-2 bg-red-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="md:col-span-7 space-y-6">
            <div className="glass-panel rounded-lg overflow-hidden border-white/10 shadow-2xl">
              <div className="px-8 py-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">The Suspects</h3>
                <span className="font-label-caps text-label-caps text-primary">3 / 8 PLAYERS</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm border border-white/5 group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8TEiTfl3zIxUtUa0K8g9xR8KCvUxi723OSHyFT0JZEqx99W4AG-EzZNTBdBJkzZZz8pLz4M6ZLp_GNPtKYsUiHbAcu4bfmi7BO_YBevrSvYzawL_K2K-bLLxAajlQTp4urV63gjYl0L744xDw-v1wFMrKTGMJJuJsqwETVBvAeEwYCYkbAPSy478CxPH_xX58_sr3sprfS16SUK-nyGiIe4njT0UO1FsOjHILiPg5JIFL9DC89eQ0dw" alt="Curator" />
                    </div>
                    <div>
                      <p className="font-headline-sm text-[18px] text-on-surface">The Curator</p>
                      <p className="font-label-caps text-[10px] text-primary">ROOM HOST</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-label-caps text-label-caps text-green-500 uppercase">Ready</span>
                    <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm border border-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                      <img className="w-full h-full object-cover grayscale brightness-75" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArk0MHAvsTtmDsGLjySmxdJiUI11aPp1t4pprdiEhxi2bBWdG47LaFT12wYvt1jS9CMLcDErs-sjcOE5rK-F0bWiqJL-7fnikWBCZksZyS_1j24_k0enEURDcXSBgKkDl_zros0-0VyXeHQZ-6TXah_b_7EF84zM6u_DplfMSJoFbOqJ-Q01FxyfkMKkx3QUzYILvDUZZFsBwX12caLZ41m60x8fnNoRfCECGwUpRg-gnSuM6HyYz17w" alt="Architect" />
                    </div>
                    <div>
                      <p className="font-headline-sm text-[18px] text-on-surface">The Architect</p>
                      <p className="font-label-caps text-[10px] text-on-surface-variant">PLAYER</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Pending</span>
                    <button className="w-6 h-6 border-2 border-white/20 rounded-full flex items-center justify-center hover:border-primary transition-all active:scale-90">
                      <div className="w-2 h-2 bg-primary/0 rounded-full group-hover:bg-primary transition-all"></div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm border border-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                      <img className="w-full h-full object-cover grayscale brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA26XfFzx7w6DM1uletD57nANJShHGWec0N-l5DXVp6m7NO-KEDPYcWm9J5ZFL0pAn-n_k7hNrKbdMXHafAYbtLV3BbtO4ZW4o-nEosa2dXL5S3S-TtVlBKnUv76Lb1S5QoKWmRlkpNRnB0OyqJLN_J4aErBLua-jvRMf8UloVZANKjXzhuQYtK9KWvYesNdSE996Z-JBhOcvb4M--pxWo1kyiR2y2-yiyyMTOxXRoL37R6rkGahcXVzw" alt="Night Watchman" />
                    </div>
                    <div>
                      <p className="font-headline-sm text-[18px] text-on-surface">The Night Watchman</p>
                      <p className="font-label-caps text-[10px] text-on-surface-variant">YOU</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" value="" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                    <span className="ml-3 font-label-caps text-label-caps text-on-surface-variant peer-checked:text-primary">TOGGLE READY</span>
                  </label>
                </div>
              </div>
              <div className="p-8 border-t border-white/5 bg-black/20 flex flex-wrap gap-4 overflow-hidden">
                <div className="w-24 h-28 bg-zinc-200 p-1 shadow-lg transform -rotate-6 flex flex-col">
                  <div className="flex-grow bg-zinc-800 overflow-hidden">
                    <img className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0UQ8pzs_6OPuTPZY54SmpRjf-to3qekXav7lGiXrozNvWR_Gv2uFOH7-obP_93zrPNnTfajYYaYBfD6uDsUkbZjXuQvF8puBjioMEHi8kMSExhehFEiFoRWChsAkP1fKoyHtykUNSI9TkDUoRmUurkKdnbCv3krzQXtcW8gADU822aw9GNEx6k8uW-8o-y1A-8TQAJbg5uFjnSUGh4zsGmNQMeo3XweFXAuX38qafvXvuodgirzlryg" alt="Evidence 1" />
                  </div>
                  <div className="h-6 flex items-center justify-center">
                    <span className="text-[8px] font-label-caps text-zinc-600">EV-01</span>
                  </div>
                </div>
                <div className="w-24 h-28 bg-zinc-200 p-1 shadow-lg transform rotate-3 flex flex-col">
                  <div className="flex-grow bg-zinc-800 overflow-hidden">
                    <img className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpvswNQZCN0nLlyEd2XQmtGov4KUC_XgDKFunD7_lhNRf3fEwGm6DSlpYdKpPxby-qz3dFEM2uLSD3P0festWvEsFTMnvQrFj2OuCbN0QwSnsNpbitA_ElX6iNU2ZKUUIhleiEo0K5pybPmjiNcbAD2wVetWr-fSpRYUTtSuI-1tKyFT4eobAKZR9ub5J7SjRuBzUUp4yUoJvUwMaELpwP39arIBgOF1h_hAWT4YVDPCgzpMUh7pmWVQ" alt="Evidence 2" />
                  </div>
                  <div className="h-6 flex items-center justify-center">
                    <span className="text-[8px] font-label-caps text-zinc-600">CR-88</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-[0.2em] animate-pulse">Waiting for host to initiate the investigation...</p>
          <div className="flex gap-4">
            <button className="px-8 py-3 glass-panel text-white font-label-caps text-label-caps tracking-widest hover:bg-white/10 transition-all rounded-sm">
              VIEW RULES
            </button>
            <button 
              onClick={handleGenerateGame}
              disabled={loading}
              className="px-8 py-3 bg-white text-background font-label-caps text-label-caps tracking-widest hover:bg-primary-fixed transition-all active:scale-95 rounded-sm disabled:opacity-50"
            >
              START CASE
            </button>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full z-50 bg-surface-container/60 backdrop-blur-lg border-t border-white/10 flex justify-around items-center h-20 px-4 pb-safe shadow-2xl">
        <a className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 transition-all" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
          <span className="font-label-caps text-[10px]">Lobby</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-white/5 transition-colors p-2 rounded-full" href="#">
          <span className="material-symbols-outlined">person_search</span>
          <span className="font-label-caps text-[10px]">Dashboard</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-white/5 transition-colors p-2 rounded-full" href="#">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-caps text-[10px]">Evidence</span>
        </a>
      </nav>
    </>
  );
}
