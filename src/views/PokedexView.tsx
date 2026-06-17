import React, { useState, useMemo } from "react";
import { 
  FlatList, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  ActivityIndicator,
  ScrollView,
  useWindowDimensions 
} from "react-native";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ShieldAlert, 
  Compass, 
  RefreshCw
} from "lucide-react-native";
import { Pokemon, CORES_TIPOS, CORES_HEX } from "../types";
import { PokemonCard } from "@/components/PokemonCard";
import { PokemonModal } from "@/components/PokemonModal";

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
  const { width } = useWindowDimensions();

  // Define colunas (2 para mobile, 3 para tablet, 4 para telas grandes)
  const numColumns = useMemo(() => {
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  }, [width]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("id-asc");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const filteredPokemon = pokemonList.filter((pkmn) => {
    const matchesSearch =
      pkmn.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkmn.id.toString().includes(searchQuery) ||
      pkmn.index.includes(searchQuery);

    const matchesType = selectedType === "" || 
      pkmn.tipos.map(t => t.toLowerCase()).includes(selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  const sortedPokemon = useMemo(() => {
    return [...filteredPokemon].sort((a, b) => {
      if (sortOption === "id-asc") return a.id - b.id;
      if (sortOption === "id-desc") return b.id - a.id;
      if (sortOption === "name-asc") return a.nome.localeCompare(b.nome);
      if (sortOption === "name-desc") return b.nome.localeCompare(a.nome);
      if (sortOption === "power-desc") {
        const powerA = a.poderes.reduce((acc, curr) => acc + curr.forca, 0);
        const powerB = b.poderes.reduce((acc, curr) => acc + curr.forca, 0);
        return powerB - powerA;
      }
      return 0;
    });
  }, [filteredPokemon, sortOption]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSortOption("id-asc");
  };

  return (
    <View className="flex-1 bg-[#070707]">
      <FlatList
        key={numColumns}
        data={loading || errorMsg ? [] : sortedPokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        
        // Ajuste de layout: padding horizontal global aqui para alinhar tudo
        contentContainerStyle={{ 
          paddingHorizontal: 24, 
          paddingBottom: 40,
          paddingTop: 32 
        }}
        
        // Espaçamento entre as colunas e linhas
        columnWrapperStyle={numColumns > 1 ? { gap: 12, marginBottom: 12 } : null}
        
        ListHeaderComponent={
          <View className="mb-8">
            {/* HERO BILLBOARD SECTION */}
            <View 
              className="relative rounded-3xl bg-white/[0.02] border border-white/10 p-8 overflow-hidden"
              style={{ minHeight: 200, justifyContent: 'flex-end' }}
            >
              <Text 
                className="absolute right-[-20] top-0 font-black text-white italic"
                style={{ fontSize: 100, opacity: 0.02, lineHeight: 100 }}
              >
                POKEDEX
              </Text>

              <View className="relative z-10">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="h-[2px] w-8 bg-[#FF421C]" />
                  <View className="flex-row items-center gap-2">
                    <Compass size={14} color="#FF421C" />
                    <Text className="text-[#FF421C] font-mono text-[10px] tracking-[3px] font-extrabold uppercase">
                      BIOMETRICS HUB
                    </Text>
                  </View>
                </View>
                
                <Text className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  SPECIES BIOMODE ANALYSIS
                </Text>
                <Text className="mt-2 text-xs text-zinc-500 leading-5">
                  Compare primary abilities, elemental properties, and stats of Pokémon from Gen 1.
                </Text>
              </View>
            </View>

            {/* SEARCH & FILTERS AREA */}
            <View className="mt-8 bg-white/[0.01] border border-white/10 rounded-2xl p-5 gap-6">
              
              {/* Search Input */}
              <View className="relative">
                <View className="absolute left-4 z-10" style={{ top: '50%', transform: [{translateY: -7}] }}>
                  <Search size={14} color="#52525b" />
                </View>
                <TextInput
                  placeholder="BUSCAR NOME OU REGISTRO..."
                  placeholderTextColor="#3f3f46"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="bg-[#0E0E0B] border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white font-mono text-[10px] tracking-widest"
                />
                {searchQuery.length > 0 && (
                  <Pressable 
                    onPress={() => setSearchQuery("")}
                    className="absolute right-4" 
                    style={{ top: '50%', transform: [{translateY: -6}] }}
                  >
                    <Text className="text-[8px] font-black text-[#FF421C]">LIMPAR</Text>
                  </Pressable>
                )}
              </View>

              {/* Sort Selection */}
              <View>
                <View className="flex-row items-center gap-2 mb-3 px-1">
                  <ArrowUpDown size={12} color="#FF421C" />
                  <Text className="text-[9px] font-black text-[#FF421C] uppercase tracking-widest">ORDENAÇÃO</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {[
                    { id: "id-asc", label: "ORDINAL (ASC)" },
                    { id: "id-desc", label: "ORDINAL (DESC)" },
                    { id: "name-asc", label: "A - Z" },
                    { id: "power-desc", label: "MAIOR ATAQUE" }
                  ].map((opt) => (
                    <Pressable
                      key={opt.id}
                      onPress={() => setSortOption(opt.id)}
                      className={`mr-2 px-4 py-2 rounded-lg border ${sortOption === opt.id ? 'bg-white border-white' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`text-[9px] font-bold ${sortOption === opt.id ? 'text-black' : 'text-zinc-500'}`}>{opt.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Type Filters */}
              <View className="border-t border-white/10 pt-5">
                <View className="flex-row items-center justify-between mb-4 px-1">
                  <View className="flex-row items-center gap-2">
                    <Filter size={12} color="#FF421C" />
                    <Text className="text-[9px] font-black text-[#FF421C] uppercase tracking-widest">CLASSE ELEMENTAL</Text>
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {Object.keys(CORES_TIPOS).map((tipoName) => {
                      const isSelected = selectedType === tipoName;
                      return (
                        <Pressable
                          key={tipoName}
                          onPress={() => setSelectedType(isSelected ? "" : tipoName)}
                          className={`px-4 py-2 rounded-md flex-row items-center gap-2 border ${
                            isSelected ? "bg-white border-white" : "bg-white/5 border-white/10"
                          }`}
                          style={{ transform: [{ skewX: '-10deg' }] }}
                        >
                          <View 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: CORES_HEX[tipoName] || "#FFF" }}
                          />
                          <Text className={`text-[9px] font-black uppercase ${isSelected ? "text-black" : "text-zinc-400"}`}>
                            {tipoName}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              {/* Status Bar */}
              <View className="flex-row items-center justify-between pt-2">
                <Text className="text-[9px] font-mono text-zinc-500 uppercase">
                  Resultados: <Text className="text-white font-bold">{sortedPokemon.length}</Text>
                </Text>
                {(selectedType || searchQuery || sortOption !== "id-asc") && (
                  <Pressable onPress={handleResetFilters} className="flex-row items-center gap-2">
                    <RefreshCw size={10} color="#FF421C" />
                    <Text className="text-[9px] font-black text-[#FF421C] uppercase">REINICIAR</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        }

        renderItem={({ item: pokemon }) => (
          // Usamos flex: 1 para que o FlatList gerencie a largura uniformemente
          <View style={{ flex: 1 }}>
            <PokemonCard
              pokemon={pokemon}
              isShiny={isShinyMaster}
              onSelect={(p) => setSelectedPokemon(p)}
            />
          </View>
        )}

        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View className="py-20 items-center justify-center">
                <ActivityIndicator color="#FF421C" size="large" />
                <Text className="mt-4 text-[10px] font-mono text-[#FF421C] uppercase">Conectando...</Text>
              </View>
            );
          }
          if (errorMsg) {
            return (
              <View className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 items-center">
                <ShieldAlert size={40} color="#ef4444" />
                <Text className="text-red-400 font-black uppercase text-xs mt-4">Erro</Text>
                <Text className="text-zinc-500 text-[10px] text-center mt-2">{errorMsg}</Text>
              </View>
            );
          }
          return (
            <View className="py-20 items-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
              <SlidersHorizontal size={40} color="#27272a" />
              <Text className="text-zinc-400 font-black uppercase text-xs mt-4">Nenhum resultado</Text>
            </View>
          );
        }}
      />

      <PokemonModal
        pokemon={selectedPokemon}
        isShiny={isShinyMaster}
        onToggleShiny={() => setIsShinyMaster(!isShinyMaster)}
        onClose={() => setSelectedPokemon(null)}
        isCaught={selectedPokemon ? pokebag.some(p => p.id === selectedPokemon.id) : false}
        onCatch={onCatch}
      />
    </View>
  );
}