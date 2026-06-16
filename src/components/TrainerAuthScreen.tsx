import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface TrainerAuthScreenProps {
  registeredUsers?: { [key: string]: { password: string; profile: any } };
  onAuthSuccess: (profile: any) => void;
  onRegisterSuccess: (
    username: string,
    password: string,
    title: string,
  ) => void;
}

export function TrainerAuthScreen({
  registeredUsers,
  onAuthSuccess,
  onRegisterSuccess,
}: TrainerAuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // Login fields
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  // Registration fields
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("Treinador Iniciante");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: cleanUser,
            password: cleanPassword,
          }),
        },
      );

      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch (e) {
        // Response wasn't JSON or was empty
      }

      if (response.ok) {
        const userId = responseData.userId;

        localStorage.setItem("userId", userId);

        const profileResponse = await fetch(
          `https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/auth/v1/stats/${userId}`,
        );

        const profileData = await profileResponse.json();

        onAuthSuccess({
          userId: userId,
          nome: profileData.username,
          titulo: "Treinador Pokémon",
          nivel: profileData.level,
          xp: 0,
          insignias: 0,
          vitorias: profileData.vitorias,
          derrotas: profileData.derrotas,
          avatar:
            profileData.username === "Goti22"
              ? "../assets/goti22.png"
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.username}`,
        });
      } else {
        setErrorMsg(
          responseData.message ||
            responseData.error ||
            "Credenciais de Treinador incorretas ou inexistentes. Tente cadastrar o perfil!",
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro de conexão com o servidor de autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: cleanUser,
            password: cleanPassword,
          }),
        },
      );

      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch (e) {
        // Response wasn't JSON or was empty
      }

      if (response.ok) {
        setErrorMsg(null);
        onRegisterSuccess(cleanUser, cleanPassword, newTitle);

        // Reset fields
        setNewUsername("");
        setNewPassword("");
        setNewTitle("Treinador Iniciante");
        setIsRegistering(false);
      } else {
        setErrorMsg(
          responseData.message ||
            responseData.error ||
            "Este nome de treinador está inválido ou já registrado! Escolha outro.",
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
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] font-sans flex items-center justify-center p-4 selection:bg-[#FF421C] selection:text-black">
      <div className="w-full max-w-md bg-white/[0.01] border border-white/10 p-8 md:p-10 rounded-2xl relative overflow-hidden shadow-2xl skew-y-[-1deg] hover:skew-y-0 transition-transform duration-500">
        {/* background glowing effect */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF421C] via-amber-400 to-[#FF421C]" />

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF421C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="skew-y-[1deg] hover:skew-y-0 transition-transform duration-500">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 text-[#FF421C] animate-spin" />
                ) : (
                  <span className="text-2xl animate-pulse">
                    {isRegistering ? "📝" : "🔴"}
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-wider italic text-white flex items-center justify-center gap-2 font-mono">
              {isRegistering ? "CADASTRO" : "POKE"}
              <span className="text-[#FF421C]">
                {isRegistering ? "TREINADOR" : "22"}
              </span>
            </h1>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5 leading-relaxed">
              {isRegistering
                ? "NOVO REGISTRO DO TREINADOR"
                : "CONEXÃO DO TREINADOR CREDENCIADO"}
            </p>
          </div>

          {isRegistering ? (
            /* REGISTRATION SCREEN */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] text-zinc-400 font-mono block mb-1.5 uppercase tracking-wider">
                  Identificação do Treinador
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ash Ketchum, Red, Misty..."
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    setErrorMsg(null);
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#0E0E0B] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-zinc-700 font-mono tracking-wider focus:ring-1 focus:ring-[#FF421C] outline-none disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-400 font-mono block mb-1.5 uppercase tracking-wider">
                  Senha Secreta da Liga
                </label>
                <input
                  type="password"
                  placeholder="Crie sua senha secreta"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrorMsg(null);
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#0E0E0B] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-zinc-700 font-mono tracking-wider focus:ring-1 focus:ring-[#FF421C] outline-none disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-400 font-mono block mb-1.5 uppercase tracking-wider">
                  Título Oficial Escolhido
                </label>
                <select
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#0E0E0B] border border-[#FF421C]/20 rounded px-3 py-2 text-xs text-white font-mono tracking-wider focus:ring-1 focus:ring-[#FF421C] focus:border-[#FF421C] outline-none disabled:opacity-50"
                >
                  <option value="Treinador Iniciante">
                    Treinador Iniciante
                  </option>
                  <option value="Iniciante da Liga">Iniciante da Liga</option>
                  <option value="Mestre Pokémon">Mestre Pokémon</option>
                  <option value="Colecionador Kanto">Colecionador Kanto</option>
                  <option value="Líder de Ginásio">Líder de Ginásio</option>
                </select>
              </div>

              {errorMsg && (
                <p className="text-[10px] text-red-500 font-mono mt-1 text-center font-bold">
                  ⚠️ {errorMsg}
                </p>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF421C] hover:bg-red-500 text-black font-black text-[10px] tracking-widest uppercase py-3 rounded skew-x-[-12deg] shadow-[0_4px_20px_rgba(255,66,28,0.3)] hover:shadow-[0_4px_25px_rgba(255,66,28,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>CADASTRANDO...</span>
                    </>
                  ) : (
                    <span>REGISTRAR E CONECTAR ➜</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg(null);
                  }}
                  disabled={isLoading}
                  className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-zinc-400 font-black text-[8px] tracking-widest uppercase py-2 rounded transition-all cursor-pointer font-mono disabled:opacity-50"
                >
                  « CANCELAR E VOLTAR AO ACESSO
                </button>
              </div>
            </form>
          ) : (
            /* ORIGINAL LOGIN SCREEN */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] text-zinc-400 font-mono block mb-1.5 uppercase tracking-wider">
                  Identificação do Treinador
                </label>
                <input
                  type="text"
                  placeholder="Ex: Neymar, kleber..."
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#0E0E0B] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-zinc-700 font-mono tracking-wider focus:ring-1 focus:ring-[#FF421C] outline-none disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-400 font-mono block mb-1.5 uppercase tracking-wider">
                  Senha da Liga Secreta
                </label>
                <input
                  type="password"
                  placeholder="Ex: Senha@Senha"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#0E0E0B] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-zinc-700 font-mono tracking-wider focus:ring-1 focus:ring-[#FF421C] outline-none disabled:opacity-50"
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-[10px] text-red-500 font-mono mt-1 text-center font-bold">
                  ⚠️ {errorMsg}
                </p>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF421C] hover:bg-red-500 text-black font-black text-[10px] tracking-widest uppercase py-3 rounded skew-x-[-12deg] shadow-[0_4px_20px_rgba(255,66,28,0.3)] hover:shadow-[0_4px_25px_rgba(255,66,28,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>AUTENTICANDO...</span>
                    </>
                  ) : (
                    <span>AUTENTICAR TREINADOR ➜</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg(null);
                  }}
                  disabled={isLoading}
                  className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-emerald-400 hover:text-emerald-300 font-black text-[9px] tracking-widest uppercase py-2 rounded transition-all cursor-pointer font-mono disabled:opacity-50"
                >
                  📝 REALIZAR NOVO CADASTRO
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <span className="text-[8px] font-mono text-zinc-650 block uppercase tracking-wider">
              {isRegistering
                ? "Ficha cadastral auditada pela Liga Secreta Kanto"
                : "Uso exclusivo para Portadores de Insígnias da Liga Kanto"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
