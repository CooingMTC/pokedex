import React, { useState } from "react";
import { ScrollView, View, Text, Pressable, Platform } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { 
  Smartphone, Code, FileText, Terminal, Download, Check, Copy, ChevronRight 
} from "lucide-react-native";

const EXPO_FILES = [
  { name: "App.tsx", path: "App.tsx", content: "import React from 'react';\nexport default function App() { ... }", type: "ts" },
  { name: "README.md", path: "docs/README.md", content: "# Projeto Expo\nInstruções...", type: "md" }
];

export function ExpoDevView() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(EXPO_FILES[selectedIdx].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView className="flex-1 px-6 pt-4 bg-[#070707]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="relative rounded-2xl bg-[#0D0E0B] border border-amber-500/20 p-6 overflow-hidden mb-6">
        <Text className="absolute right-[-10] top-0 font-black text-white italic opacity-5" style={{ fontSize: 80 }}>EXPO</Text>
        <View className="flex-row items-center gap-2 mb-2">
          <View className="h-[2px] w-6 bg-amber-400" />
          <Smartphone size={12} color="#fbbf24" />
          <Text className="text-amber-400 font-mono text-[9px] font-black uppercase tracking-[2px]">INTEGRATION PORTAL</Text>
        </View>
        <Text className="text-2xl font-black text-white uppercase italic">COMPILAÇÃO NATIVA 📱</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {EXPO_FILES.map((file, idx) => (
          <Pressable 
            key={file.name} 
            onPress={() => setSelectedIdx(idx)}
            className={`mr-2 px-4 py-3 rounded-xl border ${selectedIdx === idx ? 'bg-amber-400/10 border-amber-400' : 'bg-white/5 border-white/5'}`}
          >
            <Text className={`text-[10px] font-mono ${selectedIdx === idx ? 'text-white' : 'text-zinc-500'}`}>{file.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="bg-[#0E0E0A] border border-white/10 rounded-2xl overflow-hidden">
        <View className="flex-row items-center justify-between px-4 py-3 bg-black/40 border-b border-white/5">
          <Text className="text-[9px] font-mono text-zinc-500 uppercase">{EXPO_FILES[selectedIdx].path}</Text>
          <Pressable onPress={handleCopy} className={`px-3 py-1.5 rounded-lg ${copied ? 'bg-emerald-500' : 'bg-white/10'}`}>
            <Text className="text-[8px] font-black uppercase text-white">{copied ? 'COPIADO' : 'COPIAR'}</Text>
          </Pressable>
        </View>
        <ScrollView horizontal className="p-4 bg-black/20">
          <Text className="font-mono text-[10px] text-zinc-400 leading-5">{EXPO_FILES[selectedIdx].content}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
}