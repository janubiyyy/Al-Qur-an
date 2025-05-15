import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
export default function LoadingIndicator({ text = "Memuat..." }) {
  return (
    <View style={styles.c}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.t}>{text}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1, justifyContent: "center", alignItems: "center" },
  t: { marginTop: 8, color: "#4CAF50" },
});
