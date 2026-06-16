# Pokedex Expo TypeScript (React Native) Project

Este é o código-fonte convertido integralmente para o **Expo CLI com TypeScript**, mantendo a interface escura de altíssima fidelidade ("Artistic Flair Dark Theme") adaptada para as restrições nativas do React Native.

## 🚀 Como Executar

### 1. Criar novo projeto Expo
Se você já possui um projeto Expo existente, pode pular para o passo 2. Caso contrário:
```bash
npx create-expo-app@latest meu-pokedex-app --template blank-typescript
cd meu-pokedex-app
```

### 2. Instalar as Dependências Necessárias
O aplicativo utiliza ícones padrão integrados no Expo (`@expo/vector-icons`). Certifique-se de que estão instaladas as dependências recomendadas:
```bash
npx expo install @expo/vector-icons
```

### 3. Copiar os Arquivos
Mova ou copie os arquivos desta pasta `/expo-project` para a estrutura do seu projeto Expo:
- `App.tsx` para a raiz do seu aplicativo.
- `types.ts` para a raiz ou pasta compartilhada do seu aplicativo.
- `utils/pokeapi.ts` para a subpasta equivalente correspondente.
- `components/PokemonCard.tsx` e `components/PokemonModal.tsx` para a sua pasta de componentes.

### 4. Executar o Servidor de Desenvolvimento Expo
```bash
npx expo start
```
Use o aplicativo **Expo Go** no seu smartphone (iOS/Android) ou execute em um emulador correspondente pressionando `a` (para Android) ou `i` (para iOS) no terminal.

## 🎨 Particularidades da Conversão

1. **Native Modules**: Substituímos todos os elementos HTML standard (`div`, `main`, `h1`) por primitivos de alto desempenho do React Native (`View`, `Text`, `FlatList`, `ScrollView`, `Modal`).
2. **Pre-bundled Icons**: Integramos os ícones `Ionicons` provenientes de `@expo/vector-icons`, ideais para aplicativos de alto desempenho desenvolvidos no ecossistema Expo.
3. **Alto Nível de Polimento**: Mantivemos a paleta com backgrounds escuros (#0A0A0A), contrastes vibrantes (#FF421C para Red Spark, etc.) e barras de progresso proporcionais para biometria.
