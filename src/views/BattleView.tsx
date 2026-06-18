import {
    Activity,
    Ghost,
    ShieldAlert,
    Swords,
    Trophy,
    Zap,
} from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { CORES_HEX, Pokemon } from "../types";

const getAnimatedBackSprite = (id: number, isShiny: boolean): string => {
    if (id > 0 && id <= 649) {
        if (isShiny) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/shiny/${id}.gif`;
        }
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${id}.gif`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`;
};

const getAnimatedSprite = (id: number, isShiny: boolean, fallbackUrl: string): string => {
    if (id > 0 && id <= 649) {
        if (isShiny) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`;
        }
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
    }
    return fallbackUrl;
};

interface BattleViewProps {
    battleTeam: Pokemon[];
    pokemonList: Pokemon[];
    isShinyMaster: boolean;
    onCatch: (pkmn: Pokemon) => void;
}

type BattleState = "idle" | "searching" | "battling" | "won" | "lost";

export function BattleView({ battleTeam, pokemonList, isShinyMaster, onCatch }: BattleViewProps) {
    const [battleState, setBattleState] = useState<BattleState>("idle");
    const [opponentTeam, setOpponentTeam] = useState<Pokemon[]>([]);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [opponentIndex, setOpponentIndex] = useState(0);

    const [playerHp, setPlayerHp] = useState(100);
    const [opponentHp, setOpponentHp] = useState(100);
    const [log, setLog] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [rewardPokemon, setRewardPokemon] = useState<Pokemon | null>(null);

    const addLog = (msg: string) => {
        setLog((prev) => [msg, ...prev].slice(0, 4));
    };

    const startBattle = () => {
        if (battleTeam.length === 0) return;
        setBattleState("searching");

        setTimeout(() => {
            const numOpponents = Math.floor(Math.random() * 5) + 1;
            const team: Pokemon[] = [];
            for (let i = 0; i < numOpponents; i++) {
                const randomIndex = Math.floor(Math.random() * pokemonList.length);
                team.push(pokemonList[randomIndex]);
            }

            setOpponentTeam(team);
            setPlayerIndex(0);
            setOpponentIndex(0);
            setPlayerHp(100);
            setOpponentHp(100);
            setLog(["SISTEMA DE COMBATE INICIADO."]);
            setRewardPokemon(null);
            setBattleState("battling");
        }, 1500);
    };

    const handleAttack = (poderNome: string, poderForca: number) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const playerPkmn = battleTeam[playerIndex];
        const opponentPkmn = opponentTeam[opponentIndex];

        const damageToOpponent = Math.floor(poderForca * (Math.random() * 0.4 + 0.8));
        const newOpponentHp = Math.max(0, opponentHp - damageToOpponent);

        setOpponentHp(newOpponentHp);
        addLog(`> ${playerPkmn.nome} usou ${poderNome} causando ${damageToOpponent} DMG!`);

        setTimeout(() => {
            if (newOpponentHp <= 0) {
                addLog(`[!] ${opponentPkmn.nome} inimigo foi derrotado!`);

                if (opponentIndex + 1 < opponentTeam.length) {
                    setTimeout(() => {
                        setOpponentIndex(prev => prev + 1);
                        setOpponentHp(100);
                        addLog(`Oponente enviou ${opponentTeam[opponentIndex + 1].nome}!`);
                        setIsProcessing(false);
                    }, 1000);
                } else {
                    handleVictory();
                }
            } else {
                const opAttack = opponentPkmn.poderes?.[0] || { nome: "Investida", forca: 30 };
                const damageToPlayer = Math.floor(opAttack.forca * (Math.random() * 0.4 + 0.8));
                const newPlayerHp = Math.max(0, playerHp - damageToPlayer);

                setPlayerHp(newPlayerHp);
                addLog(`> Inimigo ${opponentPkmn.nome} usou ${opAttack.nome} (${damageToPlayer} DMG).`);

                if (newPlayerHp <= 0) {
                    addLog(`[!] Seu ${playerPkmn.nome} foi abatido!`);

                    if (playerIndex + 1 < battleTeam.length) {
                        setTimeout(() => {
                            setPlayerIndex(prev => prev + 1);
                            setPlayerHp(100);
                            addLog(`Você enviou ${battleTeam[playerIndex + 1].nome}!`);
                            setIsProcessing(false);
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            setBattleState("lost");
                            setIsProcessing(false);
                        }, 1000);
                    }
                } else {
                    setIsProcessing(false);
                }
            }
        }, 1000);
    };

    const handleVictory = () => {
        const randomReward = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        setRewardPokemon(randomReward);
        onCatch(randomReward);
        setBattleState("won");
        setIsProcessing(false);
    };

    if (battleState === "idle") {
        return (
            <View className="flex-1 bg-[#070707] justify-center items-center px-6">
                <View className="items-center mb-10">
                    <Swords size={60} color="#FF421C" opacity={0.8} />
                    <Text className="text-3xl font-black uppercase text-white italic tracking-tighter mt-6 text-center">
                        SIMULADOR DE COMBATE
                    </Text>
                    <Text className="text-xs text-zinc-500 leading-relaxed text-center mt-4 max-w-[280px]">
                        Enfrente IAs desonestas na rede para aprimorar seus Pokémon e capturar novos espécimes.
                    </Text>
                </View>
                {battleTeam.length === 0 ? (
                    <View className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl items-center w-full">
                        <ShieldAlert size={24} color="#f87171" />
                        <Text className="text-xs font-black text-red-400 mt-3 text-center uppercase">
                            Sem time ativo. Vá até a BAG e recrute Pokémon para a batalha.
                        </Text>
                    </View>
                ) : (
                    <Pressable
                        onPress={startBattle}
                        className="w-full bg-[#FF421C]/20 border border-[#FF421C]/50 py-5 rounded-2xl items-center active:opacity-50"
                    >
                        <Text className="text-sm font-black text-[#FF421C] uppercase tracking-[3px]">
                            INICIAR BUSCA POR SINAL
                        </Text>
                    </Pressable>
                )}
            </View>
        );
    }

    if (battleState === "searching") {
        return (
            <View className="flex-1 bg-[#070707] justify-center items-center px-6">
                <Activity size={40} color="#10b981" className="animate-spin" />
                <Text className="text-emerald-500 font-mono text-xs tracking-widest mt-6 uppercase">
                    Procurando alvos na rede...
                </Text>
            </View>
        );
    }

    if (battleState === "won" || battleState === "lost") {
        const isWin = battleState === "won";
        return (
            <View className="flex-1 bg-[#070707] justify-center items-center px-6">
                <View className="items-center mb-10">
                    {isWin ? <Trophy size={60} color="#fbbf24" /> : <Ghost size={60} color="#f87171" />}
                    <Text className="text-4xl font-black uppercase text-white italic tracking-tighter mt-6 text-center">
                        {isWin ? "VITÓRIA" : "SISTEMA COMPROMETIDO"}
                    </Text>
                </View>

                {isWin && rewardPokemon && (
                    <View className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 items-center w-full mb-8">
                        <Text className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-4">
                            DADOS DO ESPÉCIME EXTRAÍDOS
                        </Text>
                        <Image
                            source={{ uri: rewardPokemon.imagem }}
                            style={{ width: 100, height: 100 }}
                            resizeMode="contain"
                        />
                        <Text className="text-xl font-black text-white italic mt-2">{rewardPokemon.nome}</Text>
                        <Text className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Adicionado ao Acervo</Text>
                    </View>
                )}

                <Pressable
                    onPress={() => setBattleState("idle")}
                    className={`w-full py-5 rounded-2xl items-center active:opacity-50 border ${isWin ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-red-500/20 border-red-500/50'}`}
                >
                    <Text className={`text-sm font-black uppercase tracking-[3px] ${isWin ? 'text-emerald-500' : 'text-red-500'}`}>
                        RETORNAR AO HUB
                    </Text>
                </Pressable>
            </View>
        );
    }

    const activePlayer = battleTeam[playerIndex];
    const activeOpponent = opponentTeam[opponentIndex];
    const playerColor = CORES_HEX[activePlayer?.tipos[0]?.toLowerCase()] || CORES_HEX.normal;
    const opponentColor = CORES_HEX[activeOpponent?.tipos[0]?.toLowerCase()] || CORES_HEX.normal;

    return (
        <View className="flex-1 bg-[#070707]">
            <View className="h-32 bg-[#0A0A0A] border-b border-white/10 pt-4 px-6 justify-end pb-4 z-10 shadow-lg">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">LOG DE COMBATE</Text>
                    <Text className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
                        Alvos Restantes: {opponentTeam.length - opponentIndex}
                    </Text>
                </View>
                <ScrollView className="h-14" showsVerticalScrollIndicator={false}>
                    {log.map((l, i) => (
                        <Text key={i} className={`text-[11px] font-mono mb-1 ${i === 0 ? 'text-white' : 'text-zinc-600'}`}>
                            {l}
                        </Text>
                    ))}
                </ScrollView>
            </View>


            <View className="flex-1 relative justify-center px-6 overflow-hidden bg-black">

                <Image
                    source={{ uri: "https://cdnb.artstation.com/p/assets/images/images/097/422/559/large/yuki-pixels-1background.webp?1774138170" }}
                    style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.85, alignSelf: 'center' }}
                    resizeMode="cover"
                />

                <View className="absolute top-12 right-6  items-center w-48 z-10">
                    
                  
                    <View className="w-full mb-6 bg-[#0A0A0A]/80 border border-white/10 p-3 rounded-xl backdrop-blur-md">
                        <View className="flex-row justify-between items-center mb-1.5">
                            <View className="flex-row items-center gap-1.5 flex-1">
                                <Text className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">LVL ??</Text>
                                <Text className="text-sm font-black text-white italic uppercase" numberOfLines={1}>
                                    {activeOpponent?.nome}
                                </Text>
                            </View>
                            <Text className="text-[10px] font-mono text-zinc-400">{Math.floor(opponentHp)}/100</Text>
                        </View>
                        <View className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <View
                                className={`h-full rounded-full ${opponentHp > 30 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                style={{ width: `${opponentHp}%`, backgroundColor: opponentColor }}
                            />
                        </View>
                    </View>

   
                    <View className="relative items-center justify-center mt-2">
                        <View className="absolute  w-24 h-6 bg-black/60 rounded-full" style={{ bottom: -2.2, transform: [{ scaleX: 1.5 }] }}  />
                        <Image
                            source={{ uri: getAnimatedSprite(activeOpponent?.id, false, activeOpponent?.imagem) }}
                            style={{ width: 110, height: 110, transform: [{ scale: 1.2 }] }}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <View className="absolute bottom-10 left-6 items-center w-48">
                    <View className="relative items-center justify-center">
                        <View className="absolute bottom-0 w-24 h-8 bg-black/60 rounded-full" style={{ transform: [{ scaleX: 1.5 }] }} />
                        <Image
                            source={{ uri: getAnimatedBackSprite(activePlayer?.id, isShinyMaster) }}
                            style={{ width: 120, height: 120, transform: [{ scale: 1.3 }] }}
                            resizeMode="contain"
                        />
                    </View>

                    <View className="w-full mt-6 bg-[#0A0A0A]/80 border border-white/10 p-3 rounded-xl backdrop-blur-md">
                        <View className="flex-row justify-between items-center mb-1.5">
                            <Text className="text-sm font-black text-white italic uppercase">{activePlayer?.nome}</Text>
                            <Text className="text-[10px] font-mono text-zinc-400">{Math.floor(playerHp)}/100</Text>
                        </View>
                        <View className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <View
                                className={`h-full rounded-full ${playerHp > 30 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                style={{ width: `${playerHp}%`, backgroundColor: playerColor }}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <View className="bg-[#0A0A0A] border-t border-white/10 pt-5 pb-10 px-6 z-10">
                <View className="w-full flex-row justify-between items-center mb-4">
                    <Text className="text-xs font-black uppercase text-white tracking-[2px]">
                        PROTOCOLOS DE ATAQUE
                    </Text>
                    <Pressable onPress={() => setBattleState("idle")} disabled={isProcessing} className="bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">
                        <Text className="text-[9px] font-black text-red-500 uppercase tracking-widest">Abortar</Text>
                    </Pressable>
                </View>

                <View className="flex-row flex-wrap justify-between gap-y-3">
                    {(activePlayer?.poderes?.length > 0 ? activePlayer.poderes.slice(0, 4) : [{ nome: "Investida", forca: 35 }]).map((atk, idx) => {

                      
                        const attackColors = [
                            "#46ffc8", 
                            "#2E9AFE",  
                            "#FFD700",   
                            playerColor 
                        ];

                        const atkColor = attackColors[idx % attackColors.length];

                        return (
                            <Pressable
                                key={idx}
                                disabled={isProcessing}
                                onPress={() => handleAttack(atk.nome, atk.forca || 40)}
                                style={{ borderLeftColor: atkColor }}
                                className={`w-[48%] py-3 px-4 rounded-xl border border-white/5 border-l-4 items-start justify-center active:bg-white/10 
                  ${isProcessing ? 'bg-white/5 opacity-50' : 'bg-white/[0.03]'}`}
                            >
                                <Text className="text-[11px] font-black text-white uppercase tracking-wider" numberOfLines={1}>
                                    {atk.nome}
                                </Text>
                                <View className="flex-row items-center mt-1 gap-1.5">
                                    <Zap size={10} color={atkColor} />
                                    <Text className="text-[9px] font-mono text-zinc-400">PWR {atk.forca || 40}</Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}