import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },

  logo: {
    width: 200,
    height: 70,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
  },

  icon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    fontSize: 16,
  },

  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },

  link: {
    color: "#3B82F6",
    fontWeight: "600",
  },

  button: {
    borderRadius: 30,
    overflow: "hidden",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50", // fallback
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },

  signup: {
    marginTop: 15,
    textAlign: "center",
    color: "#444",
  },
});