import React, { useState } from "react";
import { Pokemon, CORES_HEX } from "../types";
import { 
  Trophy, Search, Plus, Trash2, ArrowUp, ArrowDown, User 
} from "lucide-react";
import { motion } from "motion/react";

// Helper function to dynamically retrieve official animated Generation V front sprites from pokeapi raw assets
const getAnimatedSprite = (id: number, isShiny: boolean, fallbackUrl: string): string => {
  if (id > 0 && id <= 649) {
    if (isShiny) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  }
  return fallbackUrl;
};

interface PokebagViewProps {
  battleTeam: Pokemon[];
  pokebag: Pokemon[];
  isShinyMaster: boolean;
  onClearTeam: () => void;
  onShiftTeamOrder: (index: number, direction: "up" | "down") => void;
  onRemoveFromTeam: (id: number) => void;
  onAddToTeam: (pkmn: Pokemon) => void;
  onReleasePokemon: (id: number) => void;
}

export function PokebagView({
  battleTeam,
  pokebag,
  isShinyMaster,
  onClearTeam,
  onShiftTeamOrder,
  onRemoveFromTeam,
  onAddToTeam,
  onReleasePokemon,
}: PokebagViewProps) {
  const [pokebagSearchQuery, setPokebagSearchQuery] = useState<string>("");

  return (
    <div className="px-6 md:px-12 pt-8 flex-1 flex flex-col gap-8 mb-12 animate-fade-in">
      
      {/* HERO MODULE BANNER */}
      <div className="relative rounded-2xl bg-white/[0.01] border border-white/10 p-6 md:p-10 flex flex-col justify-end overflow-hidden min-h-[160px]">
        <div className="absolute top-0 right-0 text-[140px] md:text-[200px] font-black leading-none opacity-[0.02] select-none translate-x-12 translate-y-3 uppercase pointer-events-none italic font-mono">
          POKEBAG
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-emerald-400" />
            <span className="text-emerald-400 font-mono text-[10px] tracking-[0.25em] font-extrabold uppercase flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> MEU TIME & POKEBAG DE CAPTURAS
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter uppercase italic text-white">
            TIME & POKEBAG DE CAPTURAS
          </h1>
          <p className="mt-3 text-xs md:text-sm text-zinc-400 leading-relaxed">
            Visualize os espécimes capturados em seu acervo e organize a ordem tática de seu time de batalha prioritário para os confrontos ativos da liga.
          </p>
        </div>
      </div>

      {/* SECTION 1: TIME RESPECTIVO (BATTLE TEAM) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-black uppercase text-white tracking-[0.2em]">
                TIME DE BATALHA COM COMBATE EM ORDEM ({battleTeam.length} de 6)
              </h3>
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Defina a sua ordem estratégica priorizada para os confrontos ativos da liga.</p>
          </div>

          {battleTeam.length > 0 && (
            <button 
              onClick={onClearTeam}
              className="text-[9px] font-mono uppercase bg-red-650/10 hover:bg-red-600 hover:text-white border border-red-500/20 px-3 py-1.5 text-red-400 transition-all cursor-pointer rounded-sm"
            >
              Esvaziar Time Recrutado
            </button>
          )}
        </div>

        {battleTeam.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl py-12 flex flex-col items-center text-center justify-center bg-white/[0.005]">
            <Trophy className="w-10 h-10 text-zinc-650 mb-3" />
            <h4 className="text-xs font-black uppercase text-zinc-450 tracking-wider">TIME DE COMBATE LIVRE</h4>
            <p className="text-[11px] font-mono text-zinc-550 mt-1 max-w-sm px-6">
              Seu time de batalha regulamentar está sem membros. Recrute pokémons de sua Pokebag abaixo ou capte novas espécies no Biometrics Hub.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {battleTeam.map((poke, index) => {
              const primaryType = poke.tipos[0]?.toLowerCase() || "normal";
              const hexColor = CORES_HEX[primaryType] || CORES_HEX.normal;
              
              return (
                <motion.div
                  layout
                  key={`web-team-${poke.id}`}
                  className="bg-white/[0.01] border border-white/10 p-4 rounded-xl flex items-center relative gap-3 group transition-all duration-300 hover:border-white/20"
                >
                  {/* Order Ribbon side badge */}
                  <div 
                    className="h-full absolute left-0 top-0 w-1.5 rounded-l-xl"
                    style={{ backgroundColor: hexColor }}
                  />

                  {/* Large battle order */}
                  <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 w-10 h-10 rounded font-black font-mono">
                    <span className="text-xs text-amber-400">{index + 1}º</span>
                    <span className="text-[6px] tracking-tighter uppercase text-zinc-550">Bat.</span>
                  </div>

                  {/* Pokemon Mini sprite - Animated */}
                  <div className="relative flex items-center justify-center w-14 h-14 shrink-0 transition-transform duration-300 group-hover:scale-120 group-hover:rotate-3">
                    <div 
                      className="absolute inset-[15%] rounded-full opacity-20 blur-md group-hover:opacity-45 transition-opacity" 
                      style={{ backgroundColor: hexColor }}
                    />
                    <img 
                      src={getAnimatedSprite(poke.id, isShinyMaster, isShinyMaster ? poke.imagemShiny : poke.imagem)} 
                      alt={poke.nome} 
                      className="w-11 h-11 object-contain relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black uppercase text-white tracking-widest truncate">{poke.nome}</h4>
                    <div className="flex gap-1.5 mt-1">
                      {poke.tipos.map(t => (
                        <span 
                          key={t} 
                          className="px-1.5 py-0.5 rounded-sm text-[7.5px] font-extrabold uppercase tracking-wide"
                          style={{ backgroundColor: `${CORES_HEX[t]}20`, color: CORES_HEX[t] }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Swapping orders and remove control */}
                  <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                    <div className="flex gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => onShiftTeamOrder(index, "up")}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 border border-white/5 text-white transition-all cursor-pointer"
                        title="Subir Posição"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        disabled={index === battleTeam.length - 1}
                        onClick={() => onShiftTeamOrder(index, "down")}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 border border-white/5 text-white transition-all cursor-pointer"
                        title="Descer Posição"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => onRemoveFromTeam(poke.id)}
                      className="w-full flex items-center justify-center gap-1 mt-1 bg-red-650/10 hover:bg-red-500 hover:text-black py-0.5 rounded text-[8px] font-black border border-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Remover do Time"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>DELETAR DO TIME</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
            
            {/* Slots restants overlay to showcase full 6 count structure */}
            {Array.from({ length: 6 - battleTeam.length }).map((_, i) => (
              <div 
                key={`slot-empty-${i}`}
                className="border border-dashed border-white/5 rounded-xl p-4 flex items-center justify-center h-[76px] bg-white/[0.002] opacity-40"
              >
                <span className="text-[9px] font-mono text-zinc-650 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <Plus className="w-3 h-3 text-zinc-700" /> SLOT DE COMBATE DECOY {battleTeam.length + i + 1}º
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: POKEBAG DRAWER STORAGE */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-3 gap-3">
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-[0.2em]">
              MINHA POKEBAG DE INVENTÁRIO ({pokebag.length})
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Clique em "Integrar ao Time" para habilitar o combatente ou configure a sua Pokebag.</p>
          </div>

          {/* Pokebag Filter Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
            <input
              type="text"
              value={pokebagSearchQuery}
              onChange={(e) => setPokebagSearchQuery(e.target.value)}
              placeholder="BUSCAR EM MEU ARCEVO..."
              className="w-full pl-9 pr-10 py-1.5 bg-[#0E0E0B] border border-white/10 rounded-md text-[9px] font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-400 text-[#F5F5F5] placeholder-zinc-650 transition-all uppercase"
            />
            {pokebagSearchQuery && (
              <button 
                onClick={() => setPokebagSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-red-500 font-mono"
              >
                APAGAR
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Pokebag items render */}
        {pokebag.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl py-12 flex flex-col items-center text-center justify-center bg-white/[0.005]">
            <User className="w-10 h-10 text-zinc-650 mb-3" />
            <h4 className="text-xs font-black uppercase text-zinc-450 tracking-wider">BAG TOTALMENTE VAZIA</h4>
            <p className="text-[11px] font-mono text-zinc-550 mt-1 max-w-sm px-6">
              Você ainda não capturou nenhum pokémon para registrar em sua bag oficial. Visite as espécies e clique no botão de captura.
            </p>
          </div>
        ) : (
          (() => {
            const filteredBag = pokebag.filter(p => p.nome.toLowerCase().includes(pokebagSearchQuery.toLowerCase()));
            
            if (filteredBag.length === 0) {
              return (
                <div className="py-8 text-center text-[10px] text-zinc-500 uppercase font-mono tracking-widest">
                  Nenhum espécime correspondente localizado em sua bag de suporte.
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredBag.map((poke) => {
                  const inTeam = battleTeam.some(p => p.id === poke.id);
                  const primaryType = poke.tipos[0]?.toLowerCase() || "normal";
                  const hexColor = CORES_HEX[primaryType] || CORES_HEX.normal;

                  return (
                    <div 
                      key={`pokebag-item-${poke.id}`}
                      className="bg-zinc-950 border border-white/5 hover:border-white/10 rounded-xl p-3 relative flex flex-col items-center text-center transition-all duration-300 group"
                    >
                      {/* Pokemon Mini sprite - Animated */}
                      <div className="relative flex items-center justify-center w-16 h-16 shrink-0 mb-2 transition-all duration-300 group-hover:scale-120 group-hover:rotate-3">
                        <div 
                          className="absolute inset-[12%] rounded-full opacity-10 blur-sm group-hover:opacity-40 transition-opacity" 
                          style={{ backgroundColor: hexColor }}
                        />
                        <img 
                          src={getAnimatedSprite(poke.id, isShinyMaster, isShinyMaster ? poke.imagemShiny : poke.imagem)} 
                          alt={poke.nome} 
                          className="w-12 h-12 object-contain relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                        />
                      </div>
                      
                      <span className="text-[9px] font-mono text-zinc-500">NO. {poke.index}</span>
                      <h4 className="text-xs font-black uppercase text-zinc-200 mt-0.5 truncate max-w-full">{poke.nome}</h4>

                      <div className="flex justify-center gap-1 mt-1">
                        {poke.tipos.map(t => (
                          <span 
                            key={t}
                            className="px-1 py-0.5 rounded-sm text-[6px] font-extrabold uppercase font-mono"
                            style={{ backgroundColor: `${CORES_HEX[t]}20`, color: CORES_HEX[t] }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Options to recruit or release */}
                      <div className="w-full mt-4 space-y-1">
                        {inTeam ? (
                          <>
                            <div className="w-full py-1 text-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 rounded text-[7.5px] font-black uppercase font-mono tracking-wider">
                              ✓ RECRUTADO NO TIME
                            </div>
                            <button
                              onClick={() => onRemoveFromTeam(poke.id)}
                              className="w-full py-1 bg-red-650/10 hover:bg-red-500 hover:text-black text-red-500 border border-red-500/20 hover:border-transparent rounded text-[8px] font-black uppercase font-mono tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1"
                              title="Deletar o pokémon do time"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              <span>DELETAR DO TIME</span>
                            </button>
                          </>
                        ) : (
                          <button
                            disabled={battleTeam.length >= 6}
                            onClick={() => onAddToTeam(poke)}
                            className="w-full py-1 bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-not-allowed rounded text-[8px] font-black uppercase font-mono tracking-wider cursor-pointer transition-all"
                          >
                            INTEGRAR AO TIME
                          </button>
                        )}
                        
                        <button
                          onClick={() => onReleasePokemon(poke.id)}
                          className="w-full py-1 text-[8px] font-black text-red-400 font-mono tracking-wider hover:bg-red-550/10 hover:text-white rounded border border-transparent hover:border-red-550/10 cursor-pointer transition-all"
                        >
                          RELEASAR À SELVA
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}
      </div>

    </div>
  );
}
