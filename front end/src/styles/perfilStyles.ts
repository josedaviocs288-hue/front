import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    elevation: 5
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#2e7d32",
    marginBottom: 15
  },

  photoButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 15
  },

  photoButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 15
  },

  saveButton: {
    backgroundColor: "#2e7d32",
    width: "100%",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },

  backButton: {
    backgroundColor: "#555",
    width: "100%",
    padding: 14,
    borderRadius: 8
  },

  backButtonText: {
    color: "#fff",
    textAlign: "center"
  }
});
