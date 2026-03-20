import { Audio } from "expo-av";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

import PaginationDots from "@/src/components/PaginationDots";
import { slides } from "@/src/data/slides";
import { styles } from "@/src/styles/onboardingStyles";

export default function Onboarding() {
  const [index, setIndex] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [index]);

  async function playSound(): Promise<void> {
    try {
      const { sound: audio } = await Audio.Sound.createAsync({
        uri: "https://www.soundjay.com/buttons/sounds/button-3.mp3"
      });

      sound.current = audio;
      await audio.playAsync();
    } catch (error) {
      console.warn("Erro ao tocar som:", error);
    }
  }

  function nextSlide(): void {
    playSound();
    fadeAnim.setValue(0);

    if (index < slides.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      router.replace("/login");
    }
  }

  const slide = slides[index];

  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.topo}>
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>♻</Text>
          <Text style={styles.logoText}>Recicle+</Text>
        </View>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.skip}>Pular</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <Animated.View style={[styles.conteudo, { opacity: fadeAnim }]}>
        <Image
          source={slide.imagem}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>{slide.titulo}</Text>
        <Text style={styles.descricao}>{slide.descricao}</Text>
      </Animated.View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <PaginationDots index={index} total={slides.length} />

        <TouchableOpacity style={styles.botao} onPress={nextSlide}>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
