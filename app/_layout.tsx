import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="coletas" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="cadastro/index" />
      <Stack.Screen name="perfil/index" />
      <Stack.Screen name="configuracao/index" />
      <Stack.Screen name="doacao/index" />
      <Stack.Screen name="doacao/casa/index" />
      <Stack.Screen name="doacao/fixa/index" />
      <Stack.Screen name="notificacoes/index" />
      <Stack.Screen name="ranking/index" />
      <Stack.Screen name="avaliacao/index" />
      <Stack.Screen name="chat/index" />
      <Stack.Screen name="onboarding/index" />
    </Stack>
  );
}