import { Image, TouchableOpacity, Text, View } from "react-native";
import { styles } from "./styles";

type NavbarProps = {
  onMenuPress: () => void;
  onNotificationPress?: () => void;
  showLogo?: boolean;
};

export function Navbar({
  onMenuPress,
  onNotificationPress,
  showLogo = true
}: NavbarProps) {
  return (
    <View style={styles.container}>
      {/* Menu */}
      <TouchableOpacity onPress={onMenuPress} style={styles.sideButton}>
        <Text style={styles.icon}>☰</Text>
      </TouchableOpacity>

      {/* Logo central */}
      {showLogo ? (
        <Image
          source={require("../../assets/images/logo-recicle-plus.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <View />
      )}

      {/* Notificação */}
      {onNotificationPress ? (
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.sideButton}
        >
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} />
      )}
    </View>
  );
}
