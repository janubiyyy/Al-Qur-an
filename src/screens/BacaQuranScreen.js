import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSurahList } from "../hooks/useSurahList";

export default function BacaQuranScreen({ navigation }) {
  const { data, loading } = useSurahList();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      data.filter(
        (item) =>
          item.nama_latin.toLowerCase().includes(query.toLowerCase()) ||
          item.nama.toLowerCase().includes(query.toLowerCase()) ||
          item.nomor.toString().includes(query)
      ),
    [data, query]
  );

  const handlePress = useCallback(
    async (item) => {
      await AsyncStorage.setItem(
        "lastRead",
        JSON.stringify({ ...item, ayat: 1 })
      );
      navigation.navigate("DetailSurah", {
        nomor: item.nomor,
        namaLatin: item.nama_latin,
      });
    },
    [navigation]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Surah..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#999"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.nomor.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {item.nomor}. {item.nama_latin} ({item.nama})
                </Text>
                <Text style={styles.ayatText}>
                  Jumlah Ayat: {item.jumlah_ayat}
                </Text>
                <Text style={styles.artiText}>Arti: {item.arti}</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    margin: 10,
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: "#333" },
  list: { padding: 10 },
  item: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    borderRadius: 15,
    elevation: 5,
  },
  row: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  ayatText: { color: "#555", marginTop: 4 },
  artiText: { color: "#777", fontStyle: "italic" },
});
