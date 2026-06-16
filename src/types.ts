export interface Poder {
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

export const CORES_TIPOS: Record<string, { bg: string; text: string; shadow: string; border: string }> = {
  fire: {
    bg: "bg-[#FF421C]",
    text: "text-[#FF421C]",
    shadow: "shadow-[0_0_25px_rgba(255,66,28,0.3)]",
    border: "border-[#FF421C]/30",
  },
  water: {
    bg: "bg-[#2E9AFE]",
    text: "text-[#2E9AFE]",
    shadow: "shadow-[0_0_25px_rgba(46,154,254,0.3)]",
    border: "border-[#2E9AFE]/30",
  },
  grass: {
    bg: "bg-[#48D0B0]",
    text: "text-[#48D0B0]",
    shadow: "shadow-[0_0_25px_rgba(72,208,176,0.3)]",
    border: "border-[#48D0B0]/30",
  },
  electric: {
    bg: "bg-[#FFD700]",
    text: "text-[#FFD700]",
    shadow: "shadow-[0_0_25px_rgba(255,215,0,0.3)]",
    border: "border-[#FFD700]/30",
  },
  psychic: {
    bg: "bg-[#FF4675]",
    text: "text-[#FF4675]",
    shadow: "shadow-[0_0_25px_rgba(255,70,117,0.3)]",
    border: "border-[#FF4675]/30",
  },
  ice: {
    bg: "bg-[#51C4E7]",
    text: "text-[#51C4E7]",
    shadow: "shadow-[0_0_25px_rgba(81,196,231,0.3)]",
    border: "border-[#51C4E7]/30",
  },
  dragon: {
    bg: "bg-[#7038F8]",
    text: "text-[#7038F8]",
    shadow: "shadow-[0_0_25px_rgba(112,56,248,0.3)]",
    border: "border-[#7038F8]/30",
  },
  fighting: {
    bg: "bg-[#C03028]",
    text: "text-[#C03028]",
    shadow: "shadow-[0_0_25px_rgba(192,48,40,0.3)]",
    border: "border-[#C03028]/30",
  },
  poison: {
    bg: "bg-[#A040A0]",
    text: "text-[#A040A0]",
    shadow: "shadow-[0_0_25px_rgba(160,64,160,0.3)]",
    border: "border-[#A040A0]/30",
  },
  normal: {
    bg: "bg-[#A8A878]",
    text: "text-[#A8A878]",
    shadow: "shadow-[0_0_25px_rgba(168,168,120,0.2)]",
    border: "border-[#A8A878]/30",
  },
  bug: {
    bg: "bg-[#A8B820]",
    text: "text-[#A8B820]",
    shadow: "shadow-[0_0_25px_rgba(168,184,32,0.2)]",
    border: "border-[#A8B820]/30",
  },
  flying: {
    bg: "bg-[#A890F0]",
    text: "text-[#A890F0]",
    shadow: "shadow-[0_0_25px_rgba(168,144,240,0.2)]",
    border: "border-[#A890F0]/30",
  },
  ground: {
    bg: "bg-[#E0C068]",
    text: "text-[#E0C068]",
    shadow: "shadow-[0_0_25px_rgba(224,192,104,0.2)]",
    border: "border-[#E0C068]/30",
  },
  rock: {
    bg: "bg-[#B8A038]",
    text: "text-[#B8A038]",
    shadow: "shadow-[0_0_25px_rgba(184,160,56,0.2)]",
    border: "border-[#B8A038]/30",
  },
  ghost: {
    bg: "bg-[#705898]",
    text: "text-[#705898]",
    shadow: "shadow-[0_0_25px_rgba(112,88,152,0.3)]",
    border: "border-[#705898]/30",
  },
  steel: {
    bg: "bg-[#B8B8D0]",
    text: "text-[#B8B8D0]",
    shadow: "shadow-[0_0_25px_rgba(184,184,208,0.2)]",
    border: "border-[#B8B8D0]/30",
  },
  fairy: {
    bg: "bg-[#EE99AC]",
    text: "text-[#EE99AC]",
    shadow: "shadow-[0_0_25px_rgba(238,153,172,0.3)]",
    border: "border-[#EE99AC]/30",
  },
  dark: {
    bg: "bg-[#705848]",
    text: "text-[#705848]",
    shadow: "shadow-[0_0_25px_rgba(112,88,72,0.2)]",
    border: "border-[#705848]/30",
  },
};

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
};
