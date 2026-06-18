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
    "pokedex" | "profile" | "pokebag" | "battle" | "expo"
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
        ? p.abilities.map((a: any) => ({ nome: a.name, forca: a.strength }))
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

  // --- ESTRATÉGIA DEFINITIVA DE SWAP ---
  const updateTeamOnServer = async (removedId: number, newId: number) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    // Colocamos os parâmetros na URL igual ao Postman
    const url = `${BASE_URL}/pokemon/v1/team?user-id=${userId}&removed-pokemon=${removedId}&new-pokemon=${newId}&removedPokemon=${removedId}&newPokemon=${newId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }, // OBRIGATÓRIO PARA A AWS NÃO BLOQUEAR
      body: JSON.stringify({
        removedPokemon: removedId,
        newPokemon: newId,
        "removed-pokemon": removedId,
        "new-pokemon": newId,
      }), // Mandamos no Body também com todos os padrões de nomenclatura possíveis
    });

    const text = await response.text();
    if (!response.ok) {
      console.log("Erro SWAP do Backend:", text);
      throw new Error(text);
    }
    return text ? JSON.parse(text) : {};
  };

  // --- ESTRATÉGIA DEFINITIVA DE REORDENAÇÃO ---
  const setTeamOrderOnServer = async (newTeamIds: number[]) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId || newTeamIds.length !== 5) return; // Garante que só envia se tiver 5

    const idsString = newTeamIds.join(",");
    const url = `${BASE_URL}/pokemon/v1/team?user-id=${userId}&teamOrder=${idsString}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamOrder: newTeamIds,
        "user-id": userId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Falha na resposta do servidor");
    }
    return response.ok;
  };

  const handleAddToTeam = async (pkmn: Pokemon) => {
    if (battleTeam.some((p) => p.id === pkmn.id)) return;

    if (battleTeam.length !== 5) {
      Alert.alert(
        "Time inválido",
        "O servidor exige exatamente 5 Pokémon no time.",
      );
      return;
    }

    try {
      const ultimoPokemon = battleTeam[4];

      await updateTeamOnServer(ultimoPokemon.id, pkmn.id);

      await loadTrainerTeam();

      Alert.alert("Sucesso!", `${pkmn.nome} substituiu ${ultimoPokemon.nome}.`);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar a troca.");
    }
  };

  const handleRemoveFromTeam = async (id: number) => {
    try {
      // Pega o primeiro Pokémon que está na Bag, mas não está no Time
      const substitutoDisponivel = pokebag.find(
        (p) => !battleTeam.some((teamPoke) => teamPoke.id === p.id),
      );

      if (!substitutoDisponivel) {
        Alert.alert(
          "Sem substitutos",
          "Você precisa de um Pokémon livre na sua Bag para assumir esta vaga no time.",
        );
        return;
      }

      await updateTeamOnServer(id, substitutoDisponivel.id);
      await loadTrainerTeam();
    } catch (error) {
      Alert.alert(
        "Falha na Remoção",
        "Não foi possível realizar a substituição.",
      );
    }
  };

  const handleClearTeam = async () => {
    if (pokebag.length === 0) {
      Alert.alert("Erro", "Mochila vazia.");
      return;
    }

    // 1. Sorteamos os 5 IDs que vão entrar no time ANTES de começar as trocas
    let novosIds: number[] = [];
    if (pokebag.length >= 5) {
      // Sorteia 5 sem repetir
      const embaralhado = [...pokebag].sort(() => Math.random() - 0.5);
      novosIds = embaralhado.slice(0, 5).map((p) => p.id);
    } else {
      // Menos de 5: sorteia 5 vezes podendo repetir
      for (let i = 0; i < 5; i++) {
        const rIdx = Math.floor(Math.random() * pokebag.length);
        novosIds.push(pokebag[rIdx].id);
      }
    }

    try {
      // 2. Opcional: Mostrar um alerta de carregamento ou algo do tipo
      // Pois faremos 5 requisições seguidas

      // 3. Loop de trocas: Para cada pokemon do time atual, trocamos pelo sorteado
      for (let i = 0; i < battleTeam.length; i++) {
        const pokemonAntigoId = battleTeam[i].id;
        const pokemonNovoId = novosIds[i];

        // Só faz a chamada se o pokemon for realmente diferente
        if (pokemonAntigoId !== pokemonNovoId) {
          await updateTeamOnServer(pokemonAntigoId, pokemonNovoId);
        }
      }

      // 4. Após terminar todas as trocas, recarregamos o time do servidor uma única vez
      await loadTrainerTeam();
      Alert.alert("Sucesso", "O time foi totalmente renovado!");
    } catch (error) {
      console.error("Erro na renovação total:", error);
      Alert.alert(
        "Erro",
        "Houve um problema ao trocar alguns membros do time.",
      );
      await loadTrainerTeam(); // Recarrega para ver onde parou
    }
  };

  const handleShiftTeamOrder = async (
    index: number,
    direction: "up" | "down",
  ) => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= battleTeam.length) return;

    // Atualiza a interface rapidamente (Optimistic Update)
    const newTeam = [...battleTeam];
    const temp = newTeam[index];
    newTeam[index] = newTeam[targetIdx];
    newTeam[targetIdx] = temp;
    setBattleTeam(newTeam);

    try {
      // Manda a nova lista de 5 IDs para a API salvar
      const newTeamIds = newTeam.map((p) => p.id);
      await setTeamOrderOnServer(newTeamIds);
    } catch (error) {
      console.log("Falha ao salvar a nova ordem no servidor");
      await loadTrainerTeam(); // Desfaz a mudança visual se o servidor der erro
    }
  };

  const handleReleasePokemon = async (id: number) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      // Se ele estiver no time, forçamos a troca antes de apagar
      if (battleTeam.some((p) => p.id === id)) {
        await handleRemoveFromTeam(id);
      }

      const url = `${BASE_URL}/pokemon/v1/captured?user-id=${userId}&pokemon-id=${id}`;
      await fetch(url, { method: "DELETE" });
      await loadTrainerTeam();
      Alert.alert("Sucesso", "Pokémon libertado do acervo digital.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao processar a libertação.");
    }
  };

  const handleCatchPokemon = async (pkmn: Pokemon) => {
    if (pokebag.some((p) => p.id === pkmn.id)) return;
    try {
      const userId = await AsyncStorage.getItem("userId");
      const url = `${BASE_URL}/pokemon/v1/captured?user-id=${userId}&pokemon-id=${pkmn.id}`;
      await fetch(url, { method: "PUT" });
      await loadTrainerTeam();
    } catch (error) {
      console.error(error);
    }
  };

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
