import { useState, useEffect, useCallback } from "react";
import { View, ScrollView, useColorScheme, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import ScreenHeader from "@/components/ScreenHeader";
import SearchBar from "@/components/SearchBar";
import ChatItem from "@/components/ChatItem";
import EmptyState from "@/components/EmptyState";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadChats = useCallback(async () => {
    try {
      const chatsData = await AsyncStorage.getItem("chats");
      if (chatsData) {
        setChats(JSON.parse(chatsData));
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [loadChats]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  }, [loadChats]);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#FFFFFF" }}>
      <ScreenHeader title="Messages" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SearchBar
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {filteredChats.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No Messages Yet"
            subtitle="Start a conversation with your contacts to see messages here"
          />
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              message={chat}
              onPress={() => router.push(`/chat/${chat.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
