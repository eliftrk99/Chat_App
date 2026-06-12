import { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  useColorScheme,
  RefreshControl,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Users, UserPlus, UsersRound } from "lucide-react-native";
import ScreenHeader from "@/components/ScreenHeader";
import SearchBar from "@/components/SearchBar";
import ContactItem from "@/components/ContactItem";
import EmptyState from "@/components/EmptyState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const loadContacts = useCallback(async () => {
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();

      const transformedContacts = data.contacts.map((contact) => ({
        id: contact.id.toString(),
        name: contact.name,
        phoneNumber: contact.phone_number,
        avatar: contact.avatar_url,
        avatarBg: contact.avatar_bg,
      }));

      setContacts(transformedContacts);
      await AsyncStorage.setItem(
        "contacts",
        JSON.stringify(transformedContacts),
      );
    } catch (error) {
      console.error("Error loading contacts:", error);
      const contactsData = await AsyncStorage.getItem("contacts");
      if (contactsData) {
        setContacts(JSON.parse(contactsData));
      }
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  }, [loadContacts]);

  const handleAddContact = async () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert("Hata", "Lütfen isim ve telefon numarası girin");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newContactName.trim(),
          phoneNumber: newContactPhone.trim(),
          avatarBg: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add contact");
      }

      await loadContacts();
      setShowAddModal(false);
      setNewContactName("");
      setNewContactPhone("");
      Alert.alert("Başarılı", "Kişi eklendi");
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (contact) => {
    try {
      const chatsData = await AsyncStorage.getItem("chats");
      const chats = chatsData ? JSON.parse(chatsData) : [];

      let existingChat = chats.find((chat) => chat.contactId === contact.id);

      if (!existingChat) {
        existingChat = {
          id: `chat_${Date.now()}`,
          contactId: contact.id,
          name: contact.name,
          avatar: contact.avatar,
          avatarBg: contact.avatarBg,
          message: "",
          time: "",
          unread: 0,
          read: false,
        };
        chats.unshift(existingChat);
        await AsyncStorage.setItem("chats", JSON.stringify(chats));
      }

      router.push(`/chat/${existingChat.id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phoneNumber.includes(searchQuery),
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#FFFFFF" }}>
      <ScreenHeader title="Kişiler" />

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
          placeholder="Kişi ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          style={{
            backgroundColor: "#0062FF",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.push("/(tabs)/contacts/create-group")}
        >
          <UsersRound size={20} color="#FFFFFF" />
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 15,
              color: "#FFFFFF",
              marginLeft: 8,
            }}
          >
            Yeni Grup Oluştur
          </Text>
        </TouchableOpacity>

        {filteredContacts.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Henüz Kişi Yok"
            subtitle="Çevrimdışı mesajlaşma için telefon numaralarıyla kişi ekleyin"
          />
        ) : (
          filteredContacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onPress={() => handleStartChat(contact)}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: insets.bottom + 20,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#0062FF",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.8}
        onPress={() => setShowAddModal(true)}
      >
        <UserPlus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20,
                color: isDark ? "#FFFFFF" : "#111111",
                marginBottom: 20,
              }}
            >
              Yeni Kişi Ekle
            </Text>

            <TextInput
              style={{
                backgroundColor: isDark ? "#2C2C2E" : "#F5F5F5",
                borderRadius: 12,
                padding: 16,
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: isDark ? "#FFFFFF" : "#111111",
                marginBottom: 12,
              }}
              placeholder="İsim"
              placeholderTextColor={isDark ? "#8E8E93" : "#B4B4B4"}
              value={newContactName}
              onChangeText={setNewContactName}
            />

            <TextInput
              style={{
                backgroundColor: isDark ? "#2C2C2E" : "#F5F5F5",
                borderRadius: 12,
                padding: 16,
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: isDark ? "#FFFFFF" : "#111111",
                marginBottom: 20,
              }}
              placeholder="Telefon Numarası"
              placeholderTextColor={isDark ? "#8E8E93" : "#B4B4B4"}
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#2C2C2E" : "#F5F5F5",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowAddModal(false);
                  setNewContactName("");
                  setNewContactPhone("");
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 16,
                    color: isDark ? "#FFFFFF" : "#111111",
                  }}
                >
                  İptal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#0062FF",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  opacity: loading ? 0.6 : 1,
                }}
                onPress={handleAddContact}
                disabled={loading}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  {loading ? "Ekleniyor..." : "Ekle"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
