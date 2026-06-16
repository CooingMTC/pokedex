import React, { useState } from "react";
import {
  User,
  Edit2,
  Database,
  Trophy,
  Award,
  Info,
  Terminal,
} from "lucide-react";

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

  const handleSaveTrainerName = () => {
    onTrainerChange({
      ...trainer,
      nome: tempName || trainer.nome,
      titulo: tempTitle || trainer.titulo,
    });
    setIsEditingName(false);
  };

  const handleGainBadge = () => {
    onTrainerChange({
      ...trainer,
      insignias: Math.min(trainer.insignias + 1, 8),
    });
  };

  const handleGainVictory = async () => {
    const novasVitorias = trainer.vitorias + 1;

    try {
      await fetch(
        `https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/auth/v1/stats/${trainer.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level: trainer.nivel,
            vitorias: novasVitorias,
            derrotas: trainer.derrotas || 0,
          }),
        },
      );

      onTrainerChange({
        ...trainer,
        vitorias: novasVitorias,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return (
    <div className="px-6 md:px-12 pt-8 flex-1 flex flex-col gap-8 mb-12 animate-fade-in">
      {/* HERO MODULE BANNER */}
      <div className="relative rounded-2xl bg-white/[0.01] border border-white/10 p-6 md:p-10 flex flex-col justify-end overflow-hidden min-h-[160px]">
        <div className="absolute top-0 right-0 text-[140px] md:text-[200px] font-black leading-none opacity-[0.02] select-none translate-x-12 translate-y-3 uppercase pointer-events-none italic font-mono">
          TRAINER
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-[#FF421C]" />
            <span className="text-[#FF421C] font-mono text-[10px] tracking-[0.25em] font-extrabold uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> ESTAÇÃO DE MONITORAMENTO ATIVA
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter uppercase italic text-white">
            PAINEL DO TREINADOR
          </h1>
          <p className="mt-3 text-xs md:text-sm text-zinc-400 leading-relaxed">
            Gerencie suas credenciais de treinamento de elite, consulte as
            diretrizes de modelagem e arquitetura para bancos de dados nativos.
          </p>
        </div>
      </div>

      {/* TRAINER IDENTIFICATION BLOCK (GLASS CARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Editing */}
        <div className="lg:col-span-1 bg-white/[0.01] border border-white/10 rounded-2xl p-6 relative flex flex-col items-center justify-center text-center">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                if (!isEditingName) {
                  setTempName(trainer.nome);
                  setTempTitle(trainer.titulo);
                }
                setIsEditingName(!isEditingName);
              }}
              className="p-2 rounded-full hover:bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Editar Perfil"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400 p-1 bg-emerald-500/10 flex items-center justify-center overflow-hidden">
              <img
                src={trainer.avatar}
                alt="Trainer Avatar"
                className="w-full h-full object-contain bg-zinc-900 rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full border-2 border-[#0A0A0A] px-2 py-0.5 text-[10px] text-zinc-950 font-black font-mono shadow-md">
              LV. {trainer.nivel}
            </div>
          </div>

          {isEditingName ? (
            <div className="w-full space-y-3 px-2 z-10">
              <div>
                <span className="text-[9px] text-[#FF421C] font-mono block text-left mb-1 uppercase tracking-wider">
                  Identificação do Treinador
                </span>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono tracking-wider focus:ring-1 focus:ring-emerald-400 outline-none uppercase"
                  placeholder="NOME"
                />
              </div>
              <div>
                <span className="text-[9px] text-[#FF421C] font-mono block text-left mb-1 uppercase tracking-wider">
                  Título de Patente
                </span>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono tracking-wider focus:ring-1 focus:ring-emerald-400 outline-none"
                  placeholder="TÍTULO"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTrainerName}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[9px] uppercase py-2 tracking-widest rounded cursor-pointer transition-all"
                >
                  SALVAR
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="flex-grow-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 py-2 text-[9px] uppercase tracking-widest rounded cursor-pointer transition-all"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black text-white tracking-wide uppercase font-mono">
                {trainer.nome}
              </h2>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF421C] mt-1">
                {trainer.titulo}
              </p>

              {/* XP visualizer */}
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                  <span>EXP. MASTER</span>
                  <span className="text-emerald-400">{trainer.xp}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${trainer.xp}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Status Counters */}
        <div className="lg:col-span-2 bg-white/[0.01] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 mb-6">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                ESTATÍSTICAS DA LIGA OFICIAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-950 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-wider">
                    Capturados
                  </span>
                  <span className="text-2xl font-mono font-black text-white">
                    {pokebagCount}
                  </span>
                </div>
                <span className="text-2xl">🎒</span>
              </div>

              <div className="bg-zinc-950 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-wider">
                    Insígnias
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-mono font-black text-amber-400">
                      {trainer.insignias}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-650">
                      / 8
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <button
                    onClick={handleGainBadge}
                    className="mt-1 px-1.5 py-0.5 bg-amber-400/10 hover:bg-amber-400 hover:text-black rounded text-[8px] font-black text-amber-400 transition-all cursor-pointer"
                    disabled={trainer.insignias >= 8}
                  >
                    CONQUISTAR
                  </button>
                </div>
              </div>

              <div className="bg-zinc-950 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-wider">
                    Vitórias
                  </span>
                  <span className="text-2xl font-mono font-black text-white">
                    {trainer.vitorias}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <button
                    onClick={handleGainVictory}
                    className="mt-1 px-1.5 py-0.5 bg-emerald-400/10 hover:bg-emerald-400 hover:text-zinc-950 rounded text-[8px] font-black text-emerald-400 transition-all cursor-pointer"
                  >
                    REGISTRAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
