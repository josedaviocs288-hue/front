import { Image, TouchableOpacity, Text, View } from "react-native";
import { styles } from "./styles";
import NotificationBadge from "@/src/components/NotificationBadge"; // 🔥 IMPORTANTE

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

      {/* Notificação com BADGE */}
      {onNotificationPress ? (
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.sideButton}
        >
          <View style={{ position: "relative" }}>
            <Text style={styles.icon}>🔔</Text>

            {/* 🔴 BADGE */}
            <NotificationBadge />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} />
      )}
    </View>
  );
}