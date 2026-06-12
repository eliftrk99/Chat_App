✨ Özellikler

📱 Mobil (React Native/Expo)

iOS ve Android uyumlu
Native görünüm ve hissiyat
TouchableOpacity butonlar
Poppins ve Inter fontları
Tab navigasyon
Modal'lar ve animasyonlar

💻 Web (Next.js/React)

Responsive tasarım (mobil ve desktop)
Tailwind CSS ile modern UI
Desktop'ta sol sidebar
Mobil'de alt navigasyon
Aynı özellikler mobil uygulamayla

🚀 Ortak Özellikler

✅ Kişi ekleme/listeleme
✅ Grup oluşturma
✅ Mesajlaşma (1:1 ve grup)
✅ Yerel veri saklama (localStorage/AsyncStorage)
✅ Çevrimdışı çalışma
✅ Arama özellikleri
✅ Responsive design

📐 Tasarım

Mobil:

Modern iOS/Material Design prensipleri
Smooth animasyonlar
Native hissiyat

Web:

Desktop: Sol sidebar + geniş içerik alanı
Mobil: Alt navigasyon + tam ekran
Hover efektleri
Responsive grid sistem

🌙 Dark Mode

Web:

Sol sidebar'da ve mobil alt nav'da güneş/ay ikonu toggle butonu
Tarayıcının sistem tercihini otomatik algılar
localStorage'a kaydeder, sayfa yenilemede hatırlar
Tüm sayfalar (sohbetler, kişiler, sohbet ekranı, grup oluşturma) koyu temayı destekler

Mobil (Ayarlar sekmesi):

3 mod seçeneği: ☀️ Açık | 📱 Sistem | 🌙 Koyu
Seçim AsyncStorage'a kaydedilir
Appearance.setColorScheme() ile tüm ekranlar anında güncellenir
Uygulama kapatılıp açılsa bile seçim korunur

🔔 Bildirimler

Web:

Sohbetler ekranında bildirim izni banner'ı çıkar (ilk açılışta)
"İzin Ver" butonuna basınca tarayıcı izni ister
İzin verilince sohbet sırasında bildirim gösterilir
Başlık çubuğunda 🔔 / 🔕 durumu gösterilir

Mobil (Ayarlar sekmesi):

Mesaj Bildirimleri toggle'ı — açınca expo-notifications ile izin ister
İzin verilince anında test bildirimi gönderilir: "Bildirimler aktif! 🎉"
Mesaj gönderilince yerel bildirim tetiklenir
İzin durumuna göre ikon değişir (Bell / BellOff, mavi / turuncu)
