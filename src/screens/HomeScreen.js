// src/screens/HomeScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Linking,
  Platform,
} from "react-native";
import {
  Text,
  Paragraph,
  Surface,
  Divider,
  Avatar,
  Card,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { usePrayerTimes, getCountdown } from "../hooks/usePrayerTimes";

const { width } = Dimensions.get("window");
const recommendedMosques = [
  {
    name: "Masjid Istiqlal",
    location: "Jakarta Pusat",
    coords: "-6.1698,106.8307",
    image:
      "https://images.unsplash.com/photo-1636984011278-886b13d0772d?w=600&auto=format&fit=crop&q=60",
    description: "Masjid terbesar di Asia Tenggara.",
  },
  {
    name: "Masjid Sunda Kelapa",
    location: "Jakarta Utara",
    coords: "-6.1214,106.8307",
    image:
      "https://masjid-sundakelapa.id/wp-content/uploads/2023/08/Gerbang-Masjid-Agung-Sunda-Kelapa-1200x500.jpg",
    description: "Arsitektur khas Betawi.",
  },
  {
    name: "Masjid Agung Jawa Tengah",
    location: "Semarang",
    coords: "-6.9667,110.4167",
    image:
      "https://images.unsplash.com/photo-1569437694481-24fb1f65c8c5?w=600&auto=format&fit=crop&q=60",
    description: "Kubah besar & menara tinggi.",
  },
  {
    name: "Masjid Sultan Suriansyah",
    location: "Banjarmasin",
    coords: "-3.3167,114.5936",
    image:
      "https://images.unsplash.com/photo-1608020932658-d0e19a69580b?w=600&auto=format&fit=crop&q=60",
    description: "Masjid kayu tertua.",
  },
];
export default function HomeScreen({ navigation }) {
  const { times, nextPrayer, loading } = usePrayerTimes();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1724843836063-eb891e3ee9f7?w=600",
      }}
      style={styles.background}
      blurRadius={2}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* GREETING */}
        <Surface style={styles.hero}>
          <Avatar.Icon
            icon={() => <Ionicons name="moon" size={32} color="white" />}
            size={58}
            style={{ backgroundColor: "#4CAF50", marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Assalamu'alaikum</Text>
            <Paragraph>Menuju sholat berikutnya:</Paragraph>
            <Paragraph style={styles.heroCountdown}>
              {nextPrayer.name} dalam {getCountdown(nextPrayer.time)}
            </Paragraph>
          </View>
        </Surface>

        {/* REKOMENDASI MASJID */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Rekomendasi Masjid</Text>
          <Divider style={{ marginVertical: 6 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedMosques.map((m, i) => (
              <Card key={i} style={styles.mosqueCard}>
                <Card.Cover
                  source={{ uri: m.image }}
                  style={styles.mosqueImage}
                />
                <Card.Content>
                  <Text style={styles.mosqueName}>{m.name}</Text>
                  <Text
                    style={styles.mosqueLocation}
                    onPress={() => {
                      const query = encodeURIComponent(m.name);
                      const url = Platform.select({
                        ios: `maps:0,0?q=${query}`,
                        android: `geo:0,0?q=${query}`,
                      });
                      Linking.openURL(url).catch(() => {
                        Linking.openURL(
                          `https://www.google.com/maps/search/?api=1&query=${query}`
                        );
                      });
                    }}
                  >
                    {m.location}
                  </Text>
                  <Paragraph style={styles.mosqueDescription}>
                    {m.description}
                  </Paragraph>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </Surface>

        {/* AYAT QURAN */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Ayat Quran Hari Ini</Text>
          <Divider style={{ marginVertical: 6 }} />
          <Text style={styles.arabic}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
          <Paragraph style={styles.translation}>
            “Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.”
          </Paragraph>
        </Surface>

        {/* VIDEO */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Keindahan Masjid Terindah</Text>
          <Divider style={{ marginVertical: 6 }} />
          <Video
            source={{
              uri: "https://videos.pexels.com/video-files/5057334/5057334-sd_640_360_30fps.mp4",
            }}
            style={styles.video}
            useNativeControls
            resizeMode="cover"
          />
        </Surface>

        {/* BUTTONS */}
        <View style={styles.btnGroup}>
          <Button
            mode="contained"
            icon="book"
            onPress={() => navigation.navigate("BacaQuran")}
            style={styles.btnContained}
          >
            Baca Quran
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("JadwalSholat")}
            style={[styles.btnOutlined, { borderColor: "#fff" }]}
            labelStyle={{ color: "#fff" }}
            icon={({ size, color }) => (
              <Ionicons name="time" size={size} color="#fff" />
            )}
          >
            Jadwal Sholat
          </Button>
        </View>

        {/* HADITS */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Hadits Hari Ini</Text>
          <Divider style={{ marginVertical: 6 }} />
          <Paragraph style={styles.hadith}>
            “Sebaik-baik kalian adalah yang mempelajari Al-Qur’an dan
            mengajarkannya.” — HR Bukhari
          </Paragraph>
        </Surface>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  background: { flex: 1 },
  container: { paddingTop: 20, paddingBottom: 40, alignItems: "center" },
  hero: {
    flexDirection: "row",
    width: "92%",
    padding: 18,
    borderRadius: 24,
    backgroundColor: "#ffffffee",
    elevation: 8,
    marginBottom: 22,
    alignItems: "center",
  },
  heroTitle: { fontSize: 22, fontWeight: "bold", color: "#4CAF50" },
  heroCountdown: { color: "#FF5722", marginTop: 4, fontWeight: "600" },
  section: {
    width: "92%",
    borderRadius: 20,
    padding: 14,
    backgroundColor: "#ffffffee",
    elevation: 4,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#4CAF50" },
  mosqueCard: {
    width: 240,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
  },
  mosqueImage: { height: 120 },
  mosqueName: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: "#333" },
  mosqueLocation: { fontSize: 14, color: "#4CAF50", marginBottom: 4 },
  mosqueDescription: { fontSize: 14, color: "#555" },
  arabic: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
    marginTop: 6,
  },
  translation: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 8,
  },
  video: { width: "100%", height: 180, borderRadius: 16, marginVertical: 10 },
  btnGroup: {
    flexDirection: "row",
    width: "92%",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  btnContained: {
    flex: 1,
    marginRight: 8,
    borderRadius: 14,
    backgroundColor: "#4CAF50",
  },
  btnOutlined: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 14,
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  hadith: {
    fontSize: 15,
    color: "#333",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },
});
