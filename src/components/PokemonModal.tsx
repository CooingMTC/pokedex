import { Pokemon, CORES_TIPOS, CORES_HEX } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, Ruler, Weight, Flame, Shield, Heart, Zap, Swords, Trophy, Sparkles } from "lucide-react";

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isShiny: boolean;
  onToggleShiny: () => void;
  onClose: () => void;
  isCaught?: boolean;
  onCatch?: (pokemon: Pokemon) => void;
}

export function PokemonModal({ pokemon, isShiny, onToggleShiny, onClose, isCaught, onCatch }: PokemonModalProps) {
  if (!pokemon) return null;

  const primaryType = pokemon.tipos[0]?.toLowerCase() || "normal";
  const hexColor = CORES_HEX[primaryType] || CORES_HEX.normal;
  const typeStyle = CORES_TIPOS[primaryType] || CORES_TIPOS.normal;

  // Map stat names to user friendly labels, maximum benchmarks, and styled icons
  const STAT_CONFIGS: Record<string, { label: string; max: number; icon: any; color: string }> = {
    hp: { label: "HP / Vida", max: 250, icon: Heart, color: "bg-emerald-500" },
    attack: { label: "Ataque", max: 190, icon: Swords, color: "bg-red-500" },
    defense: { label: "Defesa", max: 230, icon: Shield, color: "bg-blue-400" },
    "special-attack": { label: "Atq. Especial", max: 194, icon: Flame, color: "bg-purple-500" },
    "special-defense": { label: "Def. Especial", max: 230, icon: Shield, color: "bg-indigo-400" },
    speed: { label: "Velocidade", max: 180, icon: Zap, color: "bg-amber-400" },
  };

  const getStatConfig = (name: string) => {
    const formatted = name.toLowerCase();
    if (STAT_CONFIGS[formatted]) return STAT_CONFIGS[formatted];
    if (formatted.includes("special-attack")) return STAT_CONFIGS["special-attack"];
    if (formatted.includes("special-defense")) return STAT_CONFIGS["special-defense"];
    return { label: name.toUpperCase(), max: 200, icon: Trophy, color: "bg-zinc-400" };
  };

  // Calculate sum of stats
  const totalStats = pokemon.poderes.reduce((acc, curr) => acc + curr.forca, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
        />

        {/* Modal Sheet Container styled in Artistic Flair Dark theme */}
        <motion.div
          layoutId={`card-container-${pokemon.id}`}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-[#0F0F0B] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header Banner - Sleek High Contrast Gradient background */}
          <div 
            className="h-32 relative flex items-end justify-center pb-2 overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${hexColor}40, ${hexColor}08)` 
            }}
          >
            {/* OVERSIZED BACKGROUND TEXT ELEMENT */}
            <div className="absolute top-0 right-0 text-[140px] font-black leading-none opacity-[0.03] select-none translate-x-12 translate-y-2 pointer-events-none uppercase italic">
              {primaryType}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/5 hover:bg-white/15 dark:bg-black/40 hover:text-white transition-colors p-2 rounded-full text-zinc-300 border border-white/10"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ID Badge */}
            <span className="absolute top-4 left-4 bg-black/40 border border-white/10 text-zinc-300 px-3 py-1 rounded-sm font-mono text-[10px] font-bold tracking-[0.15em]">
              NO. {pokemon.id.toString().padStart(3, "0")}
            </span>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-8 pt-14 relative no-scrollbar">
            {/* Floating Pokémon Image above the container */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 flex flex-col items-center select-none pointer-events-none">
              <motion.img
                initial={{ transform: "scale(0.8) translateY(15px)", opacity: 0 }}
                animate={{ transform: "scale(1) translateY(0)", opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 155 }}
                src={isShiny ? pokemon.imagemShiny : pokemon.imagem}
                alt={pokemon.nome}
                referrerPolicy="no-referrer"
                className="w-40 h-40 object-contain filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.8)] select-all pointer-events-auto cursor-zoom-in active:scale-105 transition-transform"
              />
            </div>

            {/* Core Info Display */}
            <div className="text-center mt-3">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#F5F5F5]">
                {pokemon.nome}
              </h1>

              {/* Element Badges Diagonal Skew style */}
              <div className="flex justify-center gap-2 mt-3.5">
                {pokemon.tipos.map((tipo) => {
                  const currentStyle = CORES_TIPOS[tipo.toLowerCase()] || CORES_TIPOS.normal;
                  return (
                    <span
                      key={tipo}
                      className="px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.15em] text-[#0A0A0A] skew-x-[-12deg] shadow-md inline-block"
                      style={{ backgroundColor: CORES_HEX[tipo.toLowerCase()] || "#FFFFFF" }}
                    >
                      {tipo}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Interactive Buttons (Shiny & Catch) */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={onToggleShiny}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-[10px] font-black tracking-widest uppercase transition-all duration-300 border skew-x-[-12deg] ${
                  isShiny
                    ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isShiny ? "animate-spin" : "text-amber-400"}`} />
                <span>{isShiny ? "EXIBINDO FORMA SHINY" : "VER FORMA SHINY (BRILHANTE)"}</span>
              </button>

              {onCatch && (
                <button
                  onClick={() => onCatch(pokemon)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-[10px] font-black tracking-widest uppercase transition-all duration-300 border skew-x-[-12deg] ${
                    isCaught
                      ? "bg-zinc-900 text-emerald-400 border-emerald-500/20 cursor-default"
                      : "bg-[#FF421C] hover:bg-red-500 text-black border-transparent shadow-[0_0_20px_rgba(255,66,28,0.35)]"
                  }`}
                >
                  <span className="text-[14px]">🔴</span>
                  <span>{isCaught ? "CAPTURADO ✓" : "CAPTURAR POKÉMON"}</span>
                </button>
              )}
            </div>

            {/* Physical Traits Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
              <div className="flex flex-col items-center justify-center border-r border-white/10">
                <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                  <Ruler className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[9px] uppercase font-bold tracking-widest">ALTURA</span>
                </div>
                <span className="text-xl font-mono font-extrabold text-[#F5F5F5]">
                  {(pokemon.altura / 10).toFixed(1)} <span className="text-xs font-normal opacity-60">M</span>
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                  <Weight className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[9px] uppercase font-bold tracking-widest">PESO</span>
                </div>
                <span className="text-xl font-mono font-extrabold text-[#F5F5F5]">
                  {(pokemon.peso / 10).toFixed(1)} <span className="text-xs font-normal opacity-60">KG</span>
                </span>
              </div>
            </div>

            {/* Core Statistics Sheet */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">
                  BIOMETRIC PROFILE STATUS
                </h3>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 border border-white/10 rounded-full">
                  <Trophy className="w-3 h-3 text-[#FFD700]" />
                  <span className="text-[9px] font-bold font-mono tracking-wider text-zinc-300 uppercase">
                    TOTAL: {totalStats}
                  </span>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="space-y-4">
                {pokemon.poderes.map((stat) => {
                  const config = getStatConfig(stat.nome);
                  const Icon = config.icon;
                  // Dynamic percentage calculations
                  const percentage = Math.min((stat.forca / config.max) * 100, 100);

                  return (
                    <div key={stat.nome} className="group/stat">
                      {/* Stat Detail Labels */}
                      <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-1.5 px-0.5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="font-bold text-zinc-300">{config.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-extrabold text-[#F5F5F5]">
                            {stat.forca}
                          </span>
                          <span className="text-[9px] text-zinc-650">/ {config.max}</span>
                        </div>
                      </div>

                      {/* Power Thin Rule Bar */}
                      <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 transition-colors"
                          style={{ backgroundColor: hexColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
