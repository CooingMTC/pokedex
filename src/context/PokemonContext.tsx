import { createContext, useContext } from "react";
import { usePokemonLogic } from "@/hooks/pokemonLogic";

const PokemonContext = createContext<any>(null);

export function PokemonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const logic = usePokemonLogic();

  return (
    <PokemonContext.Provider value={logic}>
      {children}
    </PokemonContext.Provider>
  );
}

export const usePokemon = () => useContext(PokemonContext);