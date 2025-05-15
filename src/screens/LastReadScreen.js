// src/screens/LastReadScreen.js

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function LastReadScreen({ navigation }) {
  const [lastRead, setLastRead] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const json = await AsyncStorage.getItem("lastRead");
    setLastRead(json ? JSON.parse(json) : null);
    setLoading(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!lastRead) {
    return (
      <View style={styles.center}>
        <Text>Belum ada surah yang terakhir dibaca.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate("DetailSurah", {
            nomor: lastRead.nomor,
            namaLatin: lastRead.nama_latin,
          })
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>Terakhir Dibaca</Text>
          <Text style={styles.surahName}>
            {lastRead.nomor}. {lastRead.nama_latin} ({lastRead.nama})
          </Text>
          <Text style={styles.arti}>Arti: {lastRead.arti}</Text>
          <Text style={styles.ayatInfo}>Ayat terakhir: {lastRead.ayat}</Text>
        </View>
        <Ionicons
          name="arrow-forward-circle"
          size={28}
          color="#4CAF50"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    // shadow untuk iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation untuk Android
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  surahName: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  arti: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    marginBottom: 4,
  },
  ayatInfo: {
    fontSize: 14,
    color: "#4CAF50",
  },
  icon: {
    marginLeft: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
