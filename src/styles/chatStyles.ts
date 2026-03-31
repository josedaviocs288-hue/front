import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9"
  },

  header: {
    backgroundColor: "#2e7d32",
    padding: 15,
    alignItems: "center",
    ...(Platform.OS !== "web" &&{
      marginTop: 16
    })
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },

  chatContainer: {
    padding: 15,
    gap: 10
  },

  chatBloqueado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  msgAviso: {
    color: "#a00",
    fontSize: 16,
    textAlign: "center"
  },

  msg: {
    maxWidth: "70%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20
  },

  remetente: {
    backgroundColor: "#2e7d32",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0
  },

  destinatario: {
    backgroundColor: "#c8e6c9",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0
  },

  msgTextWhite: {
    color: "#fff"
  },

  msgTextDark: {
    color: "#333"
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40
  },

  btnEnviar: {
    backgroundColor: "#2e7d32",
    marginLeft: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 25
  },

  btnDisabled: {
    backgroundColor: "#9e9e9e"
  },

  btnEnviarText: {
    color: "#fff",
    fontWeight: "bold"
  },

  btnVoltar: {
    margin: 10,
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },

  btnVoltarText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
