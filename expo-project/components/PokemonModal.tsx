import React from "react";
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
          <View style={[styles.headerBanner, { backgroundColor: `${hexColor}20` }]}>
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
                referrerPolicy="no-referrer"
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
                        <View style={[styles.fillBar, { backgroundColor: hexColor, width: `${statPercentage}%` }]} />
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
});
