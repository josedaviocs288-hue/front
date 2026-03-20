import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: 330,
    alignItems: "center",
    elevation: 6
  },

  logo: {
    width: 220,
    height: 80,
    marginBottom: 5
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#41af65",
    marginTop: 5
  },

  subtitle: {
    color: "#4bbd7a",
    fontWeight: "600",
    marginBottom: 5
  },

  description: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 25
  },

  inputGroup: {
    width: "100%",
    marginBottom: 18,
    position: "relative"
  },

  icon: {
    position: "absolute",
    left: 12,
    top: 12,
    fontSize: 16
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingLeft: 40,
    fontSize: 15
  },

  options: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  button: {
    width: "100%",
    backgroundColor: "#41af65",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },

  signup: {
    marginTop: 25,
    fontSize: 13
  },

  link: {
    color: "#26a8c9",
    fontWeight: "bold"
  },

  error: {
    color: "red",
    marginTop: 10
  }
});
