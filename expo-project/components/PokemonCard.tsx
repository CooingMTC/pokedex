import React from "react";
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
  const displayId = `No. ${pokemon.id.toString().padStart(3, "0")}`;

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
          referrerPolicy="no-referrer"
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
                  { backgroundColor: "#FF421C", width: `${Math.min((attack / 150) * 100, 100)}%` }
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
                  { backgroundColor: hexColor, width: `${Math.min((speed / 150) * 100, 100)}%` }
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
});
