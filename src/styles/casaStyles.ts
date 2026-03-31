import { StyleSheet } from "react-native";
import { Platform } from "react-native";

export const styles = StyleSheet.create({
    screen: {
    padding: 16,
    backgroundColor: "#1db954",
    alignItems: "center", 
    minHeight: "100%",
  },

  container: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "#f4fef5",
    borderRadius: 20,
    padding: 20,
    marginTop: 24,        
    marginBottom: 40,

    ...(Platform.OS !== "web" &&{
        minHeight: "90%",  
        }),
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#222"
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 6,
    color: "#333"
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    height: 30,
  },

  textInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc"
  },

  button: {
    backgroundColor: "#1db954",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15
  },

  secondaryButton: {
    backgroundColor: "#888",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
