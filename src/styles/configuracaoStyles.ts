import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  pageDark: {
    backgroundColor: "#121212",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },

  textDark: {
    color: "#e0e0e0",
  },

  card: {
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    elevation: 5,
    marginBottom: "auto",
    marginTop: "auto",
  },

  cardDark: {
    backgroundColor: "#1e1e1e",
  },

  label: {
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  pickerWrapperDark: {
    backgroundColor: "#1e1e1e",
    borderColor: "#444",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    color: "#000",
  },

  inputDark: {
    backgroundColor: "#1e1e1e",
    borderColor: "#444",
    color: "#fff",
  },

  button: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },

  danger: {
    backgroundColor: "#c62828",
  },

  backButton: {
    backgroundColor: "#555",
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
