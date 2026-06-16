import React, { useEffect, useState } from "react";
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
});
