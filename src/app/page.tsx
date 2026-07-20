"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";

type ViewState = "MAIN" | "OFFLINE_SETUP" | "ONLINE_HOST" | "ONLINE_JOIN";

export default function Lobby() {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewState>("MAIN");
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", ""]);
  const [joinCode, setJoinCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();
  const { t, language } = useLanguage();

  const handleAddPlayer = () => setPlayerNames([...playerNames, ""]);
  const handleRemovePlayer = (i: number) => {
    const updated = [...playerNames];
    updated.splice(i, 1);
    setPlayerNames(updated);
  };
  
  const handleNameChange = (i: number, val: string) => {
    const updated = [...playerNames];
    updated[i] = val;
    setPlayerNames(updated);
  };

  const startOfflineGame = async () => {
    const validNames = playerNames.filter(n => n.trim() !== "");
    if (validNames.length < 3) {
      alert(t("lobby.minPlayers") || "Minimum 3 players required.");
      return;
    }
    setLoading(true);
    try {
      const judgeName = validNames.length > 0 ? validNames[0] : null;
      const res = await fetch("/api/generate-game", { 
        method: "POST", 
        body: JSON.stringify({ playerNames: validNames, judgeName, mode: "OFFLINE" }) 
      });
      if (!res.ok) throw new Error(await res.text());
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

  const hostOnlineGame = async () => {
    if (!playerName.trim()) return alert(t("lobby.enterName") || "Enter your name");
    setLoading(true);
    try {
      // Create empty lobby
      const res = await fetch("/api/create-lobby", {
        method: "POST",
        body: JSON.stringify({ hostName: playerName, mode: "ONLINE" })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.success) {
        router.push(`/lobby/${data.game.id}?playerId=${data.player.id}`);
      } else {
        alert("Failed to create lobby: " + data.error);
      }
    } catch (e: any) {
      console.error(e);
      alert("An error occurred: " + e.message);
    }
    setLoading(false);
  };

  const joinOnlineGame = async () => {
    if (!playerName.trim()) return alert(t("lobby.enterName") || "Enter your name");
    if (!joinCode.trim()) return alert(t("lobby.enterCode") || "Enter join code");
    setLoading(true);
    try {
      const res = await fetch("/api/join-lobby", {
        method: "POST",
        body: JSON.stringify({ playerName, joinCode })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.success) {
        router.push(`/lobby/${data.game.id}?playerId=${data.player.id}`);
      } else {
        alert("Failed to join lobby: " + data.error);
      }
    } catch (e: any) {
      console.error(e);
      alert("An error occurred: " + e.message);
    }
    setLoading(false);
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
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-32 px-gutter max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block px-3 py-1 bg-primary-container text-on-primary-container font-label-caps text-label-caps mb-4 rounded-sm tracking-widest">
            {t("lobby.subtitle") || "CRIME SCENE LOBBY"}
          </div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface uppercase tracking-tight">
            {t("lobby.mainHeading") || "Choose Game Mode"}
          </h2>
        </div>

        <div className="w-full glass-panel p-8 rounded-lg">
          {view === "MAIN" && (
            <div className="flex flex-col gap-4">
              <button onClick={() => setView("OFFLINE_SETUP")} className="p-6 border border-white/10 rounded-lg hover:border-primary transition-all flex flex-col items-center text-center group">
                <span className="material-symbols-outlined text-4xl mb-2 text-white/50 group-hover:text-primary transition-colors">group</span>
                <h3 className="font-headline-sm text-xl mb-1">{t("lobby.offlineMode") || "Play Offline (Local)"}</h3>
                <p className="text-sm text-on-surface-variant">{t("lobby.offlineDesc")}</p>
              </button>
              <button onClick={() => setView("ONLINE_HOST")} className="p-6 border border-white/10 rounded-lg hover:border-primary transition-all flex flex-col items-center text-center group">
                <span className="material-symbols-outlined text-4xl mb-2 text-white/50 group-hover:text-primary transition-colors">public</span>
                <h3 className="font-headline-sm text-xl mb-1">{t("lobby.hostOnline") || "Host Online Game"}</h3>
                <p className="text-sm text-on-surface-variant">{t("lobby.hostDesc")}</p>
              </button>
              <button onClick={() => setView("ONLINE_JOIN")} className="p-6 border border-white/10 rounded-lg hover:border-primary transition-all flex flex-col items-center text-center group">
                <span className="material-symbols-outlined text-4xl mb-2 text-white/50 group-hover:text-primary transition-colors">login</span>
                <h3 className="font-headline-sm text-xl mb-1">{t("lobby.joinOnline") || "Join Online Game"}</h3>
                <p className="text-sm text-on-surface-variant">{t("lobby.joinDesc")}</p>
              </button>
            </div>
          )}

          {view === "OFFLINE_SETUP" && (
            <div className="flex flex-col gap-6">
              <button onClick={() => setView("MAIN")} className="text-primary self-start flex items-center text-sm font-label-caps uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm mr-1">arrow_back</span> {t("lobby.back")}
              </button>
              <h3 className="font-headline-sm text-2xl border-b border-white/10 pb-4">{t("lobby.enterPlayerNames")}</h3>
              {playerNames.map((name, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="flex-grow relative">
                    {i === 0 && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-sm">
                        gavel
                      </span>
                    )}
                    <input
                      className={`w-full p-3 ${i === 0 ? 'pl-9 bg-primary/10 border-primary' : 'bg-white/5 border-white/20'} border rounded-md focus:border-primary outline-none transition-colors`}
                      placeholder={i === 0 ? (t("lobby.judgePlaceholder") || "Judge Name") : `${t("lobby.playerPlaceholder")} ${i}`}
                      value={name}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                    />
                  </div>
                  {playerNames.length > 3 && i !== 0 && (
                    <button onClick={() => handleRemovePlayer(i)} className="text-red-400 hover:text-red-300">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              ))}
              <button onClick={handleAddPlayer} className="text-primary hover:underline self-start">{t("lobby.addPlayer")}</button>
              <button 
                onClick={startOfflineGame}
                disabled={loading}
                className="mt-6 w-full py-4 bg-primary text-background font-label-caps font-bold tracking-widest rounded-md hover:brightness-110 disabled:opacity-50"
              >
                {loading ? t("lobby.generatingCase") : t("lobby.startOfflineGame")}
              </button>
            </div>
          )}

          {(view === "ONLINE_HOST" || view === "ONLINE_JOIN") && (
            <div className="flex flex-col gap-6">
               <button onClick={() => setView("MAIN")} className="text-primary self-start flex items-center text-sm font-label-caps uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm mr-1">arrow_back</span> {t("lobby.back")}
              </button>
              <h3 className="font-headline-sm text-2xl border-b border-white/10 pb-4">
                {view === "ONLINE_HOST" ? t("lobby.hostGameTitle") : t("lobby.joinGameTitle")}
              </h3>
              <div>
                <label className="block text-sm text-on-surface-variant mb-2">{t("lobby.yourNameLabel")}</label>
                <input
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:border-primary outline-none"
                  placeholder="e.g. John Doe"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>
              {view === "ONLINE_JOIN" && (
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">{t("lobby.joinCodeLabel")}</label>
                  <input
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:border-primary outline-none uppercase"
                    placeholder={t("lobby.joinCodePlaceholder")}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                  />
                </div>
              )}
              <button 
                onClick={view === "ONLINE_HOST" ? hostOnlineGame : joinOnlineGame}
                disabled={loading}
                className="mt-6 w-full py-4 bg-primary text-background font-label-caps font-bold tracking-widest rounded-md hover:brightness-110 disabled:opacity-50"
              >
                {loading ? t("lobby.processing") : view === "ONLINE_HOST" ? t("lobby.createLobbyBtn") : t("lobby.joinLobbyBtn")}
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
