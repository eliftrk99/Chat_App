import { View, Text, useColorScheme } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function EmptyState({
  icon: IconComponent,
  iconSize = 48,
  title,
  subtitle,
}) {
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 60,
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: isDark ? "#2C2C2E" : "#F5F5F5",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <IconComponent size={iconSize} color={isDark ? "#8E8E93" : "#B4B4B4"} />
      </View>

      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 20,
          color: isDark ? "#FFFFFF" : "#111111",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 16,
          color: isDark ? "#8E8E93" : "#8B8B8B",
          textAlign: "center",
          lineHeight: 24,
          maxWidth: 280,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
