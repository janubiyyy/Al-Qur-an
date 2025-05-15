import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function SurahItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.c} onPress={() => onPress(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.t}>
          {item.nomor}. {item.nama_latin}
        </Text>
        <Text style={styles.i}>
          Ayat: {item.jumlah_ayat} • Arti: {item.arti}
        </Text>
      </View>
      <Ionicons name="arrow-forward-circle" size={24} color="#4CAF50" />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  c: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  t: { fontSize: 16, fontWeight: "bold" },
  i: { color: "#555", marginTop: 4 },
});
