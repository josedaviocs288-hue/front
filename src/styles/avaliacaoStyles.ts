import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    ...(Platform.OS !== "web" && {
      paddingTop: 16
    })
  },

  topBar: {
    height: 60,
    backgroundColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4
  },

  topTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold"
  },

  backBtn: {
    position: "absolute",
    left: 20
  },

  backText: {
    color: "#fff",
    fontSize: 24
  },

  container: {
    padding: 30,
    alignItems: "center"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 15,
    textAlign: "center"
  },

  subtitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 25
  },

  stars: {
    flexDirection: "row",
    marginBottom: 20
  },

  star: {
    fontSize: 48,
    color: "#ccc",
    marginHorizontal: 6
  },

  starSelected: {
    color: "#f5b301"
  },

  textarea: {
    width: "100%",
    maxWidth: 480,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 15,
    textAlignVertical: "top",
    marginBottom: 20
  },

  button: {
    backgroundColor: "#1db954",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  }
});
