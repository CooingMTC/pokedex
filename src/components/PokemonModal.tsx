import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  Flame,
  Heart,
  Ruler,
  Shield,
  Sparkles,
  Swords,
  Weight,
  X,
  Zap,
  Trophy,
  ShieldAlert,
  Backpack
} from "lucide-react-native";
import { 
  Image, 
  Modal, 
  Pressable, 
  ScrollView, 
  Text, 
  View, 
  Animated, 
  Easing, 
  StyleSheet, 
  Dimensions 
} from "react-native";
import { CORES_HEX, Pokemon } from "../types";
import { useRef, useEffect } from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isShiny: boolean;
  onToggleShiny: () => void;
  onClose: () => void;
  isCaught?: boolean;
  onCatch?: (pokemon: Pokemon) => void;
}

const STAT_CONFIGS: Record<string, { label: string; max: number; color: string }> = {
  hp: { label: "HP", max: 255, color: "#ff4d4d" },
  attack: { label: "ATK", max: 190, color: "#f0932b" },
  defense: { label: "DEF", max: 230, color: "#f9ca24" },
  "special-attack": { label: "S.ATK", max: 194, color: "#eb4d4b" },
  "special-defense": { label: "S.DEF", max: 230, color: "#6ab04c" },
  speed: { label: "SPD", max: 180, color: "#48dbfb" },
};

export function PokemonModal({
  pokemon,
  isShiny,
  onToggleShiny,
  onClose,
  isCaught,
  onCatch,
}: PokemonModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (pokemon) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [pokemon]);

  if (!pokemon) return null;

  const primaryType = pokemon.tipos[0]?.toLowerCase() || "normal";
  const hexColor = CORES_HEX[primaryType] || CORES_HEX.normal;

  return (
    <Modal visible={!!pokemon} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        
        <Animated.View 
          style={[styles.backdrop, { opacity: fadeAnim }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.85)' }]} />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={[`${hexColor}90`, `${hexColor}20`, "transparent"]}
              style={StyleSheet.absoluteFill}
            />
            
            <Text style={styles.bgId}>
              #{pokemon.id.toString().padStart(3, "0")}
            </Text>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#fff" />
            </Pressable>

            <Image
              source={{ uri: isShiny ? pokemon.imagemShiny : pokemon.imagem }}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View className="items-center">
              <Text className="text-4xl font-black text-white uppercase italic tracking-tighter text-center">
                {pokemon.nome}
              </Text>
              
              <View className="flex-row gap-2 mt-2">
                {pokemon.tipos.map((tipo) => (
                  <View
                    key={tipo}
                    className="px-4 py-1 rounded-full border border-white/10"
                    style={{ backgroundColor: `${CORES_HEX[tipo.toLowerCase()]}40` }}
                  >
                    <Text className="text-white font-bold text-[10px] uppercase tracking-widest">
                      {tipo}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="flex-row justify-around py-6 mt-6 border-y border-white/5">
              <View className="items-center">
                <View className="flex-row items-center gap-2 mb-1">
                  <Weight size={14} color="#a1a1aa" />
                  <Text className="text-white font-bold">{(pokemon.peso / 10).toFixed(1)} KG</Text>
                </View>
                <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Peso</Text>
              </View>
              <View className="items-center">
                <View className="flex-row items-center gap-2 mb-1">
                  <Ruler size={14} color="#a1a1aa" />
                  <Text className="text-white font-bold">{(pokemon.altura / 10).toFixed(1)} M</Text>
                </View>
                <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Altura</Text>
              </View>
            </View>

            <View className="mt-8">
              <Text className="text-zinc-400 text-[10px] font-black uppercase tracking-[4px] mb-6">Base Stats</Text>
              
              <View className="gap-5">
                {pokemon.poderes.map((stat) => {
                  const statKey = stat.nome.toLowerCase();
                  const config = STAT_CONFIGS[statKey] || { label: stat.nome.toUpperCase(), max: 200, color: hexColor };
                  const percentage = Math.min((stat.forca / config.max) * 100, 100);

                  return (
                    <View key={stat.nome} className="flex-row items-center gap-4">
                      <View className="w-10">
                        <Text className="text-zinc-500 font-mono text-[9px] font-bold">{config.label}</Text>
                      </View>
                      <View className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <View 
                          style={{ width: `${percentage}%`, backgroundColor: config.color }} 
                          className="h-full rounded-full"
                        />
                      </View>
                      <View className="w-8 items-end">
                        <Text className="text-white font-mono text-[10px] font-bold">{stat.forca}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View className="flex-row gap-3 mt-12 mb-6">
              <Pressable 
                onPress={onToggleShiny}
                className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center gap-2 border ${isShiny ? 'bg-amber-400 border-amber-400' : 'bg-transparent border-white/10'}`}
              >
                <Sparkles size={18} color={isShiny ? "#000" : "#a1a1aa"} />
                <Text className={`font-black text-[10px] uppercase ${isShiny ? 'text-black' : 'text-zinc-400'}`}>
                  Shiny
                </Text>
              </Pressable>

              <Pressable 
                onPress={() => onCatch?.(pokemon)}
                disabled={isCaught}
                style={{ backgroundColor: isCaught ? '#1a1a1a' : '#FF421C' }}
                className="flex-[1.5] h-14 rounded-2xl flex-row items-center justify-center gap-3"
              >
                <Backpack size={18} color={isCaught ? "#52525b" : "#fff"} />
                <Text className={`font-black text-[10px] uppercase ${isCaught ? 'text-zinc-600' : 'text-white'}`}>
                  {isCaught ? "Capturado" : "Capturar Sp."}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: '#0A0A0A',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  header: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bgId: {
    position: 'absolute',
    top: 10,
    left: 20,
    fontSize: 80,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.05)',
    fontStyle: 'italic',
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 50,
  },
  pokemonImage: {
    width: 200,
    height: 200,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  }
});