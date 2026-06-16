import { Pokemon, CORES_TIPOS, CORES_HEX } from "../types";
import { motion } from "motion/react";
import { Ruler, Weight, Sparkles, Swords, Zap } from "lucide-react";

interface PokemonCardProps {
  key?: number | string;
  pokemon: Pokemon;
  isShiny: boolean;
  onSelect: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, isShiny, onSelect }: PokemonCardProps) {
  const primaryType = pokemon.tipos[0]?.toLowerCase() || "normal";
  const typeStyle = CORES_TIPOS[primaryType] || CORES_TIPOS.normal;
  const hexColor = CORES_HEX[primaryType] || CORES_HEX.normal;

  // Find key stats for the summary preview (Attack and Speed / Velocity)
  const getStat = (name: string) => {
    return pokemon.poderes.find((p) => p.nome.toLowerCase() === name || p.nome.toLowerCase().includes(name))?.forca || 50;
  };

  const attack = getStat("attack");
  const speed = getStat("speed");

  // Format ID (e.g. #006)
  const displayId = `No. ${pokemon.id.toString().padStart(3, "0")}`;

  return (
    <motion.div
      layoutId={`card-container-${pokemon.id}`}
      onClick={() => onSelect(pokemon)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 p-5 cursor-pointer transition-all duration-300 flex flex-col shadow-2xl"
      id={`pokemon-card-${pokemon.id}`}
    >
      {/* Decorative Glow Ambient Backdrop */}
      <div 
        className="absolute -right-16 -top-16 h-36 w-36 rounded-full blur-[60px] opacity-10 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: hexColor }}
      />

      {/* Hex/Ribbon ID header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-4 bg-[#FF421C]/80" />
          <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#FF421C] uppercase">
            {displayId}
          </span>
        </div>
        <div className="flex gap-1">
          {isShiny && (
            <span className="bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full text-[8px] tracking-wider uppercase font-black flex items-center gap-0.5 font-mono">
              <Sparkles className="w-2.5 h-2.5" />
              <span>SHINY</span>
            </span>
          )}
        </div>
      </div>

      {/* Artwork with ambient circular shadow */}
      <div className="relative my-5 flex items-center justify-center min-h-[140px] z-10 select-none pointer-events-none">
        {/* Glow behind image */}
        <div 
          className="absolute h-24 w-24 rounded-full blur-2xl opacity-15 group-hover:scale-125 transition-transform duration-500 ease-out"
          style={{ backgroundColor: hexColor }}
        />
        
        <img
          src={isShiny ? pokemon.imagemShiny : pokemon.imagem}
          alt={pokemon.nome}
          referrerPolicy="no-referrer"
          className="w-28 h-28 object-contain filter drop-shadow-[0_12px_12px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-550 ease-out"
        />
      </div>

      {/* Info Section */}
      <div className="mt-auto z-10 flex flex-col">
        {/* Name in uppercase italicized modern layout */}
        <h2 className="text-xl font-black uppercase italic tracking-tight text-[#F5F5F5] group-hover:text-white transition-colors duration-200">
          {pokemon.nome}
        </h2>

        {/* Diagonal Skew Type Badges */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {pokemon.tipos.map((tipo) => {
            const currentStyle = CORES_TIPOS[tipo.toLowerCase()] || CORES_TIPOS.normal;
            return (
              <span
                key={tipo}
                className={`px-3 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest text-[#0A0A0A] bg-white ${typeStyle.border} shadow-sm skew-x-[-12deg] inline-block`}
                style={{ backgroundColor: CORES_HEX[tipo.toLowerCase()] || "#FFFFFF" }}
              >
                {tipo}
              </span>
            );
          })}
        </div>

        {/* Physical Traits (Height/Weight) styled minimally */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-b border-white/[0.06] py-2 text-center text-[10px] font-mono tracking-wider uppercase text-zinc-400">
          <div className="flex items-center justify-center gap-1 border-r border-white/[0.06]">
            <Ruler className="w-3 h-3 text-zinc-500" />
            <span>{(pokemon.altura / 10).toFixed(1)}M</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Weight className="w-3 h-3 text-zinc-500" />
            <span>{(pokemon.peso / 10).toFixed(1)}KG</span>
          </div>
        </div>

        {/* Mini Stats Grid using the "Artistic Flair" signature minimalist thin-rule look */}
        <div className="mt-4 space-y-3">
          {/* Attack stat bar */}
          <div>
            <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-zinc-400 mb-1">
              <span className="flex items-center gap-1">
                <Swords className="w-2.5 h-2.5 text-zinc-500" /> ATAQUE
              </span>
              <span className="font-mono text-zinc-300">{attack}</span>
            </div>
            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-[#FF421C] transition-all duration-1000"
                style={{ width: `${Math.min((attack / 150) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Speed stat bar */}
          <div>
            <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-zinc-400 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-zinc-500" /> VELOCIDADE
              </span>
              <span className="font-mono text-zinc-300">{speed}</span>
            </div>
            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 transition-all duration-1000 animate-pulse"
                style={{ 
                  backgroundColor: hexColor,
                  width: `${Math.min((speed / 150) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
