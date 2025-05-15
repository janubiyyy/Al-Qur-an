import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  useEffect(() => onSearch(q), [q]);
  return (
    <View style={styles.c}>
      <Ionicons name="search" size={20} color="#888" />
      <TextInput
        style={styles.i}
        placeholder="Cari..."
        value={q}
        onChangeText={setQ}
        placeholderTextColor="#999"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  c: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 10,
    margin: 10,
    elevation: 2,
  },
  i: { flex: 1, marginLeft: 8 },
});
