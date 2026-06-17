import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pokemon } from "../types";
import { getPokemon } from "../utils/pokeapi";
import { Alert } from "react-native";

export function usePokemonLogic() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isShinyMaster, setIsShinyMaster] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "pokedex" | "profile" | "pokebag" | "expo"
  >("pokedex");

  const [trainer, setTrainer] = useState({
    userId: "",
    nome: "",
    titulo: "",
    nivel: 1,
    xp: 0,
    insignias: 0,
    vitorias: 0,
    derrotas: 0,
    avatar: "",
  });

  const [pokebag, setPokebag] = useState<Pokemon[]>([]);
  const [battleTeam, setBattleTeam] = useState<Pokemon[]>([]);

  // URL BASE EXTRAÍDA DO SEU POSTMAN (Corrigindo o erro do localhost)
  const BASE_URL =
    "https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon";

  const mapPkmn = (list: any[]): Pokemon[] =>
    list.map((p) => ({
      id: Number(p.index),
      index: p.index,
      nome: p.name,
      imagem: p.image,
      imagemShiny: p.image,
      tipos: p.types || ["normal"],
      poderes: p.abilities
        ? p.abilities.map((a: any) => ({
            nome: a.name,
            forca: a.strength,
          }))
        : [],
      altura: p.altura ?? 0,
      peso: p.peso ?? 0,
    }));

  const loadTrainerTeam = useCallback(async (uid?: string) => {
    try {
      const userId = uid || (await AsyncStorage.getItem("userId"));
      if (!userId) return;

      const response = await fetch(
        `${BASE_URL}/pokemon/v1/team?user-id=${userId}`,
      );
      const data = await response.json();

      const teamFromServer = mapPkmn(data.team || []);
      const capturesFromServer = mapPkmn(data.capture || []);

      const fullBag = [...capturesFromServer];
      teamFromServer.forEach((tp) => {
        if (!fullBag.some((bp) => bp.id === tp.id)) fullBag.push(tp);
      });

      setBattleTeam(teamFromServer);
      setPokebag(fullBag);
    } catch (error) {
      console.error("Erro ao carregar time:", error);
    }
  }, []);

  // --- ATUALIZAR TIME (Conforme PUT do Postman) ---
  const updateTeamOnServer = async (removedId: number, newId: number) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    const url = `${BASE_URL}/pokemon/v1/team?user-id=${userId}`;

    console.log("URL:", url);
    console.log("BODY:", {
      removedPokemon: removedId,
      newPokemon: newId,
    });

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        removedPokemon: removedId,
        newPokemon: newId,
      }),
    });

    const text = await response.text();

    console.log("STATUS:", response.status);
    console.log("RESPOSTA:", text);

    if (!response.ok) {
      throw new Error(text);
    }

    return JSON.parse(text);
  };

  const handleAddToTeam = async (pkmn: Pokemon) => {
    if (battleTeam.some((p) => p.id === pkmn.id)) return;
    try {
      if (battleTeam.length >= 6) {
        await updateTeamOnServer(battleTeam[0].id, pkmn.id);
      } else {
        await updateTeamOnServer(0, pkmn.id);
      }
      await loadTrainerTeam();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o time no servidor.");
    }
  };

  const handleRemoveFromTeam = async (id: number) => {
    console.log("CLIQUEI NA LIXEIRA", id);
    try {
      const replacement = pokebag.find(
        (p) => !battleTeam.some((teamPoke) => teamPoke.id === p.id),
      );

      if (!replacement) {
        Alert.alert(
          "Sem Pokémon disponível",
          "Não há Pokémon no inventário para substituir.",
        );
        return;
      }

      await updateTeamOnServer(id, replacement.id);
      await loadTrainerTeam();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar o time.");
    }
  };

  // --- DELETAR CAPTURADO (Conforme DELETE do Postman) ---
  const handleReleasePokemon = async (id: number) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (battleTeam.some((p) => p.id === id)) {
        await updateTeamOnServer(id, 0);
      }

      const url = `${BASE_URL}/pokemon/v1/captured?user-id=${userId}&pokemon-id=${id}`;
      const response = await fetch(url, { method: "DELETE" });

      if (response.ok) {
        await loadTrainerTeam();
        Alert.alert("Sucesso", "Pokémon libertado.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao deletar Pokémon.");
    }
  };

  // --- ADICIONAR CAPTURADO (Conforme PUT Adicionar do Postman) ---
  const handleCatchPokemon = async (pkmn: Pokemon) => {
    if (pokebag.some((p) => p.id === pkmn.id)) return;
    try {
      const userId = await AsyncStorage.getItem("userId");
      const url = `${BASE_URL}/pokemon/v1/captured?user-id=${userId}&pokemon-id=${pkmn.id}`;

      const response = await fetch(url, { method: "PUT" });

      if (response.ok) {
        if (battleTeam.length < 6) {
          try {
            await updateTeamOnServer(0, pkmn.id);
          } catch (e) {}
        }
        await loadTrainerTeam();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearTeam = async () => {
    try {
      const availablePokemons = pokebag.filter(
        (p) => !battleTeam.some((teamPoke) => teamPoke.id === p.id),
      );

      if (availablePokemons.length === 0) {
        Alert.alert(
          "Sem Pokémon disponível",
          "Não há Pokémon no inventário para substituir.",
        );
        return;
      }

      const teamReversed = [...battleTeam].reverse();

      for (
        let i = 0;
        i < Math.min(teamReversed.length, availablePokemons.length);
        i++
      ) {
        await updateTeamOnServer(teamReversed[i].id, availablePokemons[i].id);
      }

      await loadTrainerTeam();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível limpar o time.");
    }
  };

  // ... (Restante do código: useEffects, Login, Logout, ShiftOrder permanecem iguais)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedLogin = await AsyncStorage.getItem("pkmn_is_logged_in");
        const userId = await AsyncStorage.getItem("userId");
        if (savedLogin === "true" && userId) {
          setIsLoggedIn(true);
          const savedTrainer = await AsyncStorage.getItem(
            "pkmn_trainer_profile",
          );
          if (savedTrainer) setTrainer(JSON.parse(savedTrainer));
          await loadTrainerTeam(userId);
        }
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, [loadTrainerTeam]);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        const data = await getPokemon(151);
        setPokemonList(data);
      } catch (err) {
        setErrorMsg("Erro na conexão");
      } finally {
        setLoading(false);
      }
    };
    loadPokemons();
  }, []);

  const handleAuthSuccess = async (profile: any) => {
    await AsyncStorage.setItem("userId", profile.userId);
    await AsyncStorage.setItem("pkmn_is_logged_in", "true");
    setTrainer(profile);
    setIsLoggedIn(true);
    await loadTrainerTeam(profile.userId);
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "pkmn_is_logged_in",
      "userId",
      "pkmn_trainer_profile",
    ]);
    setIsLoggedIn(false);
    setBattleTeam([]);
    setPokebag([]);
    setActiveTab("pokedex");
  };

  const handleShiftTeamOrder = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= battleTeam.length) return;
    setBattleTeam((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  return {
    isLoggedIn,
    authLoading,
    pokemonList,
    loading,
    isShinyMaster,
    errorMsg,
    activeTab,
    trainer,
    pokebag,
    battleTeam,
    setActiveTab,
    setIsShinyMaster,
    handleAuthSuccess,
    handleLogout,
    handleCatchPokemon,
    handleReleasePokemon,
    handleAddToTeam,
    handleRemoveFromTeam,
    handleClearTeam,
    handleShiftTeamOrder,
    setTrainer,
    setBattleTeam,
    loadTrainerTeam,
  };
}
