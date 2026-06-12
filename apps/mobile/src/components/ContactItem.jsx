import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { MessageCircle } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function ContactItem({ contact, onPress }) {
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
    <TouchableOpacity
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#F9FAFC",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: contact.avatarBg || "#E8E4FF",
          marginRight: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {contact.avatar ? (
          <Image
            source={contact.avatar}
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
            {contact.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      {/* Contact Info */}
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 15,
            color: isDark ? "#FFFFFF" : "#111111",
            marginBottom: 2,
          }}
        >
          {contact.name}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            color: isDark ? "#8E8E93" : "#8B8B8B",
          }}
        >
          {contact.phoneNumber}
        </Text>
      </View>

      {/* Message Action */}
      <TouchableOpacity
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#0062FF",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onPress}
      >
        <MessageCircle size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
