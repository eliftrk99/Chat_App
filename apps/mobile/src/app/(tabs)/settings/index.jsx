import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Shield,
  Trash2,
  Moon,
  Sun,
  Smartphone,
} from "lucide-react-native";
import ScreenHeader from "@/components/ScreenHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useAppTheme } from "@/utils/ThemeContext";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, themeMode, setThemeMode } = useAppTheme();
  const [notifPermission, setNotifPermission] = useState(false);
  const [isOnline] = useState(false);

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setNotifPermission(status === "granted");
    });
  }, []);

  const handleNotifToggle = async (value) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotifPermission(status === "granted");
      if (status !== "granted") {
        Alert.alert(
          "İzin Gerekli",
          "Bildirimleri açmak için cihaz ayarlarından izin verin.",
        );
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Offline Messenger",
            body: "Bildirimler aktif! 🎉",
          },
          trigger: { seconds: 1 },
        });
      }
    } else {
      Alert.alert(
        "Bildirimleri Kapat",
        "Bildirimleri kapatmak için cihaz ayarlarından kapatabilirsiniz.",
        [{ text: "Tamam" }],
      );
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Tüm Verileri Sil",
      "Tüm sohbet ve mesajlar silinecek. Kişiler korunacak.",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const chatsData = await AsyncStorage.getItem("chats");
              if (chatsData) {
                const chats = JSON.parse(chatsData);
                for (const chat of chats) {
                  await AsyncStorage.removeItem(`messages_${chat.id}`);
                }
              }
              await AsyncStorage.setItem("chats", JSON.stringify([]));
              Alert.alert("Başarılı", "Tüm sohbetler silindi");
            } catch (error) {
              console.error(error);
              Alert.alert("Hata", "Silme işlemi başarısız");
            }
          },
        },
      ],
    );
  };

  if (!fontsLoaded) return null;

  const bg = isDark ? "#121212" : "#FFFFFF";
  const cardBg = isDark ? "#1E1E1E" : "#F9FAFC";
  const textPrimary = isDark ? "#FFFFFF" : "#111111";
  const textSecondary = isDark ? "#8E8E93" : "#8B8B8B";
  const iconBg = isDark ? "#2C2C2E" : "#E8E4FF";

  const SectionTitle = ({ title }) => (
    <Text
      style={{
        fontFamily: "Poppins_600SemiBold",
        fontSize: 18,
        color: textPrimary,
        marginBottom: 16,
        marginTop: 24,
      }}
    >
      {title}
    </Text>
  );

  const SettingItem = ({
    icon: Icon,
    iconColor,
    title,
    subtitle,
    value,
    onValueChange,
    showSwitch = true,
  }) => (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: iconBg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Icon size={20} color={iconColor || (isDark ? "#8E8E93" : "#0062FF")} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 15,
            color: textPrimary,
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            color: textSecondary,
          }}
        >
          {subtitle}
        </Text>
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: isDark ? "#3A3A3C" : "#D1D1D6",
            true: "#0062FF",
          }}
          thumbColor="#FFFFFF"
        />
      )}
    </View>
  );

  const ThemeButton = ({ mode, label, icon: Icon }) => (
    <TouchableOpacity
      onPress={() => setThemeMode(mode)}
      style={{
        flex: 1,
        backgroundColor: themeMode === mode ? "#0062FF" : cardBg,
        borderRadius: 12,
        padding: 14,
        alignItems: "center",
        gap: 6,
      }}
    >
      <Icon size={20} color={themeMode === mode ? "#FFFFFF" : textSecondary} />
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 12,
          color: themeMode === mode ? "#FFFFFF" : textSecondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScreenHeader title="Ayarlar" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Connection Status */}
        <View
          style={{
            backgroundColor: isOnline ? "#E8F5E9" : "#FFF3E0",
            borderRadius: 12,
            padding: 16,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isOnline ? (
            <Wifi size={24} color="#4CAF50" />
          ) : (
            <WifiOff size={24} color="#FF9800" />
          )}
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 15,
                color: "#111111",
                marginBottom: 2,
              }}
            >
              {isOnline ? "Çevrimiçi Mod" : "Çevrimdışı Mod"}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                color: "#666666",
              }}
            >
              {isOnline
                ? "Mesajlar senkronize edilecek"
                : "Mesajlar kuyruğa alındı"}
            </Text>
          </View>
        </View>

        {/* Dark Mode */}
        <SectionTitle title="Görünüm" />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 4 }}>
          <ThemeButton mode="light" label="Açık" icon={Sun} />
          <ThemeButton mode="system" label="Sistem" icon={Smartphone} />
          <ThemeButton mode="dark" label="Koyu" icon={Moon} />
        </View>

        {/* Notifications */}
        <SectionTitle title="Bildirimler" />
        <SettingItem
          icon={notifPermission ? Bell : BellOff}
          iconColor={notifPermission ? "#0062FF" : "#FF9800"}
          title="Mesaj Bildirimleri"
          subtitle={
            notifPermission ? "Bildirimler açık" : "İzin vermek için dokun"
          }
          value={notifPermission}
          onValueChange={handleNotifToggle}
        />

        {/* Privacy */}
        <SectionTitle title="Gizlilik" />
        <SettingItem
          icon={Shield}
          title="Uçtan Uca Şifreleme"
          subtitle="Tüm mesajlar şifrelenmiştir"
          showSwitch={false}
        />

        {/* Data */}
        <SectionTitle title="Veri" />
        <TouchableOpacity
          style={{
            backgroundColor: cardBg,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleClearData}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FFE4E4",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Trash2 size={20} color="#E34F54" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 15,
                color: "#E34F54",
                marginBottom: 2,
              }}
            >
              Tüm Sohbetleri Sil
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                color: textSecondary,
              }}
            >
              Tüm sohbet ve mesajları sil
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ marginTop: 32, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 13,
              color: textSecondary,
              textAlign: "center",
            }}
          >
            Offline Messenger v1.0.0
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: isDark ? "#5C5C5E" : "#C7C7CC",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Mesajlar yerel olarak saklanır ve cihazlar yakın olduğunda
            senkronize edilir
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
