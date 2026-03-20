import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20
  },
 card: {
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 30,
  elevation: 4,
  alignSelf: "center",
  width: "100%",
  maxWidth: 380
}
,
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4caf50",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center"
  },
  optionActive: {
    backgroundColor: "#4caf50"
  },
  optionText: {
    color: "#2e7d32",
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#26a8c9",
    fontWeight: "bold"
  }
});
