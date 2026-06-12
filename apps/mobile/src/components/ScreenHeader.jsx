import { View, Text, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

export default function ScreenHeader({ title, showBorder = false }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingHorizontal: 24,
        paddingBottom: 16,
        backgroundColor: isDark ? "#121212" : "#FFFFFF",
        borderBottomWidth: showBorder ? 1 : 0,
        borderBottomColor: isDark ? "#2C2C2E" : "#E5E5E5",
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 24,
          color: isDark ? "#FFFFFF" : "#111111",
          textAlign: "center",
          marginTop: 16,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
