import { Tabs } from "expo-router";
import { MessageCircle, Users, Settings } from "lucide-react-native";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
          borderTopWidth: 1,
          borderColor: isDark ? "#2C2C2E" : "#E5E7EB",
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#0062FF",
        tabBarInactiveTintColor: isDark ? "#8E8E93" : "#6B6B6B",
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "System",
        },
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color, size }) => <Users color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
