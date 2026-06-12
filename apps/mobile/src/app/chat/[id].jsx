import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Send,
  Clock,
  Check,
  CheckCheck,
  Users,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import * as Notifications from "expo-notifications";
import { useAppTheme } from "@/utils/ThemeContext";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDark } = useAppTheme();
  const [messageText, setMessageText] = useState("");
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const scrollViewRef = useRef(null);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const loadChat = useCallback(async () => {
    try {
      const chatsData = await AsyncStorage.getItem("chats");
      if (chatsData) {
        const chats = JSON.parse(chatsData);
        const chat = chats.find((c) => c.id === id);
        if (chat) {
          setChatInfo(chat);
        }
      }

      const messagesData = await AsyncStorage.getItem(`messages_${id}`);
      if (messagesData) {
        setMessages(JSON.parse(messagesData));
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  }, [id]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem(`messages_${id}`, JSON.stringify(newMessages));

      const chatsData = await AsyncStorage.getItem("chats");
      if (chatsData) {
        const chats = JSON.parse(chatsData);
        const chatIndex = chats.findIndex((c) => c.id === id);
        if (chatIndex !== -1 && newMessages.length > 0) {
          const lastMessage = newMessages[newMessages.length - 1];
          chats[chatIndex].message = lastMessage.text;
          chats[chatIndex].time = lastMessage.timestamp;
          await AsyncStorage.setItem("chats", JSON.stringify(chats));
        }
      }
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const newMessage = {
        id: `msg_${Date.now()}`,
        type: "outgoing",
        text: messageText.trim(),
        timestamp: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "queued",
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
      setMessageText("");

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Send local notification
      try {
        const { status } = await Notifications.getPermissionsAsync();
        if (status === "granted" && chatInfo) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${chatInfo.name}`,
              body: `Yeni mesaj: "${newMessage.text.substring(0, 50)}"`,
              sound: true,
            },
            trigger: null,
          });
        }
      } catch (e) {
        console.error("Notification error:", e);
      }
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 10);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "queued":
        return <Clock size={11} color={isDark ? "#8E8E93" : "#9B9B9B"} />;
      case "delivered":
        return <Check size={11} color={isDark ? "#8E8E93" : "#9B9B9B"} />;
      case "read":
        return <CheckCheck size={11} color="#09C26A" />;
      default:
        return null;
    }
  };

  const renderMessage = (message) => {
    const isOutgoing = message.type === "outgoing";

    return (
      <View
        key={message.id}
        style={{
          alignSelf: isOutgoing ? "flex-end" : "flex-start",
          marginBottom: 16,
          maxWidth: "75%",
        }}
      >
        <View
          style={{
            backgroundColor: isOutgoing
              ? "#0062FF"
              : isDark
                ? "#2C2C2E"
                : "#F7F7F7",
            borderRadius: 18,
            borderBottomRightRadius: isOutgoing ? 6 : 18,
            borderBottomLeftRadius: isOutgoing ? 18 : 6,
            padding: 12,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              lineHeight: 18,
              color: isOutgoing ? "#FFFFFF" : isDark ? "#FFFFFF" : "#212121",
            }}
          >
            {message.text}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: isOutgoing ? "flex-end" : "flex-start",
            marginTop: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 11,
              color: isDark ? "#8E8E93" : "#B5B5B5",
              marginRight: isOutgoing ? 4 : 0,
            }}
          >
            {message.timestamp}
          </Text>
          {isOutgoing && getStatusIcon(message.status)}
        </View>
      </View>
    );
  };

  if (!fontsLoaded || !chatInfo) {
    return null;
  }

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#FFFFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
          borderBottomWidth: showHeaderBorder ? 1 : 0,
          borderBottomColor: isDark ? "#2C2C2E" : "#ECECEC",
        }}
      >
        <View
          style={{
            paddingTop: insets.top,
            paddingHorizontal: 16,
            paddingBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={{ paddingRight: 12 }}
            >
              <ChevronLeft size={24} color={isDark ? "#FFFFFF" : "#121223"} />
            </TouchableOpacity>

            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: chatInfo.avatarBg || "#E8E4FF",
                marginRight: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {chatInfo.isGroup ? (
                <Users size={20} color="#0062FF" />
              ) : chatInfo.avatar ? (
                <Image
                  source={chatInfo.avatar}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                  }}
                  contentFit="cover"
                />
              ) : (
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: "#0062FF",
                  }}
                >
                  {chatInfo.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: isDark ? "#FFFFFF" : "#121223",
                }}
              >
                {chatInfo.name}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: isDark ? "#8E8E93" : "#9B9B9B",
                }}
              >
                {chatInfo.isGroup
                  ? `${chatInfo.memberCount || 0} üye`
                  : "Çevrimdışı"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 64,
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: isDark ? "#2C2C2E" : "#F1F1F1",
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 12,
                color: isDark ? "#8E8E93" : "#9B9B9B",
              }}
            >
              {chatInfo.isGroup
                ? "Grup mesajları yerel olarak saklanır"
                : "Mesajlar yerel olarak saklanır"}
            </Text>
          </View>
        </View>

        {messages.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: isDark ? "#8E8E93" : "#9B9B9B",
                textAlign: "center",
              }}
            >
              {chatInfo.isGroup
                ? "Gruba ilk mesajı gönderin!"
                : "Sohbeti başlatın!"}
            </Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
        }}
      >
        <View
          style={{
            minHeight: 48,
            backgroundColor: isDark ? "#2C2C2E" : "#F7F7F7",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: isDark ? "#2C2C2E" : "#ECECEC",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: isDark ? "#FFFFFF" : "#212121",
              maxHeight: 100,
            }}
            placeholder="Mesaj yazın..."
            placeholderTextColor={isDark ? "#8E8E93" : "#B5B5B5"}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: messageText.trim() ? "#0062FF" : "transparent",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 8,
            }}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send
              size={18}
              color={
                messageText.trim() ? "#FFFFFF" : isDark ? "#8E8E93" : "#B5B5B5"
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
