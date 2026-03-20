import { Tabs } from "expo-router";

export default function TabsLayout() {
  /*
   * TEMP: Guard de token desativado para facilitar testes sem backend.
   * Para reativar, use o exemplo abaixo e descomente os imports correspondentes:
   *
   * import AsyncStorage from "@react-native-async-storage/async-storage";
   * import { Tabs, router } from "expo-router";
   * import { useEffect, useState } from "react";
   *
   * const [ready, setReady] = useState(false);
   * useEffect(() => {
   *   (async () => {
   *     try {
   *       const token = await AsyncStorage.getItem("@token");
   *       if (!token) {
   *         router.replace("/login");
   *         return;
   *       }
   *     } finally {
   *       setReady(true);
   *     }
   *   })();
   * }, []);
   *
   * if (!ready) return null;
   */

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Início" }} />
      <Tabs.Screen name="perfil" />
      <Tabs.Screen name="configuracao" />
    </Tabs>
  );
}
