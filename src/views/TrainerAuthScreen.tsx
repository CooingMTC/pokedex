import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface TrainerAuthScreenProps {
  registeredUsers?: { [key: string]: { password: string; profile: any } };
  onAuthSuccess: (profile: any) => void;
  onRegisterSuccess: (username: string, password: string, title: string) => void;
}

export function TrainerAuthScreen({
  registeredUsers,
  onAuthSuccess,
  onRegisterSuccess,
}: TrainerAuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("Treinador Iniciante");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async () => {
    const cleanUser = usernameInput.trim();
    const cleanPassword = passwordInput;
    if (!cleanUser || !cleanPassword) {
      setErrorMsg("Preencha todos os campos do treinador!");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(
        "https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/auth/v1/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: cleanUser, password: cleanPassword }),
        }
      );

      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch (e) {
      }

      if (response.ok) {
        const userId = responseData.userId;

        await AsyncStorage.setItem("userId", userId);

        const profileResponse = await fetch(
          `https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/auth/v1/stats/${userId}`
        );
        const profileData = await profileResponse.json();

        onAuthSuccess({
          userId,
          nome: profileData.username,
          titulo: "Treinador Pokémon",
          nivel: profileData.level,
          xp: 0,
          insignias: 0,
          vitorias: profileData.vitorias,
          derrotas: profileData.derrotas,
          avatar:
            profileData.username === "Goti22"
              ? "goti22"
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.username}`,
        });
      } else {
        setErrorMsg(
          responseData.message ||
            responseData.error ||
            "Credenciais de Treinador incorretas ou inexistentes. Tente cadastrar o perfil!"
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro de conexão com o servidor de autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    const cleanUser = newUsername.trim();
    const cleanPassword = newPassword;
    if (!cleanUser || !cleanPassword) {
      setErrorMsg("Preencha todos os campos para cadastrar!");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(
        "https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/auth/v1/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: cleanUser, password: cleanPassword }),
        }
      );

      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch (e) {
      }

      if (response.ok) {
        setErrorMsg(null);
        onRegisterSuccess(cleanUser, cleanPassword, newTitle);

        setNewUsername("");
        setNewPassword("");
        setNewTitle("Treinador Iniciante");
        setIsRegistering(false);
      } else {
        setErrorMsg(
          responseData.message ||
            responseData.error ||
            "Este nome de treinador está inválido ou já registrado! Escolha outro."
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro de rede ao conectar à API de registro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#070707]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full bg-white/[0.01] border border-white/10 p-8 rounded-2xl relative overflow-hidden"
          style={{ maxWidth: 420, alignSelf: "center" }}
        >
          <LinearGradient
            colors={["#FF421C", "#fbbf24", "#FF421C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3 }}
          />

          <View className="items-center mb-8">
            <View className="w-14 h-14 rounded-full border border-white/10 bg-white/5 items-center justify-center mb-4">
              {isLoading ? (
                <ActivityIndicator color="#FF421C" />
              ) : (
                <Text style={{ fontSize: 24 }}>{isRegistering ? "📝" : "🔴"}</Text>
              )}
            </View>
            <Text className="text-2xl font-black uppercase text-white" style={{ fontStyle: "italic" }}>
              {isRegistering ? "CADASTRO " : "POKE "}
              <Text className="text-[#FF421C]">{isRegistering ? "TREINADOR" : "22"}</Text>
            </Text>
            <Text className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5 text-center">
              {isRegistering ? "NOVO REGISTRO DO TREINADOR" : "CONEXÃO DO TREINADOR CREDENCIADO"}
            </Text>
          </View>

          {isRegistering ? (
            <View className="gap-4">
              <View>
                <Text className="text-[9px] text-zinc-400 font-mono mb-1.5 uppercase tracking-wider">
                  Identificação do Treinador
                </Text>
                <TextInput
                  placeholder="Ex: Ash Ketchum, Red, Misty..."
                  placeholderTextColor="#3f3f46"
                  value={newUsername}
                  onChangeText={(t) => {
                    setNewUsername(t);
                    setErrorMsg(null);
                  }}
                  editable={!isLoading}
                  className="bg-[#0E0E0B] border border-white/10 rounded px-3 py-2.5 text-xs text-white font-mono"
                />
              </View>

              <View>
                <Text className="text-[9px] text-zinc-400 font-mono mb-1.5 uppercase tracking-wider">
                  Senha Secreta da Liga
                </Text>
                <TextInput
                  placeholder="Crie sua senha secreta"
                  placeholderTextColor="#3f3f46"
                  value={newPassword}
                  onChangeText={(t) => {
                    setNewPassword(t);
                    setErrorMsg(null);
                  }}
                  secureTextEntry
                  editable={!isLoading}
                  className="bg-[#0E0E0B] border border-white/10 rounded px-3 py-2.5 text-xs text-white font-mono"
                />
              </View>

              <View>
                <Text className="text-[9px] text-zinc-400 font-mono mb-1.5 uppercase tracking-wider">
                  Título Oficial Escolhido
                </Text>
                <View className="bg-[#0E0E0B] border border-[#FF421C]/20 rounded">
                  <Picker
                    selectedValue={newTitle}
                    onValueChange={setNewTitle}
                    enabled={!isLoading}
                    style={{ color: "#fff" }}
                    dropdownIconColor="#FF421C"
                  >
                    <Picker.Item label="Treinador Iniciante" value="Treinador Iniciante" />
                    <Picker.Item label="Iniciante da Liga" value="Iniciante da Liga" />
                    <Picker.Item label="Mestre Pokémon" value="Mestre Pokémon" />
                    <Picker.Item label="Colecionador Kanto" value="Colecionador Kanto" />
                    <Picker.Item label="Líder de Ginásio" value="Líder de Ginásio" />
                  </Picker>
                </View>
              </View>

              {errorMsg && (
                <Text className="text-[10px] text-red-500 font-mono text-center font-bold">
                  ⚠️ {errorMsg}
                </Text>
              )}

              <View className="gap-2 pt-2">
                <Pressable
                  onPress={handleRegisterSubmit}
                  disabled={isLoading}
                  className="bg-[#FF421C] py-3 rounded flex-row items-center justify-center gap-2"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator color="#000" size="small" />
                      <Text className="text-black font-black text-[10px] tracking-widest uppercase">
                        CADASTRANDO...
                      </Text>
                    </>
                  ) : (
                    <Text className="text-black font-black text-[10px] tracking-widest uppercase">
                      REGISTRAR E CONECTAR ➜
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsRegistering(false);
                    setErrorMsg(null);
                  }}
                  disabled={isLoading}
                  className="bg-transparent border border-white/10 py-2.5 rounded"
                >
                  <Text className="text-zinc-400 font-black text-[8px] tracking-widest uppercase text-center">
                    « CANCELAR E VOLTAR AO ACESSO
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="gap-4">
              <View>
                <Text className="text-[9px] text-zinc-400 font-mono mb-1.5 uppercase tracking-wider">
                  Identificação do Treinador
                </Text>
                <TextInput
                  placeholder="Ex: Neymar, kleber..."
                  placeholderTextColor="#3f3f46"
                  value={usernameInput}
                  onChangeText={(t) => {
                    setUsernameInput(t);
                    setErrorMsg(null);
                  }}
                  editable={!isLoading}
                  className="bg-[#0E0E0B] border border-white/10 rounded px-3 py-2.5 text-xs text-white font-mono"
                />
              </View>

              <View>
                <Text className="text-[9px] text-zinc-400 font-mono mb-1.5 uppercase tracking-wider">
                  Senha da Liga Secreta
                </Text>
                <TextInput
                  placeholder="Ex: Senha@Senha"
                  placeholderTextColor="#3f3f46"
                  value={passwordInput}
                  onChangeText={(t) => {
                    setPasswordInput(t);
                    setErrorMsg(null);
                  }}
                  secureTextEntry
                  editable={!isLoading}
                  className="bg-[#0E0E0B] border border-white/10 rounded px-3 py-2.5 text-xs text-white font-mono"
                />
              </View>

              {errorMsg && (
                <Text className="text-[10px] text-red-500 font-mono text-center font-bold">
                  ⚠️ {errorMsg}
                </Text>
              )}

              <View className="gap-2 pt-2">
                <Pressable
                  onPress={handleLoginSubmit}
                  disabled={isLoading}
                  className="bg-[#FF421C] py-3 rounded flex-row items-center justify-center gap-2"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator color="#000" size="small" />
                      <Text className="text-black font-black text-[10px] tracking-widest uppercase">
                        AUTENTICANDO...
                      </Text>
                    </>
                  ) : (
                    <Text className="text-black font-black text-[10px] tracking-widest uppercase">
                      AUTENTICAR TREINADOR ➜
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsRegistering(true);
                    setErrorMsg(null);
                  }}
                  disabled={isLoading}
                  className="bg-transparent border border-white/10 py-2.5 rounded"
                >
                  <Text className="text-emerald-400 font-black text-[9px] tracking-widest uppercase text-center">
                    📝 REALIZAR NOVO CADASTRO
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View className="mt-8 border-t border-white/5 pt-4">
            <Text className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider text-center">
              {isRegistering
                ? "Ficha cadastral auditada pela Liga Secreta Kanto"
                : "Uso exclusivo para Portadores de Insígnias da Liga Kanto"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
