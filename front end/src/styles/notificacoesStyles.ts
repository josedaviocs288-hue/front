import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    ...(Platform.OS !== "web" &&{
      padding: 16,
    })
  },

  list: {
    padding: 16,
    paddingBottom: 80
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2
  },

  text: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333"
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  viewBtn: {
    backgroundColor: "#2e7d32",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  },

  deleteBtn: {
    backgroundColor: "#c62828",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666"
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#2e7d32",
    padding: 16,
    alignItems: "center",
    ...(Platform.OS !== "web" &&{
      marginBottom: 16
    })
  },

  footerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
