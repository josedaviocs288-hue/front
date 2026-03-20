import { Redirect } from "expo-router";

export default function Index() {
  const usuarioLogado = false; // depois vem AsyncStorage

  if (usuarioLogado) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/onboarding" />;
}
