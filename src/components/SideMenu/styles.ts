import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10
  },
  menu: {
    position: "absolute",
    top: 0,
    width: 260,
    height: "100%",
    backgroundColor: "#2e7d32",
    paddingTop: 60,
    alignItems: "center",
    zIndex: 20
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10
  },
  placeholderPic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  placeholderText: {
    fontSize: 36,
    color: "#fff"
  },
  nome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20
  },
  item: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1b4d23"
  },
  itemPressed: {
    opacity: 0.6
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
    color: "#fff"
  },
  text: {
    fontSize: 18,
    color: "#fff"
  }
});
