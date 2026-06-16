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
