"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClientDossier({ character }: { character: any }) {
  const [activeTab, setActiveTab] = useState<'public' | 'motive' | 'alibi'>('public');

  return (
    <>
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-gutter h-16">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">timer</span>
          <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest">{character.game?.title || "A Crime at the Closed Gallery"}</span>
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="relative z-10 pt-24 pb-32 px-container-padding max-w-[1200px] mx-auto">
        {/* Case Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-l-4 border-primary-container pl-6">
          <div>
            <span className="font-label-caps text-label-caps text-primary mb-2 block">Dossier #{character.id.substring(0,8).toUpperCase()}</span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight">{character.name}</h1>
            <p className="font-body-lg text-on-surface-variant mt-2 max-w-2xl">A key person of interest in the current investigation.</p>
          </div>
          <div className="bg-primary-container/10 border border-primary-container/20 px-4 py-2 rounded-lg backdrop-blur-md">
            <span className="font-label-caps text-label-caps text-primary">Threat Level: RED</span>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Side Profile */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="paper-clip"></div>
              <div className="bg-on-surface p-4 pb-12 shadow-[8px_8px_0px_rgba(0,0,0,0.4)] relative">
                <div className="w-full aspect-square bg-surface-container-highest overflow-hidden relative">
                   <div className="w-full h-full bg-zinc-800 flex items-center justify-center filter grayscale contrast-125">
                       <span className="material-symbols-outlined text-6xl text-zinc-600">person</span>
                   </div>
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                </div>
                <div className="mt-4">
                  <p className="font-label-caps text-background text-[14px] leading-tight uppercase">SUBJECT: {character.name}</p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stamp-top-secret px-6 py-2 border-4 border-double border-secondary-container font-headline-md text-headline-md uppercase tracking-tighter pointer-events-none whitespace-nowrap">
                  TOP SECRET
                </div>
              </div>
            </div>

            {/* Forensic Stats */}
            <div className="bg-surface-container/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg space-y-4">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant border-b border-white/5 pb-2">Investigative Notes</h3>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Status</span>
                <span className="font-label-caps text-primary">Active Suspect</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Risk Factor</span>
                <span className="font-label-caps text-secondary-container text-xs">HIGH PRIORITY</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-low/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('public')}
                  className={`flex-1 py-4 font-label-caps text-label-caps transition-all ${activeTab === 'public' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Public Profile
                </button>
                <button 
                  onClick={() => setActiveTab('motive')}
                  className={`flex-1 py-4 font-label-caps text-label-caps transition-all ${activeTab === 'motive' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Hidden Motive
                </button>
                <button 
                  onClick={() => setActiveTab('alibi')}
                  className={`flex-1 py-4 font-label-caps text-label-caps transition-all ${activeTab === 'alibi' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Secret Alibi
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8 min-h-[300px]">
                
                {/* Public Profile */}
                {activeTab === 'public' && (
                  <div className="space-y-6">
                    <div className="prose prose-invert max-w-none">
                      <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Identity File</h2>
                      <p className="font-body-lg text-on-surface-variant leading-relaxed">
                        No public record anomalies detected. Subject {character.name} is known to associate with the current incident.
                      </p>
                    </div>
                  </div>
                )}

                {/* Motive */}
                {activeTab === 'motive' && (
                  <div className="space-y-6 animate-pulse-once">
                    <div className="relative">
                      <div className="absolute -top-4 -right-4 bg-primary-container text-white text-[10px] px-2 py-1 rotate-12 font-label-caps">CLASSIFIED</div>
                      <div className="p-6 bg-background/80 border-2 border-primary-container border-dashed rounded-lg">
                        <h2 className="font-headline-md text-headline-md text-primary mb-4 uppercase tracking-tighter">The Hidden Motive</h2>
                        <div className="space-y-4">
                          <p className="font-body-md text-on-surface-variant border-l-2 border-primary-container pl-4">
                            {character.motive}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alibi */}
                {activeTab === 'alibi' && (
                  <div className="space-y-6">
                    <div className="bg-zinc-100 text-zinc-900 p-8 relative torn-edge shadow-xl transform rotate-1">
                      <div className="absolute top-2 right-2 text-zinc-400">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
                      </div>
                      <h3 className="font-label-caps text-zinc-500 mb-4">STATEMENT - FOUND ON SITE</h3>
                      <div className="space-y-4 font-body-lg">
                        <p className="border-b border-zinc-300 pb-2">{character.alibi}</p>
                        <p className="border-b border-zinc-300 pb-2 text-red-900">Secret: {character.secret}</p>
                      </div>
                      <div className="mt-6 text-xs font-mono uppercase text-zinc-400">
                        Forensic Lab Status: <span className="text-error-container">UNVERIFIED</span>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href={`/evidence/${character.gameId}`} className="flex-1 bg-transparent border border-white/20 hover:bg-white/5 text-on-surface font-label-caps py-4 rounded transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">inventory_2</span>
                RETURN TO EVIDENCE LOG
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface-container/60 backdrop-blur-lg border-t border-white/10 flex justify-around items-center h-20 px-4 pb-safe shadow-2xl md:hidden">
        <Link href="/" className="flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">groups</span>
          <span className="font-label-caps text-label-caps mt-1">Lobby</span>
        </Link>
        <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
          <span className="font-label-caps text-label-caps mt-1">Dashboard</span>
        </div>
        <Link href={`/evidence/${character.gameId}`} className="flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-caps text-label-caps mt-1">Evidence</span>
        </Link>
      </nav>
    </>
  );
}
