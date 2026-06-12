import { View, Text, Pressable, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { CheckCircle, Users } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function ChatItem({ message, onPress }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Pressable
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#F9FAFC",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
      android_ripple={{ color: isDark ? "#2C2C2E" : "#E0E0E0" }}
      onPress={onPress}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: message.avatarBg || "#E8E4FF",
          marginRight: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {message.isGroup ? (
          <Users size={20} color="#0062FF" />
        ) : message.avatar ? (
          <Image
            source={message.avatar}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            contentFit="cover"
          />
        ) : (
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "#0062FF",
            }}
          >
            {message.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      <View style={{ flex: 1, marginRight: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 15,
              color: isDark ? "#FFFFFF" : "#111111",
              marginBottom: 2,
            }}
          >
            {message.name}
          </Text>
          {message.isGroup && (
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: isDark ? "#8E8E93" : "#8B8B8B",
                marginLeft: 6,
              }}
            >
              ({message.memberCount || 0})
            </Text>
          )}
        </View>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            color: isDark ? "#8E8E93" : "#8B8B8B",
            lineHeight: 18,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {message.message ||
            (message.isGroup ? "Grup oluşturuldu" : "Henüz mesaj yok")}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            color: isDark ? "#8E8E93" : "#B4B4B4",
            marginBottom: 4,
          }}
        >
          {message.time}
        </Text>

        {message.unread ? (
          <View
            style={{
              backgroundColor: "#D6302F",
              borderRadius: 8,
              minWidth: 16,
              height: 16,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 10,
                color: "#FFFFFF",
              }}
            >
              {message.unread}
            </Text>
          </View>
        ) : message.read ? (
          <CheckCircle size={16} color="#09C26A" />
        ) : null}
      </View>
    </Pressable>
  );
}
