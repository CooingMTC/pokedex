import { View, Text, Pressable, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Sparkles, User, Trophy, Smartphone } from "lucide-react-native";
import { usePokemonLogic } from "@/hooks/pokemonLogic";
import "../../global.css";
import { TrainerAuthScreen } from "@/views/TrainerAuthScreen";
import { PokedexView } from "@/views/PokedexView";
import { ProfileView } from "@/views/ProfileView";
import { PokebagView } from "@/views/PokebagView";
import { ExpoDevView } from "@/views/ExpoDevView";

export default function App() {
  const logic = usePokemonLogic();

  if (logic.authLoading) {
    return (
      <View className="flex-1 bg-[#0A0A0A] items-center justify-center">
        <Text className="text-[#FF421C] font-mono animate-pulse">
          BOOTING POKE22 SYS...
        </Text>
      </View>
    );
  }

  if (!logic.isLoggedIn) {
    return (
      <TrainerAuthScreen
        onAuthSuccess={logic.handleAuthSuccess}
        onRegisterSuccess={() => {}}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1 bg-[#0A0A0A]"
        edges={["top", "left", "right", "bottom"]}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

        <View className="h-20 border-b border-white/10 flex-row items-center justify-between px-6 bg-[#0A0A0A]">
          <View className="flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-[#FF421C]" />
            <Text className="font-mono text-[8px] tracking-[2px] font-black text-[#FF421C]">
              POKE22
            </Text>
          </View>

          <View className="flex-row gap-4 items-center">
            <Pressable
              onPress={() => logic.setIsShinyMaster(!logic.isShinyMaster)}
              className={`px-3 py-1.5 rounded-sm border ${logic.isShinyMaster ? "bg-amber-400 border-amber-300" : "bg-white/5 border-white/10"}`}
              style={{ transform: [{ skewX: "-12deg" }] }}
            >
              <Sparkles
                size={12}
                color={logic.isShinyMaster ? "#000" : "#71717a"}
              />
            </Pressable>

            <Pressable onPress={logic.handleLogout}>
              <Text className="text-[9px] font-black text-red-500 uppercase tracking-widest">
                Sair
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-1">
          {logic.activeTab === "pokedex" && (
            <PokedexView
              pokemonList={logic.pokemonList}
              loading={logic.loading}
              errorMsg={logic.errorMsg}
              isShinyMaster={logic.isShinyMaster}
              setIsShinyMaster={logic.setIsShinyMaster}
              pokebag={logic.pokebag}
              onCatch={logic.handleCatchPokemon}
            />
          )}
          {logic.activeTab === "profile" && (
            <ProfileView
              trainer={logic.trainer}
              onTrainerChange={logic.setTrainer}
              pokebagCount={logic.pokebag.length}
              onResetTrainer={() => {}}
            />
          )}
          {logic.activeTab === "pokebag" && (
            <PokebagView
              battleTeam={logic.battleTeam}
              pokebag={logic.pokebag}
              isShinyMaster={logic.isShinyMaster}
              onClearTeam={logic.handleClearTeam}
              onShiftTeamOrder={logic.handleShiftTeamOrder}
              onRemoveFromTeam={logic.handleRemoveFromTeam}
              onAddToTeam={logic.handleAddToTeam}
              onReleasePokemon={logic.handleReleasePokemon}
            />
          )}
          {logic.activeTab === "expo" && <ExpoDevView />}
        </View>

        <View className="h-20 border-t border-white/10 flex-row items-center justify-around bg-[#0A0A0A] px-4 pb-2">
          <TabButton
            active={logic.activeTab === "pokedex"}
            label="HUB"
            icon={
              <Smartphone
                size={18}
                color={logic.activeTab === "pokedex" ? "#FF421C" : "#52525b"}
              />
            }
            onPress={() => logic.setActiveTab("pokedex")}
          />
          <TabButton
            active={logic.activeTab === "profile"}
            label="PERFIL"
            icon={
              <User
                size={18}
                color={logic.activeTab === "profile" ? "#FF421C" : "#52525b"}
              />
            }
            onPress={() => logic.setActiveTab("profile")}
          />
          <TabButton
            active={logic.activeTab === "pokebag"}
            label="BAG"
            icon={
              <Trophy
                size={18}
                color={logic.activeTab === "pokebag" ? "#10b981" : "#52525b"}
              />
            }
            onPress={() => logic.setActiveTab("pokebag")}
          />
          <TabButton
            active={logic.activeTab === "expo"}
            label="DEV"
            icon={
              <Smartphone
                size={18}
                color={logic.activeTab === "expo" ? "#fbbf24" : "#52525b"}
              />
            }
            onPress={() => logic.setActiveTab("expo")}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TabButton({ active, label, icon, onPress }: any) {
  return (
    <Pressable onPress={onPress} className="items-center gap-1">
      {icon}
      <Text
        className={`text-[8px] font-black tracking-[1px] ${active ? "text-white" : "text-zinc-600"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
