import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Check } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function CreateGroupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [groupName, setGroupName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
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
    } catch (error) {
      console.error("Error loading contacts:", error);
      const contactsData = await AsyncStorage.getItem("contacts");
      if (contactsData) {
        setContacts(JSON.parse(contactsData));
      }
    }
  };

  const toggleMember = (contact) => {
    setSelectedMembers((prev) => {
      const exists = prev.find((m) => m.id === contact.id);
      if (exists) {
        return prev.filter((m) => m.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Hata", "Lütfen grup adı girin");
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert("Hata", "Lütfen en az bir üye seçin");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName.trim(),
          members: selectedMembers.map((m) => ({ phoneNumber: m.phoneNumber })),
          createdBy: "+1234567890", // This should be current user's phone
          avatarBg: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const data = await response.json();

      // Create local chat entry for the group
      const chatsData = await AsyncStorage.getItem("chats");
      const chats = chatsData ? JSON.parse(chatsData) : [];

      const newChat = {
        id: `group_${data.group.id}`,
        groupId: data.group.id,
        isGroup: true,
        name: data.group.name,
        avatarBg: data.group.avatar_bg,
        message: "",
        time: "",
        unread: 0,
        memberCount: data.group.member_count,
      };

      chats.unshift(newChat);
      await AsyncStorage.setItem("chats", JSON.stringify(chats));

      Alert.alert("Başarılı", "Grup oluşturuldu", [
        { text: "Tamam", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Hata", "Grup oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#FFFFFF" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#2C2C2E" : "#E5E5E5",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingRight: 12 }}
        >
          <ChevronLeft size={24} color={isDark ? "#FFFFFF" : "#111111"} />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 18,
            color: isDark ? "#FFFFFF" : "#111111",
            flex: 1,
          }}
        >
          Yeni Grup
        </Text>

        <TouchableOpacity
          onPress={handleCreateGroup}
          disabled={
            loading || !groupName.trim() || selectedMembers.length === 0
          }
          style={{
            opacity:
              loading || !groupName.trim() || selectedMembers.length === 0
                ? 0.5
                : 1,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: "#0062FF",
            }}
          >
            Oluştur
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Group Name */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
              color: isDark ? "#8E8E93" : "#8B8B8B",
              marginBottom: 8,
            }}
          >
            GRUP ADI
          </Text>
          <TextInput
            style={{
              backgroundColor: isDark ? "#2C2C2E" : "#F5F5F5",
              borderRadius: 12,
              padding: 16,
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: isDark ? "#FFFFFF" : "#111111",
            }}
            placeholder="Grup adını girin"
            placeholderTextColor={isDark ? "#8E8E93" : "#B4B4B4"}
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        {/* Selected Members Count */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
              color: isDark ? "#8E8E93" : "#8B8B8B",
            }}
          >
            ÜYELER
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
              color: "#0062FF",
            }}
          >
            {selectedMembers.length} seçildi
          </Text>
        </View>

        {/* Contacts List */}
        {contacts.map((contact) => {
          const isSelected = selectedMembers.find((m) => m.id === contact.id);

          return (
            <TouchableOpacity
              key={contact.id}
              style={{
                backgroundColor: isDark ? "#1E1E1E" : "#F9FAFC",
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: isSelected ? 2 : 0,
                borderColor: "#0062FF",
              }}
              onPress={() => toggleMember(contact)}
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
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 18,
                    color: "#0062FF",
                  }}
                >
                  {contact.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* Contact Info */}
              <View style={{ flex: 1 }}>
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

              {/* Checkbox */}
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: isSelected
                    ? "#0062FF"
                    : isDark
                      ? "#8E8E93"
                      : "#B4B4B4",
                  backgroundColor: isSelected ? "#0062FF" : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isSelected && <Check size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
