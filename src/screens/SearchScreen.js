// src/screens/SearchScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSurahList } from "../hooks/useSurahList";

export default function SearchScreen({ navigation }) {
  const { data, loading } = useSurahList();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      data.filter(
        (item) =>
          item.nama_latin.toLowerCase().includes(query.toLowerCase()) ||
          item.nama.toLowerCase().includes(query.toLowerCase()) ||
          item.arti.toLowerCase().includes(query.toLowerCase()) ||
          item.nomor.toString().includes(query)
      ),
    [data, query]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cari surah, arti, atau nomor..."
        value={query}
        onChangeText={setQuery}
        placeholderTextColor="#999"
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.nomor.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("DetailSurah", { nomor: item.nomor })
            }
          >
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {item.nomor}. {item.nama_latin} ({item.nama})
                </Text>
                <Text style={styles.artiText}>Arti: {item.arti}</Text>
                <Text style={styles.ayatText}>
                  Jumlah Ayat: {item.jumlah_ayat}
                </Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Surah tidak ditemukan.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  searchInput: {
    height: 45,
    borderColor: "#4CAF50",
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
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
  artiText: { color: "#777", fontStyle: "italic", fontSize: 14 },
  ayatText: { color: "#555", fontSize: 14, marginTop: 2 },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "gray",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
