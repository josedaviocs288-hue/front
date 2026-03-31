import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0aa57a", // fundo verde
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    color: "#0a5c4a",
    marginBottom: 24,
  },

  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#b5d9cf",
    marginBottom: 18,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 4,
  },

  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 18,
  },

  option: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#0aa57a",
    borderRadius: 6,
    marginHorizontal: 6,
    alignItems: "center",
  },

  optionActive: {
    backgroundColor: "#0aa57a",
  },

  optionText: {
    color: "#0aa57a",
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#0a5c4a",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },

  link: {
    marginTop: 18,
    textAlign: "center",
    color: "#0aa57a",
    fontSize: 14,
  },
});
