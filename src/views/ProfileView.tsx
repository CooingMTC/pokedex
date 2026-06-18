import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  User,
  Edit2,
  Database,
  Trophy,
  Award,
  X,
} from "lucide-react-native";

const AVATAR_MAP: { [key: string]: any } = {
  goti22: require("@/assets/goti22.png"),
};

interface ProfileViewProps {
  trainer: {
    userId: string;
    nome: string;
    titulo: string;
    nivel: number;
    xp: number;
    insignias: number;
    vitorias: number;
    derrotas: number;
    avatar: string;
  };
  onTrainerChange: (updatedTrainer: any) => void;
  pokebagCount: number;
  onResetTrainer: () => void;
}

export function ProfileView({
  trainer,
  onTrainerChange,
  pokebagCount,
  onResetTrainer,
}: ProfileViewProps) {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(trainer.nome);
  const [tempTitle, setTempTitle] = useState<string>(trainer.titulo);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const resolveAvatarSource = (avatar: string) => {
    if (avatar === "goti22") {
      return AVATAR_MAP.goti22;
    }
    if (avatar && (avatar.startsWith('http') || avatar.startsWith('data:'))) {
      return { uri: avatar };
    }
    return { uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${trainer.nome}` };
  };

  const handleSaveTrainerName = () => {
    onTrainerChange({
      ...trainer,
      nome: tempName || trainer.nome,
      titulo: tempTitle || trainer.titulo,
    });
    setIsEditingName(false);
  };

  const handleGainBadge = () => {
    if (trainer.insignias >= 8) return;
    onTrainerChange({
      ...trainer,
      insignias: trainer.insignias + 1,
    });
  };

  const handleGainVictory = async () => {
    setIsUpdating(true);
    const novasVitorias = (trainer.vitorias || 0) + 1;

    try {
      const response = await fetch(
        `https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/auth/v1/stats/${trainer.userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level: trainer.nivel,
            vitorias: novasVitorias,
            derrotas: trainer.derrotas || 0,
          }),
        }
      );

      if (response.ok) {
        onTrainerChange({ ...trainer, vitorias: novasVitorias });
      } else {
        Alert.alert("Erro", "Não foi possível sincronizar com a Liga Secreta.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro de Conexão", "Servidor da Liga Offline.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#070707]" contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 24, paddingTop: 32 }}>

      <View className="relative rounded-[32px] bg-white/[0.02] border border-white/10 p-8 overflow-hidden mb-8">
        <Text
          className="absolute right-[-20] top-[-10] font-black text-white italic"
          style={{ fontSize: 100, opacity: 0.03, lineHeight: 100 }}
        >
          TRAINER
        </Text>

        <View className="relative z-10">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="h-[2px] w-8 bg-[#FF421C]" />
            <Text className="text-[#FF421C] font-mono text-[10px] tracking-[3px] font-extrabold uppercase">
              RANKING SYSTEM
            </Text>
          </View>
          <Text className="text-3xl font-black text-white uppercase italic tracking-tighter">
            PAINEL DO TREINADOR
          </Text>
        </View>
      </View>

      <View className="bg-white/[0.02] border border-white/10 rounded-[40px] p-8 items-center relative mb-8">
        <Pressable
          onPress={() => {
            if (!isEditingName) {
              setTempName(trainer.nome);
              setTempTitle(trainer.titulo);
            }
            setIsEditingName(!isEditingName);
          }}
          className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 border border-white/10 active:opacity-50"
        >
          {isEditingName ? <X size={16} color="#f87171" /> : <Edit2 size={16} color="#52525b" />}
        </Pressable>

        <View className="relative mb-6">
          <View
            style={{ width: 128, height: 128 }} 
            className="rounded-full border-4 border-emerald-500/50 p-1.5 bg-emerald-500/5 items-center justify-center overflow-hidden"
          >
            <Image
              source={resolveAvatarSource(trainer.avatar)}
              style={{ width: '100%', height: '100%', borderRadius: 999 }}
              resizeMode="cover"
            />
          </View>
          <View className="absolute -bottom-2 -right-2 bg-amber-400 rounded-xl border-4 border-[#070707] px-3 py-1">
            <Text className="text-[11px] text-zinc-950 font-black font-mono">LV. {trainer.nivel}</Text>
          </View>
        </View>

        {isEditingName ? (
          <View className="w-full gap-4">
            <View>
              <Text className="text-[10px] text-[#FF421C] font-black mb-2 uppercase tracking-widest ml-1">Assinatura Digital</Text>
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white font-mono text-xs"
              />
            </View>
            <View>
              <Text className="text-[10px] text-[#FF421C] font-black mb-2 uppercase tracking-widest ml-1">Patente</Text>
              <TextInput
                value={tempTitle}
                onChangeText={setTempTitle}
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white font-mono text-xs"
              />
            </View>
            <Pressable
              onPress={handleSaveTrainerName}
              className="bg-emerald-500 py-4 rounded-2xl items-center mt-2"
            >
              <Text className="text-black font-black text-[11px] uppercase tracking-[2px]">Sincronizar Dados</Text>
            </Pressable>
          </View>
        ) : (
          <View className="items-center w-full">
            <Text className="text-3xl font-black text-white uppercase italic tracking-tighter">{trainer.nome}</Text>
            <Text className="text-[10px] uppercase font-black tracking-[4px] text-zinc-500 mt-2">{trainer.titulo}</Text>

            <View className="w-full mt-8">
              <View className="flex-row justify-between mb-2 px-1">
                <Text className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Master XP Progression</Text>
                <Text className="text-[9px] font-mono text-emerald-500">{trainer.xp}%</Text>
              </View>
              <View className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <View className="h-full bg-emerald-500" style={{ width: `${trainer.xp}%` }} />
              </View>
            </View>
          </View>
        )}
      </View>

      <View className="bg-white/[0.02] border border-white/10 rounded-[40px] p-8 gap-6">
        <View className="flex-row items-center gap-3 border-b border-white/5 pb-5">
          <Database size={16} color="#10b981" />
          <Text className="text-[10px] font-black uppercase tracking-[3px] text-zinc-400">Database Synchronized</Text>
        </View>

        <View className="gap-4">
          <View className="bg-black/40 border border-white/5 p-5 rounded-[24px] flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Capturas</Text>
              <Text className="text-3xl font-mono font-black text-white">{pokebagCount}</Text>
            </View>
            <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center">
              <Text className="text-2xl">🎒</Text>
            </View>
          </View>

          <View className="bg-black/40 border border-white/5 p-5 rounded-[24px] flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Insígnias</Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-3xl font-mono font-black text-amber-400">{trainer.insignias}</Text>
                <Text className="text-[10px] font-mono text-zinc-700">/ 08</Text>
              </View>
            </View>
            <Pressable
              onPress={handleGainBadge}
              disabled={trainer.insignias >= 8}
              className={`p-4 rounded-2xl ${trainer.insignias >= 8 ? 'bg-zinc-800' : 'bg-amber-400/10 border border-amber-400/20'}`}
            >
              <Trophy size={20} color={trainer.insignias >= 8 ? "#3f3f46" : "#fbbf24"} />
            </Pressable>
          </View>

          <View className="bg-black/40 border border-white/5 p-5 rounded-[24px] flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Batalhas Ganhas</Text>
              <Text className="text-3xl font-mono font-black text-white">{trainer.vitorias}</Text>
            </View>
            <Pressable
              onPress={handleGainVictory}
              disabled={isUpdating}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl active:bg-emerald-500/20"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#10b981" />
              ) : (
                <Award size={20} color="#10b981" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}