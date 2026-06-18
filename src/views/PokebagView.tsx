import {
  ArrowDown,
  ArrowUp,
  Plus,
  Search,
  Trash2,
  Trophy,
  User,
  Ghost,
  X,
  Zap
} from "lucide-react-native";
import { useState, useMemo } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { CORES_HEX, Pokemon } from "../types";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBag = useMemo(() => {
    return pokebag.filter((p) =>
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toString().includes(searchQuery)
    );
  }, [pokebag, searchQuery]);

  return (
    <ScrollView
      className="flex-1 bg-[#070707]"
      contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 24, paddingTop: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="relative rounded-[32px] bg-white/[0.02] border border-white/10 p-8 overflow-hidden mb-10">
        <Text
          className="absolute top-[-20] right-[-20] font-black uppercase text-white italic"
          style={{ fontSize: 110, opacity: 0.03 }}
        >
          BAG
        </Text>

        <View className="relative z-10">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="h-[2px] w-8 bg-emerald-500" />
            <View className="flex-row items-center gap-2">
              <Trophy size={14} color="#fbbf24" />
              <Text className="text-emerald-500 font-mono text-[10px] tracking-[3px] font-extrabold uppercase">
                LOGÍSTICA DE COMBATE
              </Text>
            </View>
          </View>

          <Text className="text-3xl font-black uppercase text-white italic tracking-tighter">
            GERENCIAMENTO DE ELITE
          </Text>
          <Text className="mt-3 text-xs text-zinc-500 leading-relaxed max-w-[260px]">
            Organize sua formação tática ou gerencie os espécimes armazenados em seu acervo digital.
          </Text>
        </View>
      </View>

      <View className="mb-12">
        <View className="flex-row items-center justify-between border-b border-white/10 pb-4 mb-6">
          <View className="flex-row items-center gap-2">
            <Zap size={16} color="#10b981" />
            {/* AGORA REFLETE O LIMITE REAL DA API (5 POKÉMONS) */}
            <Text className="text-sm font-black uppercase text-white tracking-[2px]">
              TIME ATIVO <Text className="text-emerald-500">({battleTeam.length}/5)</Text>
            </Text>
          </View>

          {battleTeam.length > 0 && (
            <Pressable
              onPress={onClearTeam}
              className="bg-red-500/10 border border-red-500/30 px-4 py-1.5 rounded-lg active:opacity-50"
            >
              <Text className="text-[10px] font-black uppercase text-red-400">Limpar</Text>
            </Pressable>
          )}
        </View>

        <View className="gap-3">
          {battleTeam.length === 0 ? (
            <View className="border border-dashed border-white/10 rounded-3xl py-14 items-center bg-white/[0.01]">
              <Ghost size={40} color="#27272a" />
              <Text className="text-xs font-black uppercase text-zinc-500 tracking-widest mt-4">
                Sem combatentes ativos
              </Text>
            </View>
          ) : (
            battleTeam.map((poke, index) => {
              const hexColor = CORES_HEX[poke.tipos[0]?.toLowerCase()] || CORES_HEX.normal;
              return (
                <View
                  key={`team-${poke.id}-${index}`}
                  className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl flex-row items-center gap-4"
                >
                  <View className="w-1 h-10 rounded-full" style={{ backgroundColor: hexColor }} />

                  <View className="w-16 h-16 bg-white/5 rounded-xl items-center justify-center border border-white/5">
                    <Image
                      source={{ uri: getAnimatedSprite(poke.id, isShinyMaster, isShinyMaster ? poke.imagemShiny : poke.imagem) }}
                      style={{ width: 48, height: 48 }}
                      resizeMode="contain"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[9px] font-mono text-emerald-500 font-bold uppercase">Posição {index + 1}</Text>
                    <Text className="text-sm font-black uppercase text-white italic" numberOfLines={1}>
                      {poke.nome}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View className="gap-1">
                      <Pressable
                        onPress={() => onShiftTeamOrder(index, "up")}
                        disabled={index === 0}
                        className={`p-2 rounded-md bg-white/5 border border-white/10 ${index === 0 ? 'opacity-10' : 'active:bg-white/10'}`}
                      >
                        <ArrowUp size={14} color="#fff" />
                      </Pressable>
                      <Pressable
                        onPress={() => onShiftTeamOrder(index, "down")}
                        disabled={index === battleTeam.length - 1}
                        className={`p-2 rounded-md bg-white/5 border border-white/10 ${index === battleTeam.length - 1 ? 'opacity-10' : 'active:bg-white/10'}`}
                      >
                        <ArrowDown size={14} color="#fff" />
                      </Pressable>
                    </View>

                    <Pressable
                      onPress={() => onRemoveFromTeam(poke.id)}
                      className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl active:bg-red-500/30"
                    >
                      <Trash2 size={18} color="#f87171" />
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}

          {Array.from({ length: Math.max(0, 5 - battleTeam.length) }).map((_, i) => (
            <View key={`empty-${i}`} className="h-16 border border-dashed border-white/5 rounded-2xl items-center justify-center opacity-20">
              <Plus size={16} color="#52525b" />
            </View>
          ))}
        </View>
      </View>

      <View>
        <View className="mb-6">
          <Text className="text-sm font-black uppercase text-white tracking-[2px] mb-4">
            MEU ACERVO <Text className="text-zinc-500">({pokebag.length}/151)</Text>
          </Text>

          <View className="relative">
            <View className="absolute left-4 top-[15px] z-10">
              <Search size={16} color={searchQuery ? "#10b981" : "#52525b"} />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="BUSCAR NO ACERVO DIGITAL..."
              placeholderTextColor="#3f3f46"
              className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white font-mono text-[11px] tracking-widest"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery("")}
                className="absolute right-4 top-[15px]"
              >
                <X size={16} color="#f87171" />
              </Pressable>
            )}
          </View>
        </View>

        {pokebag.length === 0 ? (
          <View className="py-20 items-center">
            <User size={40} color="#27272a" />
            <Text className="text-[10px] font-mono text-zinc-600 uppercase mt-4 text-center">
              Nenhum espécime capturado.
            </Text>
          </View>
        ) : filteredBag.length === 0 ? (
          <View className="py-20 items-center">
            <Search size={30} color="#27272a" />
            <Text className="text-[10px] font-mono text-zinc-600 uppercase mt-4">Nenhum resultado encontrado</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {filteredBag.map((poke) => {
              const inTeam = battleTeam.some((p) => p.id === poke.id);
              const hexColor = CORES_HEX[poke.tipos[0]?.toLowerCase()] || CORES_HEX.normal;

              return (
                <View
                  key={`bag-${poke.id}`}
                  className="bg-white/[0.02] border border-white/10 rounded-[32px] p-5 items-center"
                  style={{ width: '48%' }}
                >
                  <View className="relative w-20 h-20 items-center justify-center mb-3">
                    <View
                      className="absolute w-14 h-14 rounded-full opacity-10"
                      style={{ backgroundColor: hexColor }}
                    />
                    <Image
                      source={{ uri: getAnimatedSprite(poke.id, isShinyMaster, isShinyMaster ? poke.imagemShiny : poke.imagem) }}
                      style={{ width: 55, height: 55 }}
                      resizeMode="contain"
                    />
                  </View>

                  <Text className="text-[8px] font-mono text-zinc-500 uppercase mb-1">#{poke.index}</Text>
                  <Text className="text-[11px] font-black text-white uppercase italic text-center mb-4" numberOfLines={1}>
                    {poke.nome}
                  </Text>

                  <View className="w-full gap-2">
                    {inTeam ? (
                      <View className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center">
                        <Text className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">No Time</Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => onAddToTeam(poke)}
                        className={`w-full py-2.5 rounded-xl bg-white/5 border border-white/10 items-center active:bg-white/10 ${battleTeam.length >= 5 ? 'opacity-20' : ''}`}
                      >
                        <Text className="text-[9px] font-black text-white uppercase tracking-tighter">
                          {battleTeam.length >= 5 ? "Substituir Último" : "Recrutar"}
                        </Text>
                      </Pressable>
                    )}

                    <Pressable
                      onPress={() => onReleasePokemon(poke.id)}
                      className="w-full py-2 rounded-lg items-center active:opacity-40"
                    >
                      <Text className="text-[8px] font-black text-red-500/40 uppercase tracking-widest">Libertar</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}