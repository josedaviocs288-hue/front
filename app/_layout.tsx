import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="coletas" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="perfil" />
      <Stack.Screen name="configuracao" />
      <Stack.Screen name="doacao" />
      <Stack.Screen name="doacao/casa" />
      <Stack.Screen name="doacao/fixa" />
      <Stack.Screen name="notificacoes" />
      <Stack.Screen name="ranking" />
      <Stack.Screen name="avaliacao" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}