
import { StyleSheet } from "react-native";

export function createStyles(width: number) {
  const guidelineBaseWidth = 375;
  const scale = (size: number) => (width / guidelineBaseWidth) * size;

  return StyleSheet.create({
    screen: {
      padding: scale(14),
      backgroundColor: "#1db954",
      alignItems: "center",
      minHeight: "100%",
    },

    container: {
      width: "100%",
      maxWidth: width >= 1024 ? 900 : width >= 768 ? 700 : "100%",
      backgroundColor: "#f4fef5",
      borderRadius: scale(18),
      padding: scale(18),
      marginTop: scale(20),
      marginBottom: scale(32),
    },

    title: {
      fontSize: width >= 1024 ? 22 : width >= 768 ? 20 : 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: scale(16),
      color: "#222",
    },

    label: {
      fontSize: width >= 1024 ? 14 : 12,
      fontWeight: "600",
      marginTop: scale(10),
      marginBottom: scale(12),
      color: "#333",
      width: "100%",
      flexWrap: "wrap",
      flexShrink: 1,
    },

    textInput: {
      backgroundColor: "#fff",
      borderRadius: scale(8),
      padding: scale(10),
      borderWidth: 1,
      borderColor: "#ccc",
      fontSize: width >= 1024 ? 15 : 13,
    },

    button: {
      backgroundColor: "#1db954",
      paddingVertical: scale(12),
      borderRadius: scale(10),
      alignItems: "center",
      marginTop: scale(8),
    },

    secondaryButton: {
      backgroundColor: "#888",
      paddingVertical: scale(12),
      borderRadius: scale(10),
      alignItems: "center",
      marginTop: scale(8),
    },

    buttonText: {
      color: "#fff",
      fontSize: width >= 1024 ? 16 : 14,
      fontWeight: "bold",
    },
  });
}
