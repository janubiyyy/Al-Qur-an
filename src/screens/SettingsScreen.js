import React, { useState, useEffect } from "react";
import { View, StyleSheet, Switch } from "react-native";
import { Text } from "react-native-paper";

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    console.log(`Tema aplikasi sekarang: ${isDarkMode ? "dark" : "light"}`);
  }, [isDarkMode]);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.headerText, isDarkMode && styles.darkText]}>
        Pengaturan
      </Text>
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>
          Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>
      <Text style={[styles.settingText, isDarkMode && styles.darkText]}>
        Belum ada fitur pengaturan lainnya.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f4f7" },
  darkContainer: { backgroundColor: "#121212" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  darkText: { color: "#fff" },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  settingText: { fontSize: 16, color: "#333" },
});
