import { Ruler, Sparkles, Swords, Weight, Zap } from "lucide-react-native";
import { Image, Pressable, Text, View, Animated } from "react-native";
import { CORES_HEX, Pokemon } from "../types";
import { useRef, useEffect } from "react";

interface PokemonCardProps {
  pokemon: Pokemon;
  isShiny: boolean;
  onSelect: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, isShiny, onSelect }: PokemonCardProps) {
  const primaryType = pokemon.tipos[0]?.toLowerCase() || "normal";
  const hexColor = CORES_HEX[primaryType] || CORES_HEX.normal;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const getStat = (name: string) => {
    return pokemon.poderes.find(
      (p) => p.nome.toLowerCase() === name || p.nome.toLowerCase().includes(name)
    )?.forca || 50;
  };

  const attack = getStat("attack");
  const speed = getStat("speed");
  const displayId = `No. ${pokemon.id.toString().padStart(3, "0")}`;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
        overflow: 'hidden',
      }}
      className="relative rounded-3xl border border-white/10 bg-[#121212] mb-1"
    >
      <Pressable
        onPress={() => onSelect(pokemon)}
        className="p-5"
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >

        <View className="flex-row items-center justify-between z-20">
          <View className="flex-row items-center gap-2">
            <View className="h-[2px] w-3 bg-[#FF421C]" />
            <Text className="font-mono text-[9px] font-bold tracking-widest text-[#FF421C]">
              {displayId}
            </Text>
          </View>
          {isShiny && (
            <View className="bg-amber-400/20 px-2 py-0.5 rounded-full">
              <Sparkles size={8} color="#fbbf24" />
            </View>
          )}
        </View>

        <View className="my-4 items-center justify-center h-32 relative">
          <View
            pointerEvents="none"
            style={{ 
              backgroundColor: hexColor,
              width: 90,
              height: 90,
              borderRadius: 45,
              opacity: 0.15,
              position: 'absolute',
            }}
          />

          <Image
            source={{ uri: isShiny ? pokemon.imagemShiny : pokemon.imagem }}
            style={{ width: 100, height: 100, zIndex: 10 }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-lg font-black uppercase text-white italic tracking-tighter">
          {pokemon.nome}
        </Text>

        <View className="mt-2 flex-row flex-wrap gap-1">
          {pokemon.tipos.map((tipo) => (
            <View
              key={tipo}
              className="px-2 py-0.5 rounded-[4px]"
              style={{
                backgroundColor: CORES_HEX[tipo.toLowerCase()] || "#FFF",
                transform: [{ skewX: "-10deg" }],
              }}
            >
              <Text className="text-[8px] font-black uppercase text-black">
                {tipo}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-4 pt-3 border-t border-white/5 gap-2">
          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-[8px] font-bold text-zinc-500 uppercase">ATK</Text>
              <Text className="text-[8px] font-mono text-zinc-400">{attack}</Text>
            </View>
            <View className="h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
              <View 
                className="h-full bg-[#FF421C]" 
                style={{ width: `${Math.min((attack/150)*100, 100)}%` }} 
              />
            </View>
          </View>

          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-[8px] font-bold text-zinc-500 uppercase">SPD</Text>
              <Text className="text-[8px] font-mono text-zinc-400">{speed}</Text>
            </View>
            <View className="h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
              <View 
                className="h-full" 
                style={{ 
                  width: `${Math.min((speed/150)*100, 100)}%`,
                  backgroundColor: hexColor 
                }} 
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}