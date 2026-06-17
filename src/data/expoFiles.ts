export interface ExpoFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const EXPO_FILES: ExpoFile[] = [
  {
    name: "README.md",
    path: "README.md",
    language: "markdown",
    content: `# Pokedex Expo TypeScript (React Native) Project

Este é o código-fonte convertido integralmente para o **Expo CLI com TypeScript**, mantendo a interface escura de altíssima fidelidade ("Artistic Flair Dark Theme") adaptada para as restrições nativas do React Native.

## 🚀 Como Executar

### 1. Criar novo projeto Expo
Se você já possui um projeto Expo existente, pode pular para o passo 2. Caso contrário:
\`\`\`bash
npx create-expo-app@latest meu-pokedex-app --template blank-typescript
cd meu-pokedex-app
\`\`\`

### 2. Instalar as Dependências Necessárias
O aplicativo utiliza ícones padrão integrados no Expo (\`@expo/vector-icons\`). Certifique-se de que estão instaladas as dependências recomendadas:
\`\`\`bash
npx expo install @expo/vector-icons
\`\`\`

### 3. Copiar os Arquivos
Mova ou copie os arquivos desta pasta para a estrutura do seu projeto Expo:
- \`App.tsx\` para a raiz do seu aplicativo.
- \`types.ts\` para a raiz ou pasta compartilhada do seu aplicativo.
- \`utils/pokeapi.ts\` para a subpasta equivalente correspondente.
- \`components/PokemonCard.tsx\` e \`components/PokemonModal.tsx\` para a sua pasta de componentes.

### 4. Executar o Servidor de Desenvolvimento Expo
\`\`\`bash
npx expo start
\`\`\`
Use o aplicativo **Expo Go** no seu smartphone (iOS/Android) ou execute em um emulador correspondente pressionando \`a\` (para Android) ou \`i\` (para iOS) no terminal.`
  },
  {
    name: "App.tsx",
    path: "App.tsx",
    language: "tsx",
    content: `import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView, 
  ActivityIndicator, 
  StatusBar 
} from "react-native";
import { getPokemon } from "./utils/pokeapi";
import { Pokemon, CORES_HEX } from "./types";
import { PokemonCard } from "./components/PokemonCard";
import { PokemonModal } from "./components/PokemonModal";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("id-asc");
  const [isShinyMaster, setIsShinyMaster] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch pokemons on mount
  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const data = await getPokemon(151); // Generation I
        setPokemonList(data);
      } catch (err) {
        console.error(err);
        setErrorMsg("Não foi possível carregar os dados dos Pokémon.");
      } finally {
        setLoading(false);
      }
    };
    loadPokemons();
  }, []);

  const filteredPokemon = pokemonList.filter((pkmn) => {
    const matchesSearch =
      pkmn.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkmn.id.toString().includes(searchQuery);

    const matchesType = selectedType === "" || pkmn.tipos.map(t => t.toLowerCase()).includes(selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

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
    return 0;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSortOption("id-asc");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* TOP COMPACT HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoPrimary}>POKÉ</Text>
          <Text style={styles.logoSecondary}>DEX</Text>
        </View>

        {/* Global shiny toggler */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsShinyMaster(!isShinyMaster)}
          style={[styles.globalShinyBtn, isShinyMaster ? styles.activeShinyBtn : styles.inactiveShinyBtn]}
        >
          <Ionicons name="sparkles" size={12} color={isShinyMaster ? "#0A0A0A" : "#FBBF24"} />
          <Text style={[styles.globalShinyText, { color: isShinyMaster ? "#0A0A0A" : "#FFF" }]}>
            SHINY {isShinyMaster ? "ON" : "OFF"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH AND FILTERS */}
      <View style={styles.toolbox}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={14} color="#71717A" style={styles.searchIcon} />
          <TextInput
            placeholder="NOME OU CODIGO BIOMÉTRICO (E.G. 006)..."
            placeholderTextColor="#52525B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoCapitalize="characters"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>LIMPAR</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Horizontal Scroll Types row */}
        <View style={styles.typeSelectorWrapper}>
          <Text style={styles.elementLabel}>CLASSE ELEMENTAL</Text>
          <FlatList
            horizontal
            data={Object.keys(CORES_HEX)}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeListContent}
            renderItem={({ item }) => {
              const isSelected = selectedType === item;
              const typeColor = CORES_HEX[item];
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedType(isSelected ? "" : item)}
                  style={[
                    styles.typeSelectorBadge,
                    isSelected ? styles.typeSelected : styles.typeUnselected
                  ]}
                >
                  <View style={[styles.dotIndicator, { backgroundColor: typeColor }]} />
                  <Text style={[styles.typeSelectorText, { color: isSelected ? "#0A0A0A" : "#D4D4D8" }]}>
                    {item.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      {/* MAIN POKEMONS LIST */}
      {loading ? (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="small" color="#FF421C" />
          <Text style={styles.feedbackText}>INICIALIZANDO PORTAL BIOMÉTRICO...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.feedbackContainer}>
          <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          <Text style={styles.feedbackErrorTitle}>ERRO DE CONEXÃO</Text>
          <Text style={styles.feedbackErrorSubtitle}>{errorMsg}</Text>
        </View>
      ) : sortedPokemon.length === 0 ? (
        <View style={styles.feedbackContainer}>
          <Ionicons name="funnel-outline" size={32} color="#52525B" />
          <Text style={styles.feedbackText}>ESPÉCIE NÃO MAPEADA</Text>
          <TouchableOpacity onPress={handleResetFilters} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>MOSTRAR DISPONÍVEIS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedPokemon}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.pokemonGrid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              isShiny={isShinyMaster}
              onSelect={(p) => setSelectedPokemon(p)}
            />
          )}
        />
      )}

      {/* POPUP DETAIL DIALOG */}
      <PokemonModal
        pokemon={selectedPokemon}
        isShiny={isShinyMaster}
        onToggleShiny={() => setIsShinyMaster(!isShinyMaster)}
        onClose={() => setSelectedPokemon(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  logoRow: {
    flexDirection: "row",
  },
  logoPrimary: {
    fontSize: 18,
    fontWeight: "900",
    color: "#F5F5F5",
    letterSpacing: -0.5,
  },
  logoSecondary: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FF421C",
    letterSpacing: -0.5,
  },
  globalShinyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
  },
  activeShinyBtn: {
    backgroundColor: "#FBBF24",
    borderColor: "#FBBF24",
  },
  inactiveShinyBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  globalShinyText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  toolbox: {
    padding: 16,
    gap: 12,
  },
  searchRow: {
    flexDirection: "row",
    backgroundColor: "#161614",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#F5F5F5",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  clearBtn: {
    paddingHorizontal: 6,
  },
  clearBtnText: {
    color: "#FF421C",
    fontSize: 9,
    fontWeight: "900",
  },
  typeSelectorWrapper: {
    marginTop: 4,
  },
  elementLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: "#FF421C",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  typeListContent: {
    gap: 6,
    paddingRight: 20,
  },
  typeSelectorBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    gap: 5,
  },
  typeSelected: {
    backgroundColor: "#F5F5F5",
    borderColor: "transparent",
  },
  typeUnselected: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typeSelectorText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  pokemonGrid: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  feedbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  feedbackText: {
    color: "#71717A",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  feedbackErrorTitle: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  feedbackErrorSubtitle: {
    color: "#71717A",
    fontSize: 10,
    textAlign: "center",
  },
  resetBtn: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FF421C",
    borderRadius: 4,
  },
  resetBtnText: {
    color: "#0A0A0A",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});`
  },
  {
    name: "PokemonCard.tsx",
    path: "components/PokemonCard.tsx",
    language: "tsx",
    content: `import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Pokemon, CORES_HEX } from "../types";
import { Ionicons } from "@expo/vector-icons";

// Calculate dynamic card sizes
const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // Two columns grid with 16px horizontal margins and 16px gap

interface PokemonCardProps {
  pokemon: Pokemon;
  isShiny: boolean;
  onSelect: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, isShiny, onSelect }: PokemonCardProps) {
  const primaryType = pokemon.tipos[0]?.toLowerCase() || "normal";
  const hexColor = CORES_HEX[primaryType] || CORES_HEX.normal;

  const getStat = (name: string) => {
    return pokemon.poderes.find((p) => p.nome.toLowerCase() === name || p.nome.toLowerCase().includes(name))?.forca || 50;
  };

  const attack = getStat("attack");
  const speed = getStat("speed");
  const displayId = \`No. \${pokemon.id.toString().padStart(3, "0")}\`;

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onSelect(pokemon)}
      style={styles.card}
    >
      {/* Decorative colored glow representation */}
      <View style={[styles.glowBackdrop, { backgroundColor: hexColor }]} />

      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.idContainer}>
          <View style={styles.idIndicator} />
          <Text style={styles.idText}>{displayId}</Text>
        </View>
        {isShiny && (
          <View style={styles.shinyBadge}>
            <Text style={styles.shinyBadgeText}>✨ SHINY</Text>
          </View>
        )}
      </View>

      {/* Pokémon Image inside subtle glow circle */}
      <View style={styles.imageContainer}>
        <View style={[styles.imageBg, { backgroundColor: hexColor, opacity: 0.15 }]} />
        <Image
          source={{ uri: isShiny ? pokemon.imagemShiny : pokemon.imagem }}
          style={styles.pokemonImage}
          resizeMode="contain"
        />
      </View>

      {/* Info Section */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {pokemon.nome}
        </Text>

        {/* Types representation */}
        <View style={styles.typesRow}>
          {pokemon.tipos.map((tipo) => {
            const typeColor = CORES_HEX[tipo.toLowerCase()] || CORES_HEX.normal;
            return (
              <View 
                key={tipo} 
                style={[styles.typeBadge, { backgroundColor: typeColor }]}
              >
                <Text style={styles.typeText}>{tipo.toUpperCase()}</Text>
              </View>
            );
          })}
        </View>

        {/* Physical Traits */}
        <View style={styles.traitsRow}>
          <View style={[styles.traitCol, styles.traitBorder]}>
            <Ionicons name="resize-outline" size={12} color="#888" />
            <Text style={styles.traitText}>{(pokemon.altura / 10).toFixed(1)}M</Text>
          </View>
          <View style={styles.traitCol}>
            <Ionicons name="barbell-outline" size={12} color="#888" />
            <Text style={styles.traitText}>{(pokemon.peso / 10).toFixed(1)}KG</Text>
          </View>
        </View>

        {/* Biometrics bars */}
        <View style={styles.statsContainer}>
          {/* Attack bar */}
          <View style={styles.statBarWrapper}>
            <View style={styles.statLabelRow}>
              <Text style={styles.statLabel}>ATAQUE</Text>
              <Text style={styles.statValue}>{attack}</Text>
            </View>
            <View style={styles.barTrack}>
              <View 
                style={[
                  styles.barFill, 
                  { backgroundColor: "#FF421C", width: \`\${Math.min((attack / 150) * 100, 100)}%\` }
                ]} 
              />
            </View>
          </View>

          {/* Speed bar */}
          <View style={styles.statBarWrapper}>
            <View style={styles.statLabelRow}>
              <Text style={styles.statLabel}>VELOCIDADE</Text>
              <Text style={styles.statValue}>{speed}</Text>
            </View>
            <View style={styles.barTrack}>
              <View 
                style={[
                  styles.barFill, 
                  { backgroundColor: hexColor, width: \`\${Math.min((speed / 150) * 100, 100)}%\` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 14,
    margin: 6,
    width: cardWidth,
    position: "relative",
    overflow: "hidden",
  },
  glowBackdrop: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  idIndicator: {
    height: 2,
    width: 6,
    backgroundColor: "#FF421C",
    marginRight: 4,
  },
  idText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#FF421C",
    letterSpacing: 1,
  },
  shinyBadge: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  shinyBadgeText: {
    color: "#FBBF24",
    fontSize: 7,
    fontWeight: "bold",
  },
  imageContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 4,
  },
  imageBg: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    zIndex: 1,
  },
  info: {
    marginTop: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F5F5F5",
    textTransform: "uppercase",
    fontStyle: "italic",
    letterSpacing: -0.5,
  },
  typesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  typeText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#0A0A0A",
  },
  traitsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 6,
    marginTop: 10,
  },
  traitCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  traitBorder: {
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  traitText: {
    color: "#A1A1AA",
    fontSize: 8,
    fontWeight: "bold",
  },
  statsContainer: {
    marginTop: 10,
    gap: 6,
  },
  statBarWrapper: {
    width: "100%",
  },
  statLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 7,
    color: "#71717A",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 8,
    color: "#D4D4D8",
    fontWeight: "bold",
  },
  barTrack: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 1,
  },
});`
  },
  {
    name: "PokemonModal.tsx",
    path: "components/PokemonModal.tsx",
    language: "tsx",
    content: `import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from "react-native";
import { Pokemon, CORES_HEX } from "../types";
import { Ionicons } from "@expo/vector-icons";

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isShiny: boolean;
  onToggleShiny: () => void;
  onClose: () => void;
}

export function PokemonModal({ pokemon, isShiny, onToggleShiny, onClose }: PokemonModalProps) {
  if (!pokemon) return null;

  const primaryType = pokemon.tipos[0]?.toLowerCase() || "normal";
  const hexColor = CORES_HEX[primaryType] || CORES_HEX.normal;

  // Maximum benchmark scales for visualization
  const STAT_MAX: Record<string, { label: string; max: number; icon: string }> = {
    hp: { label: "Vida (HP)", max: 250, icon: "heart-outline" },
    attack: { label: "Ataque", max: 190, icon: "flash-outline" },
    defense: { label: "Defesa", max: 230, icon: "shield-half-outline" },
    "special-attack": { label: "Atq. Especial", max: 194, icon: "flame-outline" },
    "special-defense": { label: "Def. Especial", max: 230, icon: "shield-outline" },
    speed: { label: "Velocidade", max: 180, icon: "speedometer-outline" },
  };

  const getStatInfo = (name: string) => {
    const formatted = name.toLowerCase();
    if (STAT_MAX[formatted]) return STAT_MAX[formatted];
    if (formatted.includes("special-attack")) return STAT_MAX["special-attack"];
    if (formatted.includes("special-defense")) return STAT_MAX["special-defense"];
    return { label: name.toUpperCase(), max: 200, icon: "trophy-outline" };
  };

  const totalStats = pokemon.poderes.reduce((acc, curr) => acc + curr.forca, 0);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={pokemon !== null}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Transparent dismiss helper outside container */}
        <TouchableOpacity style={styles.dismissOverlay} onPress={onClose} />

        {/* Modal Container */}
        <View style={styles.modalContent}>
          
          {/* Header Banner */}
          <View style={[styles.headerBanner, { backgroundColor: \`\${hexColor}20\` }]}>
            {/* Decoy watermark overlay text */}
            <Text style={styles.watermarkText}>{primaryType}</Text>

            {/* Back action */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#F5F5F5" />
            </TouchableOpacity>

            {/* Id Badge */}
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>NO. {pokemon.id.toString().padStart(3, "0")}</Text>
            </View>
          </View>

          {/* Body */}
          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            
            {/* Pokemon floating image positioning spacer */}
            <View style={styles.imageSpacer}>
              <Image
                source={{ uri: isShiny ? pokemon.imagemShiny : pokemon.imagem }}
                style={styles.floatingImage}
                resizeMode="contain"
              />
            </View>

            {/* Basic Identity Info */}
            <View style={styles.identitySection}>
              <Text style={styles.name}>{pokemon.nome}</Text>
              
              <View style={styles.typesRow}>
                {pokemon.tipos.map((tipo) => {
                  const typeColor = CORES_HEX[tipo.toLowerCase()] || CORES_HEX.normal;
                  return (
                    <View key={tipo} style={[styles.typeBadge, { backgroundColor: typeColor }]}>
                      <Text style={styles.typeText}>{tipo.toUpperCase()}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Shiny form button */}
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={onToggleShiny} 
              style={[styles.shinyToggleBtn, isShiny ? styles.shinyBtnActive : styles.shinyBtnInactive]}
            >
              <Ionicons name="sparkles" size={12} color={isShiny ? "#0A0A0A" : "#FBBF24"} />
              <Text style={[styles.shinyToggleText, { color: isShiny ? "#0A0A0A" : "#D4D4D8" }]}>
                {isShiny ? "EXIBINDO FORMA SHINY" : "VER FORMA SHINY (BRILHANTE)"}
              </Text>
            </TouchableOpacity>

            {/* Physical Traits Grid */}
            <View style={styles.traitsGrid}>
              <View style={[styles.traitCol, styles.traitBorder]}>
                <View style={styles.traitLabelRow}>
                  <Ionicons name="resize-outline" size={14} color="#888" />
                  <Text style={styles.traitLabel}>ALTURA</Text>
                </View>
                <Text style={styles.traitValue}>
                  {(pokemon.altura / 10).toFixed(1)} <Text style={styles.traitUnit}>M</Text>
                </Text>
              </View>

              <View style={styles.traitCol}>
                <View style={styles.traitLabelRow}>
                  <Ionicons name="barbell-outline" size={14} color="#888" />
                  <Text style={styles.traitLabel}>PESO</Text>
                </View>
                <Text style={styles.traitValue}>
                  {(pokemon.peso / 10).toFixed(1)} <Text style={styles.traitUnit}>KG</Text>
                </Text>
              </View>
            </View>

            {/* Statistics Sheet */}
            <View style={styles.statsPanel}>
              <View style={styles.statsPanelHeader}>
                <Text style={styles.statsHeaderTitle}>BIOMETRIC PROFILE STATUS</Text>
                <View style={styles.totalBadge}>
                  <Ionicons name="trophy-outline" size={10} color="#FFD700" style={{ marginRight: 3 }} />
                  <Text style={styles.totalBadgeText}>TOTAL: {totalStats}</Text>
                </View>
              </View>

              <View style={styles.statList}>
                {pokemon.poderes.map((stat) => {
                  const info = getStatInfo(stat.nome);
                  const statPercentage = Math.min((stat.forca / info.max) * 100, 100);

                  return (
                    <View key={stat.nome} style={styles.statItem}>
                      <View style={styles.statInfoRow}>
                        <View style={styles.statNameCol}>
                          <Ionicons name={info.icon as any} size={13} color="#71717A" style={{ marginRight: 6 }} />
                          <Text style={styles.statNameText}>{info.label}</Text>
                        </View>
                        <Text style={styles.statValueText}>
                          {stat.forca} <Text style={styles.statMaxText}>/ {info.max}</Text>
                        </Text>
                      </View>

                      {/* Bar indicator */}
                      <View style={styles.trackBar}>
                        <View style={[styles.fillBar, { backgroundColor: hexColor, width: \`\${statPercentage}%\` }]} />
                      </View>
                    </View>
                  );
                })}
              </View>

            </View>

          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(5, 5, 5, 0.85)",
    justifyContent: "flex-end",
  },
  dismissOverlay: {
    position: "absolute",
    inset: 0,
  },
  modalContent: {
    backgroundColor: "#0F0F0B",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    maxHeight: "88%",
  },
  headerBanner: {
    height: 110,
    justifyContent: "center",
    position: "relative",
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    overflow: "hidden",
  },
  watermarkText: {
    position: "absolute",
    right: -10,
    top: 5,
    fontSize: 64,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 0.02)",
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#D4D4D8",
    letterSpacing: 1,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageSpacer: {
    alignItems: "center",
    height: 90,
    justifyContent: "center",
    zIndex: 10,
  },
  floatingImage: {
    width: 140,
    height: 140,
    position: "absolute",
    top: -80,
  },
  identitySection: {
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: "900",
    color: "#F5F5F5",
    textTransform: "uppercase",
    fontStyle: "italic",
    letterSpacing: -0.5,
  },
  typesRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 3,
  },
  typeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0A0A0A",
    letterSpacing: 0.5,
  },
  shinyToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 18,
    borderWidth: 1,
  },
  shinyBtnActive: {
    backgroundColor: "#FF421C",
    borderColor: "#EF4444",
  },
  shinyBtnInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  shinyToggleText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  traitsGrid: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    marginTop: 22,
    padding: 14,
  },
  traitCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  traitLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  traitLabel: {
    color: "#71717A",
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  traitBorder: {
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  traitValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#F5F5F5",
  },
  traitUnit: {
    fontSize: 11,
    fontWeight: "normal",
    color: "#71717A",
  },
  statsPanel: {
    marginTop: 24,
  },
  statsPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 6,
    marginBottom: 14,
  },
  statsHeaderTitle: {
    fontSize: 8,
    color: "#A1A1AA",
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  totalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  totalBadgeText: {
    color: "#E4E4E7",
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statList: {
    gap: 12,
  },
  statItem: {
    width: "100%",
  },
  statInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  statNameCol: {
    flexDirection: "row",
    alignItems: "center",
  },
  statNameText: {
    fontSize: 10,
    color: "#D4D4D8",
    fontWeight: "bold",
  },
  statValueText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F5F5F5",
  },
  statMaxText: {
    fontSize: 8,
    color: "#52525B",
  },
  trackBar: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  fillBar: {
    height: "100%",
  },
});`
  },
  {
    name: "PokemonProfile.tsx",
    path: "components/PokemonProfile.tsx",
    language: "tsx",
    content: `import React, { useState } from "react";
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
} from "react-native";
import { Pokemon, CORES_HEX } from "../types";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

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
];

interface PokemonProfileProps {
  onClose?: () => void;
  onLogout?: () => void;
}

export function PokemonProfile({ onClose, onLogout }: PokemonProfileProps) {
  const [trainer, setTrainer] = useState({
    nome: "Ash Ketchum",
    titulo: "Mestre Pokémon",
    nivel: 32,
    xp: 85,
    insignias: 8,
    vitorias: 242,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ash",
  });

  const [pokebag, setPokebag] = useState<Pokemon[]>(DEFAULT_POKEBAG);
  const [battleTeam, setBattleTeam] = useState<Pokemon[]>([DEFAULT_POKEBAG[0], DEFAULT_POKEBAG[1]]);

  const addToBattleTeam = (pokemon: Pokemon) => {
    if (battleTeam.some((p) => p.id === pokemon.id)) return;
    if (battleTeam.length >= 6) return;
    setBattleTeam([...battleTeam, pokemon]);
  };

  const removeFromBattleTeam = (id: number) => {
    setBattleTeam(battleTeam.filter((p) => p.id !== id));
  };

  const shiftTeamOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= battleTeam.length) return;
    const updated = [...battleTeam];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBattleTeam(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topStickyHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
          <Text style={styles.backButtonText}>Pokedex</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAINEL DO TREINADOR</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBackground}>
          <TouchableOpacity style={styles.logoutFloatingButton} onPress={onLogout}>
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

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pokebag.length}</Text>
            <Text style={styles.statLabel}>POKEBAG</Text>
            <View style={styles.glassInnerBorder} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{trainer.insignias}</Text>
            <Text style={styles.statLabel}>INSÍGNIAS</Text>
            <View style={styles.glassInnerBorder} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{trainer.vitorias}</Text>
            <Text style={styles.statLabel}>VITÓRIAS</Text>
            <View style={styles.glassInnerBorder} />
          </View>
        </View>

        <View style={styles.xpSection}>
          <View style={styles.xpRow}>
            <Text style={styles.xpTitle}>Nível de Experiência</Text>
            <Text style={styles.xpValue}>{trainer.xp}%</Text>
          </View>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: "\${trainer.xp}%" }]} />
          </View>
        </View>

        <View style={styles.sectionHeaderWrapper}>
          <Text style={styles.sectionTitle}>TIME DE BATALHA (\${battleTeam.length}/6)</Text>
          <Text style={styles.sectionSubtitle}>Ordem de entrada ativa</Text>
        </View>

        <View style={styles.battleTeamList}>
          {battleTeam.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>TIME VAZIO</Text>
            </View>
          ) : (
            battleTeam.map((poke, index) => (
              <View key={poke.id} style={styles.teamMemberRow}>
                <Text style={styles.battleOrderIndex}>\${index + 1}º</Text>
                <Image source={{ uri: poke.imagem }} style={styles.teamMemberImage} />
                <Text style={styles.teamMemberName}>\${poke.nome.toUpperCase()}</Text>
                <View style={styles.actionControls}>
                  <TouchableOpacity onPress={() => shiftTeamOrder(index, "up")} disabled={index === 0}>
                    <Ionicons name="chevron-up" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => shiftTeamOrder(index, "down")} disabled={index === battleTeam.length - 1}>
                    <Ionicons name="chevron-down" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeFromBattleTeam(poke.id)}>
                    <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionHeaderWrapper}>
          <Text style={styles.sectionTitle}>MINHA POKEBAG (\${pokebag.length})</Text>
        </View>

        <View style={styles.pokebagGrid}>
          {pokebag.map((poke) => {
            const inTeam = battleTeam.some((p) => p.id === poke.id);
            return (
              <View key={poke.id} style={styles.pokebagCard}>
                <Image source={{ uri: poke.imagem }} style={styles.pokebagCardImage} />
                <Text style={styles.pokebagCardName}>\${poke.nome}</Text>
                <TouchableOpacity
                  onPress={() => inTeam ? removeFromBattleTeam(poke.id) : addToBattleTeam(poke)}
                  style={styles.cardActionButton}
                >
                  <Text style={styles.cardActionButtonText}>
                    {inTeam ? "EM TIME" : "ADICIONAR"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#060604" },
  topStickyHeader: { height: 60, backgroundColor: "#0A0A0A", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 },
  backButton: { flexDirection: "row", alignItems: "center" },
  backButtonText: { color: "#FFF", fontWeight: "bold", marginLeft: 4 },
  headerTitle: { fontSize: 10, fontWeight: "950", color: "#FF421C" },
  scrollContent: { paddingBottom: 80 },
  headerBackground: { paddingVertical: 30, alignItems: "center", backgroundColor: "#0E0E0B", position: "relative" },
  logoutFloatingButton: { position: "absolute", top: 15, right: 15, width: 36, height: 36, backgroundColor: "rgba(255,93,93,0.1)", justifyContent: "center", alignItems: "center", borderRadius: 10 },
  glassBorder: { borderWidth: 1, borderColor: "rgba(255,93,93,0.2)" },
  pokeballDecor: { position: "absolute", alpha: 0.1 },
  avatarWrapper: { position: "relative" },
  avatarGlass: { width: 90, height: 90, borderRadius: 45, borderColor: "#48D0B0", borderWidth: 2, justifyContent: "center", alignItems: "center" },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  levelBadge: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#FFCE4B", width: 26, height: 26, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  levelText: { fontWeight: "bold", fontSize: 11 },
  trainerName: { fontSize: 20, fontWeight: "900", color: "#FFF", marginTop: 10 },
  trainerTitle: { fontSize: 11, color: "#FF421C", marginTop: 4, fontWeight: "bold" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginTop: -15 },
  statBox: { flex: 1, height: 60, backgroundColor: "#141411", borderRadius: 10, justifyContent: "center", alignItems: "center", marginHorizontal: 4 },
  glassInnerBorder: { borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  statValue: { fontSize: 16, fontWeight: "900", color: "#FFF" },
  statLabel: { fontSize: 8, color: "#71717A", marginTop: 2 },
  xpSection: { paddingHorizontal: 20, marginTop: 20 },
  xpRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  xpTitle: { fontSize: 10, color: "#D4D4D8", fontWeight: "bold" },
  xpValue: { fontSize: 10, color: "#48D0B0", fontWeight: "bold" },
  xpBarBackground: { height: 6, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3 },
  xpBarFill: { height: "100%", backgroundColor: "#48D0B0", borderRadius: 3 },
  sectionHeaderWrapper: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 12, fontWeight: "950", color: "#FFF" },
  sectionSubtitle: { fontSize: 8, color: "#71717A" },
  battleTeamList: { paddingHorizontal: 16, marginTop: 10 },
  emptyContainer: { padding: 15, backgroundColor: "rgba(255,255,255,0.02)", alignItems: "center" },
  emptyText: { color: "#71717A", fontSize: 10 },
  teamMemberRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: 8, borderRadius: 8, marginVertical: 4 },
  battleOrderIndex: { color: "#FFCE4B", fontWeight: "bold", width: 30 },
  teamMemberImage: { width: 36, height: 36 },
  teamMemberName: { flex: 1, color: "#FFF", fontWeight: "bold", fontSize: 12, marginLeft: 10 },
  actionControls: { flexDirection: "row", gap: 10 },
  pokebagGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 10, marginTop: 10 },
  pokebagCard: { width: "47%", backgroundColor: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 8, alignItems: "center" },
  pokebagCardImage: { width: 50, height: 50 },
  pokebagCardName: { color: "#FFF", fontSize: 11, fontWeight: "bold", marginTop: 5 },
  cardActionButton: { backgroundColor: "rgba(255,255,255,0.05)", width: "100%", paddingVertical: 4, borderRadius: 5, marginTop: 8, alignItems: "center" },
  cardActionButtonText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
});
`
  },
  {
    name: "types.ts",
    path: "types.ts",
    language: "typescript",
    content: `export interface Poder {
  nome: string;
  forca: number;
}

export interface Pokemon {
  id: number;
  index: string;
  nome: string;
  imagem: string;
  imagemShiny: string;
  tipos: string[];
  poderes: Poder[];
  altura: number; // in decimeters
  peso: number;   // in hectograms
}

export const CORES_HEX: Record<string, string> = {
  fire: "#FF421C",
  water: "#2E9AFE",
  grass: "#48D0B0",
  electric: "#FFD700",
  psychic: "#FF4675",
  ice: "#51C4E7",
  dragon: "#7038F8",
  fighting: "#C03028",
  poison: "#A040A0",
  normal: "#A8A878",
  bug: "#A8B820",
  flying: "#A890F0",
  ground: "#E0C068",
  rock: "#B8A038",
  ghost: "#705898",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  dark: "#705848",
};`
  },
  {
    name: "pokeapi.ts",
    path: "utils/pokeapi.ts",
    language: "typescript",
    content: `import { Pokemon } from "../types";

export const getPokemon = async (limit = 151): Promise<Pokemon[]> => {
  try {
    const response = await fetch(\`https://pokeapi.co/api/v2/pokemon?limit=\${limit}\`);
    if (!response.ok) {
      throw new Error(\`Failed to fetch list\`);
    }
    const data = await response.json();
    const pokemonList = data.results;

    const pokemonDetails = await Promise.all(
      pokemonList.map(async (pokemon: { name: string; url: string }) => {
        try {
          const detailsResponse = await fetch(pokemon.url);
          const details = await detailsResponse.json();

          const artworkDefault = details.sprites.other?.["official-artwork"]?.front_default || details.sprites.front_default;
          const artworkShiny = details.sprites.other?.["official-artwork"]?.front_shiny || details.sprites.front_shiny || details.sprites.front_default;

          return {
            id: details.id,
            index: details.id.toString().padStart(3, "0"),
            nome: details.name,
            imagem: artworkDefault,
            imagemShiny: artworkShiny,
            tipos: details.types.map((t: any) => t.type.name),
            poderes: details.stats.map((s: any) => ({
              nome: s.stat.name,
              forca: s.base_stat,
            })),
            altura: details.height,
            peso: details.weight,
          } as Pokemon;
        } catch {
          return null;
        }
      })
    );

    return pokemonDetails.filter((p): p is Pokemon => p !== null);
  } catch {
    return getFallbackPokemons();
  }
};`
  }
];
