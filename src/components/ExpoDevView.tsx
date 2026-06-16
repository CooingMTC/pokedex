import React, { useState } from "react";
import { EXPO_FILES } from "../data/expoFiles";
import { Smartphone, Code, FileText, Terminal, Download, Check, Copy } from "lucide-react";

export function ExpoDevView() {
  const [selectedExpoFileIndex, setSelectedExpoFileIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="px-6 md:px-12 pt-8 flex-1 flex flex-col gap-6 select-text mb-12">
      {/* Developer mini billboard */}
      <div className="relative rounded-2xl bg-[#0D0E0B] border border-amber-500/20 p-6 md:p-8 flex flex-col justify-end overflow-hidden">
        {/* watermark decoration */}
        <div className="absolute top-0 right-0 text-[120px] font-black leading-none opacity-[0.02] select-none translate-x-12 translate-y-3 uppercase pointer-events-none italic font-mono">
          EXPO
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[2px] w-6 bg-amber-400" />
            <span className="text-amber-400 font-mono text-[9px] tracking-[0.2em] font-extrabold uppercase flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-amber-400" /> Expo Integration Portal
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic text-white leading-tight">
            COMPILAÇÃO EM DISPOSITIVO NATIVO 📱
          </h1>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed max-w-3xl">
            O código fonte do Pokédex foi totalmente convertido para <strong className="text-amber-300">React Native e Expo CLI com TypeScript</strong>. 
            Utilize este Hub de Integração para inspecionar, copiar, ou exportar o código. Os arquivos correspondentes foram gerados em seu diretório na pasta <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">/expo-project/</code>.
          </p>
        </div>
      </div>

      {/* IDE Workspace Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-[500px]">
        {/* File navigator sidebar - 3 columns */}
        <div className="lg:col-span-3 bg-white/[0.01] border border-white/10 rounded-xl p-4 flex flex-col gap-3 h-fit">
          <div className="text-[10px] uppercase font-black text-zinc-500 tracking-wider mb-2 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Arquivos Gerados ({EXPO_FILES.length})</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {EXPO_FILES.map((file, idx) => {
              const isCur = selectedExpoFileIndex === idx;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedExpoFileIndex(idx)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left transition-all text-xs font-mono select-none cursor-pointer ${
                    isCur 
                      ? "bg-amber-400/10 text-white border-l-2 border-amber-400 bg-white/5 font-bold" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border-l-2 border-transparent"
                  }`}
                >
                  {file.name.endsWith(".md") ? (
                    <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
                  ) : file.name.endsWith(".ts") ? (
                    <Terminal className="w-4 h-4 text-blue-400 shrink-0" />
                  ) : (
                    <Code className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>

          {/* Download banner helper */}
          <div className="mt-6 p-4 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-400 space-y-2 leading-relaxed font-mono">
            <div className="flex items-center gap-1 text-zinc-300 font-bold uppercase text-[9px]">
              <Download className="w-3 h-3 text-[#FF421C]" />
              <span>Acesso Direto</span>
            </div>
            <p>Todos estes arquivos estão prontos para uso em seu diretório:</p>
            <code className="text-[#FF421C] block select-all bg-black/40 px-2 py-1 rounded text-center font-bold">/expo-project/</code>
          </div>
        </div>

        {/* Code viewer workspace - 9 columns */}
        <div className="lg:col-span-9 bg-[#0E0E0A] border border-white/10 rounded-xl flex flex-col overflow-hidden min-h-[400px]">
          {/* editor header bar */}
          <div className="flex items-center justify-between px-5 py-3 h-12 bg-[#090906] border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/40" />
              </div>
              <span className="h-4 w-[1px] bg-white/15" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                {EXPO_FILES[selectedExpoFileIndex].path}
              </span>
            </div>

            <button
              onClick={() => handleCopyCode(EXPO_FILES[selectedExpoFileIndex].content, selectedExpoFileIndex)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-[9px] uppercase font-black font-mono transition-all cursor-pointer ${
                copiedIndex === selectedExpoFileIndex
                  ? "bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)] font-bold animate-pulse"
                  : "bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {copiedIndex === selectedExpoFileIndex ? (
                <>
                  <Check className="w-3 h-3 text-black" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Code scrollview with styled typography */}
          <div className="flex-1 p-5 overflow-auto max-h-[580px]">
            <pre className="font-mono text-xs text-zinc-300 select-all leading-relaxed whitespace-pre font-medium pr-10">
              {EXPO_FILES[selectedExpoFileIndex].content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
