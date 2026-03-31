import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8f1",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 30,
    textAlign: "center"
  },

  opcoes: {
    width: "100%",
    maxWidth: 360,
    gap: 20
  },

  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },

  voltar: {
    backgroundColor: "#888"
  }
});
