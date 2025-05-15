import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import { fetchJadwalSholat } from "../services/prayerService";

const prayerConfig = [
  { key: "subuh", label: "Subuh", icon: "weather-sunset-up" },
  { key: "dzuhur", label: "Dzuhur", icon: "white-balance-sunny" },
  { key: "ashar", label: "Ashar", icon: "weather-sunset-down" },
  { key: "maghrib", label: "Maghrib", icon: "weather-night" },
  { key: "isya", label: "Isya", icon: "moon-waning-crescent" },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function JadwalSholatScreen() {
  const [jadwal, setJadwal] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playingKey, setPlayingKey] = useState(null);
  const playedRef = useRef({});
  const soundRef = useRef(null);

  // 1️⃣ Minta izin notifikasi
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin notifikasi ditolak",
          "Anda tidak akan menerima alarm sholat otomatis."
        );
      }
    })();
  }, []);

  // 2️⃣ Load jadwal
  const loadJadwal = useCallback(async () => {
    setLoading(true);
    try {
      const cityCode = "1301";
      const { data } = await fetchJadwalSholat(cityCode);
      setJadwal(data.jadwal);
      playedRef.current = {};
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Gagal memuat jadwal sholat");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadJadwal();
  }, [loadJadwal]);

  // Unload sound saat unmount
  useEffect(() => {
    return () => {
      (async () => {
        if (soundRef.current) {
          try {
            await soundRef.current.stopAsync();
          } catch {}
          try {
            await soundRef.current.unloadAsync();
          } catch {}
          soundRef.current = null;
        }
      })();
    };
  }, []);

  // 3️⃣ Auto-play + notifikasi tiap menit
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hhmm = now.toTimeString().slice(0, 5);
      prayerConfig.forEach((p) => {
        if (jadwal[p.key] === hhmm && !playedRef.current[p.key]) {
          playAdzan(p.key);
          Notifications.scheduleNotificationAsync({
            content: {
              title: `Waktu Sholat ${p.label}`,
              body: `Saatnya sholat ${p.label} (${hhmm})`,
            },
            trigger: { seconds: 1 },
          });
          playedRef.current[p.key] = true;
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [jadwal]);

  // Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadJadwal();
  };

  // 4️⃣ Play adzan (dipakai auto & manual)
  const playAdzan = useCallback(async (key) => {
    // hentikan & unload previous sound
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch {}
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/adzan.mp3")
      );
      soundRef.current = sound;
      setPlayingKey(key);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingKey(null);
          // cleanup setelah selesai
          (async () => {
            try {
              await sound.unloadAsync();
            } catch {}
            soundRef.current = null;
          })();
        }
      });
    } catch (err) {
      console.error("Error play adzan:", err);
    }
  }, []);

  // 5️⃣ Toggle tombol play/pause
  const toggleAdzan = useCallback(
    async (key) => {
      if (playingKey === key) {
        // sedang play → stop & unload
        if (soundRef.current) {
          try {
            await soundRef.current.stopAsync();
          } catch {}
          try {
            await soundRef.current.unloadAsync();
          } catch {}
          soundRef.current = null;
        }
        setPlayingKey(null);
      } else {
        // play adzan baru
        await playAdzan(key);
      }
    },
    [playingKey, playAdzan]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jadwal Sholat Hari Ini</Text>
        <Text style={styles.headerDate}>{today}</Text>
      </View>

      {prayerConfig.map((p) => {
        const isThisPlaying = playingKey === p.key;
        return (
          <View key={p.key} style={styles.card}>
            <Icon name={p.icon} size={28} color="#4CAF50" />
            <View style={styles.info}>
              <Text style={styles.label}>{p.label}</Text>
              <Text style={styles.time}>{jadwal[p.key]}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleAdzan(p.key)}
              style={styles.playButton}
            >
              <Icon
                name={isThisPlaying ? "pause-circle" : "play-circle"}
                size={28}
                color="#4CAF50"
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#4CAF50" },
  headerDate: { fontSize: 14, color: "#555", marginTop: 4 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  info: { flex: 1, marginLeft: 12 },
  label: { fontSize: 18, fontWeight: "600", color: "#333" },
  time: { fontSize: 16, color: "#555", marginTop: 2 },
  playButton: { padding: 4 },
});
