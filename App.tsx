import React, { useEffect, useState } from "react";
import { getPokemon } from "./src/utils/pokeapi";
import { Pokemon } from "./src/types";
import { Sparkles, User, Trophy, Smartphone } from "lucide-react";
import { TrainerAuthScreen } from "./src/components/TrainerAuthScreen";
import { PokedexView } from "./src/components/PokedexView";
import { ProfileView } from "./src/components/ProfileView";
import { PokebagView } from "./src/components/PokebagView";
import { ExpoDevView } from "./src/components/ExpoDevView";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("pkmn_is_logged_in") === "true";
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("pkmn_registered_users");
    return saved ? JSON.parse(saved) : {};
  });

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isShinyMaster, setIsShinyMaster] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "pokedex" | "profile" | "pokebag" | "expo"
  >("pokedex");

  const [trainer, setTrainer] = useState(() => {
    const saved = localStorage.getItem("pkmn_trainer_profile");

    return saved
      ? JSON.parse(saved)
      : {
          userId: "",
          nome: "",
          titulo: "",
          nivel: 1,
          xp: 0,
          insignias: 0,
          vitorias: 0,
          avatar: "",
        };
  });

  const [pokebag, setPokebag] = useState<Pokemon[]>(() => {
    const saved = localStorage.getItem("pkmn_trainer_pokebag");
    return saved ? JSON.parse(saved) : [];
  });

  const [battleTeam, setBattleTeam] = useState<Pokemon[]>(() => {
    const saved = localStorage.getItem("pkmn_trainer_team");
    return saved ? JSON.parse(saved) : [];
  });

  const loadTrainerTeam = async () => {
    setBattleTeam([]);
    setPokebag([]);
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const response = await fetch(
        `https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/pokemon/v1/team?user-id=${userId}`,
      );

      const data = await response.json();

      console.log("TEAM API:", data);

      const teamPokemons: Pokemon[] = data.team.map((p: any) => ({
        id: Number(p.index),
        index: p.index,
        nome: p.name,
        imagem: p.image,
        imagemShiny: p.image,
        tipos: p.types,
        poderes: p.abilities.map((a: any) => ({
          nome: a.name,
          forca: a.strength,
        })),
      }));

      const capturedPokemons: Pokemon[] = data.capture.map((p: any) => ({
        id: Number(p.index),
        index: p.index,
        nome: p.name,
        imagem: p.image,
        imagemShiny: p.image,
        tipos: p.types,
        poderes: p.abilities.map((a: any) => ({
          nome: a.name,
          forca: a.strength,
        })),
      }));

      setBattleTeam(teamPokemons.map((p) => ({ ...p })));
      setPokebag(capturedPokemons.map((p) => ({ ...p })));
    } catch (error) {
      console.error("Erro ao carregar time:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadTrainerTeam();
    }
  }, [isLoggedIn]);

  // React local storage persistence sync
  useEffect(() => {
    localStorage.setItem("pkmn_trainer_profile", JSON.stringify(trainer));
  }, [trainer]);

  useEffect(() => {
    localStorage.setItem("pkmn_trainer_pokebag", JSON.stringify(pokebag));
  }, [pokebag]);

  useEffect(() => {
    localStorage.setItem("pkmn_trainer_team", JSON.stringify(battleTeam));
  }, [battleTeam]);

  // Action methods
  const handleAuthSuccess = (profile: any) => {
    setIsLoggedIn(true);
    localStorage.setItem("userId", profile.userId);
    setTrainer(profile);
    loadTrainerTeam();
  };

  const handleRegisterSuccess = (
    username: string,
    passwordInput: string,
    title: string,
  ) => {
    const newProfile = {
      userId: "",
      nome: username,
      titulo: title || "Treinador Iniciante",
      nivel: 1,
      xp: 0,
      insignias: 0,
      vitorias: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    setRegisteredUsers((prev) => ({
      ...prev,
      [username]: {
        password: passwordInput,
        profile: newProfile,
      },
    }));

    setIsLoggedIn(true);
    localStorage.setItem("pkmn_is_logged_in", "true");
    setTrainer(newProfile);
  };

  const handleLogout = () => {
    // limpa login
    localStorage.removeItem("pkmn_is_logged_in");
    localStorage.removeItem("userId");

    // opcional: limpa dados locais do treinador
    localStorage.removeItem("pkmn_trainer_profile");
    localStorage.removeItem("pkmn_trainer_pokebag");
    localStorage.removeItem("pkmn_trainer_team");

    setTrainer({
      userId: "",
      nome: "",
      titulo: "",
      nivel: 1,
      xp: 0,
      insignias: 0,
      vitorias: 0,
      avatar: "",
    });

    setPokebag([]);
    setBattleTeam([]);
    setActiveTab("pokedex");

    setIsLoggedIn(false);
  };

  const handleCatchPokemon = async (pkmn: Pokemon) => {
    if (pokebag.some((p) => p.id === pkmn.id)) return;

    try {
      const userId = localStorage.getItem("userId");

      const response = await fetch(
        `https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/pokemon/v1/captured?user-id=${userId}&pokemon-id=${pkmn.id}`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao capturar Pokémon");
      }

      const updatedBag = [...pokebag, pkmn];
      setPokebag(updatedBag);

      // Auto add to battle team if < 6
      if (battleTeam.length < 6) {
        setBattleTeam((prev) => [...prev, { ...pkmn }]);
      }

      // Award XP
      setTrainer((prev) => {
        let nextXp = prev.xp + 20;
        let nextLevel = prev.nivel;

        if (nextXp >= 100) {
          nextXp -= 100;
          nextLevel += 1;
        }

        return {
          ...prev,
          xp: nextXp,
          nivel: nextLevel,
        };
      });

      console.log("Pokemon capturado:", pkmn.nome);
    } catch (error) {
      console.error("Erro ao capturar:", error);
    }
  };

  const handleReleasePokemon = async (id: number) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await fetch(
        `https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/pokemon/v1/captured?user-id=${userId}&pokemon-id=${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao remover Pokémon");
      }

      setPokebag((prev) => prev.filter((p) => p.id !== id));
      setBattleTeam((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Não foi possível remover o Pokémon.");
    }
  };

  const handleAddToTeam = async (pkmn: Pokemon) => {
    if (battleTeam.some((p) => p.id === pkmn.id)) return;

    if (battleTeam.length >= 6) {
      const removed = battleTeam[0].id;

      await updateTeamOnServer(removed, pkmn.id);

      setBattleTeam((prev) => {
        const updated = prev.slice(1);
        return [...updated, { ...pkmn }];
      });
      return;
    }

    setBattleTeam((prev) => [...prev, { ...pkmn }]);
  };

  const handleRemoveFromTeam = async (id: number) => {
    await updateTeamOnServer(id);

    setBattleTeam((prev) => prev.filter((p) => p.id !== id));
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

  const updateTeamOnServer = async (removedId: number, newId?: number) => {
    try {
      const userId = localStorage.getItem("userId");

      const url = new URL(
        "https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/pokemon/v1/team",
      );

      url.searchParams.append("user-id", userId || "");
      url.searchParams.append("removed-pokemon", String(removedId));

      if (newId) {
        url.searchParams.append("new-pokemon", String(newId));
      }

      const response = await fetch(url.toString(), {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar time");
      }
    } catch (error) {
      console.error("Erro API team:", error);
    }
  };

  const handleResetTrainerData = () => {
    const pika = pokemonList.find((p) => p.id === 25);
    const chari = pokemonList.find((p) => p.id === 6);
    const blast = pokemonList.find((p) => p.id === 9);
    const initialBag = [pika, chari, blast].filter((p): p is Pokemon => !!p);

    setTrainer({
      userId: "",
      nome: "Ash Ketchum",
      titulo: "Mestre Pokémon",
      nivel: 32,
      xp: 85,
      insignias: 8,
      vitorias: 242,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ash",
    });
    setPokebag(initialBag);
    setBattleTeam([initialBag[0], initialBag[1]].filter(Boolean));
  };

  // Fetch pokemons on mount
  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const data = await getPokemon(151); // Load Generation I
        setPokemonList(data);
      } catch (err) {
        console.error(err);
        setErrorMsg(
          "Não foi possível carregar os dados dos Pokémon. Tentando novamente...",
        );
      } finally {
        setLoading(false);
      }
    };
    loadPokemons();
  }, []);

  if (!isLoggedIn) {
    return (
      <TrainerAuthScreen
        registeredUsers={registeredUsers}
        onAuthSuccess={handleAuthSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans select-none selection:bg-[#FF421C] selection:text-black transition-colors duration-300">
      {/* MAIN HUB SECTION */}
      <div className="min-h-screen flex flex-col min-w-0">
        {/* TOP COMPACT HEADER */}
        <header className="h-24 border-b border-white/10 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-xl z-20">
          {/* Left Column (Brand/Branding) */}
          <div className="flex-1 hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF421C] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#FF421C]">
              POKE22 SYS
            </span>
          </div>

          {/* Center Column (Navbar links) */}
          <div className="flex flex-wrap gap-3 sm:gap-6 md:gap-8 text-[11.5px] uppercase tracking-widest font-black items-center justify-center">
            <button
              onClick={() => setActiveTab("pokedex")}
              className={`transition-all duration-300 uppercase font-black cursor-pointer ${
                activeTab === "pokedex"
                  ? "text-[#FF421C] scale-105"
                  : "opacity-45 hover:opacity-85 text-white"
              }`}
            >
              Pokedex
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`transition-all duration-300 uppercase font-black cursor-pointer flex items-center gap-1.5 ${
                activeTab === "profile"
                  ? "text-[#FF421C] scale-105"
                  : "opacity-45 hover:opacity-85 text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Perfil</span>
            </button>
            <button
              onClick={() => setActiveTab("pokebag")}
              className={`transition-all duration-300 uppercase font-black cursor-pointer flex items-center gap-1.5 ${
                activeTab === "pokebag"
                  ? "text-emerald-400 scale-105"
                  : "opacity-45 hover:opacity-85 text-white"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Time & Pokebag</span>
            </button>
            <button
              onClick={() => setActiveTab("expo")}
              className={`flex items-center gap-1.5 transition-all duration-300 uppercase font-black cursor-pointer ${
                activeTab === "expo"
                  ? "text-amber-400 scale-105"
                  : "opacity-45 hover:opacity-85 text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Expo</span>
            </button>
          </div>

          {/* Right Column (Actions/Logout) */}
          <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
            {/* Interactive Shiny Global Mode Switcher */}
            <button
              onClick={() => setIsShinyMaster(!isShinyMaster)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-[9px] font-black tracking-widest uppercase border skew-x-[-12deg] transition-all duration-300 shadow-md ${
                isShinyMaster
                  ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                  : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <Sparkles
                className={`w-3 h-3 ${isShinyMaster ? "animate-pulse" : ""}`}
              />
              <span className="hidden sm:inline">SHINY</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-[9.5px] font-mono hover:text-white hover:bg-red-600/20 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded uppercase tracking-wider text-red-400 transition-all cursor-pointer font-black"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Tab content router */}
        {activeTab === "pokedex" && (
          <PokedexView
            pokemonList={pokemonList}
            loading={loading}
            errorMsg={errorMsg}
            isShinyMaster={isShinyMaster}
            setIsShinyMaster={setIsShinyMaster}
            pokebag={pokebag}
            onCatch={handleCatchPokemon}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            trainer={trainer}
            onTrainerChange={setTrainer}
            pokebagCount={pokebag.length}
            onResetTrainer={handleResetTrainerData}
          />
        )}

        {activeTab === "pokebag" && (
          <PokebagView
            battleTeam={battleTeam}
            pokebag={pokebag}
            isShinyMaster={isShinyMaster}
            onClearTeam={() => setBattleTeam([])}
            onShiftTeamOrder={handleShiftTeamOrder}
            onRemoveFromTeam={handleRemoveFromTeam}
            onAddToTeam={handleAddToTeam}
            onReleasePokemon={handleReleasePokemon}
          />
        )}

        {activeTab === "expo" && <ExpoDevView />}

        {/* COMPACT INDUSTRIAL FOOTER */}
        <footer className="mt-24 border-t border-white/10 py-12 text-center bg-[#070707]">
          <div className="max-w-7xl mx-auto px-6 text-[10px] font-mono tracking-widest uppercase text-zinc-500 space-y-2">
            <p className="text-[#FF421C] font-black">
              PKMN RESEARCH LABS • BIOMETRIC INTERACTIVE DIRECTORY
            </p>
            <p className="opacity-60">
              © 1996 - 2026 species index data provided to league associates.
              authorized use only.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
