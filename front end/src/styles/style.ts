import { StyleSheet } from "react-native";

export function createStyles(width: number, height: number) {
  const baseWidth = 375;
  const scale = (size: number) => (width / baseWidth) * size;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#1db954",
      alignItems: "center",
      justifyContent: "center",
      padding: scale(14),
    },

    container: {
      width: "100%",
      maxWidth: width * 0.8,
      minHeight: height * 0.8,
      backgroundColor: "#f4fef5",
      borderRadius: scale(18),
      padding: scale(18),
    },

    title: {
      fontSize: scale(20),
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: scale(16),
      color: "#222",
    },

    label: {
      fontSize: scale(12),
      fontWeight: "600",
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
      fontSize: scale(13),
    },

    button: {
      backgroundColor: "#1db954",
      paddingVertical: scale(12),
      borderRadius: scale(10),
      alignItems: "center",
      marginTop: scale(10),
    },

    buttonText: {
      color: "#fff",
      fontSize: scale(14),
      fontWeight: "bold",
    },
  });
}
