import React, { useState } from "react";
import { Pokemon, CORES_TIPOS, CORES_HEX } from "../types";
import { PokemonCard } from "./PokemonCard";
import { PokemonModal } from "./PokemonModal";
import { 
  Search, Filter, SlidersHorizontal, Loader2, ArrowUpDown, 
  ShieldAlert, Compass, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PokedexViewProps {
  pokemonList: Pokemon[];
  loading: boolean;
  errorMsg: string | null;
  isShinyMaster: boolean;
  setIsShinyMaster: (v: boolean) => void;
  pokebag: Pokemon[];
  onCatch: (pkmn: Pokemon) => void;
}



export function PokedexView({
  pokemonList,
  loading,
  errorMsg,
  isShinyMaster,
  setIsShinyMaster,
  pokebag,
  onCatch,
}: PokedexViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("id-asc");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Filter list based on search and type elements
  const filteredPokemon = pokemonList.filter((pkmn) => {
    const matchesSearch =
      pkmn.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkmn.id.toString().includes(searchQuery) ||
      pkmn.index.includes(searchQuery);

    const matchesType = selectedType === "" || pkmn.tipos.map(t => t.toLowerCase()).includes(selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  // Sort filtered list
  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    if (sortOption === "id-asc") return a.id - b.id;
    if (sortOption === "id-desc") return b.id - a.id;
    if (sortOption === "name-asc") return a.nome.localeCompare(b.nome);
    if (sortOption === "name-desc") return b.nome.localeCompare(a.nome);
    if (sortOption === "power-desc") {
      const powerA = a.poderes.reduce((acc, curr) => acc + curr.forca, 0);
      const powerB = b.poderes.reduce((acc, curr) => acc + curr.forca, 0);
      return powerB - powerA;
    }
    if (sortOption === "power-asc") {
      const powerA = a.poderes.reduce((acc, curr) => acc + curr.forca, 0);
      const powerB = b.poderes.reduce((acc, curr) => acc + curr.forca, 0);
      return powerA - powerB;
    }
    return 0;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSortOption("id-asc");
  };

  return (
    <>
      {/* HERO BILLBOARD SECTION */}
      <div className="px-6 md:px-12 pt-8">
        <div className="relative rounded-2xl bg-white/[0.01] border border-white/10 p-6 md:p-10 flex flex-col justify-end overflow-hidden min-h-[220px]">
          {/* OVERSIZED BACKGROUND WATERMARK TEXT */}
          <div className="absolute top-0 right-0 text-[140px] md:text-[200px] font-black leading-none opacity-[0.02] select-none translate-x-12 translate-y-3 uppercase pointer-events-none italic">
            Pokedex
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-[#FF421C]" />
              <span className="text-[#FF421C] font-mono text-[10px] tracking-[0.25em] font-extrabold uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Biometrics Hub
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter uppercase italic text-white">
              SPECIES BIOMODE ANALYSIS
            </h1>
            <p className="mt-3 text-xs md:text-sm text-zinc-400 select-text leading-relaxed">
              Compare primary abilities, elemental properties, and stats of Pokémon from Gen 1. 
              Activate Shiny Bio-Mode or explore element queries down below.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN BODY AREA CONTAINER */}
      <main className="flex-1 px-6 md:px-12 py-8">
        
        {/* SEARCH, SORT AND FILTERS PLATFORM BRIDGE */}
        <section className="bg-white/[0.01] border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl mb-8 space-y-6">
          
          {/* Controls Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Search Block */}
            <div className="relative lg:col-span-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="DIGITE O NOME OU REGISTRO BIOMÉTRICO (E.G. 006)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-14 py-3 bg-[#0E0E0B] border border-white/10 rounded-lg text-xs font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-[#FF421C] text-[#F5F5F5] placeholder-zinc-600 transition-all uppercase"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-[#FF421C] hover:text-white transition-colors"
                >
                  LIMPAR
                </button>
              )}
            </div>

            {/* Sort Block */}
            <div className="relative lg:col-span-4">
              <div className="relative w-full">
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-[#0E0E0B] border border-white/10 rounded-lg text-[10px] font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#FF421C] appearance-none cursor-pointer text-zinc-300 font-bold uppercase transition-all"
                >
                  <option value="id-asc">POKÉDEX ORDINAL (CRESCENTE)</option>
                  <option value="id-desc">POKÉDEX ORDINAL (DECRESCENTE)</option>
                  <option value="name-asc">ALFABÉTICA (A - Z)</option>
                  <option value="name-desc">ALFABÉTICA (Z - A)</option>
                  <option value="power-desc">MAIOR ATAQUE GLOBAL</option>
                  <option value="power-asc">MENOR ATAQUE GLOBAL</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-500" />
              </div>
            </div>
          </div>

          {/* Element Filter Block */}
          <div className="border-t border-white/10 pt-5">
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <Filter className="w-3.5 h-3.5 text-[#FF421C]" />
              <span className="text-[10px] uppercase font-black tracking-[0.15em] text-[#FF421C]">CLASSE ELEMENTAL</span>
              {selectedType && (
                <button
                  onClick={() => setSelectedType("")}
                  className="ml-auto text-[10px] font-black uppercase tracking-widest text-[#FF421C] hover:text-white transition-colors"
                >
                  MOSTRAR TODOS
                </button>
              )}
            </div>

            {/* Element Buttons List */}
            <div className="flex flex-wrap gap-2 pr-1">
              {Object.keys(CORES_TIPOS).map((tipoName) => {
                const isSelected = selectedType === tipoName;
                
                return (
                  <button
                    key={tipoName}
                    onClick={() => setSelectedType(isSelected ? "" : tipoName)}
                    className={`px-3 py-1.5 rounded-sm text-[9px] font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 border skew-x-[-12deg] cursor-pointer ${
                      isSelected
                        ? "bg-white text-[#0A0A0A] border-transparent scale-[1.04]"
                        : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: CORES_HEX[tipoName] || "#FFF" }}
                    />
                    <span>{tipoName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono tracking-widest uppercase text-zinc-500 pt-1">
            <div className="flex items-center gap-2">
              <span>Dossiês correspondentes: </span>
              <span className="text-white font-black px-2 py-0.5 bg-white/5 border border-white/10 rounded">
                {sortedPokemon.length} de {pokemonList.length}
              </span>
              {selectedType && (
                <span>
                  • Classe: <strong className="text-white capitalize">{selectedType}</strong>
                </span>
              )}
            </div>

            {(selectedType || searchQuery || sortOption !== "id-asc") && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-[#FF421C] hover:text-white font-black transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>REINICIAR DIRETÓRIO</span>
              </button>
            )}
          </div>
        </section>

        {/* DYNAMIC STATES (GRID & FEEDBACKS) */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 flex flex-col items-center justify-center gap-4 text-center"
            >
              <Loader2 className="w-8 h-8 text-[#FF421C] animate-spin" />
              <div className="space-y-1">
                <h3 className="text-sm uppercase font-black tracking-[0.2em] text-[#FF421C]">INICIALIZANDO PORTAL BIOMÉTRICO...</h3>
                <p className="text-[10px] font-mono tracking-wider text-zinc-500">CONECTANDO AO BANCO DE DADOS DA ARCHIVE ASSOCIATION</p>
              </div>
            </motion.div>
          ) : errorMsg ? (
            <motion.div
              layout
              className="bg-white/[0.01] border border-red-500/30 rounded-2xl p-8 text-center max-w-md mx-auto my-12"
            >
              <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-sm font-black uppercase tracking-wider text-red-400">ERRO DE TRANSCRIÇÃO</h3>
              <p className="text-xs font-mono text-zinc-400 mt-2">{errorMsg}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-5 bg-red-600/20 hover:bg-red-600 border border-red-500/50 text-white font-extrabold text-[10px] tracking-widest uppercase px-5 py-2.5 rounded transition-all"
              >
                RECONECTAR
              </button>
            </motion.div>
          ) : sortedPokemon.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl max-w-lg mx-auto"
            >
              <SlidersHorizontal className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">ESPÉCIE NÃO MAPEADA</h3>
              <p className="text-[11px] text-zinc-500 mt-2 px-6 font-mono pr-8">
                Nenhum registro corresponde aos critérios consultados. Tente ajustar o termo de busca ou redefina o elemento.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 bg-[#FF421C] text-black font-black text-[10px] tracking-widest uppercase px-5 py-2.5 rounded shadow-lg hover:bg-orange-500 transition-all skew-x-[-12deg]"
              >
                RESTAURAR BUSCA
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-1"
            >
              {sortedPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isShiny={isShinyMaster}
                  onSelect={(p) => setSelectedPokemon(p)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP DETAIL MODAL DIALOG */}
        <PokemonModal
          pokemon={selectedPokemon}
          isShiny={isShinyMaster}
          onToggleShiny={() => setIsShinyMaster(!isShinyMaster)}
          onClose={() => setSelectedPokemon(null)}
          isCaught={selectedPokemon ? pokebag.some(p => p.id === selectedPokemon.id) : false}
          onCatch={onCatch}
        />
      </main>
    </>
  );
}
