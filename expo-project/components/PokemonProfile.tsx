import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Pokemon, CORES_HEX } from "../types";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Mock default Pokemons to populate the Pokebag and Battle Team initially
const DEFAULT_POKEBAG: Pokemon[] = [
  {
    id: 25,
    index: "025",
    nome: "Pikachu",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    imagemShiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png",
    tipos: ["electric"],
    poderes: [
      { nome: "hp", forca: 35 },
      { nome: "attack", forca: 55 },
      { nome: "defense", forca: 40 },
      { nome: "speed", forca: 90 },
    ],
    altura: 4,
    peso: 60,
  },
  {
    id: 6,
    index: "006",
    nome: "Charizard",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    imagemShiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/6.png",
    tipos: ["fire", "flying"],
    poderes: [
      { nome: "hp", forca: 78 },
      { nome: "attack", forca: 84 },
      { nome: "defense", forca: 78 },
      { nome: "speed", forca: 100 },
    ],
    altura: 17,
    peso: 905,
  },
  {
    id: 9,
    index: "009",
    nome: "Blastoise",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
    imagemShiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/9.png",
    tipos: ["water"],
    poderes: [
      { nome: "hp", forca: 79 },
      { nome: "attack", forca: 83 },
      { nome: "defense", forca: 100 },
      { nome: "speed", forca: 78 },
    ],
    altura: 16,
    peso: 855,
  },
  {
    id: 3,
    index: "003",
    nome: "Venusaur",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
    imagemShiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/3.png",
    tipos: ["grass", "poison"],
    poderes: [
      { nome: "hp", forca: 80 },
      { nome: "attack", forca: 82 },
      { nome: "defense", forca: 83 },
      { nome: "speed", forca: 80 },
    ],
    altura: 20,
    peso: 1000,
  },
];

interface PokemonProfileProps {
  onClose?: () => void;
  onLogout?: () => void;
}

export function PokemonProfile({ onClose, onLogout }: PokemonProfileProps) {
  // Database mock states that will track state interactively in-app
  const [trainer, setTrainer] = useState({
    nome: "Ash Ketchum",
    titulo: "Mestre Pokémon",
    nivel: 32,
    xp: 85,
    insignias: 8,
    vitorias: 242,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ash",
  });

  // Pokebag state: All owned captured species
  const [pokebag, setPokebag] = useState<Pokemon[]>(DEFAULT_POKEBAG);
  
  // Battle Team (Time Respectivo) - ordered, limited to max 6
  const [battleTeam, setBattleTeam] = useState<Pokemon[]>([DEFAULT_POKEBAG[0], DEFAULT_POKEBAG[1]]);

  // Add a pokémon from Pokebag to the Battle Team
  const addToBattleTeam = (pokemon: Pokemon) => {
    if (battleTeam.some((p) => p.id === pokemon.id)) return; // Already in team
    if (battleTeam.length >= 6) return; // Team is full
    setBattleTeam([...battleTeam, pokemon]);
  };

  // Remove a pokémon from the Battle Team
  const removeFromBattleTeam = (id: number) => {
    setBattleTeam(battleTeam.filter((p) => p.id !== id));
  };

  // Change battle order (swap position up or down)
  const shiftTeamOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= battleTeam.length) return;

    const updated = [...battleTeam];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBattleTeam(updated);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Absolute Header Ribbon */}
      <View style={styles.topStickyHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
          <Text style={styles.backButtonText}>Pokedex</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAINEL DO TREINADOR</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header com Pokebola Decorativa */}
        <View style={styles.headerBackground}>
          {/* Botão de Logout Flutuante (Glass Style) */}
          <TouchableOpacity 
            style={styles.logoutFloatingButton} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#FF5D5D" />
            <View style={styles.glassBorder} />
          </TouchableOpacity>

          <View style={styles.pokeballDecor} />
          
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGlass}>
              <Image source={{ uri: trainer.avatar }} style={styles.avatarImage} />
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{trainer.nivel}</Text>
            </View>
          </View>

          <Text style={styles.trainerName}>{trainer.nome}</Text>
          <Text style={styles.trainerTitle}>{trainer.titulo}</Text>
        </View>

        {/* Status Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pokebag.length}</Text>
            <Text style={styles.statLabel}>POKEBAG</Text>
            <View style={styles.glassInnerBorder} />
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{trainer.insignias}</Text>
            <Text style={styles.statLabel}>Insignias</Text>
            <View style={styles.glassInnerBorder} />
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{trainer.vitorias}</Text>
            <Text style={styles.statLabel}>Vitorias</Text>
            <View style={styles.glassInnerBorder} />
          </View>
        </View>

        {/* Experiência progress bar */}
        <View style={styles.xpSection}>
          <View style={styles.xpRow}>
            <Text style={styles.xpTitle}>Nivel de Experiencia</Text>
            <Text style={styles.xpValue}>{trainer.xp}%</Text>
          </View>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: `${trainer.xp}%` }]} />
          </View>
        </View>

        {/* SEÇÃO 1: TIME RESPECTIVO (BATTLE TEAM) - Dynamic and Ordered */}
        <View style={styles.sectionHeaderWrapper}>
          <View style={styles.indicatorPulse} />
          <Text style={styles.sectionTitle}>TIME DE BATALHA ({battleTeam.length}/6)</Text>
          <Text style={styles.sectionSubtitle}>Ordem de entrada em combate ativo</Text>
        </View>

        <View style={styles.battleTeamList}>
          {battleTeam.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-outline" size={32} color="rgba(255,255,255,0.15)" />
              <Text style={styles.emptyText}>NENHUM POKÉMON ESCALADO PARA COMBATE</Text>
              <Text style={styles.emptySubtext}>Adicione pokémons da sua Pokebag abaixo para preencher o time.</Text>
            </View>
          ) : (
            battleTeam.map((poke, index) => {
              const mainType = poke.tipos[0] || "normal";
              const typeColor = CORES_HEX[mainType] || "#FFF";
              return (
                <View key={`${poke.id}-${index}`} style={styles.teamMemberRow}>
                  {/* Battle Order badge */}
                  <View style={[styles.battleOrderBadge, { backgroundColor: typeColor }]}>
                    <Text style={styles.battleOrderIndex}>{index + 1}º</Text>
                    <Text style={styles.battleOrderSub}>BATALHA</Text>
                  </View>

                  <Image source={{ uri: poke.imagem }} style={styles.teamMemberImage} />

                  <View style={styles.teamMemberInfo}>
                    <Text style={styles.teamMemberName}>{poke.nome.toUpperCase()}</Text>
                    <View style={styles.typesRow}>
                      {poke.tipos.map((t) => (
                        <View key={t} style={[styles.typeBadge, { backgroundColor: CORES_HEX[t] || "#71717A" }]}>
                          <Text style={styles.typeText}>{t.toUpperCase()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Ordering and removal actions */}
                  <View style={styles.actionControls}>
                    <TouchableOpacity 
                      onPress={() => shiftTeamOrder(index, "up")}
                      disabled={index === 0}
                      style={[styles.arrowButton, index === 0 && styles.disabledButton]}
                    >
                      <Ionicons name="chevron-up" size={16} color={index === 0 ? "#444" : "#FFF"} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      onPress={() => shiftTeamOrder(index, "down")}
                      disabled={index === battleTeam.length - 1}
                      style={[styles.arrowButton, index === battleTeam.length - 1 && styles.disabledButton]}
                    >
                      <Ionicons name="chevron-down" size={16} color={index === battleTeam.length - 1 ? "#444" : "#FFF"} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => removeFromBattleTeam(poke.id)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.innerGlassBorder} />
                </View>
              );
            })
          )}
        </View>

        {/* SEÇÃO 2: POKEBAG (POKEMONS DISPONÍVEIS) */}
        <View style={styles.sectionHeaderWrapper}>
          <View style={[styles.indicatorPulse, { backgroundColor: "#48D0B0" }]} />
          <Text style={styles.sectionTitle}>MINHA POKEBAG ({pokebag.length})</Text>
          <Text style={styles.sectionSubtitle}>Todos os seus espécimes capturados</Text>
        </View>

        <View style={styles.pokebagGrid}>
          {pokebag.map((poke) => {
            const inTeam = battleTeam.some((p) => p.id === poke.id);
            const mainType = poke.tipos[0] || "normal";
            const hexColor = CORES_HEX[mainType] || "#71717A";

            return (
              <View key={poke.id} style={styles.pokebagCard}>
                <View style={[styles.cardTypeGlow, { backgroundColor: hexColor }]} />
                
                <Image source={{ uri: poke.imagem }} style={styles.pokebagCardImage} />
                <Text style={styles.pokebagCardName}>{poke.nome}</Text>
                
                <View style={styles.cardTypesRow}>
                  {poke.tipos.map((t) => (
                    <View key={t} style={[styles.microTypeBadge, { backgroundColor: CORES_HEX[t] || "#555" }]}>
                      <Text style={styles.microTypeText}>{t.substring(0, 3).toUpperCase()}</Text>
                    </View>
                  ))}
                </View>

                {/* Team addition trigger */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => inTeam ? removeFromBattleTeam(poke.id) : addToBattleTeam(poke)}
                  style={[
                    styles.cardActionButton,
                    inTeam ? styles.cardActionButtonInTeam : styles.cardActionButtonAdd,
                  ]}
                >
                  <Ionicons name={inTeam ? "checkmark-circle" : "add-circle-outline"} size={14} color={inTeam ? "#000" : "#FFF"} />
                  <Text style={[styles.cardActionButtonText, { color: inTeam ? "#000" : "#FFF" }]}>
                    {inTeam ? "EM TIME" : "SABOR TIME"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.innerGlassBorder} />
              </View>
            );
          })}
        </View>

        {/* Sair da Pokédex main button */}
        <TouchableOpacity style={styles.logoutMainButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FF5D5D" style={{ marginRight: 8 }} />
          <Text style={styles.logoutMainText}>Encerrar Sessão do Treinador</Text>
          <View style={styles.glassBorder} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060604", // Dark sci-fi theme matching high fidelity web
  },
  topStickyHeader: {
    height: 60,
    backgroundColor: "#0A0A0A",
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 100,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FF421C",
    letterSpacing: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerBackground: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: "center",
    backgroundColor: "#0E0E0B",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    position: "relative",
  },
  logoutFloatingButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 93, 93, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 93, 93, 0.25)",
  },
  pokeballDecor: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 40,
    borderColor: "rgba(255, 66, 28, 0.03)",
    opacity: 0.5,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  avatarGlass: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(72, 208, 176, 0.1)",
    borderWidth: 3,
    borderColor: "#48D0B0",
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#161614",
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFCE4B",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#0E0E0B",
    justifyContent: "center",
    alignItems: "center",
  },
  levelText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 12,
  },
  trainerName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  trainerTitle: {
    fontSize: 12,
    color: "#FF421C",
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 4,
    textTransform: "uppercase",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: -20,
    zIndex: 10,
    gap: 8,
  },
  statBox: {
    flex: 1,
    height: 70,
    backgroundColor: "#141411",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  glassInnerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
  },
  statLabel: {
    fontSize: 8,
    color: "#71717A",
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 4,
  },
  xpSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  xpTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#E4E4E7",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  xpValue: {
    fontSize: 11,
    fontWeight: "900",
    color: "#48D0B0",
  },
  xpBarBackground: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#48D0B0",
    borderRadius: 4,
  },
  sectionHeaderWrapper: {
    paddingHorizontal: 20,
    marginTop: 35,
    marginBottom: 15,
  },
  indicatorPulse: {
    width: 12,
    height: 2,
    backgroundColor: "#FF421C",
    borderRadius: 1,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "950",
    color: "#FFF",
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: "#71717A",
    marginTop: 2,
    fontStyle: "italic",
  },
  battleTeamList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.01)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    textAlign: "center",
  },
  emptyText: {
    color: "#D4D4D8",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 10,
    textAlign: "center",
  },
  emptySubtext: {
    color: "#52525B",
    fontSize: 8,
    marginTop: 4,
    textAlign: "center",
  },
  teamMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 10,
    position: "relative",
  },
  battleOrderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  battleOrderIndex: {
    fontSize: 12,
    fontWeight: "900",
    color: "#000",
  },
  battleOrderSub: {
    fontSize: 6,
    fontWeight: "905",
    color: "#000",
    letterSpacing: 0.5,
  },
  teamMemberImage: {
    width: 48,
    height: 48,
    marginLeft: 8,
  },
  teamMemberInfo: {
    flex: 1,
    marginLeft: 10,
  },
  teamMemberName: {
    fontSize: 12,
    fontWeight: "Bold",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  typesRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 5,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  typeText: {
    fontSize: 6,
    fontWeight: "bold",
    color: "#000",
  },
  actionControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  arrowButton: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.2,
  },
  removeButton: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "rgba(255,107,107,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  innerGlassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    pointerEvents: "none",
  },
  pokebagGrid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pokebagCard: {
    width: (width - 42) / 2,
    backgroundColor: "rgba(255,255,255,0.01)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  cardTypeGlow: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.08,
  },
  pokebagCardImage: {
    width: 60,
    height: 60,
  },
  pokebagCardName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#E4E4E7",
    marginTop: 6,
    textTransform: "uppercase",
  },
  cardTypesRow: {
    flexDirection: "row",
    gap: 3,
    marginTop: 4,
  },
  microTypeBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  microTypeText: {
    fontSize: 5,
    fontWeight: "900",
    color: "#000",
  },
  cardActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: "100%",
    height: 26,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1,
  },
  cardActionButtonAdd: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardActionButtonInTeam: {
    backgroundColor: "#FBBF24",
    borderColor: "transparent",
  },
  cardActionButtonText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  logoutMainButton: {
    marginHorizontal: 16,
    height: 48,
    backgroundColor: "rgba(255, 93, 93, 0.05)",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 93, 93, 0.15)",
  },
  logoutMainText: {
    color: "#FF5D5D",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
