import { Dimensions, Platform, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1db954",
    alignItems: "center",
  },

  container: {
    width: "92%",
    maxWidth: 520,
    backgroundColor: "#f4fef5",
    borderRadius: 20,
    padding: 16,
    marginTop: 24,
    marginBottom: 40,
    ...(Platform.OS !== "web" ? { minHeight: height * 0.8 } : {}),
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#222",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
    color: "#333",
  },

  textInput: {
    backgroundColor: "#fff",
    borderRadius: Platform.OS === "web" ? 8 : 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
    minHeight: 46,
    lineHeight: 20,
  },

  button: {
    backgroundColor: "#1db954",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  secondaryButton: {
    backgroundColor: "#888",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  pickerWrapper: {
    backgroundColor: "#e0e0e0",
    borderRadius: Platform.OS === "web" ? 8 : 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    overflow: Platform.OS === "web" ? "visible" : "hidden",
    minHeight: 46,
  },

  picker: {
    backgroundColor: "#e0e0e0",
    color: "#000",
    height: Platform.OS === "web" ? 42 : 50,
  },
});
