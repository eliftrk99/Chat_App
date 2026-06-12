import { View, TextInput, useColorScheme } from "react-native";
import { Search } from "lucide-react-native";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";

export default function SearchBar({ placeholder, value, onChangeText }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        height: 44,
        backgroundColor: isDark ? "#2C2C2E" : "#F5F5F5",
        borderRadius: 22,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 20,
      }}
    >
      <Search size={18} color={isDark ? "#8E8E93" : "#B4B4B4"} />
      <TextInput
        style={{
          flex: 1,
          fontFamily: "Poppins_400Regular",
          fontSize: 16,
          color: isDark ? "#FFFFFF" : "#111111",
          marginLeft: 12,
        }}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#8E8E93" : "#B4B4B4"}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
