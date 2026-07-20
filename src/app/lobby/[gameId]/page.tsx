"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function OnlineLobby({ params }: { params: { gameId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = searchParams.get("playerId");
  const { t } = useLanguage();
  
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [judgeId, setJudgeId] = useState<string>("");
  const [chatMessage, setChatMessage] = useState("");
  
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playerId) {
      router.push("/");
      return;
    }

    const fetchLobby = async () => {
      try {
        const res = await fetch(`/api/lobby?gameId=${params.gameId}`);
        const data = await res.json();
        if (data.success) {
          setGame(data.game);
          if (data.game.status !== 'SETUP') {
            router.push(`/evidence/${data.game.id}?playerId=${playerId}`);
          }
        }
      } catch (e) {
        console.error("Error fetching lobby", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLobby();
    const interval = setInterval(fetchLobby, 2000);
    return () => clearInterval(interval);
  }, [params.gameId, playerId, router]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [game?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    const msg = chatMessage;
    setChatMessage("");
    
    // Optimistic UI update
    const tempMsg = { id: Math.random().toString(), playerId, content: msg, player: game.players.find((p:any) => p.id === playerId) };
    setGame((prev:any) => ({ ...prev, messages: [...(prev.messages || []), tempMsg] }));
    
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ gameId: params.gameId, playerId, content: msg })
    });
  };

  const handleStartGame = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/start-online-game", {
        method: "POST",
        body: JSON.stringify({ gameId: params.gameId, judgeId: judgeId || null })
      });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to start game: " + data.error);
        setStarting(false);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
      setStarting(false);
    }
  };

  if (loading || !game) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;

  const currentPlayer = game.players.find((p: any) => p.id === playerId);
  const isHost = currentPlayer?.isHost;

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 md:p-8 flex flex-col md:flex-row gap-8">
      {/* LEFT COLUMN - Lobby Info */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-lg border border-white/10">
          <h2 className="text-primary font-label-caps tracking-widest text-sm mb-2">ONLINE LOBBY</h2>
          <h1 className="text-3xl font-headline-sm uppercase mb-4">Waiting for Agents</h1>
          
          <div className="bg-white/5 p-4 rounded-md border border-white/10 mb-6 flex justify-between items-center">
            <span className="text-on-surface-variant font-label-caps tracking-widest">JOIN CODE</span>
            <span className="text-3xl font-mono tracking-[0.3em] text-white select-all">{game.joinCode}</span>
          </div>

          <h3 className="text-xl font-headline-sm mb-4">Connected Players ({game.players.length})</h3>
          <ul className="space-y-2 mb-8">
            {game.players.map((p: any) => (
              <li key={p.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-md">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {p.playerName.charAt(0).toUpperCase()}
                </div>
                <span>{p.playerName} {p.id === playerId ? "(You)" : ""}</span>
                {p.isHost && <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-sm font-label-caps">HOST</span>}
              </li>
            ))}
          </ul>

          {isHost ? (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <label className="block text-sm text-on-surface-variant mb-2">Select Judge (Optional)</label>
                <select 
                  className="w-full bg-white/5 border border-white/20 rounded-md p-3 text-white outline-none"
                  value={judgeId}
                  onChange={(e) => setJudgeId(e.target.value)}
                >
                  <option value="">None (All players are suspects)</option>
                  {game.players.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.playerName}</option>
                  ))}
                </select>
                <p className="text-xs text-on-surface-variant mt-1">The Judge oversees the case and is NOT a suspect.</p>
              </div>
              <button 
                onClick={handleStartGame}
                disabled={starting || game.players.length < 3}
                className="w-full py-4 bg-primary text-background font-label-caps font-bold tracking-widest rounded-md hover:brightness-110 disabled:opacity-50"
              >
                {starting ? "GENERATING CASE..." : "START CASE"}
              </button>
              {game.players.length < 3 && <p className="text-xs text-center text-red-400">Need at least 3 players to start.</p>}
            </div>
          ) : (
            <div className="border-t border-white/10 pt-6 text-center animate-pulse text-on-surface-variant text-sm tracking-widest">
              WAITING FOR HOST TO START...
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN - Chat */}
      <div className="flex-1 md:max-w-sm flex flex-col h-[600px] md:h-[calc(100vh-4rem)] glass-panel border border-white/10 rounded-lg overflow-hidden">
        <div className="bg-black/40 p-4 border-b border-white/10 font-label-caps tracking-widest text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">chat</span>
          SECURE CHANNEL
        </div>
        
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {game.messages?.map((msg: any) => {
            const isMe = msg.playerId === playerId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-on-surface-variant mb-1 font-label-caps">{msg.player?.playerName}</span>
                <div className={`px-4 py-2 rounded-md max-w-[80%] ${isMe ? 'bg-primary text-background rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/10 flex gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-primary text-sm"
            placeholder="Type a message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button type="submit" className="bg-primary/20 text-primary p-2 rounded-md hover:bg-primary/30 transition-colors">
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
